const admin = require('firebase-admin');
const { AdminFcmToken } = require('../models');

let initialized = false;
function initFcm() {
  if (!initialized && process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
  }
}

async function notifyNewOrder(order) {
  initFcm();
  const tokens = await AdminFcmToken.findAll({ attributes: ['fcm_token'] });
  const messages = tokens.map(t => ({
    token: t.fcm_token,
    notification: {
      title: 'New Order!',
      body: `Order #${order.id} - ₹${order.total}`,
      sound: 'default',
    },
    data: { orderId: order.id, type: 'new_order' },
  }));
  if (messages.length) {
    await admin.messaging().sendAll(messages);
  }
}

module.exports = { notifyNewOrder };