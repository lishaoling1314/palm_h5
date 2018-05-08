<template>
    <div class="wrap">
        <!-- 顶部 -->
        <nav-return title="确认支付" :goHome="false"></nav-return>
        <!-- 课程 -->
        <div class="content">
        	<courses :courses="coursesProfile" :onlyName="true" :showFree="false"></courses>
        </div>
        <!-- 按钮 -->
        <div class="operate">
        	<p class="total">合计：</p>
        	<p class="fee">￥{{ coursesProfile.single_sale_price }}</p>
        	<p class="confirm-btn" :class="{'btn-click': payClick}" @click="confirmPay" @mousedown="payClick = true" @mouseup="payClick = false" @touchstart="payClick = true" @touchend="payClick = false">确定</p>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';
import courses from '@/components/courses/courses';

import { Toast,Indicator } from 'mint-ui';

import { getProductProfile } from '@/service/product';
import { orderPlace } from '@/service/order';
import { getLocalStore,browserRedirect } from '@/utils';
export default {
    data() { 
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	coursesId: '0',//课程id
        	coursesProfile: {},//课程详情
            payClick: false,//确认支付
        }
    },
    components: {
        navReturn,
        courses
    },
    created: function () {
        // 获取课程id
        let coursesId = this.$route.query.courses;
        if (coursesId !== undefined) {
            this.coursesId = coursesId;
            // 获取课程信息
            this.getCourseProfile();
        }else{
            Toast('获取课程信息失败');
        }
    },
    methods: {
    	// 获取课程信息
    	getCourseProfile: async function (){
    	    // 获取课程信息
    	    Indicator.open();
    	    let res = await getProductProfile(this.agencysInfo.id,this.coursesId);
    	    Indicator.close();
    	    if (res.errCode === 0 && res.data !== null) {
    	        this.coursesProfile = res.data;
    	    }else{
    	        Toast('获取课程信息失败');
    	    }
    	},
    	// 生成订单
    	confirmPay: async function () {
            let role = 10;
			// 获取用户信息
			let userInfo = getLocalStore('userInfo');
			if (userInfo !== null) {
				userInfo = JSON.parse(userInfo);
				role = Number(userInfo.role)
			}
            if (role === 2) {
                Toast('学员才能进行当前操作');
                return false;
            }
			// 获取order信息
			let order = {};
			order['prod_id'] = this.coursesId;
			order['num'] = 1;
            Indicator.open();
            let channel = browserRedirect();
    		let res = await orderPlace(2,channel,[order]);
            Indicator.close();
    		if (res.errCode === 0) {
                // 定义支付成功回调url
                let callBackUrl = window.location.href.split('confirmPay')[0] + 'coursesInfo?courses=' + this.coursesId;
                this.goToDetail('/orderPay',{'orderNo': res.data.order_no, 'callBackUrl': callBackUrl});
    		}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 20001){
	            Toast('课程信息不能为空');
    		}else if(res.errCode === 101){
    			Toast('渠道不能为空');
    		}else if(res.errCode === 10007){
    			Toast('用户类型不能为空');
    		}else{
                Toast('生成订单失败')
            }
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	min-height: 100vh;
	background-color: #ffffff;
	.content{
		padding: 60px 24px 0 24px;
	}
	.operate{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 750px;
		height: 98px;
		border-top: 2px solid #eeeeee;
		position: fixed;
		bottom: 0;
		p{
			font-size: 34px;
		}
		.total{
 	        color: #333333;
		}
		.fee{
			color: #fa4343;
			margin-right: 30px;
		}
		.confirm-btn{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 280px;
			height: 100%;
			color: #ffffff;
			background-color: #02b4a3;
			cursor: pointer;
		}
	}
}
</style>