<template>
    <div class="wrap">
	    <!-- 顶部 -->
        <nav-return title="我的消息" :goBackToLast="false" leavePath="/studentCenter">></nav-return>
        <!-- 切换列表 -->
	    <div class="nav-tab">
	    	<p :class="tab === 1? 'nav-tab-focus':''" @click="tab = 1">全部</p>
	    	<p :class="tab === 2? 'nav-tab-focus':''" @click="tab = 2">未读<span class="dot" v-if="unReadNum > 0"></span></p>
	    	<p :class="tab === 3? 'nav-tab-focus':''" @click="tab = 3">已读</p>
	    </div>
	    <!-- 消息列表 -->
	    <div class="message-list">
	    	<div class="message-item" v-for="item in curList" @click="goToDetail('/myMessage',{'messageId': item.id})">
	    	    <!-- 圆点 -->
	    		<div class="dot-wrap">
	    			<p class="dot" v-if="Number(item.is_read) === 1"></p>
	    			<p class="dot dot-red" v-else></p>
	    		</div>
	    		<!-- 消息 -->
	    		<div class="message-content">
	    			<p class="title-and-date">
	    				<span class="title">{{ item.title | cutString(35) }}</span>
	    				<span class="date">{{ item.created_at | timeToDate(false,true,true) }}</span>
	    			</p>
	    			<p class="content">{{ item.content | deleteHref() | cutString(70) }}</p>
	    		</div>
	    	</div>
	    </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';

import { Toast,Indicator } from 'mint-ui';

import { studentMessage } from '@/service/user';
import { getLocalStore } from '@/utils';
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	messageList: [],//用户消息列表
			tab: 1
        }
    },
    components: {
    	navReturn
    },
    created: function () {
    	let tab = this.$route.query.tab;
    	if (tab !== undefined && (Number(tab) === 2 || Number(tab) === 3)) {
    	    this.tab = tab;
    	}
    	this.getStudentMessage();
    },
    computed: {
    	//当前列表
		curList: function () {
			let result = [];
		    switch(this.tab){
		    //未读
		    case 2:
		        this.messageList.forEach(function(value){
		        	if (Number(value.is_read) === 0) {
		        		result.push(value);
		        	}
		        })
			    break;
			// 已读
		    case 3:
		        this.messageList.forEach(function(value){
		        	if (Number(value.is_read) === 1) {
		        		result.push(value);
		        	}
		        })
			    break;
		    default:
			    result = this.messageList;
		    }
		    return result;
		},
		// 未读数量
		unReadNum: function () {
			let result = 0;
			this.messageList.forEach(function(value){
				if (Number(value.is_read) === 0) {
					result++;
				}
			})
			return result;
		}
    },
    methods: {
        //获取用户信息
        getStudentMessage: async function () {
        	let userInfo = getLocalStore('userInfo');
        	let roleType = 2;
        	if (userInfo !== null) {
        		userInfo = JSON.parse(userInfo);
        		roleType = Number(userInfo.role) === 2? 1:2;
        	}
        	Indicator.open();
        	let res = await studentMessage(roleType,this.agencysInfo.id);
        	Indicator.close();
        	if (res.errCode === 0) {
        		if (res.data !== null) {
	                this.messageList = res.data;
        		}else{
        			Toast('用户消息列表为空');
        		}
        	}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
            	Toast('获取用户消息列表失败');
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	.nav-tab{
		display: flex;
		width: 750px;
		height: 88px;
		border: 2px solid #eeeeee;
		background-color: #ffffff;
		p{
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			height: 88px;
			font-size: 30px;
			font-weight: bold;
			color: #666666;
			cursor: pointer;
			position: relative;
			.dot{
				width: 16px;
				height: 16px;
				background-color: #fa4343;
				border-radius: 50%;
				position: absolute;
				top: 21px;
				right: 75px;
			}
		}
		.nav-tab-focus{
			color: #02b4a3;
			border-bottom: 4px solid #02b4a3;
		}
	}
	// 消息列表
	.message-list{
		margin-top: 20px;
		.message-item{
			display: flex;
			width: 750px;
			background-color: #ffffff;
			cursor: pointer;
			// 圆点
			.dot-wrap{
				display: flex;
				justify-content:center;
				width: 90px;
				.dot{
					width: 16px;
					height: 16px;
					background-color: #bdbdbd;
					border-radius: 50%;
					margin-top: 38px;
				}
				.dot-red{
					background-color: #fa4343;
				}
			}
			// 消息
			.message-content{
				flex: 1;
				border-bottom: 2px solid #eeeeee;
				padding: 30px 38px 30px 0;
				.title-and-date{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.title{
						font-size: 30px;
						color: #333333;
					}
					.date{
						font-size: 22px;
						color: #999999;
					}
				}
				.content{
					width: 606px;
					font-size: 28px;
					color: #999999;
					line-height: 42px;
					margin-top: 21px;
				}
			}
		}
	}
}
</style>