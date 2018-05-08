<template>
  <div class="wrap">
        <!--顶部-->
        <nav-return :title="(curRouteName === 'resetStudentNickname' || curRouteName === 'resetAgencysNickname')?'昵称':'应急邮箱'" operate="确定" @navOperate="finishReset" :goHome="false"></nav-return>
        <!-- 提示 -->
        <error-tips></error-tips>
        <div class="module" v-if="curRouteName === 'resetStudentNickname' ||  curRouteName === 'resetAgencysNickname'">
            <input type="text" v-model="nickName" placeholder="请填写昵称">
            <img src="../../assets/icon/close_del@2x.png" @click="nickName = ''" />
        </div>
        <div class="module" v-else>
            <input type="text" v-model="email" placeholder="请填写应急邮箱"  maxlength="20">
            <img src="../../assets/icon/close_del@2x.png" @click="email = ''" />
        </div>
  </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import errorTips from '@/views/account/components/errorTips';//提示信息

import { Toast,Indicator } from 'mint-ui';

import { userProfile, editUserInfo } from '@/service/user';
import { getLocalStore,emailRegexpVaild } from'@/utils';
import { mapMutations } from 'vuex';
export default {
    data(){
        return{
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
            userInfo: {},//用户信息
            curRouteName: '',//路由名
            nickName: '',//昵称
            email: ''//邮箱
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
            if(Number(userInfo.role) === 10){
                if (to.name === 'resetAgencysNickname') {
                    next('/' + to.params.agencysNamePy + '/resetStudentNickname');
                }
                if (to.name === 'resetAgencysEmail') {
                    next('/' + to.params.agencysNamePy + '/resetStudentEmail');
                }
            }
            if(Number(userInfo.role) === 2){
                if (to.name === 'resetStudentNickname') {
                    next('/' + to.params.agencysNamePy + '/resetAgencysNickname');
                }
                if (to.name === 'resetStudentEmail') {
                    next('/' + to.params.agencysNamePy + '/resetAgencysEmail');
                }
            }
        }
        next();
    },
    created: function () {
        this.curRouteName = this.$route.name;
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
                let data = res.data;
                // 判断是否为空
                if (data.nickname !== '' && data.nickname !== null) {
                    this.nickName = data.nickname;
                }
                if (data.email !== '' && data.email !== null) {
                    this.email = data.email;
                }
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 80001){
                Toast('机构不存在');
            }else{
                Toast('获取用户信息失败');
            }
        },
        //完成设置
        finishReset: async function () {
            if (this.curRouteName === 'resetStudentNickname') {
                if (this.nickName === '') {
                    this.SET_ACCOUNT(['errorTips','昵称不能为空']);
                    return false;
                }
            }else{
                if (this.email === '') {
                    this.SET_ACCOUNT(['errorTips','应急邮箱不能为空']);
                    return false;
                }
                if (!emailRegexpVaild(this.email)) {
                    this.SET_ACCOUNT(['errorTips','应急邮箱格式不正确']);
                    return false;
                }
            }
            let res;
            Indicator.open();
            res = await editUserInfo(this.agencysInfo.id,this.nickName,this.email);
            Indicator.close();
            if (res.errCode === 0) {
                if (this.curRouteName === 'resetStudentNickname' || this.curRouteName === 'resetAgencysNickname') {
                    Toast('修改昵称成功');
                }else{
                    Toast('修改应急邮箱成功');
                }
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
                Toast('修改用户信息失败');
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
    .module{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 88px;
        background-color: #fff;
        padding: 0 24px;
        margin-top: 30px;
        input{
            font-size: 32px;
            color: #333333;
            border: none;
        }
        input::placeholder{
            font-size: 32px;
            color: #999999;
        }
        img{
            width: 26px;
            height: 26px;
            cursor: pointer;
        }
    }
}
</style>

