import pino from 'pino';
import { makeWASocket, useMultiFileAuthState, makeInMemoryStore } from '@whiskeysockets/baileys';
import { handleCommand, handleEvalCommand } from './handlers/commandHandler.js';
import { initPlugins } from './handlers/pluginHandler.js';
import { getDatabase } from './utils/database.js';
import { Events, Coordinator } from './helper/constant.js';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const store = makeInMemoryStore({
  logger: pino(Coordinator.level)
    .child({ 
      ...Coordinator.level,
      stream: 'store'
    })
});
const init = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('ملف_الاتصال');
  const sock = makeWASocket({
    auth: state,
    logger: pino(Coordinator.level),
    printQRInTerminal: true
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
      console.info( "صور الـqrcode كي يتم تشغيل البوت");
    }
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode !== 401) {
        init();
      }
    }
    if (connection === "open") {
      console.info( "تم الاتصال بالرقم بدون مشاكل");
    }
  });
  console.log("تجهيز الاتصال....");
};
init();