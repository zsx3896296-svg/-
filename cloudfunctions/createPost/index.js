const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { title, content, phone } = event;
  if (!title || !content || !phone) {
    throw new Error('缺少必填信息');
  }

  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();
  const now = new Date();

  const postRes = await db.collection('posts').add({
    data: {
      title,
      content,
      status: 'active',
      openid: OPENID,
      createdAt: now,
      updatedAt: now
    }
  });

  await db.collection('post_contacts').add({
    data: {
      postId: postRes._id,
      phone,
      createdAt: now
    }
  });

  return { id: postRes._id };
};
