export default {
  name: 'أمر الاختبار', 
  command: ['تست'], 
  category: 'أدوات',
  description: 'أمر لاختبار البوت', 
  args: [], 
  execution: ({ sock, m, args, prefix, sleep }) => {
    sock.sendMessage(m.key.remoteJid, { text: 'يعمل بلا مشاكل' });
  },
  hidden: false,
};
