import { adminNumbers } from '../admin.js';

export default {
  name: 'امر الطرد',
  command: ['طرد'],
  category: 'إدارة',
  description: 'طرد العضو عند الإشارة إليه أو الرد عليه.',
  args: [],
  execution: async ({ sock, m, args }) => {
    // التأكد أن الرسالة داخل مجموعة
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: 'هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    // التأكد من صلاحية الشخص المرسل
    const senderNumber = m.key.participant;
    if (!adminNumbers.includes(senderNumber)) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.' });
    }

    try {
      // إرسال تفاعل بالإيموجي ✅ على رسالة الأمر
      await sock.sendMessage(m.key.remoteJid, {
        react: {
          text: '✅', // الإيموجي المطلوب
          key: m.key,  // رسالة الأمر
        },
      });

      // التأكد من وجود إشارة أو رد على رسالة
      const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const repliedJid = m.message?.extendedTextMessage?.contextInfo?.participant;

      const targetJid = mentionedJid || repliedJid;

      if (!targetJid) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ يجب الإشارة إلى شخص أو الرد على رسالة لطرد العضو.' });
      }

      // استخراج رقم البوت (منع طرد البوت)
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      if (targetJid === botNumber) {
        return sock.sendMessage(m.key.remoteJid, { text: '❌ لا يمكن طرد البوت.' });
      }

      // تنفيذ عملية طرد العضو
      await sock.groupParticipantsUpdate(m.key.remoteJid, [targetJid], 'remove');
      return sock.sendMessage(m.key.remoteJid, { text: '*✅ تم طرد العضو من المجموعة.*' });
    } catch (error) {
      console.error(error);
      return sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' });
    }
  },
};
