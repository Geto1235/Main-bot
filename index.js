import express from 'express';
import pino from 'pino';
import { makeWASocket, useMultiFileAuthState, makeInMemoryStore } from '@whiskeysockets/baileys';
import { handleCommand, handleEvalCommand } from './handlers/commandHandler.js';
import { initPlugins } from './handlers/pluginHandler.js';
import { getDatabase } from './utils/database.js';
import { Events, Coordinator } from './helper/constant.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Web server setup
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Node.js Web App & WhatsApp Bot</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <header>
          <h1>Welcome to the Web App & WhatsApp Bot!</h1>
        </header>
        <main>
          <p>This is a simple web app and WhatsApp bot running together in Node.js.</p>
        </main>
        <footer>
          <p>&copy; 2025 Node.js Web & Bot</p>
        </footer>
      </body>
    </html>
  `);
});

const startServer = () => {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      console.log(`Web server is running at http://localhost:${port}`);
      resolve();
    });
  });
};

// WhatsApp bot setup
const store = makeInMemoryStore({
  logger: pino(Coordinator.level).child({
    ...Coordinator.level,
    stream: 'store',
  }),
});

const startWhatsAppBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('ملف_الاتصال');
  const sock = makeWASocket({
    auth: state,
    logger: pino(Coordinator.level),
    printQRInTerminal: true,
  });

  await sleep(Coordinator.fast);
  store.bind(sock.ev);

  sock.ev.on(Events.CredsUpdate, saveCreds);

  const pluginDir = './plugins';
  initPlugins(pluginDir, sock);

  const { prefix } = getDatabase();
  sock.ev.on(Events.MessagesUpsert, async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;
    const text = m.message.conversation || m.message.extendedTextMessage?.text;
    if (!text) return;

    if (text.startsWith('=>')) {
      handleEvalCommand(text.slice(2).trim(), m, sock);
    } else {
      handleCommand(text, m, sock, prefix, sleep);
    }
  });

  sock.ev.on(Events.ConnectionUpdate, ({ qr, connection, lastDisconnect }) => {
    if (qr) {
      console.info("Please scan the QR code to connect the bot.");
    }
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode !== 401) {
        startWhatsAppBot();  // Reconnect if connection closes unexpectedly
      }
    }
    if (connection === 'open') {
      console.info("Successfully connected to WhatsApp!");
    }
  });

  console.log("Bot is ready...");
};

// Run both web server and WhatsApp bot at the same time
const runApp = async () => {
  try {
    await Promise.all([startServer(), startWhatsAppBot()]);
  } catch (err) {
    console.error('Error starting server or bot:', err);
  }
};

// Start the application
runApp();
