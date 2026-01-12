const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { keyword } = event;
  const db = cloud.database();
  let query = db.collection('posts').where({ status: 'active' });

  if (keyword) {
    const regexp = db.RegExp({
      regexp: keyword,
      options: 'i'
    });
    query = db.collection('posts').where(
      db.command.and([
        { status: 'active' },
        db.command.or([
          { title: regexp },
          { content: regexp }
        ])
      ])
    );
  }

  const res = await query.orderBy('createdAt', 'desc').get();
  const data = res.data.map((item) => ({
    ...item,
    createdAt: item.createdAt ? item.createdAt.toLocaleString() : ''
  }));

  return { data };
};
