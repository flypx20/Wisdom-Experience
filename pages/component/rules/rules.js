Component({
  /**
 1. 组件的属性列表
   */
  properties: {

     isRuleTrue:{
       type:Boolean,
       value:false
     },
     showmodal:{
       type: Boolean,
       value: false      
     },
    advertisement:{
      type:String,
      value:''
    }
   
  },

  /**
 2. 组件的初始数据
   */
  data: {

    rule: [
      '每套试题共有10题单选题，总限时5分钟。',
      '每道题均为10分，总得分为100分。',
      '在规定时间内答完题并提交的，正确率越高、得分越高。',
      '正确率相同的，答题速度越快、得分越高。',
      '未在规定时间内完成所有题目，系统自动根据答题者答完的题目计算分值。'
    ],
  },

  /**
 3. 组件的方法列表
   */
  methods: {
    showRule: function () {
      this.setData({
        isRuleTrue: true,
        showmodal:false
      })
    },
    hideRule: function () {
      this.setData({
        isRuleTrue: false,
        showmodal:false
      });
      this.triggerEvent('isRuleTrueChange',this.data.isRuleTrue);
    }

    }
})