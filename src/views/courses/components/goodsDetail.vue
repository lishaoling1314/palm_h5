<template>
    <div class="goods">
	    <!-- 老师介绍 -->
    	<div class="detail">
		    <decorate-title class="decorate-title" title="老师介绍"></decorate-title>
	    	<!-- 教师列表 -->
	    	<div class="teacher-list">
		    	<div class="teacher-item" v-for="(item,key) in coursesProfile.teacher_list" :style="key === 0?'':'border-top: 1px solid #eeeeee'">
		    		<p class="teacher-sort">老师{{ key | numberToChinese }}</p>
		    		<!-- 教师信息 -->
		    		<div class="teacher-info">
			    		<!-- 头像 -->
		    			<div class="teacher-img-wrap" @click="goToDetail('/teacherInfo',{'teacher':item.id})">
		    				<img class="teacher-img" :src="item.img_url">
		    			</div>
		    			<!-- 详情 -->
		    			<div class="teacher-detail">
		    				<p class="teacher-name">{{ item.name }}</p>
		    				<p class="teacher-through">{{ item.desc }}</p>
		    			</div>
		    		</div>
		    	</div>
	    	</div>
    	</div>
    	<!-- 商品详情 -->
    	<div class="detail good-margin">
		    <decorate-title class="decorate-title" title="商品详情"></decorate-title>
    		<div class="goods-detail" v-html="coursesProfile.content"></div>
    	</div>
    </div>
</template>
<script>
import decorateTitle from '@/components/common/decorateTitle';

export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo// 机构信息
        }
    },
    components: {
    	decorateTitle
    },
    props: {
    	//课程详情
	    coursesProfile: {
	    	type: Object,
            default: function () {
                return {
					teacher_list: []
                }
            }
	    }
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>	
.goods{
	.detail{
		background-color: #ffffff;
		// nav
		.decorate-title{
			padding: 65px 0 59px;
		}
		// 教师列表
		.teacher-list{
			display: flex;
			flex-direction: column;
			margin-top: -30px;
			padding: 0 30px;
			.teacher-item{
				padding: 30px 0;
				// 排序
				.teacher-sort{
					width: 180px;
					height: 64px;
					font-size: 32px;
					color: #333333;
					background-color: #f2f4f4;
					border-radius: 10px;
					text-align: center;
					padding: 14px 37px;
				}
				// 教师信息
				.teacher-info{
					display: flex;
					justify-content: space-between;
					margin-top: 58px;
					// 头像
					.teacher-img-wrap{
						width: 165px;
						height: 165px;
						border: 6px solid #b3e8e3;
						border-radius: 50%;
						cursor: pointer;
						overflow: hidden;
						.teacher-img{
							width: 165px;
							height: 165px;
						}
					}
					// 详情
					.teacher-detail{
						display: flex;
						flex-direction: column;
						width: 480px;
						padding-top: 5px;
						.teacher-name{
							font-size: 36px;
							font-weight: bold;
							color: #333333;
						}
						.teacher-through{
							font-size: 24px;
							color: #333333;
							line-height: 48px;
							margin-top: 40px;
						}
					}
				}
			}
		}
		// 商品详情
		.goods-detail{
			max-width: 750px;
			padding: 0 60px 95px 60px;
			.goods-introduce{
				font-size: 24px;
				color: #333333;
				line-height: 48px;
			}
			.goods-img{
				width: 630px;
				height: 236px;
				margin-top: 42px;
			}
		}
	}
	.good-margin{
		margin-top: 20px;
	}
}
</style>
<style lang="scss">
	.goods {
		.detail{
			.goods-detail{
				img{
					width: 100%;
				}
			}
		}
	}
</style>