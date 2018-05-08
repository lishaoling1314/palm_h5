<template>
  <div class="safe-center">
        <!-- 顶部 -->
        <nav-return title="安全中心" :goBackToLast="false" leavePath="/studentCenter"></nav-return>
        <!-- 内容 -->
        <div class="content">
            <div class="phone">
                <p class="title">手机号</p>
                <p class="mobile-number">
                    <img src="../../assets/icon/security_phone@2x.png">
                    <span class="number">{{ userInfo.mobile }}</span>
                </p>
            </div>
        </div>
        <nav-enter leftText="账户密码" rightText="已设置" @click.native="goToReset"></nav-enter>
        <!-- 底部 -->
        <div class="content">
            <p class="tips">如果遇到账号信息泄露、忘记密码、诈骗等账号安全问题，可前往安全中心。</p>
        </div>
  </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import navEnter from '@/components/common/navEnter';//账户密码

import { Toast,Indicator } from 'mint-ui';

import { userProfile } from '@/service/user';
import { getLocalStore } from '@/utils';
export default {
    data(){
        return{
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
            userInfo: {},//用户信息
        }
    },
    components:{
        navReturn,
        navEnter
    },
    beforeRouteEnter: function (to,from,next) {
        let userInfo = getLocalStore('userInfo');
        if (userInfo !== null) {
            userInfo = JSON.parse(userInfo);
            if(Number(userInfo.role) === 10 && to.name !== 'studentSafeCenter'){
                next('/' + to.params.agencysNamePy + '/studentSafeCenter');
            }
            if(Number(userInfo.role) === 2 && to.name !== 'agencysSafeCenter'){
                next('/' + to.params.agencysNamePy + '/agencysSafeCenter');
            }
        }
        next();
    },
    created: function () {
        this.getUserProfile();
    },
    methods:{
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
        //重置密码
        goToReset: function () {
            if (this.$route.name === 'studentSafeCenter') {
                this.goToOther('/studentResetPassword');
            }else{
                this.goToOther('/agencysResetPassword');
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
.safe-center{
    width: 750px;
    min-height: 100vh;
    background-color: #fff;
    .content{
        margin-top: 50px;
        padding: 0 25px;
        .phone{
            width: 100%;
            height: 88px;
            display: flex;
            justify-content:space-between;
            align-items: center;
            border-bottom: 2px solid #eeeeee;
            .title{
                font-size: 32px;
                color: #323333;
            }
            .mobile-number{
                display: flex;
                justify-content:flex-end;
                align-items: center;
                img{
                    width: 42px;
                    height: 42px;
                }
                .number{
                    font-size: 26px;
                    color:#666;
                    margin-left: 25px;
                }
            }
        }
    }
    .tips{
        width: 100%;
        font-size: 30px;
        color: #999899;
        line-height: 48px;
        margin-top: 76px;
    }
}
</style>

