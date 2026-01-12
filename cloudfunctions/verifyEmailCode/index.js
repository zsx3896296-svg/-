const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

function ensureEcjtuEmail(email) {
  return typeof email === 'string' && email.endsWith('@ecjtu.edu.cn');
}

exports.main = async (event) => {
  const { email, code } = event;
  if (!ensureEcjtuEmail(email)) {
    throw new Error('仅支持 @ecjtu.edu.cn 邮箱');
  }

  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();
  const now = Date.now();

  const codeRes = await db.collection('email_codes')
    .where({ openid: OPENID, email })
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  const latest = codeRes.data[0];
  if (!latest || latest.code !== code || latest.expiresAt < now) {
    throw new Error('验证码无效或已过期');
  }

  const profileRes = await db.collection('user_profiles').where({ openid: OPENID }).get();
  if (profileRes.data.length) {
    await db.collection('user_profiles').doc(profileRes.data[0]._id).update({
      data: {
        email,
        verified: true,
        updatedAt: new Date(now)
      }
    });
  } else {
    await db.collection('user_profiles').add({
      data: {
        openid: OPENID,
        email,
        verified: true,
        createdAt: new Date(now),
        updatedAt: new Date(now)
      }
    });
  }

  return { verified: true };
};
