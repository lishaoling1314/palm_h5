<template>
    <div class="wrap">
	    <!-- 顶部 -->
	    <div class="top">
	    	<div class="nav">
		    	<!-- 用户中心 -->
	    		<img v-if="Number(userInfo.role) === 2" class="user-center-icon" :class="{'icon-opacity-click': goCenter}" src="../../assets/icon/home_menu@2x.png" alt="用户中心" @click="goToOther('/agencysCenter')" @mousedown="goCenter = true" @mouseup="goCenter = false" @touchstart="goCenter = true" @touchend="goCenter = false" />
	    		<img v-else class="user-center-icon" :class="{'icon-opacity-click': goCenter}" src="../../assets/icon/home_menu@2x.png" alt="用户中心" @click="goToOther('/studentCenter')" @mousedown="goCenter = true" @mouseup="goCenter = false" @touchstart="goCenter = true" @touchend="goCenter = false" />
	    		<!-- 机构名 -->
	    		<p class="agencys-name">{{ agencysInfo.name }}</p>
	    		<!-- 用户消息 -->
	    		<div class="user-message" @click="goToOther('/messageList')" @mousedown="goMsgClick = true" @mouseup="goMsgClick = false" @touchstart="goMsgClick = true" @touchend="goMsgClick = false">
	    			<img class="user-message-icon" :class="{'icon-opacity-click': goMsgClick}" src="../../assets/icon/message@2x.png" alt="用户消息" />
	    			<span class="message-number" v-if="messageNum > 0">{{ messageNum }}</span>
	    		</div>
	    	</div>
	    	<!-- 搜索框 -->
	    	<div class="search-wrap" @click="goToOther('/search')">
		        <img class="search-icon" src="../../assets/icon/search_gray@2x.png" alt="搜索灰色" />
	            <p class="search-text">搜索老师、机构、课程</p>
	    	</div>
	    </div>
    	<!-- 轮播图 -->
		<swiper :options="swiperOption" ref="mySwiper" class="swiper-box" @mouseout.native="swiperControl(1)" @mouseover.native="swiperControl(2)">
		    <swiper-slide class="swiper-item" v-for="(item,key) in swipeList" :key="key">
			    <img class="swiper-slide-img" :src="item">
		    </swiper-slide>
		    <div class="swiper-pagination" slot="pagination"></div>
		 </swiper>
		<!-- 机构信息 -->
	    <div class="agencys">
		    <div class="agencys-info">
		    	<img class="logo" :src="agencysInfo.logo_url" />
				<p class="name">{{ agencysInfo.name }}</p>
		    </div>
		    <div class="agencys-number">
		    	<div class="number-item border-right">
			    	<img class="courses-icon" src="../../assets/icon/home_curriculum@2x.png" alt="课程" />
			    	<p class="number-text">课程数量 {{ agencysInfo.product_total }}</p>
		    	</div>
    	    	<div class="number-item">
    		    	<img class="student-icon" src="../../assets/icon/home_student@2x.png" alt="学生" />
    		    	<p class="number-text">学生数量 {{ agencysInfo.student_total }}</p>
    	    	</div>
		    </div>
	    </div>
	    <!-- 可报读课程 -->
    	<div class="courses-nav">
	    	<decorate-title title="可报读课程"></decorate-title>
    		<span class="courses-nav-more" @click="goToDetail('/search',{'type': 1})">
    			<img class="more-icon" src="../../assets/icon/home_more@2x.png" alt="学生" />
    		</span>
    	</div>
    	<div class="courses-list">
    		<home-courses-info class="courses-list-item" v-for="(item,key) in agencysCourses" :courses="item" :key="key"></home-courses-info>
    	</div>
    	<!-- 推荐课程 -->
    	<div class="courses-nav">
    		<decorate-title title="推荐课程"></decorate-title>
    		<span class="courses-nav-more" @click="goToDetail('/search',{'type': 2})">
    			<img class="more-icon" src="../../assets/icon/home_more@2x.png" alt="学生" />
    		</span>
    	</div>
    	<div class="courses-list">
	    	<home-courses-info class="courses-list-item" v-for="(item,key) in recommendCourses" :courses="item" :key="key" :price="2"></home-courses-info>
    	</div>
    	<p class="copyright">版权归棕榈教育所有</p>
    </div>
</template>
<script>
import decorateTitle from '@/components/common/decorateTitle';
import homeCoursesInfo from './components/homeCoursesInfo';

import { Indicator } from 'mint-ui';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import Cookies from 'js-cookie'// cookies

import { getAgencysInfoByName } from '@/service/agencys';
import { getFilterProduct } from '@/service/product';
import { studentMessageNum } from '@/service/user';
import { getLocalStore } from '@/utils';

export default {
    data() {
        return {
		    agencysInfo: this.$route.params.agencysInfo,// 机构信息
		    userInfo: {},// 用户信息
		    messageNum: 0,// 消息数量
		    swiperOption: {
		    	autoplay: {
		    		delay: 2000
		    	},
				slidesPerView: 1,
				loop: true,
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				}
            },
		    swipeList: [
               require('../../assets/images/swipe_one.gif'),
               require('../../assets/images/swipe_two.gif'),
               require('../../assets/images/swipe_three.gif'),
               require('../../assets/images/swipe_four.gif')
	        ],// 轮播图信息
	        agencysCourses: [],// 可报读课程
	        recommendCourses: [],// 推荐课程
	        goCenter: false,//进入中心页
	        goMsgClick: false//进入消息页
        }
    },
    components: {
    	decorateTitle,
        homeCoursesInfo,
        swiper,
        swiperSlide
    },
    created: function () {
    	// 判断是否有用户信息
    	let userInfo = getLocalStore('userInfo');
    	if (userInfo !== null && userInfo !== 'null') {
    		this.userInfo = JSON.parse(userInfo);
    	}
    	// 获取机构信息
    	this.getAgencysInfo();
    	// 获取用户消息数量
    	this.getMessageNum();
    	// 获取相关课程
        this.getAgencysCourses();
        this.getRecommendCourses();
    },
    methods:{
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
    	// 获取用户消息数量
    	getMessageNum: async function () {
    		//判断用户类型
    		let roleType = Number(this.userInfo.role) === 2 ? 1 : 2;
    		Indicator.open();
    		let res = await studentMessageNum(roleType,this.agencysInfo.id);
    		Indicator.close();
    		// 获取消息数量
    		if (res.errCode === 0) {
                this.messageNum = Number(res.data.un_read);
    		}
    	},
        // 获取机构课程
        getAgencysCourses: async function () {
        	Indicator.open();
        	let res = await getFilterProduct(1,this.agencysInfo.id);
        	Indicator.close();
        	if (res.errCode === 0 && res.data !== null) {
				this.agencysCourses = res.data.list;
        	}
        },
	    // 获取机构推荐课程
	    getRecommendCourses: async function () {
	    	Indicator.open();
	    	let res = await getFilterProduct(2,this.agencysInfo.id);
	    	Indicator.close();
	    	if (res.errCode === 0 && res.data !== null) {
				this.recommendCourses = res.data.list;
	    	}
	    },
	    // 轮播控制
	    swiperControl: function (type) {
	    	if (type === 1) {
	    		this.$refs.mySwiper.swiper.autoplay.start();
	    	}else{
		    	this.$refs.mySwiper.swiper.autoplay.stop();
	    	}
	    }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	display: flex;
	flex-direction: column;
	align-items: center;
	// 顶部
	.top{
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #ffffff;
		padding-bottom: 20px;
		.nav{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 750px;
			height: 88px;
			padding: 0 30px;
			.user-center-icon{
		        width: 34px;
		        height: 35px;
		        cursor: pointer;
			}
			.agencys-name{
				font-size: 34px;
				color: #101010;
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
					width: 32px;
					height: 32px;
					font-size: 20px;
					color: #ffffff;
					background-color: #fa4343;
					border-radius: 50%;
					padding-top: 3px;
					position: absolute;
					top: -18px;
					right: -18px;
				}
			}
		}
		// 搜索框
		.search-wrap{
			display: flex;
			align-items: center;
			width: 702px;
			height: 54px;
			border-radius: 10px;
			background-color: #eeeeee;
			cursor: pointer;
			margin-top: 22px;
			.search-icon{
				width: 28px;
				height: 28px;
				margin: 0 25px;
			}
			.search-text{
				font-size: 24px;
				color: #999999;
			}
		}
	}
	// 轮播图
	.swiper-container {
	    width: 750px;
	    height: 300px;
	    .swiper-slide-img{
	    	width: 750px;
	    	height: 300px;
	    }
	}  
	// 机构
	.agencys{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 750px;
		height: 264px;
		background-color: #ffffff;
		padding: 0 24px;
		.agencys-info{
			display: flex;
			align-items: center;
			width: 702px;
			height: 176px;
			border-bottom: 2px solid #eeeeee;
			.logo{
				width: 126px;
				height: 126px;
				border-radius: 100px;
				margin-right: 24px;
			}
			.name{
				font-size: 34px;
				font-weight: bold;
				color: #333333;
			}
		}
	}
	// 机构数量信息
	.agencys-number{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex: 1;
		width: 750px;
		.number-item{
			display: flex;
			flex: 1;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			height: 32px;
			.courses-icon{
				width: 37px;
				height: 32px;
			}
			.student-icon{
				width: 26px;
				height: 30px;
			}
			.number-text{
				font-size: 24px;
				color: #666666;
				margin-left: 15px;
			}
		}
		.border-right{
			border-right: 2px solid #eeeeee;
		}
	}
    // 课程
	.courses-nav{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750px;
		height: 120px;
		position: relative;
		.courses-nav-line{
			width: 11px;
			height: 18px;
			color: #02b4a3;
		}
		.courses-nav-title{
			font-size: 32px;
			color: #333333;
			margin: 0 14px;
		}
		.courses-nav-more{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			width: 750px;
			height: 120px;
			cursor: pointer;
			padding-right: 30px;
			position: absolute;
			top: 0;
			left: 0;
			.more-icon{
				width: 12px;
				height: 22px;
			}
		}
	}
	.courses-list{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 750px;
		margin-top: -26px;
		padding: 0 24px;
		.courses-list-item{
			margin-top: 26px;
		}
		.courses-list-item:nth-child(odd){
			margin-right: 20px;
		}
	}
	// 版权
	.copyright{
		width: 750px;
		font-size: 26px;
		color: #999999;
		text-align: center;
		padding: 80px 0 66px;
	}
}
</style>