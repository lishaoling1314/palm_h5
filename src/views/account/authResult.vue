<template>
    <div class="wrap">
        <!-- 内容wrap -->
        <div class="content">
            <!--顶部-->
            <agencys-info class="mechanism"></agencys-info>
            <!-- 审核结果 -->
            <p class="result">{{ resultText }}</p>
            <!-- 申请进度 -->
            <apply-status :pendStatus="pendStatus" :pendRemarks="pendRemarks" pendInit="提交资料"></apply-status>
            <!-- 按钮 -->
            <push-button class="push-button success-login" v-if="pendStatus === 3" text="登录" :btnStatus="true" @click.native="firstLogin"></push-button>
            <push-button class="push-button" v-if="pendStatus === 4" text="重新提交资料" :btnStatus="true" @click.native="goToOther('/informationAuth')"></push-button>
        </div>
        <!-- 底部 -->
        <direct-access v-if="pendStatus === 3 || pendStatus === 4" contact="联系客服" @operateTwo="customerService"></direct-access>
        <direct-access v-else text="重新提交资料" contact="联系客服" @operateOne="goToOther('/informationAuth')" @operateTwo="customerService"></direct-access>
    </div>
</template>

<script>
import agencysInfo from '@/components/agencys/agencysInfo';//头部的logo和机构名字
import applyStatus from './components/applyStatus';//申请进度
import pushButton from './components/pushButton';//跳转页面的按钮
import directAccess from './components/directAccess';//底部按钮

import { Indicator } from 'mint-ui';

import { mapMutations } from 'vuex';
import { loginStatus, getPendStatus } from '@/service/account';
import { setLocalStore } from '@/utils';

export default {
    data(){
        return{
            agencysInfo: this.$route.params.agencysInfo,//机构信息
            userInfo: {},// 用户信息
            showRemark: false,// 显示详情
            pendStatus: 1,// 审核状态
            pendRemarks: ''//审核信息
        }
    },
    //离开路由删除store信息s
    beforeRouteLeave(to, from, next) {
        this.InitAcconut();
        next();
    },
    components:{
        agencysInfo,
        applyStatus,
        pushButton,
        directAccess
    },
    created: function () {
        // 获取审核状态
        this.getStudentPendStatus();
    },
    computed: {
        resultText: function () {
            let result;
            if (this.pendStatus === 1) {
                result = '资料提交成功，请耐心等待机构管理员审核';
            }
            if (this.pendStatus === 2) {
                result = '机构管理员审核中，请耐心等待审核结果';
            }
            if (this.pendStatus === 3) {
                result = '恭喜' + this.userInfo.truename + '学员，审核通过';
            }
            if (this.pendStatus === 4) {
                result = this.userInfo.truename + '学员，加入机构申请不通过';
            }
            return result;
        }
    },
    methods:{
        ...mapMutations([
            'SET_ACCOUNT',
            'InitAcconut'
        ]),
        // 获取审核状态
        getStudentPendStatus: async function () {
            let res = await getPendStatus(this.agencysInfo.id);
            // 判断是否审核结果
            let errCode = res.errCode;
            if (errCode === 0) {
                this.userInfo = res.data;
                this.pendStatus = Number(res.data.pend_status);
                this.pendRemarks = res.data.pend_remarks;
            }else if(errCode === 10003 || errCode === 10005){
                this.tokenOutOfDate();
            }else if(errCode === 10026){
                this.SET_ACCOUNT(['errorTips','机构不存在']);
            }else if(errCode === 80002){
                this.SET_ACCOUNT(['errorTips','机构不存在']);
            }else if(errCode === 10029){
                this.SET_ACCOUNT(['errorTips','暂未申请加入机构']);
                // 无审核状态跳转到信息认证页
                this.goToOther('/informationAuth');
            }else{
                // 无审核状态跳转到登录页
                this.goToOther('/mobileLogin');
            }
        },
        // 第一次登录
        firstLogin: async function () {
            Indicator.open();
            let res = await loginStatus(this.agencysInfo.id);
            Indicator.close();
            // 判断是否修改登录状态成功
            let errCode = res.errCode;
            if (errCode === 0 && res.data !== null) {
                // 储存新的用户信息
                setLocalStore('userInfo',res.data);
                // 跳转到首页
                this.goToOther('');
            }else if(errCode === 10003 || errCode === 10005){
                this.tokenOutOfDate();
            }else if(errCode === 10005){
                this.SET_ACCOUNT(['errorTips','登录信息已过期，请重新登录']);
                // 跳转回登录页
                this.tokenOutOfDate();
            }else if(errCode === 10026){
                this.SET_ACCOUNT(['errorTips','机构不存在']);
            }else if(errCode === 10031){
                this.SET_ACCOUNT(['errorTips','审核通过确认失败']);
            }else if(errCode === 80002){
                this.SET_ACCOUNT(['errorTips','机构不存在']);
            }else if(errCode === 10069){
                this.SET_ACCOUNT(['errorTips','用户未申请或未申请通过']);
            }else{
                this.goToOther('/mobileLogin');
            }
        },
        //客服
        customerService: function () {
            window.open("https://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=196392&configID=6425&jid=9530781744","_blank","height=630,width=950,scrollbars=no,location=no");
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 750px;
    min-height: 100vh;
    background-color: #ffffff;
    padding-top: 102px;
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        .result{
            font-size: 30px;
            color: #666666;
            margin-top: 110px;
        }
        .push-button{
            margin-top: 18px;
        }
        .success-login{
            margin-top: 120px;
        }
    }
}
</style>

