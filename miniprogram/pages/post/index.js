Page({
  data: {
    id: '',
    post: null,
    phone: ''
  },
  onLoad(options) {
    this.setData({ id: options.id || '' });
    this.fetchPost();
  },
  fetchPost() {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'getPost',
      data: { id: this.data.id }
    }).then((res) => {
      this.setData({ post: res.result.data || null });
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },
  onGetPhone() {
    wx.showLoading({ title: '验证中' });
    wx.cloud.callFunction({
      name: 'getPhone',
      data: { postId: this.data.id }
    }).then((res) => {
      if (res.result && res.result.phone) {
        this.setData({ phone: res.result.phone });
      } else {
        wx.showToast({ title: '暂无手机号', icon: 'none' });
      }
    }).catch((err) => {
      wx.showToast({ title: err?.message || '未通过校邮认证', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  }
});
