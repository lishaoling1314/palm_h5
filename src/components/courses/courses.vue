<template>
    <div class="course" @touchmove="showDelete">
        <div class="content" :class="deleteBtn?'content-hide':''">
		    <!-- 课程图片 -->
		    <div class="course-img-wrap" @click="goDetail">
		    	<img class="course-img" :src="courses.img_url" alt="课程图片" />
		    </div>
	    	<!-- 课程信息 -->
	    	<div class="course-info">
	    		<p class="course-name" @click="goDetail">{{ courses.name }}</p>
	    		<!-- 申请中 -->
	    		<p class="course-fee" v-if="showPercent && (Number(courses.pend_status) === 1 || Number(courses.pend_status) === 2)">
	    			<span class="fee-free">申请中</span>
	    		</p>
	    		<!-- 申请不通过 -->
	    		<p class="course-fee" v-else-if="showPercent && (Number(courses.pend_status) === 4)">
	    			<span class="fee-now">申请不通过</span>
	    		</p>
	    		<!-- 价格 -->
	    		<p class="course-fee" v-else>
	    			<span v-if="Number(courses.is_free && showFree) === 1" class="fee-free">免费</span>
	    			<span v-else class="fee-now">￥{{ courses.single_sale_price }}</span>
	    			<span class="fee-old">￥{{ courses.origin_price  }}</span>
	    		</p>
	    		<!-- 在读人数 -->
	    		<p class="course-number-level" v-if="!onlyName">
	    			<span class="course-number">{{ courses.read_count }}人在读</span>
	    			<span class="course-level">{{ courses.level | levelToChinese }}</span>
	    		</p>
	    		<!-- 申请日期 -->
	    		<p class="pend-mark" v-if="showPercent && (Number(courses.pend_status) === 1 || Number(courses.pend_status) === 2)">申请时间：{{ courses.apply_created |  timeToDate(true,true,true) }}</p>
	    		<!-- 不通过理由 -->
	    		<p class="pend-mark" v-if="showPercent && Number(courses.pend_status) === 4">理由：{{ courses.pend_remarks | cutString(23) }}</p>
	    		<!-- 进度条(我的课程以及审核通过才显示) -->
	    		<div class="percent" v-if="showPercent && Number(courses.pend_status) === 3">
		    		<p class="percent-zero" v-if="Number(courses.percent) === 0">0%</p>
		    		<p class="normal percent-full" v-else-if="Number(courses.percent) === 100">100%</p>
		    		<p class="normal" :style="percentLength" v-else-if="Number(courses.percent) < 20">
			    		<span class="small-percent">{{ courses.percent }}%</span>
		    		</p>
	    			<p class="normal normal-padding" v-else :style="percentLength">{{ courses.percent }}%</p>
	    		</div>	
	    	</div>
        </div>
        <p class="delete-btn" v-if="deleteBtn" @click="deleteFav">删除</p>
    </div>
</template>
<script>
import { cancelProductFav } from '@/service/user';

import { Toast,Indicator } from 'mint-ui';

export default {
    data() {
        return {
			agencysInfo: this.$route.params.agencysInfo,// 机构信息
			percentLength:{
				width: 0
			},
			deleteBtn: false,//显示删除按钮
			lastPageX: undefined,//前一次滑动的pageX
        }
    },
    props: {
	    //内容
		courses: {
			default: {}
		},
		// 只显示标题
		onlyName: {
			default: false
		},
		//是否跳转
		jump: {
			default: false
		},
		//是否显示学习进度
		showPercent: {
			default: false
		},
		//是否能删除
		isDelete: {
			default: false
		},
		//是否显示免费
		showFree: {
			default: true
		}
    },
    mounted: function () {
    	// 设置学习进度条
        this.percentLength.width = Number(this.courses.percent)*0.04 + 'rem';
    },
    methods: {
	    // 进入详情
	    goDetail: function () {
	    	// 判断是否允许跳转到详情页
	    	if (!this.jump) {
	    		return false;
	    	}
	    	// 判断是否为已报读课程，是则跳转到学习页,不是则跳转到详情页
	    	let productType = Number(this.courses.product_type);
    		if (this.showPercent && productType > 2) {
    			this.$router.push({path: '/' + this.agencysInfo.name_py + '/coursesStudy',query: {'courses':this.courses.id}});	
    		}else{
	    		this.$router.push({path: '/' + this.agencysInfo.name_py + '/coursesInfo',query: {'courses':this.courses.id}});	
    		}
	    },
	    // 显示删除按钮
	    showDelete: function (e) {
	    	if (this.isDelete) {
		    	let changedTouches = e.changedTouches[0];
		    	let pageX = changedTouches.pageX;
		    	if (this.lastPageX === undefined) {
		            this.lastPageX = pageX;
		    	}else{
		    		// 左滑
	                if (pageX < this.pageX) {
						this.deleteBtn = true;
	                }else{
	                	this.deleteBtn = false;
	                }
	                this.pageX = pageX;
		    	}
	    	}
	    },
	    // 删除收藏
	    deleteFav: async function () {
	    	Indicator.open();
	    	let res = await cancelProductFav(this.agencysInfo.id,this.courses.id);
	    	Indicator.close();
	    	if (res.errCode === 0) {
                window.location.reload();
	    	}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
                Toast('删除收藏失败');
            }
	    }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.course{
	display: flex;
	justify-content: flex-end;
	width: 100%;
	background-color: #ffffff;
	.content{
		display: flex;
		justify-content: space-between;
		flex: 1;
		min-width: 685px;
		.course-img-wrap{
			width: 304px;
			height: 170px;
			border-radius: 10px;
			cursor: pointer;
	        overflow: hidden;
	        .course-img{
	        	width: 304px;
	        }
		}
		.course-info{
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			padding: 5px 0;
			.course-name{
				width: 356px;
				height: 67px;
				font-size: 30px;
				color: #323333;
				line-height: 39px;
				cursor: pointer;
			}
			.course-fee{
				.fee-free{
					font-size: 28px;
					color: #02b4a3;
					margin-right: 26px;
				}
				.fee-now{
					font-size: 28px;
					color: #fa4343;
					margin-right: 26px;
				}
				.fee-old{
					font-size: 26px;
					color: #999899;
					text-decoration: line-through;
				}
			}
			.course-number-level{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.course-number{
					font-size: 20px;
					color: #666666;
				}
				.course-level{
					font-size: 20px;
					color: #02b4a3;
				}
			}
			// 申请日期
			.pend-mark{
				font-size: 22px;
				color: #999;
			}
			// 学习进度
			.percent{
				display: flex;
				align-items: center;
				width: 312px;
				height: 26px;
				border: 2px solid #bdbdbd;
				border-radius: 13px;
				padding-left: 4px;
				position: relative;
				.normal{
					display: flex;
					justify-content: flex-end;
					align-items: center;
					max-width: 300px;
					height: 18px;
					font-size: 20px;
					color: #ffffff;
					background: linear-gradient(to right, #4bd1c8 , #4ccbd2);
					border-radius: 13px;
					position: relative;
				}
				.normal-padding{
					padding-right: 12px;
				}
				.percent-full{
					display: flex;
					justify-content: center;
					width: 300px;
				}
				.percent-zero{
					font-size: 20px;
					color: #04b2a3;
					position: absolute;
					left: 27px;
				}
				.small-percent{
					font-size: 20px;
					color: #04b2a3;
					position: absolute;
					right: -50px;
				}
			}
		}
	}
	.delete-btn{
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 100px;
		font-size: 28px;
		color: #ffffff;
		background-color: #04b2a3;
		border-radius: 6px;
		cursor: pointer;
		margin-left: 20px;
	}
}
</style>