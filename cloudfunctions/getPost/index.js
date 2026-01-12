const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { id } = event;
  if (!id) {
    throw new Error('缺少帖子ID');
  }

  const db = cloud.database();
  const res = await db.collection('posts').doc(id).get();
  const post = res.data;

  if (post && post.createdAt) {
    post.createdAt = post.createdAt.toLocaleString();
  }

  return { data: post };
};
