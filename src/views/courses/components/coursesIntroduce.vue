<template>
    <div class="introduce">
        <!-- 视屏 -->
    	<video class="video" v-if="coursesProfile.video_url !== null && coursesProfile.video_url !== ''" ref="video" controls="controls" preload="auto" :src="coursesProfile.video_url" controlsList="nodownload" @contextmenu.prevent="videoRight">您的浏览器不支持 video 标签。</video>
    	<div v-else class="course-img">
	    	<img :src="coursesProfile.img_url" alt="商品头图" />
    	</div>
    	<div class="content">
    		<div class="name-and-collect">
    			<p class="name">{{ coursesProfile.name }}</p>
    			<img class="collect" v-if="Number(coursesProfile.is_fav) === 1" src="../../../assets/icon/collection_selected@2x.png" @click="coursesFav(0)" alt="收藏按钮" />
    			<img class="collect" v-else src="../../../assets/icon/collection_default@2x.png" @click="coursesFav(1)" alt="收藏按钮" />
    		</div>
    		<!-- 评级 -->
    		<star class="star" :score="Number(coursesProfile.score)"></star>
    		<p class="description">{{ coursesProfile.desc }}</p>
    		<!-- 原价 -->
    		<p class="fee-old">
	    		<span>￥</span>
	    		<span>{{ coursesProfile.origin_price }}</span>
    		</p>
    		<div class="number">
	    		<!-- 现价 -->
    			<p class="fee-now">
	    			<span>￥</span>
	    			<span>{{ coursesProfile.single_sale_price }}</span>
    			</p>
    			<!-- 报读人数 -->
    			<p class="student-number">报读人数：{{ coursesProfile.read_count }}人</p>
    		</div>
    	</div>
    </div>
</template>
<script>
import star from './star';

import { Toast,Indicator } from 'mint-ui';

import { addProductFav, cancelProductFav } from '@/service/user';

export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        }
    },
    components: {
		star
    },
	props: {
		//课程详情
	    coursesProfile: {
	    	type: Object,
	        default: function () {
	            return {

	            }
	        }
	    },
	    //前一个路由名
	    fromName: {
	    	type: String,
	    	default: function () {
	    		return 'null'
	    	}
	    }
	},
    methods: {
    	//收藏
    	coursesFav: async function (action) {
    		let res;
    		let success;
    		let error;
    		// 0为取消收藏,1为添加收藏
    		Indicator.open();
    		if (action === 1) {
	            res = await addProductFav(this.agencysInfo.id, this.coursesProfile.id);
	            // 成功文案
	            success = '您已成功收藏该商品';
	            error = '收藏失败';
    		}else{
    			res = await cancelProductFav(this.agencysInfo.id, this.coursesProfile.id);
    			success = '您已取消该商品收藏';
    			error = '取消收藏失败';
    		}
    		Indicator.close();
    		if (res.errCode === 0) {
    			Toast(success);
    			if (action === 1) {
	    			this.$emit('favSuccess');
    			}else{
	                this.$emit('favFail');
    			}
    		}else if(res.errCode === 10003 || res.errCode === 10005){
                this.tokenOutOfDate();
            }else{
                Toast(error);
            }
    	},
    	//返回上一页
		backTo: function () {
			// 判断上一次路由是否为空,空则返回首页
			if (this.fromName === 'null') {
                this.goToOther('');
			}else{
				this.$router.go(-1);
			}
		},
		// 右键事件
		videoRight: function () {
			return false;		
		}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.introduce{
	background-color: #ffffff;
	padding-bottom: 44px;
	position: relative;
	// 视频
	.video{
		width: 750px;
		height: 422px;
	}
	video::-webkit-media-controls-enclosure {
	    overflow:hidden;
	}

	video::-webkit-media-controls-panel {
	    width: calc(100% + 35px); 
	}
	// 商品头图
	.course-img{
		width: 750px;
		height: 422px;
		overflow: hidden;
		img{
			width: 750px;
		}
	}
	// 课程信息
	.content{
		padding: 0 30px;
		// 课程名称和收藏
		.name-and-collect{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 34px;
			.name{
				font-size: 34px;
				font-weight: bold;
				color: #333333;
			}
			.collect{
				width: 36px;
				height: 33px;
				cursor: pointer;
			}
		}
		// 评级
		.star{
			margin-top: 28px;
		}
		// 描述
		.description{
			font-size: 28px;
			color: #999999;
			line-height: 40px;
			margin-top: 28px;
		}
		// 原价
		.fee-old{
			display: flex;
			align-items: center;
			color: #999999;
			text-decoration: line-through;
			margin-top: 47px;
			span:nth-child(1){
				font-size: 20px;
			}
			span:nth-child(2){
				font-size: 24px;
			}
		}
		//现价和报名人数
		.number{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 8px;
			.fee-now{
				span:nth-child(1){
					font-size: 24px;
					font-weight: 900;
					color: #fa4343;
				}
				span:nth-child(2){
					font-size: 44px;
					font-weight: bold;
					color: #fa4343;
				}
			}
			.student-number{
				font-size: 22px;
				color: #999999;
			}
		}
	}
}
</style>