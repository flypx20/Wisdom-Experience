function get(url, params) {

  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://dev.arkbao.com/xddj-minisvr/rest/api/v1/' + url, 
      data: params,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        resolve(res.data);
      },
      fail(res){
        reject(res.data);
      }
    })
  })
};
function post(url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://dev.arkbao.com/xddj-minisvr/rest/api/v1/'+url, 
      data: params,
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        resolve(res.data);
      },
      fail(res) {
        reject(res);
      }
    })
  })
};
module.exports = {
  get:get,
  post:post
}