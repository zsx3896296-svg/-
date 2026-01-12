const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async () => {
  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();

  const profileRes = await db.collection('user_profiles').where({ openid: OPENID }).get();
  const profile = profileRes.data[0] || null;

  return {
    openid: OPENID,
    profile
  };
};
