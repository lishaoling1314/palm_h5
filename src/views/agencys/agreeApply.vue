<template>
    <div class="wrap">
	    <!-- 顶部 -->
        <nav-return title="确认同意申请" :goHome="false"></nav-return>
        <!-- 课程 -->
        <div class="courses-wrap">
			<courses :courses="productInfo" :onlyName="true"></courses>
        </div>
        <!-- 选项 -->
        <div class="option-list" style="margin-top: 30px;">
        	<div class="option-item border-bottom">
        		<div class="content">
        			<img class="buy-icon" src="../../assets/icon/buy_1@2x.png" alt="课程购买" />
        			<p class="buy-text">购买课程完整授权</p>
        			<img class="question-icon" src="../../assets/icon/question_explain@2x.png" alt="疑问" @click="toatlTips = !toatlTips" />
        			<p class="fee">￥{{ productInfo.sale_price }}</p>
        		</div>
        		<img class="radio-icon" :src="curSelect === 1 ? selectIcon[1]:selectIcon[0]" alt="选择" @click="curSelect = 1">
        	</div>
        	<p class="buy-tips" v-if="toatlTips">选择“购买课程学习期限”方式购买，即可在该课程规定的学习期限内可同意任意学员报读申请</p>
        </div>
        <div class="option-list" :style="toatlTips? 'margin-top: 10px':''">
        	<div class="option-item border-bottom">
        		<div class="content">
        			<img class="buy-icon" src="../../assets/icon/buy_2@2x.png" alt="课程购买" />
        			<p class="buy-text">购买该学员单次学习机会</p>
        			<img class="question-icon" src="../../assets/icon/question_explain@2x.png" alt="疑问" @click="singlelTips = !singlelTips" />
        			<p class="fee">￥{{ productInfo.single_sale_price }}</p>
        		</div>
        		<img class="radio-icon" :src="curSelect === 2 ? selectIcon[1]:selectIcon[0]" alt="选择" @click="curSelect = 2">
        	</div>
        	<p class="buy-tips" v-if="singlelTips">选择“购买该学员单次学习机会”方式，即只有该学员可在该课程学习期限内进行该课程学习，若需要同意其他学员报读申请需重新购买</p>
        </div>
        <!-- 合计 -->
        <div class="total">
	        <p class="fee">合计：<span class="fee-text">￥{{ totalPrice }}</span></p>
        	<p class="confirm" @click="confirmPay" :class="{'btn-click':agreedApprove}" @mousedown="agreedApprove = true" @mouseup="agreedApprove = false" @touchstart="agreedApprove = true" @touchend="agreedApprove = false">确定</p>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';
import courses from '@/components/courses/courses';

import { Toast,Indicator } from 'mint-ui';

import { orderPlace } from '@/service/order';
import { getProductProfile } from '@/service/product';
import { applyReadProfile } from '@/service/agencys';
import { browserRedirect } from '@/utils';
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	applyId: '',//申请id
        	applyInfo: {},//申请信息
        	productInfo: {},//商品信息
        	curSelect: 1,//当前选择
        	toatlTips: 0,//展开提示
        	singlelTips: 0,//展开提示
        	agreedApprove: false,//确认同意申请
        	selectIcon: [
				require('../../assets/icon/choose_selected@2x.png'),
				require('../../assets/icon/choose_defult@2x.png')
        	]
        }
    },
    components: {
    	navReturn,
    	courses
    },
    created: function () {
    	// 获取课程id
        let applyId = this.$route.query.applyId;
        if (applyId !== undefined) {
        	this.applyId = applyId;
        	this.getInfo();
        }else{
        	Toast('获取课程信息失败');
        }
    },
    computed: {
    	//合计
        totalPrice: function () {
        	let result = 0;
        	if (this.curSelect === 1) {
        		result = this.productInfo.sale_price;
        	}else{
        		result = this.productInfo.single_sale_price;
        	}
        	return result;
        }
    },
    methods: {
    	// 获取信息
    	getInfo: async function () {
    	    Indicator.open();
    	    let res = await applyReadProfile(this.agencysInfo.id,this.applyId);
    	    Indicator.close();
    	    if (res.errCode === 0) {
    	        this.applyInfo = res.data;
    	        this.productInfo = res.data.product_info;
    	    }else if (res.errCode === 10003 || res.errCode === 10005) {
    	        this.tokenOutOfDate();
    	    }else if(res.errCode === 80001){
    	        Toast('当前机构不存在');
    	    }else{
    	        Toast('获取申请信息失败');
    	    }
    	},
    	// 生成订单
    	confirmPay: async function () {
			// 获取order信息
			let order = {};
			order['prod_id'] = this.productInfo.id;
			order['num'] = 1;
			// 获取当前url
			let callBackUrl = window.location.href.split('agreeApply')[0];
			// 判断是否为为单个学生购买支付成功回到审核列表
			if (this.curSelect === 2) {
				order['user_id'] = this.applyInfo.user_id;
				// 为单个学生购买支付成功则跳转到审核列表
				callBackUrl = callBackUrl + 'enrolCourses';
			}else{
				// 购买完整版则回当前学生申请页
				callBackUrl = callBackUrl + 'coursesApprove?applyId=' + this.applyId;
			}
			Indicator.open();
    	    let channel = browserRedirect();
    		let res = await orderPlace(1,channel,[order]);
    		Indicator.close();
    		if (res.errCode === 0 && res.data !== null) {
                this.goToDetail('/orderPay',{'orderNo': res.data.order_no,'callBackUrl':callBackUrl});
    		}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 20001){
	            Toast('课程信息不能为空');
    		}else if(res.errCode === 101){
    			Toast('渠道不能为空');
    		}else if(res.errCode === 10007){
    			Toast('用户类型不能为空');
    		}else{
    			Toast('生成订单失败');
    		}
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	// 课程
	.courses-wrap{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750px;
		height: 230px;
		background-color: #ffffff;
		margin-top: 30px;
		padding: 0 30px;
	}
	// 选项
	.option-list{
		background-color: #ffffff;
		padding: 0 30px;
		.option-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 110px;
			.content{
				display: flex;
				align-items: center;
				.buy-icon{
					width: 60px;
					height: 60px;	
				}
				.buy-text{
					font-size: 30px;
					color: #333333;
					margin-left: 21px;
				}
				.question-icon{
					width: 30px;
					height: 30px;
					cursor: pointer;
					margin-left: 8px;
				}
				.fee{
					font-size: 30px;
					color: #fa4343;
					margin-left: 23px;
				}
			}
			.radio-icon{
				width: 38px;
				height: 38px;
				cursor: pointer;
			}
		}
		.buy-tips{
			font-size: 28px;
			color: #666666;
			line-height: 42px;
			padding: 42px 0 44px;
		}
		.border-bottom{
			border-bottom: 2px solid #eeeeee;
		}
	}
	// 合计
	.total{
		display: flex;
		width: 100%;
		height: 98px;
		background-color: #ffffff;
		position: absolute;
		bottom: 0;
		.fee{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			flex: 1;
			font-size: 34px;
			color: #333333;
			.fee-text{
				color: #fa4343;
				margin-right: 31px;
			}
		}
		.confirm{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 277px;
			height: 100%;
			font-size: 34px;
			color: #ffffff;
			background-color: #04b2a3;
			cursor: pointer;
		}
	}
}
</style>