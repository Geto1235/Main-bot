import { updateDatabase, getDatabase } from '../utils/database.js';
import { eliteNumbers } from '../elite.js'; 
export default {
  name: 'أمر تعيين البريفكس', 
  command: ['بريفكس'],
  category: 'الإعدادات', 
  description: 'تعيين بريفكس الأمر', 
  args: ['بريفكس جديد'],
  execution: ({ sock, m, args, prefix, sleep }) => {
    const senderNumber = m.key.participant;
    const newPrefix = args[0]; 
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(m.key.remoteJid, { text: 'أنت لا تملك صلاحية استخدام هذا الأمر.' });
    }
    if (newPrefix) {
      updateDatabase('prefix', newPrefix);
      sock.sendMessage(m.key.remoteJid, { text: `تم تغيير البريفكس إلى ${newPrefix}` });
    } else {
      sock.sendMessage(m.key.remoteJid, { text: 'من فضلك، قدم بريفكس جديد!' }); 
    }
  },  hidden: false, 
};
