<template>
    <div class="wrap">
        <!-- 提示 -->
        <error-tips></error-tips>
        <!--顶部-->
        <agencys-info class="mechanism"></agencys-info>
        <!-- 标题 -->
        <decorate-title class="decorate-title" title="认证信息"></decorate-title>
        <!-- 信息 -->
        <div class="info-input" :class="nameEmpty? 'empty-tips-border':''">
            <img class="must" src="../../assets/icon/must.jpg" height="18" width="23">
            <p class="info-title">真实姓名</p>
            <input type="text" v-model="realName" placeholder="您的姓名" @keyup="nameEmpty = false">
        </div>
        <div class="info-input" :class="emailEmpty? 'empty-tips-border':''">
            <img class="must" src="../../assets/icon/must.jpg" height="18" width="23">
            <p class="info-title">邮箱</p>
            <input type="text" v-model="email" placeholder="应急邮箱" @keyup="emailEmpty = false" maxlength="20">
        </div>
        <div class="info-input">
            <p class="info-title title-margin">部门/专业</p>
            <input type="text" v-model="dept" placeholder="您的部门/专业">
        </div>
        <div class="info-input">
            <p class="info-title title-margin">职务/班级</p>
            <input type="text" v-model="career" placeholder="您的职务/班级">
        </div>
        <div class="info-input">
            <p class="info-title title-margin">员工证/学生证</p>
            <input type="text" v-model="studentNo" placeholder="您的员工证/学生证">
        </div>
        <!--申请提交-->
        <push-button class="push-button" text="提交申请" :btnStatus="submitCheck" @click.native="submitInfo"></push-button>
    </div>
</template>
<script>
import decorateTitle from '@/components/common/decorateTitle';
import agencysInfo from '@/components/agencys/agencysInfo'; //头部的logo和机构名字
import pushButton from './components/pushButton'; //跳转页面的按钮
import errorTips from './components/errorTips';//提示信息

import Cookies from 'js-cookie';// cookies
import { Toast,Indicator } from 'mint-ui';


import { mapMutations } from 'vuex';
import { getStudentJoin, addStudentJoin } from '@/service/account';
import { emailRegexpVaild } from '@/utils';

export default {
    data() {
        return {
            studentInfo: {},//用户信息
            agencysInfo: this.$route.params.agencysInfo,//机构信息
            realName: '',//真实姓名
            email: '',//邮箱
            dept: '',//所属部门
            career: '',//职务
            studentNo: '',//员工证
            nameEmpty: false,//名字为空
            emailEmpty: false,//邮箱为空
        }
    },
    //离开路由删除store信息s
    beforeRouteLeave(to, from, next) {
        this.InitAcconut();
        next();
    },
    components: {
        decorateTitle,
        agencysInfo,
        pushButton,
        errorTips
    },
    created: function () {
        // 获取用户信息
        this.getStudentInfo();
    },
    computed: {
        // 判断是否允许提交
        submitCheck: function () {
            let result = false;
            //邮箱验证
            let emailRegexp = false;
            if (this.email !== '') {
                emailRegexp = emailRegexpVaild(this.email);
            }
            if (this.realName !== '' && emailRegexp) {
                result = true;
            }
            return result;
        }
    },
    methods: {
        ...mapMutations([
            'SET_ACCOUNT',
            'InitAcconut'
        ]),
        // 获取学员信息
        getStudentInfo: async function () {
            let res = await getStudentJoin(this.agencysInfo.id);
            // 判断是否有用户信息
            if (res.errCode === 0 && res.data) {
                let data = res.data;
                this.realName = data.truename;//真实姓名
                this.email = data.email;//邮箱
                this.dept = data.dept//所属部门
                this.career = data.career//职务
                this.studentNo = data.student_no//员工证
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
                this.studentInfo = {};
            }
        },
        // 信息提交
        submitInfo: async function () {
            // 真实姓名不能为空
            if (this.realName === '' || this.realName === null) {
                this.nameEmpty = true;
                this.SET_ACCOUNT(['errorTips','真实姓名不能为空']);
                return false;
            }
            // 邮箱不能为空
            if (this.email === '' || this.email === null) {
                this.emailEmpty = true;
                this.SET_ACCOUNT(['errorTips','邮箱不能为空']);
                return false;
            }
            // 邮箱不能为空
            if (!emailRegexpVaild(this.email)) {
                this.emailEmpty = true;
                this.SET_ACCOUNT(['errorTips','邮箱格式不正确']);
                return false;
            }
            // 加载loadind
            Indicator.open('正在提交申请');
            // 保存认证信息
            let res = await addStudentJoin(this.agencysInfo.id,this.realName,this.email,this.dept,this.career,this.studentNo);
            Indicator.close();
            // 判断结果
            let errCode = res.errCode;
            if (errCode === 0) {
                this.goToOther('/authResult');
            }else if(errCode === 10026){
                this.SET_ACCOUNT(['errorTips','机构不存在']);
            }else if(errCode === 10031){
                this.SET_ACCOUNT(['errorTips','提交失败']);
            }else if(errCode === 10032){
                this.SET_ACCOUNT(['errorTips','真实姓名不能为空']);
            }else if(errCode === 10033){
                this.SET_ACCOUNT(['errorTips','邮箱不能为空']);
            }else if(errCode === 10052){
                this.goToOther('/authResult');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 750px;
    min-height: 100vh;
    background-color: #ffffff;
    padding-top: 100px;
    position: relative;
    .decorate-title {
        margin: 72px 0 40px;
    }
    .info-input{
        display: flex;
        align-items: center;
        width: 670px;
        height: 88px;
        border-bottom: 2px solid #eeeeee;
        margin-top: 20px;
        .must{
            width: 15px;
            height: 16px;
            margin: 0 10px;
        }
        .info-title{
            width: 235px;
            font-size: 34px;
            color: #666666;
        }
        .title-margin{
            margin-left: 35px
        }
        input{
            height: 81px;
            font-size: 34px;
            color: #333333;
            border: none;
            padding-top: 2px;
        }
        input::placeholder {
            font-size: 34px;
            color: #999999;
        }
        input:focus {
            outline: none;
        }
    }
    .empty-tips-border{
        border: 2px solid #fa4343;
        border-radius: 10px;
    }
    .push-button {
        margin-top: 120px;
    }
}
</style>