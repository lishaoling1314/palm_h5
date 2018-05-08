<template>
    <div class="verify">
        <div class="content">
            <div class="icon-wrap">
                <img src="../../../assets/icon/signin_code@2x.png">
            </div>
            <input type="text" v-model="verifyCode" placeholder="验证码" @keyup="inputCode" maxlength="6">
        </div>
        <p v-if="getCode" class="get-code" :class="{'allow-get-code': mobileVaild, 'btn-click':btnClick }" @click="toGetCode" @mousedown="btnClick = true" @mouseup="btnClick = false" @touchstart="btnClick = true" @touchend="btnClick = false">{{ text }}</p>
        <p class="get-code disabled-get-code" v-else disabled="disabled">{{ time }}s</p>
    </div>
</template>
<script>
import Cookies from 'js-cookie';// cookies

import { mapState, mapGetters, mapMutations } from 'vuex';
import { loginSms, signupSms, forgotSms } from '@/service/account';

export default {
    data() {
        return {
            verifyCode: '',// 验证码
            getCode: true, // 是否允许获取验证码
            time: 60,// 倒计时
            btnClick: false
        }
    },
    props: {
        // 显示返回按钮
        type: {
            default: '0',// 1.快速登录,2.用户注册 3.找回密码
        },
        // 按钮文字
        text: {
            default: '获取验证码'
        },
        // 加载即倒计时
        loadCountDown: {
            default: false
        }
    },
    computed: {
        // 手机号码
        ...mapState({
            mobile: state => state.account.mobile
        }),
        // 获取手机号码验证结果
        ...mapGetters([
           'mobileVaild'
        ])
    },
    created: function () {
        // 加载即倒计时
        if (this.loadCountDown) {
            this.countDown();
        }
    },
    methods: {
        ...mapMutations([
            'SET_ACCOUNT'
        ]),
        // 输入验证码
        inputCode: function () {
            let verifyCode = this.verifyCode;
            // 替换非数字字符
            this.verifyCode = verifyCode.replace(/[^0-9]/g, '');
            this.SET_ACCOUNT(['verifyCode',this.verifyCode]);
        },
        // 获取验证码定时器
        toGetCode: async function() {
            //判断手机号是否为空
            if (this.mobile === '') {
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
                return false;
            }
            //判断手机号是否通过验证
            if (!this.mobileVaild) {
                this.SET_ACCOUNT(['errorTips','您输入的手机号码有误']);
                return false;
            }  
            // 获取16位流水号   
            let streamNumber = '';
            for (let i = 0; i < 16; i++) {
                streamNumber = streamNumber + String(Math.floor(Math.random() * 10));
            }       
            // 判断当前需要获取验证码的页面
            let res;
            switch(this.type){
                case '1':
                    res = await loginSms(this.mobile,streamNumber);
                    break;
                case '2':
                    res = await signupSms(this.mobile,streamNumber);
                    break;
                case '3':
                    res = await forgotSms(this.mobile,streamNumber);
                    break;
                default:
                    return false;
            }
            let errCode = res.errCode;
            // 判断是否获取成功
            if (errCode === 0) {
                // 储存流水号,时间为5分钟
                let inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
                Cookies.set('streamNumber', streamNumber, { expires: inFiveMinutes });
                // 倒计时
                this.countDown();
            }else if(errCode === 10002){
                this.SET_ACCOUNT(['errorTips','该手机号尚未注册']);
            }else if(errCode === 10006){
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if(errCode === 10010){
                this.SET_ACCOUNT(['errorTips','流水单号不能为空']);
            }else if(errCode === 10011){
                this.SET_ACCOUNT(['errorTips','手机号码已被注册']);
            }else if(errCode === 10013){
                this.SET_ACCOUNT(['errorTips','发送失败']);
            }
        },
        // 倒计时
        countDown: function () {
            // 设置按钮为不可点击
            this.getCode = false;
            let interval = setInterval(() => {
                // 间隔1秒减1
                this.time--;
                // 直到小于等于0
                if (this.time <= 0) {
                    // 允许重新发送验证码
                    this.getCode = true;
                    this.text = '重新发送验证码';
                    this.time = 60;
                    // 清除定时器
                    clearInterval(interval);
                }
            }, 1000);
        }
    }
}
</script>
<style lang="scss" scoped>
.verify{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 670px;
    .content {
        display: flex;
        align-items: center;
        height: 88px;
        border-bottom: 2px solid #dedede;
        padding-left: 26px;
        .icon-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            img {
                width: 36px;
                height: 42px;
            }
        }
        input {
            width: 280px;
            height: 84px;
            font-size: 32px;
            color: #333;
            border: none;
            margin-left: 46px;
        }
        input::placeholder {
            font-size: 32px;
            color: #999999;
        }
        input:focus {
            outline: none;
        }
    }
    .get-code {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        height: 78px;
        font-size: 32px;
        color: rgba(255, 255, 255, 0.35);
        background-color: #02b4a3;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 10px;
    }
    .allow-get-code{
        color: rgba(255, 255, 255, 1);
    }
    .disabled-get-code{
        color: rgba(255, 255, 255, 1);
        background-color: #bdbdbd;
    }
}
</style>

