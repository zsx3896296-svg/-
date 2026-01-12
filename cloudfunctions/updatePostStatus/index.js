const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { id, status } = event;
  if (!id || !status) {
    throw new Error('缺少参数');
  }

  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();
  const postRes = await db.collection('posts').doc(id).get();

  if (!postRes.data || postRes.data.openid !== OPENID) {
    throw new Error('无权限操作');
  }

  await db.collection('posts').doc(id).update({
    data: {
      status,
      updatedAt: new Date()
    }
  });

  return { success: true };
};
