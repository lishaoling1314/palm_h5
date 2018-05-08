<template>
    <div class="wrap">
        <!-- 顶部 -->
        <nav-return title="余额支付"></nav-return>
        <!-- 提示 -->
        <error-tips></error-tips>
        <!-- 内容 -->
        <div class="content">
            <p class="operate-tip">该验证手机号为注册时使用的手机号</p>
            <!-- 验证码 -->
            <div class="verify">
                <div class="verify-content">
                    <div class="icon-wrap">
                        <img src="../../assets/icon/signin_code@2x.png">
                    </div>
                    <input type="text" v-model="verifyCode" placeholder="验证码" @keyup="inputCode" maxlength="6" />
                </div>
                <p v-if="getCode" class="get-code allow-get-code" :class="{'btn-click':btnClick }" @click="countDown" @mousedown="btnClick = true" @mouseup="btnClick = false" @touchstart="btnClick = true" @touchend="btnClick = false">{{ verifyText }}</p>
                <p class="get-code disabled-get-code" v-else disabled="disabled">{{ time }}s</p>
            </div>
            <!-- 下一步按钮 -->
            <p class="push-button" :class="{'btn-status': verifyCode.length === 6,'btn-click':btnPay}" @click="confirmPay" @mousedown="btnPay = true" @mouseup="btnPay = false" @touchstart="btnPay = true" @touchend="btnPay = false">确认支付</p>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import errorTips from '@/views/account/components/errorTips'//提示信息

import { Indicator } from 'mint-ui';
import Cookies from 'js-cookie';// cookies

import { mapMutations } from 'vuex';
import { userProfile } from '@/service/user';
import { balancePaySms, balancePay } from '@/service/order';
export default {
    data() {
        return{
            agencysInfo: this.$route.params.agencysInfo,//机构信息
            orderNo: '',//订单号
            userInfo: {},//用户信息
            verifyCode: '',// 验证码
            verifyText: '获取验证码',
            getCode: true, // 是否允许获取验证码
            time: 60, // 倒计时
            btnClick: false,//点击获取验证码
            btnPay: false,//确认支付
        }
    },
    components:{
        navReturn,
        errorTips
    },
    created: function () {
        // 获取订单号
        let orderNo = this.$route.query.orderNo;
        let callBackUrl = this.$route.query.callBackUrl;
        if (orderNo !== undefined && orderNo !== callBackUrl) {
            this.orderNo = orderNo;
            this.callBackUrl = callBackUrl;
        }
        this.getUserProfile();
    },
    methods:{
        ...mapMutations([
            'SET_ACCOUNT'
        ]),
        //获取用户信息
        getUserProfile: async function () {
            Indicator.open();
            let res = await userProfile(this.agencysInfo.id);
            Indicator.close();
            if (res.errCode === 0 && res.data !== null) {
                this.userInfo = res.data;
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 80001){
                Toast('机构不存在');
            }else{
                Toast('获取用户信息失败');
            }
        },
        // 输入验证码
        inputCode: function () {
            let verifyCode = this.verifyCode;
            // 替换非数字字符
            this.verifyCode = verifyCode.replace(/[^0-9]/g, '');
        },
        // 获取验证码定时器
        countDown: async function() {
            // 判断是否有订单号
            if (this.orderNo === '') {
                this.SET_ACCOUNT(['errorTips','订单号不能为空']);
                return false;
            }
            // 判断是否有手机号
            let mobile = this.userInfo.mobile;
            if (mobile === null || mobile === '' || mobile === undefined) {
                this.SET_ACCOUNT(['errorTips','用户信息不存在']);
                return false;
            }
            // 获取16位流水号   
            let streamNumber = '';
            for (let i = 0; i < 16; i++) {
                streamNumber = streamNumber + String(Math.floor(Math.random() * 10));
            }       
            // 判断当前需要获取验证码的页面
            Indicator.open();
            let res = await balancePaySms(mobile,streamNumber,this.orderNo);
            Indicator.close();
            let errCode = res.errCode;
            // 判断是否获取成功
            if (errCode === 0) {
                // 储存流水号,时间为15分钟
                Cookies.set('streamNumber', streamNumber, { expires: 15 });
                // 设置按钮为不可点击
                this.getCode = false;
                let interval = setInterval(() => {
                    // 间隔1秒减1
                    this.time--;
                    // 直到小于等于0
                    if (this.time <= 0) {
                        // 允许重新发送验证码
                        this.getCode = true;
                        this.verifyText = '重新发送验证码';
                        this.time = 60;
                        // 清除定时器
                        clearInterval(interval);
                    }
                }, 1000)
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(errCode === 10002){
                this.SET_ACCOUNT(['errorTips','该手机号尚未注册']);
            }else if(errCode === 10006){
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if(errCode === 10010){
                this.SET_ACCOUNT(['errorTips','流水单号不能为空']);
            }else if(errCode === 40019){
                this.SET_ACCOUNT(['errorTips','当前订单不可支付']);
            }else{
                this.SET_ACCOUNT(['errorTips','获取验证码失败']);
            }
        },
        //确认支付
        confirmPay: async function () {
            // 判断是否有订单号
            if (this.orderNo === '') {
                this.SET_ACCOUNT(['errorTips','订单号不能为空']);
                return false;
            }
            // 判断是否有手机号
            let mobile = this.userInfo.mobile;
            if (mobile === null || mobile === '' || mobile === undefined) {
                this.SET_ACCOUNT(['errorTips','用户信息不存在']);
                return false;
            }
            // 判断是否有验证码
            if (this.verifyCode.length !== 6) {
                this.SET_ACCOUNT(['errorTips','请输入正确的验证码']);
                return false;
            }
            let streamNumber = Cookies.get('streamNumber');
            if (streamNumber === undefined) {
                this.SET_ACCOUNT(['errorTips','验证码已超时，请重新获取']);
                return false;
            }
            Indicator.open();
            let res = await balancePay(this.userInfo.mobile,streamNumber,this.orderNo,this.verifyCode);
            Indicator.close();
            let errCode = res.errCode;
            if (errCode === 0) {
                this.goToOther('/enrolCourses');
            }else if (errCode === 10003 || errCode === 10005) {
                this.tokenOutOfDate();
            }else if(errCode === 10002){
                this.SET_ACCOUNT(['errorTips','手机号未注册']);
            }else if(errCode === 10006){
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if(errCode === 10010){
                this.SET_ACCOUNT(['errorTips','验证码已超时，请重新获取']);
            }else if(errCode === 10019 || errCode === 40051){
                this.SET_ACCOUNT(['errorTips','验证码错误']);
            }else if(errCode === 10055){
                this.SET_ACCOUNT(['errorTips','验证码不能为空']);
            }else if(errCode === 10067){
                this.SET_ACCOUNT(['errorTips','验证码已超时，请重新获取']);
            }else if(errCode === 60011){
                this.SET_ACCOUNT(['errorTips','账户余额不足']);
            }else if(errCode === 40019){
                this.SET_ACCOUNT(['errorTips','当前订单不可支付']);
            }else{
                this.SET_ACCOUNT(['errorTips','支付失败']);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap{
    width: 750px;
    min-height: 100vh;
    background-color: #fff;
    position: relative;
    //内容
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 750px;
        .operate-tip{
            font-size: 30px;
            color: #666666;
            margin-top: 120px;
        }
        .verify{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 670px;
            margin-top: 96px;
            .verify-content {
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
                margin-top: 10px;
            }
            .allow-get-code{
                color: rgba(255, 255, 255, 1);
                cursor: pointer;
            }
            .disabled-get-code{
                color: rgba(255, 255, 255, 1);
                background-color: #bdbdbd;
            }
        }
        .push-button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 670px;
            height: 88px;
            border-radius: 10px;
            background-color: #02b4a3;
            font-size: 34px;
            color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            margin-top: 192px;
        }
        .btn-status{
            color: rgba(255, 255, 255, 1);
            cursor: pointer;
        }
    }  
}
</style>

