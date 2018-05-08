<template>
    <div class="history">
    	<!-- 最近搜索 -->
    	<div class="history-item">
	    	<!-- 顶部 -->
    		<div class="history-nav">
	    		<div class="history-type">
	    			<img class="recent-icon" src="../../assets/icon/search_black@2x.png" alt="搜索黑色icon" />
	    			<p class="history-text">最近搜索</p>
	    		</div>
	    		<img class="history-del" src="../../assets/icon/del@2x.png" alt="删除" @click="clearHistory" />
	    	</div>
	    	<!-- 关键词列表 -->
	    	<div class="keyword-list" v-if="historyList.length > 0">
	    		<p class="keyword" v-for="item in historyList" @click="historySearch(item)">{{ item }}</p>
	    	</div>
			<!-- 无搜索历史 -->
			<p class="empty-history" v-else>暂无搜索历史</p>
    	</div>
    	<!-- 热门搜索 -->
    	<div class="history-item">
    		<div class="history-nav">
	    		<div class="history-type">
	    			<img class="hot-icon" src="../../assets/icon/searchhot@2x.png" alt="热门" />
	    			<p class="history-text">热门搜索</p>
	    		</div>
	    	</div>
	    	<div class="keyword-list">
	    		<p class="keyword" v-for="item in hotList" @click="historySearch(item.keywords)">{{ item.keywords }}</p>
	    	</div>
    	</div>
    </div>
</template>
<script>
import { searchsHot } from '@/service/product';

export default {
    data() {
        return {
			hotList: []
        }
    },
    props: [
		'historyList'
    ],
    created: function () {
		this.getHot();   
    },
    methods: {
    	// 清除关键词搜索
    	clearHistory: function () {
    		this.$emit('clearHistory');
    	},
    	//获取热门关键词
    	getHot: async function () {
    		let res = await searchsHot();
    		if (res.errCode === 0) {
    			this.hotList = res.data;
    		}
    	},
    	//历史搜索
    	historySearch: function (keyword) {
            this.$emit('update:history',keyword);
            this.$emit('search');
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.history{
	min-height: 100vh;
	background-color: #ffffff;
	// 搜索历史
	.history-item{
		width: 750px;
		margin-top: 44px;
		padding: 0 30px;
		// 顶部
		.history-nav{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.history-type{
				display: flex;
				align-items: center;
				.recent-icon{
					width: 28px;
					height: 28px;	
				}
				.hot-icon{
					width: 29px;
					height: 34px;	
				}
				.history-text{
					font-size: 32px;
					color: #323333;
					margin-left: 17px;
				}
			}
			.history-del{
				width: 30px;
				height: 32px;
				cursor: pointer;
			}
		}
		// 关键词列表
		.keyword-list{
			display: flex;
			flex-wrap: wrap;
			margin-top: 34px;
			.keyword{
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60px;
				font-size: 28px;
				color: #666666;
				border: 2px solid #eeeeee;
				border-radius: 6px;
				cursor: pointer;
				margin: 0 18px 18px 0;
				padding: 17px 25px;
			}
		}
		// 空
		.empty-history{
			font-size: 32px;
			color: #989999;
			text-align: center;
			padding: 45px 0 44px;
		}
	}
}

</style>