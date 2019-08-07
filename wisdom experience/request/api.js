var {get,post} = require('./http.js');
function getQuestion(p){
  return get('que/getQuestion',p);
}
function getOpenId(p) {
  return get('mini/getOpenId', p);
}
function postQuestion(p) {
  return post('que/postQuestion', p);
}
function wxDecode(p){
  return post('mini/wxDecode', p);  
}
function uploadImg(p){
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://dev.arkbao.comapi/upload/uploadImg',
      data: p,
      method: 'POST',
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
}
module.exports = {
  getQuestion : getQuestion,
  getOpenId: getOpenId,
  postQuestion: postQuestion,
  wxDecode:wxDecode,
  uploadImg:uploadImg
}