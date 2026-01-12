const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

function ensureEcjtuEmail(email) {
  return typeof email === 'string' && email.endsWith('@ecjtu.edu.cn');
}

exports.main = async (event) => {
  const { postId } = event;
  if (!postId) {
    throw new Error('缺少帖子ID');
  }

  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();
  const profileRes = await db.collection('user_profiles').where({ openid: OPENID }).get();
  const profile = profileRes.data[0];

  if (!profile || !profile.verified || !ensureEcjtuEmail(profile.email)) {
    throw new Error('未通过校邮认证');
  }

  const contactRes = await db.collection('post_contacts').where({ postId }).get();
  const contact = contactRes.data[0];

  return {
    phone: contact ? contact.phone : ''
  };
};
