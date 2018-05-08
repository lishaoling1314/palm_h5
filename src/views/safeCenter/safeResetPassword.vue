<template>
  <div class="wrap">
        <!--顶部-->
        <nav-return title="重置密码" operate="完成" @navOperate="finishReset" :goHome="false"></nav-return>
        <!-- 提示 -->
        <error-tips></error-tips>
        <!--内容-->
        <ul class="content">
            <li>
                <p class="title">账户</p>
                <p class="account">{{ userInfo.mobile }}</p>
            </li>
            <li>
                <p class="title">旧密码</p>
                <input type="password" v-model="originPassword" placeholder="请填写旧密码">
            </li>
            <li>
                <p class="title">新密码</p>
                <input type="password" v-model="newPassword" placeholder="请填写新密码" maxlength="16">
            </li>
            <li>
                <p class="title">确认密码</p>
                <input type="password" v-model="newPasswordAgain" placeholder="请再次输入新的密码" maxlength="16">
            </li>
        </ul>
        <div class="password-tips">
            <p class="tips">8-16位密码，需同时包含字母和数字。</p>
            <p class="tips-btn" @click="goToDetail('/findPassword',{ 'mobile': userInfo.mobile })">忘记密码？</p>
        </div>
  </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import errorTips from '@/views/account/components/errorTips';//提示信息

import { Toast,Indicator } from 'mint-ui';

import { userProfile, userResetPassword } from '@/service/user';
import { getLocalStore, passwordRegexpVaild } from'@/utils';
import { mapMutations } from 'vuex';
export default {
    data(){
        return{
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
            userInfo: {},//用户信息
            originPassword: '',//旧密码
            newPassword: '',//新密码
            newPasswordAgain: ''//二次密码
        }
    },
    components:{
        navReturn,
        errorTips
    },
    beforeRouteEnter: function (to,from,next) {
        let userInfo = getLocalStore('userInfo');
        if (userInfo !== null) {
            userInfo = JSON.parse(userInfo);
            if(Number(userInfo.role) === 10 && to.name !== 'studentResetPassword'){
                next('/' + to.params.agencysNamePy + '/studentResetPassword');
            }
            if(Number(userInfo.role) === 2 && to.name !== 'agencysResetPassword'){
                next('/' + to.params.agencysNamePy + '/agencysResetPassword');
            }
        }
        next();
    },
    created: function () {
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
        // 完成重置密码
        finishReset: async function () {
            if (this.originPassword === '') {
                this.SET_ACCOUNT(['errorTips','请输入旧密码']);
                return false;
            }
            if (this.newPassword === '') {
                this.SET_ACCOUNT(['errorTips','请输入新密码']);
                return false;
            }
            if (!passwordRegexpVaild(this.newPassword)) {
                this.SET_ACCOUNT(['errorTips','请输入8-16位密码，需同时包含字母和数字']);
                return false;
            }
            if (this.newPasswordAgain === '') {
                this.SET_ACCOUNT(['errorTips','请输入确认密码']);
                return false;
            }
            if (this.newPassword !== this.newPasswordAgain) {
                this.SET_ACCOUNT(['errorTips','密码不一致']);
                return false;
            }
            Indicator.open();
            let res = await userResetPassword(this.userInfo.mobile,this.originPassword,this.newPassword,this.newPasswordAgain);
            Indicator.close();
            if (res.errCode === 0) {
                Toast('重置密码成功');
                if (this.$route.name === 'studentResetPassword') {
                    this.goToOther('/studentSafeCenter');
                }else{
                    this.goToOther('/agencysSafeCenter');
                }
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if (res.errCode === 10006) {
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if (res.errCode === 10014) {
                this.SET_ACCOUNT(['errorTips','请输入确认密码']);
            }else if (res.errCode === 10015) {
                tthis.SET_ACCOUNT(['errorTips','密码不一致']);
            }else if (res.errCode === 10024) {
                this.SET_ACCOUNT(['errorTips','请输入新密码']);
            }else if (res.errCode === 10035) {
                this.SET_ACCOUNT(['errorTips','请输入旧密码']);
            }else if (res.errCode === 10036) {
                this.SET_ACCOUNT(['errorTips','提交的手机号码与用户注册手机号不一致']);
            }else if (res.errCode === 10043) {
                this.SET_ACCOUNT(['errorTips','密码错误，请重新填写']);
            }else{
                Toast('重置密码失败');
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
    min-height: 100vh;
    background-color: #fff;
    .content{
        width: 100%;
        margin-top: 50px;
        padding: 0 25px;
        li{
            display: flex;
            align-items: center;
            height: 88px;
            border-bottom: 1px solid #eee;
            p{
                width: 240px;
                font-size: 32px;
                color:#323333;
            }
            .account{
                font-size: 32px;
                color:#323333;
            }
            input{
                flex: 1;
                height: 78px;
                font-size: 32px;
                color: #323333;
                border:none;
            }
            input::placeholder{
                font-size: 32px;
                color: #999999;
            }
        }
    }
    .password-tips{
        padding: 77px 25px 0 25px;
        .tips{
            font-size: 30px;
            color: #989999;
            margin-bottom: 42px;
        }
        .tips-btn{
            font-size: 30px;
            color: #04b2a3;
            cursor: pointer;
        }
    }
}
</style>

