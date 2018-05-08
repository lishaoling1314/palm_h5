<template>
    <div class="wrap">
	    <!-- 顶部 -->
        <nav-return title="我的消息"></nav-return>
        <!-- 内容 -->
        <div class="message">
        	<p class="title">{{ messageDetail.title }}</p>
        	<p class="date-and-agencys">
        		<span class="date">{{ messageDetail.created_at | timeToDate(true,true,true) }}</span>
        		<span class="agencys">{{ agencysInfo.name }}</span>
        	</p>
        	<p class="content" v-html="messageDetail.content"></p>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';

import { Toast,Indicator } from 'mint-ui';

import { getMessage } from '@/service/user';
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	messageId: '',//消息id
        	messageDetail: {},//消息
			tab: 1
        }
    },
    components: {
    	navReturn
    },
    created: function () {
    	let messageId = this.$route.query.messageId;
    	if (messageId !== undefined) {
			this.messageId = messageId;
			this.getMessageDetail();
    	}else{
			Toast('获取消息失败');
    	} 
    },
    methods: {
        // 获取消息详情
    	getMessageDetail: async function () {
            Indicator.open();
    		let res = await getMessage(this.messageId);
            Indicator.close();
    		if (res.errCode === 0 && res.data !== null) {
                this.messageDetail = res.data;
    		}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
            	Toast('获取用户消息失败');
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
	.message{
		padding: 0 30px;
		.title{
			font-size: 38px;
			color: #333333;
			line-height: 52px;
			margin-top: 68px;
		}
		.date-and-agencys{
			display: flex;
			align-items: center;
			margin-top: 35px;
			.date{
				font-size: 24px;
				color: #666666;
				margin-right: 30px;
			}
			.agencys{
				font-size: 26px;
				color: #04b2a3;
			}
		}
		.content{
            overflow: hidden;
			font-size: 30px;
			color: #666666;
			line-height: 50px;
			margin-top: 54px;
		}
	}
}
</style>