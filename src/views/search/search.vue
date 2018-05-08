<template>
    <div class="search">
	    <!-- 顶部 -->
    	<div class="search-top">
    		<img class="return-icon" :class="{'icon-opacity-click': goBackClick}" src="../../assets/icon/nav_return@2x.png" @click="goToOther('')" @mousedown="goBackClick = true" @mouseup="goBackClick = false" @touchstart="goBackClick = true" @touchend="goBackClick = false" />
    		<div class="search-area">
    			<img class="search-icon" src="../../assets/icon/search_gray@2x.png" alt="搜索灰色" />
    			<input class="search-input" v-model="keyWord" type="text" name="serach" placeholder="搜索老师、机构、课程" />
    			<img class="close-icon" v-if="keyWord !== ''" src="../../assets/icon/close_del@2x.png" alt="关闭" @click="keyWord = '';keyWordHistory = true" />
    		</div>
    		<p class="search-btn" @click="coursesSearch">搜索</p>
    	</div>
    	<!-- 结果列表 -->
		<courses-list v-if="agencysCourses.length > 0" :courseList="agencysCourses" v-infinite-scroll="loadMore" infinite-scroll-disabled="true" infinite-scroll-distance="10"></courses-list>
		<p v-show="loading" class="load-more">
		  <mt-spinner type="fading-circle"></mt-spinner>
		  加载中...
		</p>
    	<!-- 历史记录 -->
    	<key-word-list v-if="keyWordHistory" :historyList="historyList" :history.sync="keyWord" @search="coursesSearch" @clearHistory="clearHistory"></key-word-list>
		<!-- 搜索结果为空 -->
		<div class="empty" v-if="resultEmpty">
			<div class="empty-wrap">
				<img class="empty-icon" src="../../assets/icon/search_empty@2x.png" alt="搜索为空" />
			</div>
			<p class="empty-text">搜索结果为空</p>
		</div>
    </div>
</template>
<script>
import keyWordList from './keyWordList';
import coursesList from '@/components/courses/coursesList';

import { Toast,Indicator,InfiniteScroll  } from 'mint-ui';

import { getFilterProduct, searchsAdd } from '@/service/product';
import { getLocalStore, setLocalStore, removeLocalStore } from '@/utils';

export default {
    data() {
        return {
	        agencysInfo: this.$route.params.agencysInfo,// 机构信息
	        searchType: 3,//搜索方式默认为3(关键词搜索)
	        agencysCourses: [],// 搜索结果
	        keyWord: '',// 关键词
	        pageSize: 12,// 初始化个数
	        totalCourses: 0,//课程总数
	        keyWordHistory: true,//关键词列表
	        historyList: [],//历史关键词
	        resultEmpty: false,//搜索结果为空
	        goBackClick: false,//返回上一页
	        loading: false
        }
    },
    components: {
    	coursesList,
		keyWordList
    },
    created: function () {
    	// 获取本地历史记录字符串
    	let historyStr = getLocalStore('keyWordList');
    	// 判断是否为空
    	if (historyStr !== null) {
    		// 不为空获取关键词数组
    		this.historyList = historyStr.split(',');
    	}
    	// 获取搜索类型
    	let type = this.$route.query.type;
    	if (Number(type) === 1 || Number(type) === 2) {
    		this.searchType = type;
    		this.coursesSearch();
    	}
    },
    methods: {
    	// 课程搜索
        coursesSearch: async function () {
        	// 判断关键词
        	if (this.keyWord === '' && this.searchType === 3) {
	            Toast('关键词不能为空~');
	            return false;
        	}else{
        		if (this.keyWord !== '') {
        			// 储存关键词
        			this.saveKeyWord();
        			searchsAdd(this.keyWord);
        		}
        	}
        	// 显示loading
        	 Indicator.open('正在搜索...');
        	// 机构id,页码,显示个数,关键词(默认页码1,个数6)
        	let res = await getFilterProduct(this.searchType,this.agencysInfo.id,1,6,this.keyWord);
        	Indicator.close();
        	// 搜索完成
        	if (res.errCode === 0) {
        		// 隐藏搜索历史
        		this.keyWordHistory = false;
				this.agencysCourses = res.data.list;
				this.totalCourses = res.data.total;
        	}else if(res.errCode === 20011){
        		// 隐藏搜索历史
        		this.keyWordHistory = false;
        		// 显示为空
	        	this.resultEmpty = true;
	        	// 清空结果
	        	this.agencysCourses = [];
        	}else{
        		Toast('搜索失败~');
        	}
        },
        // 加载更多
        loadMore: async function () {
        	// 判断是否正在加载，防止无限加载,且条数未到最大的获取量
        	if(!this.loading && this.agencysCourses.length < this.totalCourses){
	        	// 显示底部loding
	        	this.loading = true;
	        	// 机构id,页码,显示个数,关键词(默认页码1,个数6)
	        	let res = await getFilterProduct(this.searchType,this.agencysInfo.id,1,this.pageSize,this.keyWord);
	        	// 搜索完成
	        	if (res.errCode === 0) {
	        		// 储存数据
					this.agencysCourses = res.data.list;
					this.totalCourses = res.data.total;
					// pageSize加6
					this.pageSize = this.pageSize + 6;
	        	}else{
	        		Toast('加载失败~');
	        	}
	        	// 隐藏loading
				this.loading = false;
        	}else{
        		if (this.agencysCourses.length === this.totalCourses) {
	        		Toast('没有更多了~');
        		}
        	}
        },
	    //储存关键词
	    saveKeyWord: function () {
	    	let keyWord = this.keyWord;
	    	// 获取已有数组
	    	let historyArray = this.historyList;
	    	// 获取本地历史记录字符串
	    	let historyStr;
	    	if (historyArray.length > 0) {
	    		historyStr = historyArray.join(',');
	    	}else{
	    		historyStr = '';
	    	}
	    	//判断当前搜索词是否已经搜索过
	    	if (historyStr !== '' && historyStr.indexOf(keyWord) >= 0) {
	    	    //搜索过则进行位置调整
	    	    for (let i = 0; i < historyArray.length; i++) {
	    	        if (keyWord === historyArray[i]) {
	    	            //判断当前搜索词是否为最新
	    	            if (i !== 0) {
	    	                //不为最新则从原有位置移除
	    	                historyArray.splice(i, 1);
	    	                //并移到第一位
	    	                historyArray.unshift(keyWord);
	    	            }
	    	        }
	    	    }
	    	} else {
	    	    //判断当前数目是否已到达10条
	    	    if (historyArray.length < 10) {
	    	        //未到10条则开头插入新关键词
	    	        historyArray.unshift(keyWord);
	    	    } else {
	    	        //已到10条则删除最后一条,并插入新的关键词
	    	        historyArray.splice(9, 1);
	    	        historyArray.unshift(keyWord);
	    	    }
	    	}
	    	// 储存新的关键词信息
	    	setLocalStore('keyWordList',historyArray.join(','));
	    	// 更新关键词
	    	this.historyList = historyArray;
	    },
	    // 清空历史搜索记录
	    clearHistory: function () {
            removeLocalStore('keyWordList');
            // 更新关键词
            this.historyList = [];
	    }
    },
    watch: {
    	// 关键词为空,初始化参数
    	keyWord: function () {
    		if (this.keyWord === '') {
    			// 显示搜索历史
    			this.keyWordHistory = true;
    			// 清空已搜索结果
    			this.agencysCourses = [];
    			// 隐藏为空
    			this.resultEmpty = false;
    		}
    	},
    	// 路由刷新
    	$route: function () {
    		window.location.reload();
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search{
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	// 顶部
	.search-top{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 750px;
		height: 88px;
		background-color: #ffffff;
		border-bottom: 2px solid #eeeeee;
		padding: 0 30px;
		position: relative;
		.return-icon{
			width: 16px;
			height: 30px;
			cursor: pointer;
		}
		.search-area{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 554px;
			height: 54px;
			background-color: #eeeeee;
			border-radius: 10px;
			.search-icon{
				width: 28px;
				height: 28px;
				margin: 0 25px;
			}
			.search-input{
				flex: 1;
				height: 50px;
				font-size: 26px;
				color: #333333;
				background-color: #eeeeee;
				border: none;
			}
			.search-input::placeholder {
			    font-size: 26px;
			    color: #999999;
			}
			.search-input:focus {
			    outline: none;
			}
			.close-icon{
				width: 26px;
				height: 26px;
				cursor: pointer;
				margin: 0 20px;
			}
		}
		.search-btn{
			font-size: 28px;
			color: #02b4a3;
			cursor: pointer;
		}
	}
	//加载更多
	.load-more{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: -10px;
		padding-bottom: 20px;
	}
	//搜索结果为空
	.empty{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		.empty-wrap{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 214px;
			height: 214px;
			background-color: #ffffff;
            border-radius: 50%;
            .empty-icon{
            	width: 104px;
            	height: 88px;
            }
		}
		.empty-text{
			font-size: 32px;
			color: #666666;
			margin-top: 40px;
		}
	}
}
</style>