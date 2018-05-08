<template>
    <div class="teacher">
    	<div class="simple-introduce">
	    	<nav-return :title="agencysInfo.name"></nav-return>
    	    <!-- 顶部 -->
	    	<div class="top">
	    	    <!-- 高斯模糊背景 -->
		    	<img class="background-filter" :src="teacherProfile.img_url" alt="背景">
		    	<!-- 黑色遮罩 -->
		    	<div class="black-mask"></div>
	    		<!-- 头像 -->
    			<div class="teacher-img-wrap">
    				<img class="teacher-img" :src="teacherProfile.img_url"  alt="头像">
    			</div>
    			<!-- 老师名字 -->
    			<p class="teacher-name">{{ teacherProfile.name }}</p>
	    	</div>
	    	<!-- 简介 -->
	    	<div class="bottom">
	    		<div class="title">
		    		<div class="decorate-line">
	    			    <p class="line"></p>
	    				<img src="../../assets/icon/diamond.png" alt="菱形" width="7" height="7" />
		    		</div>
	    			<p class="title-text">老师简介</p>
		    		<div class="decorate-line">
	    				<img src="../../assets/icon/diamond.png" alt="菱形" width="7" height="7" />
	    			    <p class="line"></p>
		    		</div>
	    		</div>
	    		<p class="content">{{ teacherProfile.desc }}</p>
	    	</div>
    	</div>
    	<!-- 老师详情 -->
    	<div class="teacher-detail">
	    	<p class="detail-title">老师详情</p>
    		<div v-html="teacherProfile.content"></div>
    	</div>
	    <!-- 主讲课程 -->
    	<div class="courses-nav">
    		<decorate-title title="主讲课程"></decorate-title>
    	</div>
    	<courses-list :courseList="teacherProduct" style="padding-top: 0;"></courses-list>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';
import decorateTitle from '@/components/common/decorateTitle';
import coursesList from '@/components/courses/coursesList';

import { Toast,Indicator } from 'mint-ui';

import { teacherProfile, teacherProduct } from '@/service/product';
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	teacherId: '',//教师id
        	teacherProfile: {},//教师信息
        	teacherProduct: []//教师关联商品
        }
    },
    components: {
    	navReturn,
    	decorateTitle,
    	coursesList
    },
    created: function () {
        // 获取教师id
        let teacherId = this.$route.query.teacher;
        if (teacherId !== undefined) {
            this.teacherId = teacherId;
            // 获取教师资料
            this.getTeacherProfile();
            // 获取教师关联商品
            this.getTeacherProduct();
        }else{
            Toast('获取教师信息失败');
        }
    },
    methods: {
    	// 获取教师资料
    	getTeacherProfile: async function () {
            // 获取教师信息
            Indicator.open();
            let res = await teacherProfile(this.agencysInfo.id,this.teacherId);
            Indicator.close();
            if (res.errCode === 0 && res.data !== null) {
                this.teacherProfile = res.data;
            }else{
                Toast('获取教师信息失败');
            }
    	},
		// 获取教师关联的商品
		getTeacherProduct: async function () {
	        // 获取教师关联的商品
	        Indicator.open();
	        let res = await teacherProduct(this.agencysInfo.id,this.teacherId);
	        Indicator.close();
	        if (res.errCode === 0 && res.data !== null) {
	            this.teacherProduct = res.data;
	        }
		},
    	// 返回上一页
		backTo: function () {
			this.$router.go(-1);
		}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.teacher{
	// 简介
	.simple-introduce{
		background-color: #ffffff;
		.top{
			width: 750px;
			height: 207px;
			position: relative;
			// 高斯模糊背景
			.background-filter{
				width: 750px;
				height: 80px;
				filter: blur(25px);
				position: absolute;
				top: 88px;
				left: 0;
			}
			// 黑色遮罩
			.black-mask{
				width: 750px;
				height: 207px;
				background-color: rgba(0,0,0,0.5);
				position: absolute;
				top: 0;
				left: 0;
			}
			// 头像
			.teacher-img-wrap{
				width: 150px;
				height: 150px;
				border: 4px solid #ffffff;
				border-radius: 50%;
				overflow: hidden;
				position: absolute;
				top: 100px;
				left: 77px;
				.teacher-img{
					width: 150px;
					height: 150px;
				}
			}
			// 老师名字
			.teacher-name{
				font-size: 34px;
				color: #ffffff;
				position: absolute;
				top: 145px;
				left: 260px;
			}
		}
		.bottom{
			padding: 92px 50px 71px;
			.title{
				display: flex;
				justify-content: center;
				align-items: center;
				.title-text{
					font-size: 36px;
					color: #666666;
					padding: 0 18px;
				}
				.decorate-line{
					display: flex;
					align-items: center;
					justify-content: center;
					img{
						margin: 8px;
					}
					p{
						width: 100px;
						height: 2px;
						background-color: #333333;
					}
				}
			}
			.content{
				font-size: 28px;
				color: #323333;
				line-height: 48px;
				margin-top: 46px;
			}
		}
	}
	// 详情
	.teacher-detail{
		background-color: #ffffff;
		margin-top: 20px;
		padding: 0 50px 56px;
		.detail-title{
			display: flex;
			align-items: center;
			height: 100px;
			font-size: 36px;
			color: #333333;
			border-bottom: 2px solid #eeeeee;
			margin-bottom: 56px;
		}
	}
	// 主讲课程
	.courses-nav{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750px;
		height: 120px;
		position: relative;
	}
}
</style>