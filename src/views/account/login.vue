<template>
    <div class="wrap">
        <!-- 顶部 -->
        <nav-return title="登录" :goHome="false"></nav-return>
        <!-- 提示 -->
        <error-tips></error-tips>
        <!-- 内容wrap -->
        <div class="content-wrap">
            <!-- 内容-->
            <div class="content">
                <!-- 机构名称 -->
                <agencys-info class="mechanism"></agencys-info>
                <!-- 手机号 -->
                <mobile-number class="mobile-number" :areaCode="false"></mobile-number>
                <!-- 验证码 -->
                <verify-code class="verify-code" type="1" v-if="curRouteName === 'mobileLogin'"></verify-code>
                <!-- 密码 -->
                <enter-password class="enter-password" v-if="curRouteName === 'passwordLogin'" :confirm="false"></enter-password>
                <!-- 密码登录,注册 -->
                <div class="way">
                    <p v-if="curRouteName === 'mobileLogin'" @click="goToOther('/passwordLogin')">使用密码登录</p>
                    <p v-if="curRouteName === 'passwordLogin'" @click="goToOther('/findPassword')">忘记密码？</p>
                    <p @click="goToOther('/register')">没有账号？点击注册</p>
                </div>
                <!-- 登录按钮 -->
                <push-button class="push-button" text="登录" :btnStatus="curRouteName === 'mobileLogin'? mobileAndVerifyCodeNoEmpety : allowPasswordLogin" @click.native="userLogin"></push-button>
            </div>
            <!-- 底部 -->
            <direct-access :text="curRouteName === 'mobileLogin'? '直接访问':'使用动态密码登录'" @operateOne="bottomBtn"></direct-access> 
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import agencysInfo from '@/components/agencys/agencysInfo';//头部的logo和机构名字
import mobileNumber from './components/mobileNumber';//手机号码
import verifyCode from './components/verifyCode';//验证码
import enterPassword from './components/enterPassword';//密码
import pushButton from './components/pushButton';//跳转页面的按钮
import directAccess from './components/directAccess';//直接访问
import errorTips from './components/errorTips';//底部按钮

import Cookies from 'js-cookie';// cookies
import { Indicator } from 'mint-ui';

import { mapState, mapGetters, mapMutations } from 'vuex';
import { quickLogin, passwordLogin } from '@/service/account';
import { mobileRegexpVaild, setLocalStore } from '@/utils';

export default {
    data() {
        return{
            curRouteName: 'mobileLogin',//当前路由名
            agencysInfo: this.$route.params.agencysInfo,//机构信息
        }
    },
    //离开路由删除store信息
    beforeRouteLeave(to, from, next) {
        this.InitAcconut();
        next();
    },
    components:{
        navReturn,
        agencysInfo,
        errorTips,
        mobileNumber,
        verifyCode,
        enterPassword,
        pushButton,
        directAccess,
        errorTips 
    },
    created: function () {
        // 获取当前路由名
        this.curRouteName = this.$route.name;
    },
    computed: {
        // 手机号码
        // 流水号
        // 验证码
        ...mapState({
            mobile: state => state.account.mobile,
            verifyCode: state => state.account.verifyCode,
            password: state => state.account.password
        }),
        // 判断是否允许快速登录
        // 判断是否允许密码登录
        ...mapGetters([
            'mobileVaild',
           'mobileAndVerifyCodeNoEmpety',
           'allowPasswordLogin'
        ])
    },
    methods:{
        ...mapMutations([
            'SET_ACCOUNT',
            'InitAcconut'
        ]),
        // 用户登录
        userLogin: async function () {
            // 手机号为空
            if (this.mobile === '') {
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
                return false;
            }
            // 手机号不合法
            if (!this.mobileVaild) {
                this.SET_ACCOUNT(['errorTips','您输入的手机号码有误']);
                return false;
            }
            // 定义结果
            let res;
            // 判断当前路由名选择登录方式
            if (this.curRouteName === 'mobileLogin') {
                // 验证码为空
                if (this.verifyCode === '') {
                    this.SET_ACCOUNT(['errorTips','请输入验证码']);
                    return false;
                }
                // 获取流水号
                let streamNumber = Cookies.get('streamNumber');
                if (streamNumber === undefined) {
                    this.SET_ACCOUNT(['errorTips','验证码超时，重新获取']);
                    return false;
                }
                // 显示loading
                Indicator.open('正在登录...');
                // 验证码登录
                res = await quickLogin(this.mobile,streamNumber,this.agencysInfo.id,this.verifyCode);
            }else{
                // 密码为空
                if (this.password === '') {
                    this.SET_ACCOUNT(['errorTips','请输入密码']);
                    return false;
                }
                // 显示loading
                Indicator.open('正在登录...');
                // 账号密码登录
                res = await passwordLogin(this.mobile,this.agencysInfo.id,this.password);
            }
            // 关闭loading
            Indicator.close();
            // 判断结果
            let errCode = res.errCode;
            if (errCode === 0) {
                // 储存机构id
                res.data.agency_id = this.agencysInfo.id;
                // 储存用户信息
                setLocalStore('userInfo',res.data);
                // 储存用户登陆信息
                if (this.curRouteName === 'mobileLogin') {
                    // 快速登陆储存手机号
                    setLocalStore('quickLogin',{mobile:this.mobile});
                }else{
                    // 账号密码储存
                    setLocalStore('passwordLogin',{mobile:this.mobile,password:this.password});
                }
                // 判断是否第一次登录
                if (Number(res.data.first_login) === 1 && Number(res.data.role) === 10 ) {
                    // 是则跳转到审核页
                    this.goToOther('/authResult');   
                }else{
                    // 获取是否为机构申请审批页或者报读课程申请审批页
                    let msgEnter = Cookies.get('msgEnter');
                    let msgQuery = Cookies.get('msgQuery');
                    // 是则跳转到该页
                    if (msgEnter !== undefined && Number(res.data.role) !== 10) {
                        this.goToDetail(msgEnter,JSON.parse(msgQuery)); 
                    }else{
                        // 跳转到主页
                        this.goToOther(''); 
                    }
                }
            }else if(errCode === 10002){
                this.SET_ACCOUNT(['errorTips','该手机号尚未注册']);
            }else if(errCode === 10006){
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if(errCode === 10010){
                this.SET_ACCOUNT(['errorTips','验证码超时，重新获取']);
            }else if(errCode === 10019){
                this.SET_ACCOUNT(['errorTips','验证码错误']);
            }else if(errCode === 10024){
                this.SET_ACCOUNT(['errorTips','请输入密码']);
            }else if(errCode === 10025){
                this.SET_ACCOUNT(['errorTips','密码不正确']);
            }else if(errCode === 10026){
                this.SET_ACCOUNT(['errorTips','机构不存在']);
            }else if(errCode === 10055){
                this.SET_ACCOUNT(['errorTips','请输入验证码']);
            }else if(errCode === 10067){
                this.SET_ACCOUNT(['errorTips','验证码超时，重新获取']);
            }
        },   
        // 底部按钮
        bottomBtn: function () {
            // 直接访问
            if (this.curRouteName === 'mobileLogin') {
                let is_anonymous = Number(this.agencysInfo.is_anonymous);
                if (is_anonymous === 0) {
                    this.SET_ACCOUNT(['errorTips','当前机构不支持直接访问，请先登录']);
                }else{
                   // 跳转到首页
                   this.goToOther('');
                }
            }else{
                // 验证码登录
                this.goToOther('/mobileLogin');
            }
        }
    },
    watch: {
        $route: function () {
            window.location.reload();
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap{
    display: flex;
    flex-direction: column;
    width: 750px;
    min-height:100vh;
    background-color: #fff;
    .content-wrap{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        // 内容
        .content{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 750px;
            //机构名称
            .mechanism{
                margin-top: 16px;
            }
            //手机号码
            .mobile-number{
                margin-top: 34px;
            }
            .verify-code,
            .enter-password{
                margin-top: 20px;
            }
            //其他登录方式
            .way{
                width: 670px;
                margin-top:50px;
                display: flex;
                justify-content: space-between;
                p{
                    font-size: 28px;
                    color:#999;
                    cursor: pointer;
                }
            }
            .push-button{
                margin-top: 96px;
            }
        }
    }
}
</style>

