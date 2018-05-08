<template>
    <div class="wrap">
	    <!-- 顶部 -->
        <nav-return :title="type === 1? '加入机构申请列表':'报读课程申请列表'" :goBackToLast="false" leavePath="/agencysCenter"></nav-return>
        <!-- 切换列表 -->
	    <div class="nav-tab">
	    	<p :class="tab === 1? 'nav-tab-focus':''" @click="tab = 1">待审核</p>
	    	<p :class="tab === 2? 'nav-tab-focus':''" @click="tab = 2">已通过</p>
	    	<p :class="tab === 3? 'nav-tab-focus':''" @click="tab = 3">未通过</p>
	    </div>
	    <!-- 标题 -->
	    <p class="nav-title">
	    	<span>名称</span>
	    	<span>{{ type === 1? '员工/学生证号':'申请课程名称' }}</span>
	    	<span>申请时间</span>
	    	<span>操作</span>
	    </p>
        <!-- 列表 -->
        <div class="apply-list">
        	<p class="apply-item" v-for="item in allList">
        		<span>{{ item.truename | cutString(7) }}</span>
        		<span v-if="type === 1">{{ item.student_no | cutString(15)}}</span>
        		<span v-else>{{ item.product_name }}</span>
        		<span>{{ item.pend_created | timeToDate(true,true,true, true) }}</span>
        		<span class="wait-pend" v-if="Number(item.pend_status) === 1|| Number(item.pend_status) === 2" @click="goToPend(item.apply_id)">去审批</span>
        		<span v-else-if="Number(item.pend_status) === 3">已通过</span>
        		<span v-else>未通过</span>
        	</p>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';

import { Toast,Indicator  } from 'mint-ui';

import { applyJoinList, applyReadList } from '@/service/agencys';
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	type: 1,//1为加入机构，2为报读课程
			tab: 1,
			allList: [],//所有列表
			pageSize: 12,//初始偏移量
			pageTotal: 1,//总共页码
			loadSuccess: true//是否允许获取数据
        }
    },
    components: {
    	navReturn
    },
    //离开路由删除store信息s
    beforeRouteLeave(to, from, next) {
    	// 移除点击事件
    	window.removeEventListener('scroll', this.handleScroll);
        next();
    },
    created: function () {
    	//获取路由元信息
    	this.type = this.$route.meta.type;
    	//获取tab
    	let tab = this.$route.query.tab;
    	if (tab !== undefined && (Number(tab) === 1 || Number(tab) === 2 || Number(tab) === 3)) {
			this.tab = Number(tab);
    	}else{
            if (this.type === 1) {
            	this.goToDetail('/addToAgencys',{'tab': 1});
            }else{
            	this.goToDetail('/enrolCourses',{'tab': 1});
            }
    	}
    	//获取列表
    	this.getList();
    },
    mounted: function () {
		// 监听滚动事件
	    window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
    	//获取列表
    	getList: async function () {
    		// 判断是否允许获取数据
    		if (!this.loadSuccess) {
    			return false;
    		}else{
    			// 设置为不允许获取数据
    			this.loadSuccess = false;
    		}
            let res; 
            Indicator.open();
            if (this.type === 1) {
	            res = await applyJoinList(this.agencysInfo.id,1,this.pageSize,(this.tab + 1));
            }else{
            	res = await applyReadList(this.agencysInfo.id,1,this.pageSize,(this.tab + 1));
            }
            Indicator.close();
            if (res.errCode === 0) {
                if (res.data !== null) {
                	this.allList = res.data.list;
                	// 储存页码总数
                	this.pageTotal = Number(res.data.page_total);
                	// 设置下一次获取数据偏移量
                	this.pageSize = this.pageSize + 12;
                }
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 80001){
            	Toast('当前机构不存在');
            }else if(res.errCode === 80014 || res.errCode === 80016){
            	Toast('当前暂无申请');
            }else{
            	Toast('获取列表失败');
            }
            // 设置为允许
            this.loadSuccess = true;
    	},
    	//去审核
    	goToPend: function (applyId) {
            if (this.type === 1) {
            	this.goToDetail('/agencysApprove',{'applyId':applyId});
            }else{
            	this.goToDetail('/coursesApprove',{'applyId':applyId});
            }
    	},
    	//监听滚动
    	handleScroll: function (e) {
    		//滚动条的位置
    		let scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    		//内容区域的真实高度
    		let scrollHeight = document.body.scrollHeight + document.documentElement.scrollHeight;
    		// 元素的高度
    		let windowHeight = document.body.clientHeight + document.documentElement.clientHeight;
    		// 滚动条的偏移值 + 元素的高度 = 内容总体的高度
		　　if((scrollTop + windowHeight) === scrollHeight){
				// 获取元素
		　　　　 this.getList();
		　　}
    	}
    },
    watch:{
    	//监听路由变化
    	$route: function () {
    		window.location.reload();
    	},
    	//列表切换
    	tab: function () {
    		if (this.type === 1) {
    			this.goToDetail('/addToAgencys',{'tab':this.tab});
    		}else{
    			this.goToDetail('/enrolCourses',{'tab':this.tab});
    		}
    	},
    	//监听pageSize变化
    	pageSize: function () {
    		// 总页码为1则无需再加载
    		if (this.pageTotal === 1) {
    			this.loadSuccess = false;
    		}
    		// 当页码总数大于1
    		if (this.pageTotal > 1) {
		    	//获取已有数量
		    	let curNum = this.allList.length;
				//获取倒数第二页能拿到的数量
				let penultimateNum = (Number(this.pageTotal) - 1) * 12;
				//获取能拿到的总数量
				let totalNum = (Number(this.pageTotal)) * 12;
				//判断是否已拿到最后页数据
				if (curNum > penultimateNum && curNum < totalNum) {
                    this.loadSuccess = false;
				}
    		}
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	// 顶部切换列表
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
		}
		.nav-tab-focus{
			color: #02b4a3;
			border-bottom: 4px solid #02b4a3;
		}
	}
	// 顶部标题
	.nav-title{
		display: flex;
		justify-content: center;
		width: 100%;
		height: 88px;
		background-color: #ffffff;
		padding: 30px 0;
		margin-top: 20px;
		span{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30px;
			color: #02b4a3;
		}
		span:nth-child(1){
			width: 120px;
		}
		span:nth-child(2){
			width: 259px;
			border-left: 2px solid #eeeeee;
		}
		span:nth-child(3){
			width: 197px;
			border-left: 2px solid #eeeeee;
			border-right: 2px solid #eeeeee;
		}
		span:nth-child(4){
			width: 120px;
		}
	}
	// 申请列表
	.apply-list{
		background-color: #ffffff;
		margin-top: 20px;
        padding: 0 30px;
		.apply-item{
			display: flex;
			width: 100%;
			height: 88px;
			background-color: #ffffff;
            border-bottom: 2px solid #eeeeee;
			span{
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28px;
				color: #666666;
			}
			span:nth-child(1){
				justify-content: flex-start;
				width: 120px;
				color: #333333;
			}
			span:nth-child(2){
				width: 259px;
			}
			span:nth-child(3){
				width: 197px;
			}
			span:nth-child(4){
				width: 120px;
			}
			.wait-pend{
				color: #04b2a3;
				cursor: pointer;
			}
		}
	}
}
</style>