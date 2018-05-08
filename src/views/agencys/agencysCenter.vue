<template>
    <div class="wrap">
	    <!-- 顶部 -->
    	<div class="nav">
	    	<!-- 返回按钮 -->
    		<img class="go-back" :class="{'icon-opacity-click': goBackClick}" src="../../assets/icon/nav_return_white@2x.png" alt="返回按钮" @click="goToOther('/')" @mousedown="goBackClick = true" @mouseup="goBackClick = false" @touchstart="goBackClick = true" @touchend="goBackClick = false" />
    		<!-- 机构名 -->
    		<p class="user-center">个人中心</p>
    	</div>
    	<!-- 用户信息 -->
    	<div class="user-info">
	    	<!-- 学校名 -->
			<p class="school">{{ userInfo.agency_name }}</p>
    		<!-- 头像 -->
			<div class="user-img-wrap" @click="goToOther('/agencysInfo')">
				<img class="user-img" :src="userInfo.img_url" alt="头像">
			</div>
			<p class="name">
				<span>姓名：{{ userInfo.truename }}</span>
				<span>昵称：{{ userInfo.nickname }}</span>
			</p>
    	</div>
    	<!-- 申请 -->
    	<div class="user-center-module">
    		<div class="balance">
    			<div class="title">
    				<img src="../../assets/icon/balance@2x.png">
    				<p>机构账户余额</p>
    			</div>
    			<p class="fee">￥{{ agencysBalance.balance }}</p>
    		</div>
    		<div class="apply-list">
    			<div class="apply-item border-right" @click="goToDetail('/addToAgencys',{'tab':1})" @mousedown="addToAgencys = true" @mouseup="addToAgencys = false" @touchstart="addToAgencys = true" @touchend="addToAgencys = false">
    				<p class="type">加入机构申请</p>
    				<img src="../../assets/icon/mechanism_join@2x.png" :class="{'icon-opacity-click':addToAgencys}">
    				<p class="number number-add">人数：{{ agencysInfo.join_total }}</p>
    			</div>
    			<div class="apply-item" @click="goToDetail('/enrolCourses',{'tab':1})" @mousedown="enrolCourses = true" @mouseup="enrolCourses = false" @touchstart="enrolCourses = true" @touchend="enrolCourses = false">
    				<p class="type">报读课程申请</p>
    				<img src="../../assets/icon/mechanism_study@2x.png" :class="{'icon-opacity-click':enrolCourses}">
    				<p class="number number-read">人数：{{ agencysInfo.read_total }}</p>
    			</div>
    		</div>
    	</div>
    	<!-- 安全中心 -->
    	<div class="safe-center">
    		<nav-enter leftText="安全中心" :border="false" @click.native="goToOther('/agencysSafeCenter')"></nav-enter>
    	</div>
        <!-- 退出登录 -->
        <log-out></log-out>
    </div>
</template>
<script>
import navEnter from '@/components/common/navEnter';
import logOut from '@/views/user/logOut';

import { Toast,Indicator } from 'mint-ui';
import Cookies from 'js-cookie'// cookies

import { userProfile, myBalance } from '@/service/user';
import { getAgencysInfoByName } from '@/service/agencys';
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	userInfo: {},//用户信息
        	goBackClick: false,//返回上一页
        	addToAgencys: false,//加入机构申请
        	enrolCourses: false,//报读课程申请
        	agencysBalance: {
        		balance: 0
        	},//机构余额
        }
    },
    components: {
    	navEnter,
    	logOut
    },
    created: function () {
    	// 获取用户信息
        this.getUserProfile();
        // 获取机构信息
        this.getAgencysInfo();
        // 获取用户余额
        this.getAgencysBalance();
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
        // 获取机构信息
        getAgencysInfo: async function (){
        	Indicator.open();
            let res = await getAgencysInfoByName(this.agencysInfo.name_py);
            Indicator.close();
            if (res.errCode === 0 && res.data !== null) {
            	// 储存机构信息,时间为一天
            	Cookies.set('agencysInfo', res.data, { expires: 1 });
            	this.agencysInfo = res.data;
            }else{
            	Cookies.remove('agencysInfo');
            }
        },
        // 获取机构余额
        getAgencysBalance: async function (){
        	Indicator.open();
            let res = await myBalance();
            Indicator.close();
            if (res.errCode === 0) {
            	this.agencysBalance = res.data[0];
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
            	Toast('获取机构余额失败');
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
		background-color: #f87236;
		padding: 0 30px;
		position: relative;
		.go-back{
	        width: 16px;
	        height: 30px;
	        cursor: pointer;
	        position: absolute;
	        left: 30px;
	        top: 29px;
		}
		.user-center{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			font-size: 34px;
			color: #ffffff;
		}
	}
	// 用户信息
	.user-info{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 750px;
		height: 342px;
		background-color: #f87236;
		//学校
		.school{
			font-size: 30px;
			font-weight: bold;
			color: #ffffff;
			margin-top: 15px;
		}
		// 头像
		.user-img-wrap{
			width: 140px;
			height: 140px;
			border: 4px solid rgba(255,255,255,0.7);
			border-radius: 70%;
			overflow: hidden;
			cursor: pointer;
			margin-top: 29px;
			box-sizing: content-box;
			.user-img{
				width: 140px;
				height: 140px;
			}
		}
		// 姓名和昵称
		.name{
			display: flex;
			margin-top: 41px;
			span{
				font-size: 26px;
				color: #feffff;
				background-color: #f35a1c;
				border-radius: 6px;
				padding: 17px 33px;
				margin: 0 13px;
			}
		}
	}
	// 申请
	.user-center-module{
		background: #ffffff;
		// 余额
		.balance{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 100px;
			border-bottom: 1px solid #eeeeee;
			padding: 0 24px;
			.title{
				display: flex;
				align-items: center;
	            img{
	            	width: 64px;
	            	height: 64px;
	            	margin-right: 26px;
	            }
	            p{
	            	font-size: 32px;
	            	color: #323333;
	            }
			}
			.fee{
				font-size: 32px;
				color: #323333;
			}
		}
		// 申请
		.apply-list{
			display: flex;
			padding: 86px 0;
			.apply-item{
				display: flex;
				flex-direction: column;
				align-items: center;
				flex: 1;
				cursor: pointer;
				.type{
					font-size: 30px;
					color: #333333;
				}
				img{
					width: 112px;
					height: 112px;
					margin-top: 20px;
				}
				.number{
					font-size: 30px;
					margin-top: 30px;
				}
				.number-add{
					color: #04b2a3;
				}
				.number-read{
					color: #35a7f5;
				}
			}
			.border-right{
				border-right: 2px solid #eeeeee;
			}
		}
	}
	// 安全中心
	.safe-center{
		background-color: #ffffff;
		margin-top: 20px;
	}
}
</style>