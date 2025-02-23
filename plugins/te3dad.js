export default {
  name: 'ارسال اعلان الفعالية',
  command: ['تعداد'],
  category: 'إدارة',
  description: 'إرسال إعلان فعالية الحروف مع تخصيص الحرف والمسؤول.',
  args: ['الحرف', 'المسؤول'],
  execution: async ({ sock, m, args }) => {
    // التأكد أن الرسالة داخل مجموعة
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: 'هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    // التأكد من وجود الحرف والمسؤول
    if (args.length < 2) {
      return sock.sendMessage(m.key.remoteJid, { text: '❌ يجب عليك تحديد الحرف والمسؤول لإرسال الإعلان.' });
    }

    const letter = args[0]; // الحرف
    const responsiblePerson = args[1]; // المسؤول
    const winner = args[2]; //الفائز

    // إرسال رسالة الإعلان مع الحرف والمسؤول المحدد
    const message = `
*⟬اعلان فعاليه الحروف⟭*

*❀✦═══ •『🌗』• ═══✦❀*

*✪شرح الفعالية✪*
*🌗╎يختار المقدم حرف اول*
*من يجاوب بثلاث شخصيات عشوائيه* 
*تبدا بنفس الحرف المختار هو الفائز* 

  *🌗╎الــحـرف🔠⇚⟬${letter}⟭*

   *🌗╎الـفـائـز:⟬${winner}⟭*

     *🌗╎الـجـائـزة:⟬5K⟭*

   *🌗╎الـمـسـؤول:⟬${responsiblePerson}⟭*

*❀✦═══ •『🌗』• ═══✦❀*

*• 『𝐂.𝐌.𝐀⊰🌑⊱𝑳𝑼𝑵𝑨𝑹』•*
    `;

    // إرسال الرسالة إلى المجموعة
    try {
      await sock.sendMessage(m.key.remoteJid, { text: message });
      return sock.sendMessage(m.key.remoteJid, { text: `✅ تم إرسال إعلان الفعالية بنجاح!` });
    } catch (error) {
      console.error(error);
      return sock.sendMessage(m.key.remoteJid, { text: '❌ حدث خطأ أثناء إرسال الإعلان.' });
    }
  },
};
