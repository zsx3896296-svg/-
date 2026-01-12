Page({
  data: {
    keyword: '',
    posts: []
  },
  onShow() {
    this.fetchPosts();
  },
  onKeywordInput(event) {
    this.setData({ keyword: event.detail.value });
  },
  onSearch() {
    this.fetchPosts();
  },
  fetchPosts() {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'listPosts',
      data: { keyword: this.data.keyword }
    }).then((res) => {
      this.setData({ posts: res.result.data || [] });
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }).finally(() => {
      wx.hideLoading();
    });
  },
  goDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/post/index?id=${id}` });
  },
  goPublish() {
    wx.navigateTo({ url: '/pages/publish/index' });
  }
});
