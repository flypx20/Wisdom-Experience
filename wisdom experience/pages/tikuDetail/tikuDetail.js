var { getQuestion, postQuestion} = require('../../request/api.js');
var valHandle;  //定时器
const ctx = wx.createCanvasContext("bgCanvas")
Page({
  data: {
    //倒计时数据
    stepText: 30 ,

    //题目数据
    questionArray:[],
    question:{},
    title:'',
    self:0,
    index:'',
    correct:'',
    showanswer1:'',
    showanswer2: '',    
    showanswer3: '',
    showanswer4: '',
    confirmed:false,
    disabled:false,
    ispassed:false,
    length:10,

    //结果数据
    dration: 0,
    point: 0,
    ques: "",
    type: "",
    userId: ""
  },

  onLoad:function(options){
    var questionType = this.options.questionType;
    var userName = this.options.userName;
    var openId = '51';
    // 1 党的十九大报告, 2中国共产党章程, 3新形势下党内政治, 4中国共产党党员权利保障条例, 5习近平总书记系列重要讲话, 6党史基础知识测试题
    switch (questionType){
      case '1':
      this.setData({
        title:'党的十九大报告'
      });
        break;
      case '2':
        this.setData({
          title: '中国共产党章程'
        });
        break;
      case '3':
        this.setData({
          title: '新形势下党内政治'
        });
        break;
      case '4':
        this.setData({
          title: '中国共产党党员权利保障条例'
        });
        break;
      case '5':
        this.setData({
          title: '习近平总书记系列重要讲话'
        });
        break;
      case '6':
        this.setData({
          title: '党史基础知识测试题'
        });
        break;
    }
    //获取题目列表
    getQuestion({
      questionType: questionType,
      userName:userName,
      openId:openId
    }).then(res=>{
      if(res.code == '10000'){
        this.setData({
          questionArray: res.questions,
          userId:res.userId,
          type: questionType,
          length:res.questions.length
        });
        this.showQus(this.data.self);
      }
    })

  },
  onReady: function () {
    //倒计时
  this.countDown();
  },
    // 选项选中
    isSelect:function(e){
      if(!this.data.confirmed){
        var index = e.currentTarget.dataset.id;
        this.setData({
          index: index
        });

      }

    },
    //确定答案
    confirm:function(e){
      clearInterval(this.valHandle);
 
      var questions = this.data.questionArray
      var point = this.data.point;
      var ques = this.data.ques;
      var self = this.data.self;
      var id = this.data.question.id;
      var _answer = id + '=' + this.data.index+',';
      ques = ques+_answer;
      var correct = questions[self].quAsr;
      var alllength = questions.length - 1;
     
      this.setData({

        correct: correct,
        confirmed: true,
        ques:ques
      });

      if(correct !== this.data.index){
        console.log('saas');
        switch(this.data.index){
          case 'A':
          this.setData(
            {
              showanswer1: 'selectSection2',
              confirmed: true
            }
          );
          break;
          case 'B':
            this.setData(
              {
                showanswer2: 'selectSection2',
                confirmed: true
              }
            );
            break;
          case 'C':
            this.setData(
              {
                showanswer3: 'selectSection2',
                confirmed: true
              }
            );
            break;
          case 'D':
            this.setData(
              {
                showanswer4: 'selectSection2',
                confirmed: true
              }
            );
            break;
        }
        point = point+0;
        this.setData({
          point:point
        })
        if (this.data.confirmed){
          var that = this;
          setTimeout(function(){
            that.nextQus(); 

            // that.countDown();                      
          },3000)
        }
      } else{
        point = point + 10;
        this.setData({
          point: point
        })
        if (this.data.confirmed){
          this.setData({
            correct: correct,
            confirmed: true
          });
          var that = this;
          setTimeout(function () {
            that.nextQus();
          }, 100)
        }
 
      }
      this.setData({ disabled:true,ispassed:true
      });

    },
    //跳过
    showQus:function(index){
      // this.countDown();
    clearInterval(this.valHandle);
      var questions = this.data.questionArray;
      var question = questions[index];

      var that = this;
      this.setData({

        question:question
      });
      var alllength = questions.length - 1;

      var self = this.data.self;
      if (this.data.confirmed && (self == alllength)) {
        this.setData({
          disabled: true
        })

      }else{
        setTimeout(function(){
          that.setData({ disabled: false });
        },600)

      }
      if (self == alllength){
        this.setData({
          ispassed: true
        })

      }else{

        setTimeout(function () {
          that.setData({
            ispassed: false
          });
        // that.countDown();
        }, 600)
      }
      this.countDown();
    },
    nextQus:function(){
      var that = this;
      clearInterval(this.valHandle);
      var questions = this.data.questionArray;
      var length = questions.length;
      var costime = (30 - this.data.stepText) * 1000;
      var dration = costime + this.data.dration;
      this.setData({
        dration:dration
      }); 
      var self = this.data.self;
      if(self<length-1){
        self++;
        this.setData({
          self:self,
          index: '',
          correct: '',
          showanswer1: '',
          showanswer2: '',
          showanswer3: '',
          showanswer4: '',
          confirmed: false,
          stepText:30,
          // dration: dration,
        });
         this.countDown();
        this.showQus(self);
      }
      this.setData({
        ispassed:true,
        disabled:true

      });
      var questions = that.data.questionArray;
      var alllength = questions.length - 1;
      var self = that.data.self;
      if (that.data.confirmed && (self == alllength)) {
        that.setData({
          disabled: true,
          ispassed: true,
        });
        if (that.data.ques == '') {
          that.setData({
            ques: '1=,2=,3=,4=,5=,6=,7=,8=,9=,10='
          })
        }
        console.log(that.data.dration);
        postQuestion({
          dration: that.data.dration,
          point: that.data.point,
          ques: that.data.ques,
          type: that.data.type,
          userId: that.data.userId
        }).then(res => {
          if (res.code == '10000') {
            wx.redirectTo({

              url: '../index/index?point=' + that.data.point,
            })
          } else {
            console.log(res);
          }
        })
      }

      // this.countDown();  
    },
    //倒计时

countDown:function(){
  var that = this;
  var step = that.data.stepText;  //定义倒计时
  var num = -0.5;
  var decNum = 2 / step / 10;

  clearInterval(this.valHandle)
  function drawArc(endAngle) {
    ctx.setLineWidth(16)
    ctx.arc(50, 50, 38, 0, 2 * Math.PI)
    ctx.setStrokeStyle('white')
    ctx.stroke()

    ctx.beginPath()
    // ctx.setLineCap('round')
    ctx.setLineWidth(15)
    ctx.arc(50, 50, 38, 1.5 * Math.PI, endAngle, true)
    ctx.setStrokeStyle('#b9292b')
    ctx.stroke()
    ctx.draw()
  }

  that.valHandle = setInterval(function () {

    that.setData({
      stepText: Math.round(step)
    })
    step = (step - 0.1).toFixed(1)
    num += decNum
    drawArc(num * Math.PI)

    if (step <= 0) {
      clearInterval(that.valHandle);  //销毁定时器
      that.confirm();
    
    }

  }, 100); 
 
}
      

});
