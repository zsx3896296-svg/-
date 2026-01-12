Page({
  data: {
    openid: '',
    email: '',
    code: '',
    verified: false
  },
  onShow() {
    this.fetchProfile();
  },
  onLogin() {
    wx.showLoading({ title: '登录中' });
    wx.cloud.callFunction({ name: 'login' })
      .then((res) => {
        this.setData({ openid: res.result.openid || '' });
        wx.showToast({ title: '登录成功', icon: 'success' });
        this.fetchProfile();
      })
      .catch(() => {
        wx.showToast({ title: '登录失败', icon: 'none' });
      })
      .finally(() => {
        wx.hideLoading();
      });
  },
  onEmailInput(event) {
    this.setData({ email: event.detail.value });
  },
  onCodeInput(event) {
    this.setData({ code: event.detail.value });
  },
  onSendCode() {
    if (!this.data.email) {
      wx.showToast({ title: '请输入邮箱', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '发送中' });
    wx.cloud.callFunction({
      name: 'sendEmailCode',
      data: { email: this.data.email }
    }).then(() => {
      wx.showToast({ title: '验证码已发送', icon: 'success' });
    }).catch((err) => {
      wx.showToast({ title: err?.message || '发送失败', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },
  onVerify() {
    if (!this.data.email || !this.data.code) {
      wx.showToast({ title: '请输入邮箱和验证码', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '认证中' });
    wx.cloud.callFunction({
      name: 'verifyEmailCode',
      data: { email: this.data.email, code: this.data.code }
    }).then(() => {
      wx.showToast({ title: '认证成功', icon: 'success' });
      this.setData({ verified: true });
    }).catch((err) => {
      wx.showToast({ title: err?.message || '认证失败', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },
  fetchProfile() {
    wx.cloud.callFunction({ name: 'login' })
      .then((res) => {
        this.setData({
          openid: res.result.openid || '',
          verified: res.result.profile?.verified || false,
          email: res.result.profile?.email || ''
        });
      });
  }
});
