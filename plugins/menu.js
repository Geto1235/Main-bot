import { getPlugins } from '../handlers/pluginHandler.js';
import { inlineCode } from '../helper/formatted.js';
export default {
  name: 'أمر القائمة',
  command: ['اوامر'],
  category: 'عام',
  description: 'يعرض الأوامر المتاحة',
  args: [],
  execution: ({ sock, m, args, prefix, sleep }) => {
    const plugins = getPlugins();
    let menu = '『𝐊𝐘𝐎𝐑𝐀𝐊𝐔』\n\n❉ • • • ━━ ⌝┇اوامر┇⌞ ━━ • • • ❉\n\n';
    const categories = {};
    plugins.forEach((plugin) => {
      if (plugin.hidden) return;
      if (!categories[plugin.category]) {
        categories[plugin.category] = [];
      }
      const commandList = plugin.command.map((cmd) => 
        `${inlineCode(cmd)} ${plugin.args.join(' ')}`).join('\n');
      categories[plugin.category].push(commandList);
    });
    Object.keys(categories).forEach((category) => {
      menu += `❐┇『${category}』\n`;
      menu += categories[category].join('\n');
      menu += '\n\n';
    });
    menu += '❉ • • • ━━ ⌝┇🌑┇⌞ ━━ • • • ❉\n\n『⁩𝐊𝐘𝐎𝐑𝐀𝐊𝐔 𝐈𝐒 𝐖𝐎𝐑𝐊𝐈𝐍𝐆 𝐍𝐎𝐖 🌑』';
    sock.sendMessage(m.key.remoteJid, { text: menu });
  },
  hidden: false,
};
