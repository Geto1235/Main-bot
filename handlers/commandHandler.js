import { getPlugins } from './pluginHandler.js';
import { updateDatabase } from '../utils/database.js';
import { inspect } from 'util';

export const handleCommand = (text, m, sock, prefix, sleep) => {
  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const plugins = getPlugins();

  for (const plugin of plugins) {
    if (plugin.hidden) continue;

    if (plugin.command.includes(command)) {
      plugin.execution({ sock, m, args, prefix, sleep });
      break;
    }
  }
};

export const handleEvalCommand = (code, m, sock, eventEmitter) => {
  try {
    let result = eval(code);
    if (result instanceof Promise) {
      result.then(res => {
        sock.sendMessage(m.key.remoteJid, { text: inspect(res) });
      }).catch(err => {
        sock.sendMessage(m.key.remoteJid, { text: inspect(err) });
      });
    } else {
      sock.sendMessage(m.key.remoteJid, { text: inspect(result) });
    }
  } catch (err) {
    sock.sendMessage(m.key.remoteJid, { text: inspect(err) });
  }
};
