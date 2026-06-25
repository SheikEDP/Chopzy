// utils/fcm.js
const admin = require('firebase-admin');
const { sequelize } = require('../models');

// Initialize Firebase Admin
let firebaseAdmin;

try {
  if (admin.apps && admin.apps.length > 0) {
    firebaseAdmin = admin;
    console.log('✅ Firebase Admin already initialized');
  } else {
    try {
      const serviceAccount = require('../service-account-key.json');
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'dailyeatsadmin',
      });
      console.log('✅ Firebase Admin initialized with service account');
    } catch (serviceAccountError) {
      console.log('⚠️ Service account not found, using default credentials');
      firebaseAdmin = admin.initializeApp({
        projectId: 'dailyeatsadmin',
      });
      console.log('✅ Firebase Admin initialized with default credentials');
    }
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error);
  try {
    firebaseAdmin = admin.initializeApp({
      projectId: 'dailyeatsadmin',
    });
    console.log('✅ Firebase Admin initialized with fallback config');
  } catch (fallbackError) {
    console.error('❌ Failed to initialize Firebase Admin:', fallbackError);
  }
}

async function notifyNewOrder(order) {
  try {
    console.log('📨 Sending order notification for order:', order.id);
    
    if (!firebaseAdmin) {
      console.error('❌ Firebase Admin not initialized');
      return { success: false, error: 'Firebase Admin not initialized' };
    }

    // Get admin tokens using raw SQL
    const adminTokens = await getAdminFcmTokens();
    
    if (!adminTokens || adminTokens.length === 0) {
      console.log('⚠️ No admin tokens found');
      return { success: false, error: 'No admin tokens found' };
    }

    console.log(`📱 Found ${adminTokens.length} active admin tokens`);

    const orderTotal = order.total || order.total_amount || 0;
    const customerName = order.user?.name || order.customer_name || 'Customer';

    const message = {
      notification: {
        title: '🛒 New Order Received!',
        body: `Order #${order.id} - ₹${orderTotal.toFixed(2)} from ${customerName}`,
      },
      data: {
        order_id: order.id.toString(),
        type: 'new_order',
        timestamp: new Date().toISOString(),
        total: orderTotal.toString(),
        customer_name: customerName,
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'chopzy_admin_channel',
          priority: 'high',
          visibility: 'public',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            alert: {
              title: '🛒 New Order Received!',
              body: `Order #${order.id} - ₹${orderTotal.toFixed(2)} from ${customerName}`,
            },
          },
        },
      },
    };

    // Send to all admin tokens
    const results = await Promise.allSettled(
      adminTokens.map(async (tokenData) => {
        try {
          const response = await firebaseAdmin.messaging().send({
            ...message,
            token: tokenData.token,
          });
          console.log(`✅ Notification sent to admin: ${response}`);
          return { success: true, token: tokenData.token };
        } catch (error) {
          console.log(`❌ Failed to send to token:`, error.message);
          if (error.code === 'messaging/invalid-registration-token' || 
              error.code === 'messaging/registration-token-not-registered') {
            await removeAdminFcmToken(tokenData.token);
          }
          return { success: false, token: tokenData.token, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
    console.log(`📨 Notifications sent: ${successful}/${adminTokens.length} successful`);
    
    return { success: true, sent: successful, total: adminTokens.length };
  } catch (error) {
    console.error('❌ Error sending order notification:', error);
    return { success: false, error: error.message };
  }
}

async function getAdminFcmTokens() {
  try {
    const [results] = await sequelize.query(
      'SELECT token, admin_id FROM admin_fcm_tokens WHERE is_active = 1'
    );
    return results || [];
  } catch (error) {
    console.error('Error getting admin tokens:', error);
    return [];
  }
}

async function removeAdminFcmToken(token) {
  try {
    await sequelize.query(
      'DELETE FROM admin_fcm_tokens WHERE token = ?',
      { replacements: [token] }
    );
    console.log(`🗑️ Removed invalid token: ${token}`);
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

module.exports = {
  notifyNewOrder,
  getAdminFcmTokens,
  removeAdminFcmToken,
};