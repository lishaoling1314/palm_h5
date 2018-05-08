<template>
    <div class="wrap" :class="selectWay? 'no-scroll':''">
        <!--顶部-->
        <nav-return class="nav-return" title="个人信息"></nav-return>
        <div class="user-info-module">
            <div class="module-item" >
                <div class="module-item-border">
                    <p class="module-item-title">头像</p>
                    <div class="module-item-head" @click="selectWay = true">
                        <div class="user-img-wrap">
                            <img class="user-img" v-if="userInfo.img_url !== '' && userInfo.img_url !== null" :src="userInfo.img_url" alt="头像" />
                            <img class="user-img empty-head" v-else src="../../assets/icon/no_head.png" alt="头像" />
                        </div>
                        <img class="icon" src="../../assets/icon/more_nor@2x.png" />
                    </div>
                </div>
            </div>
            <nav-enter leftText="昵称" :rightText="userInfo.nickname === '' || userInfo.nickname === null? '未设置':userInfo.nickname" @click.native="goToReset(1)"></nav-enter>
            <nav-enter leftText="真实姓名" :rightText="userInfo.truename === '' || userInfo.truename === null? '未设置':userInfo.truename" :enterBtn="false" :border="false"></nav-enter>
        </div>
        <div class="user-info-module">
            <nav-enter leftText="手机号" :rightText="userInfo.mobile" :enterBtn="false"></nav-enter>
            <nav-enter leftText="应急邮箱" :rightText="userInfo.email === '' || userInfo.email === null? '未设置':userInfo.email" :border="false" @click.native="goToReset(2)"></nav-enter>
        </div>
        <template v-if="Number(userInfo.role) === 10">
            <div class="user-info-module" v-if="Number(agencysInfo.type) === 1">
                <nav-enter leftText="班级" :rightText="userInfo.dept === '' || userInfo.dept === null? '未设置':userInfo.dept" :enterBtn="false"></nav-enter>
                <nav-enter leftText="学生证" :rightText="userInfo.student_no === '' || userInfo.student_no === null? '未设置':userInfo.student_no" :enterBtn="false" :border="false"></nav-enter>
            </div>
            <div class="user-info-module" v-else>
                <nav-enter leftText="部门" :rightText="userInfo.dept === '' || userInfo.dept === null? '未设置':userInfo.dept" :enterBtn="false"></nav-enter>
                <nav-enter leftText="职务" :rightText="userInfo.career === '' || userInfo.career === null? '未设置':userInfo.career" :enterBtn="false"></nav-enter>
                <nav-enter leftText="员工证" :rightText="userInfo.student_no === '' || userInfo.student_no === null? '未设置':userInfo.student_no" :enterBtn="false" :border="false"></nav-enter>
            </div>
        </template>
        <!-- 头像选择 -->
        <div class="select-way" v-if="selectWay" @touchstart="hideSelect" @click="hideSelect">
            <p class="confirm-select">
                <span :class="{'white-click': takePhoto}" @click="selectImg('camera')" @mousedown="takePhoto = true" @mouseup="takePhoto = false" @touchstart="takePhoto = true" @touchend="takePhoto = false">拍照</span>
                <span class="select-border" :class="{'white-click': selectPicture}" @click="selectImg('image')" @mousedown="selectPicture = true" @mouseup="selectPicture = false" @touchstart="selectPicture = true" @touchend="selectPicture = false">从手机相册选择</span>
            </p>
            <p class="cancel-select" :class="{'white-click': cancelHead}" @click="selectWay = false" @mousedown="cancelHead = true" @mouseup="cancelHead = false" @touchstart="cancelHead = true" @touchend="cancelHead = false">取消</p>
        </div>
        <!-- 选择框 -->
        <input type="file" ref="camera" accept="image/*" capture="camera" hidden @change="showImage('camera')" />
        <input type="file" ref="image" accept="image/*" hidden @change="showImage('image')" />
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import navEnter from '@/components/common/navEnter';//进入下一步

import { Toast, Indicator } from 'mint-ui';

import { userProfile } from '@/service/user';
import { getLocalStore } from'@/utils';
export default {
    data(){
        return{
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
            userInfo: {},//用户信息
            curRouteName: '',//路由名
            selectWay: false,
            imageInfo: {},//照片信息
            takePhoto: false,//点击拍照
            selectPicture: false,//点击选择照片
            cancelHead: false// 取消上传头像
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
            if(Number(userInfo.role) === 10 && to.name !== 'studentInfo'){
                next('/' + to.params.agencysNamePy + '/studentInfo');
            }
            if(Number(userInfo.role) === 2 && to.name !== 'agencysInfo'){
                next('/' + to.params.agencysNamePy + '/agencysInfo');
            }
        }
        next();
    },
    beforeRouteLeave: function (to,from,next) {
        if (to.name === 'personalImage') {
            to.params.imageInfo = this.imageInfo;
        }
        next();
    },
    created: function () {
        this.curRouteName = this.$route.name;
        this.getUserProfile();
    },
    methods: {
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
        //修改信息
        goToReset: function (type) {
            if (this.$route.name === 'studentInfo') {
                if (type === 1) {
                    this.goToOther('/resetStudentNickname');
                }else{
                    this.goToOther('/resetStudentEmail');
                }
            }else{
                if (type === 1) {
                    this.goToOther('/resetAgencysNickname');
                }else{
                    this.goToOther('/resetAgencysEmail');
                }
            }
        },
        //选择照片
        selectImg: function (ref) {
            this.$refs[ref].click();
        },
        //显示照片
        showImage: function (ref) {
            let imageInfo = this.$refs[ref].files[0];
            if (imageInfo !== undefined) {
                // 储存照片信息
                this.imageInfo = imageInfo;
                // 清空input框
                this.$refs[ref].value = '';
                // 跳转到图片处理页
                this.goToOther('/personalImage');
            }
        },
        //点击遮罩关闭选择
        hideSelect: function(e){
            let className = e.target.className;
            if (className === 'select-way') {
                this.selectWay = false;
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


<style  lang="scss" scoped> 
.wrap{
    min-height: 100vh;
    position: relative;
    .nav-return{
        margin-bottom: 30px;
    }
    .user-info-module{
        background-color: #ffffff;
        margin-bottom: 20px;
        .module-item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 162px;
            padding: 0 25px;
            .module-item-border{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 100%;
                border-bottom: 2px solid #eeeeee;
                .module-item-title{
                    font-size: 32px;
                    color: #323333;
                }
                .module-item-head{
                    display: flex;
                    align-items: center;
                    .user-img-wrap{
                        width: 110px;
                        height: 110px;
                        border-radius: 50%;
                        overflow: hidden;
                        cursor: pointer;
                        margin-right: 24px;
                        position: relative;
                        .user-img{
                            width: 110px;
                            height: 110px;
                        }
                        .empty-head{
                            width: 110px;
                            height: 110px;
                            border-radius: 50%;
                            border: 2px solid #eee;
                            position: absolute;
                            top: 0;
                            left: 0;
                        }
                    }
                   .icon{
                       width: 12px;
                       height: 22px;
                   } 
                }
            }
        }
    }
    // 头像选择方式
    .select-way{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(7,12,12,0.3);
        position: absolute;
        top: 0;
        left: 0;
        .confirm-select{
            background-color: #ffffff;
            border-radius: 10px;
            span{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 702px;
                height: 110px;
                font-size: 32px;
                color: #333333;
                cursor: pointer;
            }
            .select-border{
                border-top: 1px solid #dedede;
            }
        }
        .cancel-select{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 702px;
            height: 110px;
            font-size: 32px;
            color: #333333;
            background-color: #ffffff;
            border-radius: 10px;
            cursor: pointer;
            margin: 20px 0;
        }
    }
}
.no-scroll{
    overflow-y: hidden;
}
</style>

