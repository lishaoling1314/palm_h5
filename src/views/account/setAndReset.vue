<template>
    <div class="wrap">
        <!-- 顶部 -->
        <nav-return :title="curRouteName === 'setPassword'?'设置密码':'重置密码'" :goHome="false"></nav-return>
        <!--  提示  -->
        <error-tips></error-tips>
        <!-- 内容  -->
        <div class="content">
            <!-- 注册提示 -->
            <p class="register-tip" :class="curRouteName === 'setPassword'? '': 'register-tip-no'">8-16位密码，需同时包含字母和数字</p>
            <!-- 密码 -->
            <enter-password class="password" :showRepassword="true"></enter-password>
            <div class="nickname" v-if="curRouteName === 'setPassword'">
                <div class="icon-wrap">
                    <img src="../../assets/icon/signin_name@2x.png">
                </div>
                <input type="text" v-model="nickname" placeholder="昵称">
            </div>
            <!-- 重置密码提示 -->
            <p class="reset-tip" v-if="curRouteName === 'resetPassword'">8-16位密码，需同时包含字母和数字</p>
            <push-button class="push-button" text="完成" :btnStatus="submitCheck" @click.native="finishPasswordSet"></push-button>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import enterPassword from './components/enterPassword';//密码
import pushButton from './components/pushButton';//跳转页面的按钮
import errorTips from './components/errorTips'//提示信息

import Cookies from 'js-cookie';// cookies
import { Toast, Indicator } from 'mint-ui';

import { mapState, mapGetters, mapMutations } from 'vuex';
import { setPassword, resetPassword } from '@/service/account';
import { setLocalStore, passwordRegexpVaild, nicknameRegexpVaild } from '@/utils';

export default {
    data() {
        return{
            curRouteName: 'setPassword',//当前路由名
            agencysInfo: this.$route.params.agencysInfo,//机构信息
            nickname: '',//昵称
            passwordResetToken: ''//重置密码token
        }
    },
    //离开路由删除store信息
    beforeRouteLeave(to, from, next) {
        Cookies.remove('getCodeMobile');
        this.InitAcconut();
        next();
    },
    components:{
        navReturn,
        enterPassword,
        pushButton,
        errorTips 
    },
    created: function () {
        // 获取当前路由名
        this.curRouteName = this.$route.name;
        // 每次刷新页面从cookie获取手机号码
        let mobile = Cookies.get('getCodeMobile');
        // 不存在则直接跳转回输入手机页面
        if (mobile === undefined) {
            // 判断当前路由
            if (this.curRouteName === 'setPassword') {
                this.goToOther('/register');
            }else{
                this.goToOther('/findPassword');
            }
        }else{
            // 存在则储存到store
            this.SET_ACCOUNT(['mobile',mobile]);
            // 若为重置密码则需判断是否有重置密码token
            if (this.curRouteName === 'resetPassword') {
                let passwordResetToken = Cookies.get('passwordResetToken');
                // 不存在则返回
                if (passwordResetToken === undefined) {
                    this.goToOther('/findPassword');
                }else{
                    this.passwordResetToken = passwordResetToken;
                }
            }
        }
    },
    computed: {
        // 手机号码
        ...mapState({
            mobile: state => state.account.mobile,
            password: state => state.account.password,
            rePassword: state => state.account.rePassword
        }),
        // 判断是否允许提交
        submitCheck: function () {
            let result = false;
            if (this.password !== '' && this.rePassword !== '') {
                if (this.curRouteName === 'setPassword' && this.nickname === '') {
                    result = false;
                }else{
                    result = true;
                }
            }
            return result;
        }
    },
    methods:{
        ...mapMutations([
            'SET_ACCOUNT',
            'InitAcconut'
        ]),
        // 完成密码设置
        finishPasswordSet: async function () {
            // 密码为空
            if (this.password === '') {
                this.SET_ACCOUNT(['errorTips','请输入密码']);
                return false;
            }
            // 二次密码为空
            if (this.rePassword === '') {
                this.SET_ACCOUNT(['errorTips','请输入密码二次密码']);
                return false;
            }
            // 密码正则验证
            if (!passwordRegexpVaild(this.password)) {
                this.SET_ACCOUNT(['errorTips','请输入8-16位密码，需同时包含字母和数字']);
                return false;
            }
            // 二次密码为空
            if (this.password !== this.rePassword) {
                this.SET_ACCOUNT(['errorTips','密码不一致']);
                return false;
            }
            // 定义结果
            let res;
            // 判断当前路由
            if (this.curRouteName === 'setPassword') {
                // 昵称正不能为空
                if (this.nickname === '') {
                    this.SET_ACCOUNT(['errorTips','请输入昵称']);
                    return false;
                }
                // 昵称正则验证
                if (!nicknameRegexpVaild(this.nickname)) {
                    this.SET_ACCOUNT(['errorTips','昵称只能由汉字，英文和数字组成']);
                    return false;
                }
                // 显示loading
                Indicator.open('正在注册...');
                // 设置密码
                res = await setPassword(this.mobile,this.password,this.rePassword,this.agencysInfo.id,this.nickname);
            }else{
                // 显示loading
                Indicator.open('正在修改...');
                // 重置密码
                res = await resetPassword(this.passwordResetToken,this.password,this.rePassword);
            }
            // 关闭loading
            Indicator.close();
            let errCode = res.errCode;
            // 判断是否获取成功
            if (errCode === 0) {
                if (this.curRouteName === 'setPassword') {
                    // 储存用户信息
                    setLocalStore('userInfo',res.data);
                    // 跳转到信息认证
                    this.goToOther('/informationAuth');
                }else{
                    Toast('重置密码成功');
                    // 跳转到登录页
                    this.goToOther('/passwordLogin');
                }
            }else if(errCode === 10006){
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if(errCode === 10011){
                this.SET_ACCOUNT(['errorTips','该手机号已注册，可直接登录']);
            }else if(errCode === 10014){
                this.SET_ACCOUNT(['errorTips','请输入二次密码']);
            }else if(errCode === 10015){
                this.SET_ACCOUNT(['errorTips','密码不一致']);
            }else if(errCode === 10017){
                this.SET_ACCOUNT(['errorTips','注册失败']);
            }else if(errCode === 10021){
                this.SET_ACCOUNT(['errorTips','重置密码超时']);
            }else if(errCode === 10023){
                this.SET_ACCOUNT(['errorTips','修改密码失败']);
            }else if(errCode === 10024){
                this.SET_ACCOUNT(['errorTips','请输入密码']);
            }else if(errCode === 10026){
                this.SET_ACCOUNT(['errorTips','机构不存在']);
            }else if(errCode === 10056){
                this.SET_ACCOUNT(['errorTips','重置密码超时']);
            }else if(errCode === 10070){
                this.SET_ACCOUNT(['errorTips','请输入昵称']);
            }else{
                this.goToOther('/mobileLogin');
            }
        }
    },
    watch: {
        // 监听是否有刷新
        $route: function () {
            window.location.reload();
        }
    }
}
</script>
<style lang="scss" scoped> 
.wrap{
    width: 750px;
    min-height:100vh;
    background-color: #fff;
    position: relative;
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 750px;
        .register-tip{
            font-size: 30px;
            color: #666666;
            margin-top: 120px;
        }
        .register-tip-no{
            opacity: 0;
        }
        .password{
            margin-top: 50px;
        }
        .re-password{
            margin-top: 20px;
        }
        .nickname {
            display: flex;
            align-items: center;
            width: 670px;
            height: 88px;
            border-bottom: 2px solid #dedede;
            padding-left: 26px;
            margin-top: 20px;
            .icon-wrap{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                img {
                    width: 32px;
                    height: 36px;
                }
            }
            input{
                height: 85px;
                font-size: 32px;
                color: #333333;
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
        .reset-tip{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 670px;
            height: 88px;
            font-size: 30px;
            color: #999999;
            margin-top: 20px;
        }
        .push-button{
            margin-top: 80px;
        }
    }
}
</style>
