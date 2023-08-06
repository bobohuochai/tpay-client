// vue-driver
import Driver from "driver.js"
import "driver.js/dist/driver.min.css"
import './driver.css'
import * as userApis from '../services/user';

const driver = new Driver({
  className: 'mydriver-class',
  animate: true,
  opacity: 0.7,
  padding: 10,
  allowClose: false,
  nextBtnText: '下一步',
  prevBtnText: '上一步',
  closeBtnText: '关闭',
  doneBtnText: '完成',
  onNext: function (dirver) {
    console.log("onNext");
  },
  onReset () {
    // 调用方法
    userApis.updateNewFlag();
  }
});

export default function start () {
  driver.defineSteps(
    [
      {
        element: '#user-id-handler',
        popover: {
          className: 'step-first-popover',
          title: '第一步',
          description: '提交KYC信息',
          position: 'left',
          closeBtnText: '跳过'
        }
      },
      {
        element: '#recharge-order',
        popover: {
          className: 'step-second-popover',
          title: '第二步',
          description: '进行账户充值',
          position: 'right',
          closeBtnText: '跳过'
        }
      },
      {
        element: '#card-request',
        popover: {
          className: 'step-third-popover',
          title: '第三步',
          description: '申请信用卡',
          position: 'right',
          closeBtnText: '跳过'
        }
      },
      {
        element: '#cardholder',
        popover: {
          className: 'step-four-popover',
          title: '第四步',
          description: '自定义持卡人信息，默认为KYC信息',
          position: 'right'
        }
      },
    ]
  );
  driver.start();
};
