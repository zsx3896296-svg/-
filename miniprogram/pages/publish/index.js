Page({
  data: {
    title: '',
    content: '',
    phone: ''
  },
  onTitleInput(event) {
    this.setData({ title: event.detail.value });
  },
  onContentInput(event) {
    this.setData({ content: event.detail.value });
  },
  onPhoneInput(event) {
    this.setData({ phone: event.detail.value });
  },
  onSubmit() {
    const { title, content, phone } = this.data;
    if (!title || !content || !phone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '发布中' });
    wx.cloud.callFunction({
      name: 'createPost',
      data: { title, content, phone }
    }).then(() => {
      wx.showToast({ title: '发布成功', icon: 'success' });
      wx.navigateBack();
    }).catch(() => {
      wx.showToast({ title: '发布失败', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  }
});
