//index.js
//获取应用实例
var { getOpenId,wxDecode } = require('../../request/api.js');
const app = getApp();
function canvasToTempFilePath(option, context) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...option,
      success: resolve,
      fail: reject,
    }, context)
  })
}

function saveImageToPhotosAlbum(option) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      ...option,
      success: resolve,
      fail: reject,
    })
  })
}
Page({
  data:{
    tikuName:[
      '党的十九大报告',
      '《中国共产党章程》',
      '《关于新形势下党内政治生活的若干准则》',
      '《中国共产党党员权利保障条例》',
      '习近平总书记系列重要讲话',
      '党史基础知识'
    ],
    username:'',
    openId:'',
    isRuleTrue:false,
    showmodal:false,
    advertisement:"",
    goTest:false,
    show:false,


    point: 0,
    message: '',
    bjurl: '',
    cgmessage: '',
    visible: false,
    beginDraw: false,
    isDraw: false,

    canvasWidth: 843,
    canvasHeight: 1500,

    imageFile: '',
  },
  onLoad:function(options){
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          getOpenId({
            code:res.code
          }).then(res=>{
            if(res.code == 10000){
              that.setData({
                openId:res.openid
              })
            }
           
          }).catch(res=>{
            console.log(res);
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
//
  if(options.point){
     this.setData({
      visible: true,
      point:options.point
    });

  }
    var point = this.data.point;
    if (80 <= point && point <= 100) {
      this.setData({
        message: '党建先锋',
        bjurl: 'https://dev.arkbao.com/xddj-minisvr/imgs/20190805/1564997026789.png',
        cgmessage: '太棒了！恭喜你在本次答题中获得称号：',
        imagesrc:'../../images/p3.png'
      });
    } else if (60 <= point && point <= 70) {
      this.setData({
        message: '党建达人',
        bjurl: 'https://dev.arkbao.com/xddj-minisvr/imgs/20190805/1564997005038.png',
        cgmessage: '加油啦！遗憾你在本次答题中获得称号：',
        imagesrc: '../../images/p2.png'
      });
    } else {
      this.setData({
        message: '党建小白',
        bjurl: 'https://dev.arkbao.com/xddj-minisvr/imgs/20190805/1564996966312.png',
        cgmessage: '加油啦！遗憾你在本次答题中获得称号：',
        imagesrc: '../../images/p1.png'
      });
    }
    this.draw();
  },
  onReady:function(){
    this.rules = this.selectComponent('#rules');
  },
  selectTk:function(e){
    let num = e.target.dataset.num;
    this.setData({
      num:num
    })
  },
  usernameInput:function(e){
    let username = e.detail.value.replace(/\s*/g, "");
    this.setData({
      username:username
    })
  },
  close: function () {
    this.setData({ visible: false })
  },
  handleSave: function () {
    this.draw();
    const { imageFile } = this.data

      saveImageToPhotosAlbum({
        filePath: imageFile,
      }).then(() => {
        this.triggerEvent('close')
        wx.showToast({
          icon: 'none',
          title: '成功保存图片到相册',
          duration: 2000,
        })
      }).catch(()=>{
        console.log('保存失败');
      })

  },
  draw: function () {
    const { userInfo, canvasWidth, canvasHeight } = this.data
    const point = this.data.point;
    const cgmessage = this.data.cgmessage;
    const message = this.data.message;
    const avatarUrl = '../images/code.png'
    const ctx = wx.createCanvasContext('share', this)
    const imagesrc = this.data.imagesrc;
    // 绘制背景
    ctx.drawImage(
      imagesrc,
      0,
      0
    )

    // 绘制用户名
    ctx.setFontSize(50)
    ctx.setTextAlign('left')
    ctx.setFillStyle('#ff6600')
    ctx.fillText(
      point + '分',
      350,
      500
    )
    ctx.stroke()
    //鼓励语
    ctx.setFontSize(30)
    ctx.setFillStyle('#666666')
    ctx.fillText(
      cgmessage,
      110,
      580
    )
    ctx.stroke()
    ctx.setFontSize(50)
    ctx.setFillStyle('#e40404')
    ctx.fillText(
      '“' + message + '”',
      240,
      670
    )
    ctx.stroke()
    //二维码
    ctx.drawImage(
      '../../images/code.png',
      180,
      850,
      110,
      110
    )
    ctx.setFontSize(24)
    ctx.setFillStyle('black')
    ctx.fillText(
      '湘东组工',
      190,
      980
    )

    ctx.stroke()
    ctx.drawImage(
      '../../images/logo.png',
      460,
      860,
      110,
      110
    )
    ctx.draw(false, () => {
      canvasToTempFilePath({
        canvasId: 'share',
      }, this).then(({ tempFilePath }) => this.setData({ imageFile: tempFilePath }))
    })
    wx.hideLoading()
    this.setData({ isDraw: true });
  },
  isRuleTrueChange:function(e){
    let name = this.data.username;
    let questionType = this.data.num;
    let openId = this.data.openId;
    this.setData({
      goTest:e.detail
    });
    if(name == '' || questionType== '' || !this.data.show){
      this.setData({
        goTest: true
      });     
    }
    if (!this.data.goTest) {
      wx.redirectTo({

        url: '../tikuDetail/tikuDetail?questionType=' + questionType + '&userName=' + name + '&openId=' + openId,
      })
    }
  },
  goTest:function(e){
    this.setData({
      goTest: true,
      show:false
    });    
    let iselect = this.data.num;
    let name = this.data.username;

    if(!iselect){
      this.setData({
        isRuleTrue:true,
        showmodal:true,
        advertisement:'请选择题库后进行答题'
      });
      return false;
    }
    if(name === ''){
      this.setData({
        isRuleTrue: true,
        showmodal:true,
        advertisement:'请输入姓名后进行答题'
      });

      return false;
    }
    if (iselect && (name != '')) {
      this.rules.showRule();
      this.setData({
        show:true
      })

    }

  }
})
 