App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('基础库需 2.2.3 或以上');
      return;
    }
    wx.cloud.init({
      env: wx.cloud.DYNAMIC_CURRENT_ENV,
      traceUser: true
    });
  }
});
