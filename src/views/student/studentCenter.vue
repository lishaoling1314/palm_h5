<template>
    <div class="wrap">
	    <!-- 顶部 -->
    	<div class="nav">
	    	<!-- 返回按钮 -->
    		<img class="go-back" :class="{'icon-opacity-click': goBackClick}" src="../../assets/icon/nav_return_white@2x.png" alt="返回按钮" @click="goToOther('')" @mousedown="goBackClick = true" @mouseup="goBackClick = false" @touchstart="goBackClick = true" @touchend="goBackClick = false" />
    		<!-- 机构名 -->
    		<p class="user-center">个人中心</p>
    		<!-- 用户消息 -->
    		<div class="user-message" @click="goToDetail('/messageList')" @mousedown="goMsgClick = true" @mouseup="goMsgClick = false" @touchstart="goMsgClick = true" @touchend="goMsgClick = false">
    			<img class="user-message-icon" :class="{'icon-opacity-click': goMsgClick}" src="../../assets/icon/message@2x.png" alt="用户消息" />
    			<span class="message-number" v-if="Number(messageNum) > 0">{{ messageNum }}</span>
    		</div>
    	</div>
    	<!-- 用户信息 -->
    	<div class="user-info">
    		<!-- 头像 -->
			<div class="user-img-wrap" @click="goToOther('/studentInfo')">
				<img class="user-img" v-if="userInfo.img_url !== '' && userInfo.img_url !== null && userInfo.img_url !== undefined" :src="userInfo.img_url" alt="头像" />
				<img class="user-img" v-else src="../../assets/icon/no_head.png" alt="头像" />
			</div>
			<div class="school-and-name">
				<p>{{ userInfo.agency_name }}</p>
				<p v-if="userInfo.nickname !== null">{{ userInfo.nickname }}</p>
				<p v-else>{{ userInfo.truename }}</p>
			</div>
    	</div>
    	<!-- 我的报读课程 -->
    	<div class="user-center-module">
	    	<nav-enter v-if="Number(coursesNum.total) > 0" :leftText="'我的报读课程  (' + coursesNum.total + ')'" @click.native="goToDetail('/studentCourses')"></nav-enter>
	    	<nav-enter v-else :leftText="'我的报读课程'" @click.native="goToDetail('/studentCourses')"></nav-enter>
	    	<div class="module-list">
		    	<!-- 申请中 -->
	    		<div class="module-item border-right" @click="goToDetail('/studentCourses',{'tab': 1})" @mousedown="courseApply = true" @mouseup="courseApply = false" @touchstart="courseApply = true" @touchend="courseApply = false">
		    		<div class="module-icon-message">
			    		<img class="module-icon" :class="{'icon-opacity-click': courseApply}" src="../../assets/icon/student_apply.png" alt="申请中">
			    		<p class="module-message" v-if="Number(coursesNum.applying) > 0">{{ coursesNum.applying }}</p>
		    		</div>
		    		<p class="module-text">申请中</p>
	    		</div>
	    		<!-- 未开始 -->
	    		<div class="module-item border-right" @click="goToDetail('/studentCourses',{'tab': 3})" @mousedown="courseNoStart = true" @mouseup="courseNoStart = false" @touchstart="courseNoStart = true" @touchend="courseNoStart = false">
	        		<div class="module-icon-message">
			    		<img class="module-icon" :class="{'icon-opacity-click': courseNoStart}" src="../../assets/icon/student_no_start.png" alt="未开始">
	    	    		<p class="module-message" v-if="Number(coursesNum.unread) > 0">{{ coursesNum.unread }}</p>
	        		</div>
		    		<p class="module-text">未开始</p>
	    		</div>
	    		<!-- 学习中 -->
	    		<div class="module-item border-right" @click="goToDetail('/studentCourses',{'tab': 4})" @mousedown="courseStudy = true" @mouseup="courseStudy = false" @touchstart="courseStudy = true" @touchend="courseStudy = false">
	        		<div class="module-icon-message">
			    		<img class="module-icon" :class="{'icon-opacity-click': courseStudy}" src="../../assets/icon/student_study.png" alt="学习中">
	    	    		<p class="module-message" v-if="Number(coursesNum.inread) > 0">{{ coursesNum.inread }}</p>
	        		</div>
		    		<p class="module-text">学习中</p>
	    		</div>
	    		<!-- 未通过 -->
	    		<div class="module-item">
	        		<div class="module-icon-message" @click="goToDetail('/studentCourses',{'tab': 2})" @mousedown="courseNoPass = true" @mouseup="courseNoPass = false" @touchstart="courseNoPass = true" @touchend="courseNoPass = false">
			    		<img class="module-icon" :class="{'icon-opacity-click': courseNoPass}" src="../../assets/icon/student_no_pass.png" alt="未通过">
	    	    		<p class="module-message" v-if="Number(coursesNum.refuse) > 0">{{ coursesNum.refuse }}</p>
	        		</div>
		    		<p class="module-text">未通过</p>
	    		</div>
	    	</div>
    	</div>
    	<!-- 我的消息 -->
    	<div class="user-center-module">
	    	<nav-enter v-if="Number(messageNum) > 0" :leftText="'我的消息  ('+ messageNum +')'" @click.native="goToDetail('/messageList')"></nav-enter>
	    	<nav-enter v-else leftText="我的消息" @click.native="goToDetail('/messageList')"></nav-enter>
	    	<div class="module-list">
		    	<!-- 未读 -->
	    		<div class="module-item border-right" @click="goToDetail('/messageList',{'tab': 2})" @mousedown="msgUnReadClick = true" @mouseup="msgUnReadClick = false" @touchstart="msgUnReadClick = true" @touchend="msgUnReadClick = false">
	        		<div class="module-icon-message">
			    		<img class="module-icon" :class="{'icon-opacity-click': msgUnReadClick}" src="../../assets/icon/student_no_read.png" alt="未读">
	    	    		<p class="module-message" v-if="Number(messageNum) > 0">{{ messageNum }}</p>
	        		</div>
		    		<p class="module-text">未读</p>
	    		</div>
	    		<!-- 已读 -->
	    		<div class="module-item" @mousedown="msgReadClick = true" @mouseup="msgReadClick = false" @touchstart="msgReadClick = true" @touchend="msgReadClick = false">
	        		<div class="module-icon-message" @click="goToDetail('/messageList',{'tab': 3})">
			    		<img class="module-icon" :class="{'icon-opacity-click': msgReadClick}" src="../../assets/icon/student_read.png" alt="已读">
	        		</div>
		    		<p class="module-text">已读</p>
	    		</div>
	    	</div>
    	</div>
    	<!-- 我的收藏 -->
    	<div class="my-collect">
    		<nav-enter v-if="Number(favNum) > 0" :leftText="'我的收藏  (' + favNum +')'" @click.native="goToOther('/collectList')"></nav-enter>
    		<nav-enter v-else leftText="我的收藏" @click.native="goToOther('/collectList')"></nav-enter>
    		<nav-enter leftText="安全中心" :border="false" @click.native="goToOther('/studentSafeCenter')"></nav-enter>
    	</div>
    	<!-- 退出登录 -->
		<log-out></log-out>
    </div>
</template>
<script>
import navEnter from '@/components/common/navEnter';
import logOut from '@/views/user/logOut';

import { Toast,Indicator } from 'mint-ui';

import { userProfile, studentMessageNum, applyCoursesNum, productFavNum } from '@/service/user';
import { getLocalStore } from '@/utils';
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	userInfo: {},//用户信息
        	coursesNum: {
        		applying: 0,
        		finish: 0,
        		inread: 0,
        		refuse: 0,
        		total: 0,
        		unread: 0
        	},//用户报读数量
        	messageNum: 0,//消息数量
        	favNum: 0,//收藏数量
        	goBackClick: false,//返回上一页
        	goMsgClick: false,//进入消息页
        	courseApply: false,//申请中
        	courseNoStart: false,//未开始
        	courseStudy: false,//学习中
	        courseNoPass: false,//未通过
        	msgUnReadClick: false,//消息未读
        	msgReadClick: false,//消息已读
        }
    },
    components: {
    	navEnter,
    	logOut
    },
    created: function () {
        this.getUserProfile();
        this.getApplyCoursesNum();
        this.getMessageNum();
        this.getProductFavNum();
    },
    methods: {
        //获取用户信息
        getUserProfile: async function () {
        	Indicator.open();
        	let res = await userProfile(this.agencysInfo.id);
        	Indicator.close();
        	if (res.errCode === 0 && res.data !== null) {
                this.userInfo = res.data;
                if (Number(this.userInfo.role) === 2) {
                	this.goToOther('/agencysCenter');
                }
        	}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 80001){
            	Toast('机构不存在');
            }else{
            	Toast('获取用户信息失败');
            }
        },
    	// 获取用户报读课程数量
    	getApplyCoursesNum: async function () {
    		Indicator.open();
    		let res = await applyCoursesNum(this.agencysInfo.id);
    		Indicator.close();
    		// 获取用户课程
    		if (res.errCode === 0) {
                this.coursesNum = res.data;
    		}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 80001){
            	Toast('机构不存在');
            }else{
            	Toast('获取用户报读课程数量失败');
            }
    	},
    	// 获取用户消息数量
    	getMessageNum: async function () {
    		Indicator.open();
    		let res = await studentMessageNum(2,this.agencysInfo.id);
    		Indicator.close();
    		// 获取消息数量
    		if (res.errCode === 0) {
                this.messageNum = Number(res.data.un_read);
    		}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
            	Toast('获取用户消息失败');
            }
    	},
    	// 获取用户收藏数量
    	getProductFavNum: async function () {
    		Indicator.open();
    		let res = await productFavNum(this.agencysInfo.id);
    		Indicator.close();
    		// 获取户收藏数量
    		if (res.errCode === 0) {
                this.favNum = Number(res.data);
    		}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
            	Toast('获取用户收藏失败');
            }
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	min-height: 100vh;
	padding-bottom: 100px;
	position: relative;
	// 顶部
	.nav{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 750px;
		height: 88px;
		background-color: #02b4a3;
		padding: 0 30px;
		.go-back{
	        width: 16px;
	        height: 30px;
	        cursor: pointer;
		}
		.user-center{
			font-size: 34px;
			color: #ffffff;
			padding-left: 28px;
		}
		.user-message{
			cursor: pointer;
			position: relative;
			.user-message-icon{
				width: 44px;
				height: 34px;
			}
			.message-number{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 35px;
				height: 35px;
				font-size: 20px;
				color: #ffffff;
				background-color: #fa4343;
				border-radius: 50%;
				padding-top: 3px;
				position: absolute;
				top: -18px;
				right: -15px;
			}
		}
	}
	// 用户信息
	.user-info{
		display: flex;
		align-items: center;
		width: 750px;
		height: 280px;
		background-color: #02b4a3;
		// 头像
		.user-img-wrap{
			width: 140px;
			height: 140px;
			border: 4px solid rgba(255,255,255,0.7);
			border-radius: 50%;
			overflow: hidden;
			cursor: pointer;
			margin-left: 30px;
			box-sizing: content-box;
			.user-img{
				width: 140px;
				height: 140px;
			}
		}
		// 学校和姓名
		.school-and-name{
			margin-left: 42px;
			p{
				font-size: 30px;
				font-weight: bold;
				color: #ffffff;
				margin: 16px 0;
			}
		}
	}
	// 我的相关模块
	.user-center-module{
		background-color: #ffffff;
		margin-bottom: 20px;
		.module-list{
			display: flex;
			width: 750px;
			height: 190px;
			padding: 36px 0;
			.module-item{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				flex: 1;
				cursor: pointer;
				.module-icon-message{
					margin-bottom: 10px;
					position: relative;
					.module-icon{
						width: 54px;
						height: 54px;
					}
					.module-message{
						display: flex;
						justify-content: center;
						align-items: center;
						width: 32px;
						height: 32px;
						font-size: 20px;
						color: #ffffff;
						background-color: #fa4343;
						border-radius: 50%;
						padding-top: 2px;
						position: absolute;
						top: -15px;
						right: -15px;
					}
				}
				.module-text{
					font-size: 26px;
					color: #323333;
					margin-top: 10px;
				}
			}
			.border-right{
				border-right: 2px solid #eeeeee;
			}
		}
	}
	// 我的收藏
	.my-collect{
		background-color: #ffffff;
	}	
}
</style>