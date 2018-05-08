<template>
    <div class="operate">
	    <!-- 客服 -->
    	<div class="customer-service operate-item" :class="{'white-click': serviceClick}" @click="customerService" @mousedown="serviceClick = true" @mouseup="serviceClick = false" @touchstart="serviceClick = true" @touchend="serviceClick = false">
    		<img src="../../../assets/icon/tab_service@2x.png" alt="客服">
    		<p>客服</p>
    	</div>
		<!-- 购买课程 -->
		<div class="buy-courses operate-item" :class="{'white-click': buyClick}" v-if="Number(coursesProfile.is_read) === 0" @click="buyCheck" @mousedown="buyClick = true" @mouseup="buyClick = false" @touchstart="buyClick = true" @touchend="buyClick = false">
			<img src="../../../assets/icon/tab_buy@2x.png" alt="购买课程">
			<p>购买课程</p>
		</div>
		<!-- 申请报读/再次报读 -->
		<div class="apply-courses operate-item" :class="{'apply-courses-disabled':Number(coursesProfile.is_apply) === 1 && Number(coursesProfile.pend_status) !== 4,'btn-click': applyClick}" v-if="Number(coursesProfile.is_read) === 0" @click="checkApply" @mousedown="applyClick = true" @mouseup="applyClick = false" @touchstart="applyClick = true" @touchend="applyClick = false">
			<img src="../../../assets/icon/tab_apply@2x.png" alt="申请报读/再次报读">
			<p>{{ Number(coursesProfile.pend_status) === 4 ? '再次报读':'申请报读'}}</p>
		</div>
    	<!-- 马上学习 -->
    	<div v-if="Number(coursesProfile.is_read) === 1" class="learn-now operate-item" :class="{'btn-click': studyClick}" @click="goToDetail('/coursesStudy',{'courses': coursesProfile.id})" @mousedown="studyClick = true" @mouseup="studyClick = false" @touchstart="studyClick = true" @touchend="studyClick = false">
    		<img src="../../../assets/icon/tab_study@2x.png" alt="马上学习">
    		<p>马上学习</p>
    	</div>
    	<!-- 申请确认 -->
    	<confirm-toast v-if="showApplyTips" :tips="Number(coursesProfile.pend_status) === 4 ? '是否确认再次报读':'是否确认申请报读'" @confirm="readApply" @cancel="showApplyTips = false;"></confirm-toast>
    </div>
</template>
<script>
import confirmToast from '@/components/common/confirmToast';
import { Toast,Indicator } from 'mint-ui';

import { addApplyRead } from '@/service/product';
import { getLocalStore } from '@/utils'

export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	userInfo: null,//用户信息
        	showApplyTips: false,//是否显示申请提示
        	isRead: 0,//是否刻度
        	serviceClick: false,//点击客服
        	buyClick: false,//购买课程
        	applyClick: false,//申请点击
        	studyClick: false,//马上学习
        }
    },
	props: {
		//课程详情
	    coursesProfile: {
	    	type: Object,
	        default: function () {
	            return {

	            }
	        }
	    }
	},
	components: {
		confirmToast
	},
	created: function () {
		// 获取当前有用户信息
		let userInfo = getLocalStore('userInfo');
		if (userInfo !== null) {
			userInfo = JSON.parse(userInfo);
			// 判断是否有当前机构下的用户信息
			if (Number(userInfo.agency_id) === Number(this.agencysInfo.id)) {
				this.userInfo = userInfo;
			}else{
				this.userInfo = null;
			}
		}
	},
	methods: {
		// 购买判断
		buyCheck: function () {
    		// 管理员不允许申请报读
            if (this.userInfo !== null && Number(this.userInfo.role) === 2) {
                Toast('学员才能进行当前操作');
                return false;
            }
            this.goToDetail('/confirmPay',{'courses': this.coursesProfile.id})
		},
		// 判断是否已经报读
		checkApply: function () {
			if (Number(this.coursesProfile.is_apply) === 1 && Number(this.coursesProfile.pend_status) !== 4) {
				Toast('您已申请报读，请等待审核结果');
			}else{
				// 判断是否有当前机构下的用户信息
				if (this.userInfo !== null) {
					// 管理员不允许申请报读
		            if (Number(this.userInfo.role) === 2) {
		                Toast('学员才能进行当前操作');
		                return false;
		            }
					this.showApplyTips = true;
				}else{
					// 没有则跳转到登陆页
					this.goToOther('/mobileLogin');
				}
			}
		},
		//报读申请
		readApply: async function () {
			Indicator.open();
            let res = await addApplyRead(this.agencysInfo.id,this.coursesProfile.id);
            Indicator.close();
            if (res.errCode === 0) {
            	if (Number(this.coursesProfile.pend_status) === 4) {
            		Toast('您的再次报读申请已提交');
            	}else{
	            	Toast('您的报读申请已提交');
            	}
            	// 获取新的是否有学习机会判断
            	this.coursesProfile.is_read = res.data.is_read;
            	// 申请成功回调
            	this.$emit('applySuccess');
            }else if(res.errCode === 10003 || res.errCode === 10005){
                this.tokenOutOfDate();
            }else{
            	if (Number(this.coursesProfile.pend_status) === 4) {
            		Toast('再次报读失败');
            	}else{
	            	Toast('申请报读失败');
            	}
            }
            this.showApplyTips = false;
		},
		//客服
		customerService: function () {
			window.open("https://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=196392&configID=6425&jid=9530781744","_blank","height=630,width=950,scrollbars=no,location=no");
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.operate{
	display: flex;
	justify-content: flex-end;
	width: 750px;
	height: 98px;
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	.operate-item{
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		img{
			margin-right: 7px;
		}
		p{
			font-size: 30px;
			color: #02b4a3;
			margin-left: 7px;
		}
	}
	// 客服
	.customer-service{
		flex: 1;
		border-top: 2px solid #eeeeee;
		cursor: pointer;
		img{
			width: 32px;
			height: 29px;
		}
	}
	// 购买课程
	.buy-courses{
		width: 262px;
		border-left: 2px solid #eeeeee;
		border-top: 2px solid #eeeeee;
		cursor: pointer;
		img{
			width: 33px;
			height: 30px;
		}
	}
	// 申请报读
	.apply-courses{
		width: 330px;
		background-color: #02b4a3;
		cursor: pointer;
		img{
			width: 29px;
			height: 33px;
		}
		p{
			color: #ffffff;
		}
	}
	.apply-courses-disabled{
		background-color: #dddddd;
	}
	//马上学校
	.learn-now{
		width: 500px;
		background-color: #02b4a3;
		cursor: pointer;
		img{
			width: 29px;
			height: 27px;
		}
		p{
			color: #ffffff;
		}
	}
}
</style>