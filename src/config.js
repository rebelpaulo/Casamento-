export const config = {
  adminUser: process.env.ADMIN_USER || 'paulimoria',
  adminPass: process.env.ADMIN_PASS || 'morianeto',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '+351916989048',
  groupLink: process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/SEU_LINK_AQUI',
  port: Number(process.env.PORT || 3000)
};
