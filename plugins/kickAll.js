import { eliteNumbers } from '../elite.js'; 
export default {
    name: 'امر طرد الكل', 
    command: ['تصفية'],
    category: 'إدارة',  
    description: 'يطرد جميع الأعضاء في المجموعة دفعة واحدة', 
    args: [],  
    hidden: false, 
    execution: async ({ sock, m, args, prefix, sleep }) => {
      if (!m.key.remoteJid.endsWith('@g.us')) {
        return sock.sendMessage(m.key.remoteJid, { text: 'هذا الأمر يعمل فقط داخل المجموعات.' });
      }
      const senderNumber = m.key.participant; 
      console.log("الرقم المرسل: ", senderNumber); 
        if (!eliteNumbers.includes(senderNumber)) {
        return sock.sendMessage(m.key.remoteJid, { text: 'أنت لا تملك صلاحية استخدام هذا الأمر.' });
      }
      try {
        const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
        const participants = groupMetadata.participants;
          const admins = participants.filter(participant => participant.admin);
        const adminIds = admins.map(admin => admin.id);
        const toRemove = participants.filter(participant => 
          participant.id !== senderNumber &&  
          !adminIds.includes(participant.id) &&  
          !eliteNumbers.includes(participant.id) 
        );
        if (toRemove.length > 0) {
          const removalIds = toRemove.map(participant => participant.id);
          await sock.groupParticipantsUpdate(m.key.remoteJid, removalIds, 'remove');
          sock.sendMessage(m.key.remoteJid, { text: 'تم طرد جميع الأعضاء بنجاح.' });
        } else {
          sock.sendMessage(m.key.remoteJid, { text: 'لا يوجد أعضاء للطرد في هذه المجموعة.' });
        }
      } catch (error) {
        console.error('فشل في طرد الأعضاء:', error);
        sock.sendMessage(m.key.remoteJid, { text: 'حدث خطأ أثناء محاولة طرد الأعضاء.' });
      }
    },
  };
  
