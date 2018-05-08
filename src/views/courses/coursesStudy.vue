<template>
    <div class="wrap" :class="curImage !== '' || tab === 2? 'wrap-no-scroller':''" @touchstart.stop="hideTalkInput">
        <!-- 未通过审核 -->
        <no-study-chance v-if="noStudyChance"></no-study-chance>
        <!-- 顶部 -->
        <nav-return :title="agencysInfo.name"></nav-return>
        <!-- 视屏 -->
    	<video class="video" v-show="coursesVideo.material_url !== '' && curImage === ''" ref="video" controls="controls" :src="coursesVideo.material_url" autoplay="autoplay" controlsList="nodownload" @loadstart="playStart" @pause="saveProgress" @ended="playEnd" @contextmenu.prevent="videoRight">您的浏览器不支持 video 标签。</video>
		<!-- 信息切换tab -->
	    <div class="nav-tab">
	    	<p :class="tab === 1? 'nav-tab-focus':''" @click="tab = 1;showTalk = false;">课程目录</p>
	    	<p :class="tab === 2? 'nav-tab-focus':''" @click="tab = 2">课程提问</p>
	    </div>
	    <!-- 课程目录 -->
	    <div class="courses-directory" v-show="tab === 1">
		    <courses-directory-list :coursesProfile="coursesProfile"></courses-directory-list>
	    </div>
	    <!-- 课程提问 -->
	    <div class="course-question" v-show="tab === 2" ref="courseQuestion">
		    <template v-for="item in questionList">
		    	<div class="content-item student-content-item" v-if="Number(item.role) === 0" >
			    	<div class="message" v-if="Number(item.type) === 1">
			    		<p class="user-name" style="text-align:right;">{{ item.nickname }}</p>
			    		<p class="content student-content">{{ item.content }}</p>
			    	</div>
			    	<div class="message" v-else>
			    	    <p class="user-name" style="text-align:right;">{{ item.nickname }}</p>
			    	    <talk-image :src="item.content" :type="0" @click.native="curImage = item.content"></talk-image>
			    	</div>
			    	<div class="user-img-wrap">
			    		<img class="user-img" v-if="item.img_url !== null && item.img_url !== undefined && item.img_url !== ''" :src="item.img_url" alt="学生头像" />
			    		<img class="empty-head" v-else src="../../assets/icon/no_head.png" alt="学生头像" />
			    	</div>
		    	</div>
		    	<div class="content-item" v-else>
			    	<div class="user-img-wrap">
			    		<img class="user-img" v-if="item.img_url !== null && item.img_url !== undefined && item.img_url !== ''"  :src="item.img_url" alt="老师头像" />
			    		<img class="empty-head" v-else src="../../assets/icon/no_head.png" alt="老师头像" />
			    	</div>
			    	<div class="message" v-if="Number(item.type) === 1">
			    		<p class="user-name">{{ item.nickname }}</p>
			    		<p class="content teacher-content">{{ item.content }}</p>
			    	</div>
			    	<div class="message" v-else>
				    	<p class="user-name">{{ item.nickname }}</p>
				    	<talk-image :src="item.content" :type="1" @click.native="curImage = item.content"></talk-image>
			    	</div>
		    	</div>
		    </template>
	    </div>
        <!-- 下载 -->
        <div class="study-btn" v-if="!showTalk">
        	<p class="question" :class="{'white-click':makeQuestion}" @click.stop="showTalkInput" @mousedown="makeQuestion = true" @mouseup="makeQuestion = false" @touchstart="makeQuestion = true" @touchend="makeQuestion = false">
	        	<img src="../../assets/icon/tab_question@2x.png" alt="发起提问">
	        	<span>发起提问</span>
        	</p>
        	<p class="download" :class="{'btn-click':downMaterial}" @click="goToDetail('/coursesDownload',{'courses':coursesId})" @mousedown="downMaterial = true" @mouseup="downMaterial = false" @touchstart="downMaterial = true" @touchend="downMaterial = false">
	        	<img src="../../assets/icon/tab_download@2x.png" alt="下载">
	        	<span>下载资料</span>
        	</p>
        </div>
        <!-- 发起提问 -->
        <div class="make-talk" v-if="showTalk">
	        <input type="file" ref="image" accept="image/*" hidden @change="uploadTalk(1)" />
        	<img class="talk-icon" src="../../assets/icon/talk.png" alt="发起提问" @click="selectImage" />
        	<input class="talk-input" v-model="content" type="text" name="talk" @keyup.enter="uploadTalk(2)" />
        	<p class="talk-btn" @click="uploadTalk(2)">发送</p>
        </div>
        <!-- 图片放大 -->
        <open-image v-if="curImage !== ''" :img="curImage" @hideImage="curImage = ''"></open-image>
    </div>
</template>
<script>
import noStudyChance from './components/noStudyChance';
import navReturn from '@/components/common/navReturn';
import coursesDirectoryList from './components/coursesDirectoryList';
import talkImage from './components/talkImage';
import openImage from './components/openImage';

import { Toast,Indicator } from 'mint-ui';

import { mapState } from 'vuex';
import { getProductProfile } from '@/service/product';
import { getCourseQuestion, addCourseQuestion, studentLearn } from '@/service/user';
import { getLocalStore, setLocalStore } from '@/utils';
export default {
    data() { 
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
			tab: 1,
        	noStudyChance: false,//是否有学习资格
        	coursesId: '',//课程id
        	coursesProfile: {},//课程详情
        	questionList: [],//课程提问
			showTalk: false,//显示输入框
			curImage: '',//提问的图片
			content: '',//输入框内容
			makeQuestion: false,//发起提问
			downMaterial: false,//下载资料
        }
    },
    components: {
        noStudyChance,
        navReturn,
        coursesDirectoryList,
        talkImage,
        openImage
    },
    created: function () {
        // 获取课程id
        let coursesId = this.$route.query.courses;
        if (coursesId !== undefined) {
        	// 判断是否显示问答框
        	let tab = this.$route.query.tab;
        	if (Number(tab) === 2) {
				this.tab = 2;
        	}
            this.coursesId = coursesId;
            // 获取课程信息
            this.getCourseProfile();
            // 获取课程提问
            this.courseQuestionList();
        }else{
            Toast('获取课程信息失败');
        }
    },
    computed:{
    	// 视频链接
    	...mapState({
    	    coursesVideo: state => state.product.coursesVideo
    	})
    },
    methods: {
    	// 获取课程信息
    	getCourseProfile: async function (){
    	    // 获取课程信息
    	    Indicator.open();
    	    let res = await getProductProfile(this.agencysInfo.id,this.coursesId);
    	    Indicator.close();
    	    if (res.errCode === 0 && res.data !== null) {
    	    	let data = res.data;
    	    	// 判断是否有学习权限
    	    	if (Number(res.data.is_read) === 0) {
	                this.noStudyChance = true;
                    return false;
    	    	}
    	        this.coursesProfile = res.data;
    	    }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
    	        Toast('获取课程信息失败');
    	    }
    	},
    	// 获取课程提问
    	courseQuestionList: async function () {
    		let res = await getCourseQuestion(this.agencysInfo.id,this.coursesId);
    		if (res.errCode === 0) {
                if (res.data !== null) {
                	// 获取原有信息长度
                	let oldLength = this.questionList.length;
                	let newLength = res.data.length;
                	// 赋值
                	this.questionList = res.data;
                	// 有新消息则滚动到底部
                	if (oldLength !== newLength) {
	                	this.scrollToBottom();
                	}
                }
    		}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
    			Toast('获取课程提问失败');
    		}
    	},
    	// 视频开始播放时
    	playStart: function () {
            // 获取本地储存信息
            let videoSave = getLocalStore('videoSave');
            // 判断是否有已储存信息
            if (videoSave !== null) {
            	videoSave = JSON.parse(videoSave);
            	if (videoSave[this.coursesVideo.id] !== undefined) {
            		let _video = this.$refs.video;
            		_video.currentTime = videoSave[this.coursesVideo.id];
            	}
            }
    	},
    	// 储存播放进度
    	saveProgress: function () {
    		let _video = this.$refs.video;
    		if (_video === undefined) {
    			return false;
    		}
    		// 获取当前暂停秒数
    		let currentTime = _video.currentTime;
    		// 获取本地储存信息
    		let videoSave = getLocalStore('videoSave');
    		// 判断是否为空
    		if (videoSave === null) {
    			videoSave = {};
    		}else{
    			videoSave = JSON.parse(videoSave);
    		}
    		// 储存对应视频播放进度
    		videoSave[this.coursesVideo.id] = currentTime;
    		setLocalStore('videoSave',videoSave);
    	},
    	// 播放结束
    	playEnd: async function () {
    		// 获取本地储存信息
    		let videoSave = getLocalStore('videoSave');
    		// 删除已储存信息
    		if (videoSave !== null) {
    			videoSave = JSON.parse(videoSave);
    			if (videoSave[this.coursesVideo.id] !== undefined) {
    				delete videoSave[this.coursesVideo.id];
    			}
    			setLocalStore('videoSave',videoSave);
    		}
    		// 储存学习进度
			let res = await studentLearn(this.agencysInfo.id,this.coursesId,[this.coursesVideo.id],this.coursesVideo.lesson_id);
    	},
    	// 显示输入框,并添加事件监听
    	showTalkInput: function () {
    		let _this = this;
    		this.tab = 2;
            this.showTalk = true;
    	},
    	// 隐藏输入框
    	hideTalkInput: function (e){
    		if (this.showTalk) {
				let targetClassName = e.target.className;
		   		if (targetClassName !== 'make-talk' && targetClassName !== 'talk-icon' && targetClassName !== 'talk-input' && targetClassName !== 'talk-btn') {
		   			// 隐藏输入框
		   			this.showTalk = false;
		   		}
    		}
    	},
    	// 选择图片
    	selectImage: function () {
			this.$refs.image.click();
    	},
    	// 提交问答
    	uploadTalk: async function (type) {
    		let content = '';
    		let imgFile = '';
    		// 判断是传文字还是图片
    		if (type === 1) {
                imgFile = this.$refs.image.files[0];
    		}else{
    			content = this.content;
    		}
    		Indicator.open();
			let res = await addCourseQuestion(this.agencysInfo.id,this.coursesId,content,imgFile);
			Indicator.close();
			if (res.errCode === 0) {
                this.questionList = res.data;
                this.content = '';
                this.$refs.image.value = '';
                // 滚动到底部
                this.scrollToBottom();
			}else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
                Toast('提问失败');
			}
    	},
    	// 聊天框到底部
    	scrollToBottom: function () {
			// 获取聊天框
			let courseQuestion = this.$refs.courseQuestion;
			// 滚动到底部
			this.$nextTick(() => {
		    	courseQuestion.scrollTop = courseQuestion.scrollHeight;
			})
    	},
		// 右键事件
		videoRight: function () {
			return false;		
		}
    },
    watch: {
		tab: function () {
			// 滚动到底部
			this.scrollToBottom();
			// 设置定时轮询
	        let interval = setInterval(() => {
	            if (this.tab === 2 && this.$route.name === 'coursesStudy') {
	            	// 获取课程提问
	            	this.courseQuestionList();
	            }else{
	            	// 清除定时器
	            	clearInterval(interval);
	            }
	        }, 10000)
		}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	min-height: 100vh;
	background-color: #ffffff;
	position: relative;
	// 视频
	.video{
		width: 750px;
		height: 422px;
		margin-bottom: 20px;
	}
	video::-webkit-media-controls-enclosure {
	    overflow:hidden;
	}

	video::-webkit-media-controls-panel {
	    width: calc(100% + 35px); 
	}
	// 切换
	.nav-tab{
		display: flex;
		width: 750px;
		height: 88px;
		border: 1px solid #eeeeee;
		background-color: #ffffff;
		p{
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			height: 88px;
			font-size: 30px;
			color: #333333;
			cursor: pointer;
		}
		.nav-tab-focus{
			color: #02b4a3;
			border-bottom: 4px solid #02b4a3;
		}
	}
	// 课程目录
	.courses-directory{
	    background-color: #ffffff;
	    padding-top: 40px;
	    // 排序
	    .courses-sort{
	        width: 170px;
	        height: 64px;
	        font-size: 32px;
	        color: #333333;
	        background-color: #f2f4f4;
	        border-radius: 10px;
	        margin: 0 0 55px 40px;
	        padding: 14px 37px;
	    }
	}
	// 课程提问
	.course-question{
		height: calc(100vh - 598px); 
		overflow-y: scroll;
		padding: 76px 26px 200px 26px;
		.content-item{
			display: flex;
			margin-bottom: 56px;
			.user-img-wrap{
			    width: 86px;
			    height: 86px;
			    border-radius: 50%;
			    overflow: hidden;
			    cursor: pointer;
			    position: relative;
			    .user-img{
			        width: 86px;
			        height: 86px;
			    }
			    .empty-head{
			    	width: 86px;
			    	height: 86px;
			    	border-radius: 50%;
			    	border: 2px solid #eee;
			    	position: absolute;
			    	top: 0;
			    	left: 0;
			    }
			}
			.message{
				margin: 0 40px;
				position: relative;
				// 用户名
				.user-name{
					font-size: 24px;
					color: #666666;
					margin-bottom: 10px;
				}
				// 信息框
				.content{
					max-width: 470px;
					min-height: 80px;
					font-size: 32px;
					color: #070d0c;
					border-radius: 4px;
					padding: 24px 27px;
				}
				// 学生信息框
				.student-content{
					background-color: #ccf0ed;
					border: 2px solid #04b2a3;
				}
				.student-content::before {
				    content: " ";
				    position: absolute;
				    top: 41px;
				    right: -28px;
				    border-width: 14px;
				    border-style: solid;
				    border-color: transparent transparent transparent #04b2a3;
				}
				.student-content::after {
				    content: " ";
				    position: absolute;
				    top: 41px;
				    right: -26px;
				    border-width: 14px;
				    border-style: solid;
				    border-color: transparent transparent transparent #ccf0ed;
				}
				// 老师信息框
				.teacher-content{
					background-color: #f6f6f6;
					border: 2px solid #bdbdbd;
				}
				.teacher-content::before {
				    content: " ";
				    position: absolute;
				    top: 41px;
				    left: -28px;
				    border-width: 14px;
				    border-style: solid;
				    border-color: transparent #999797 transparent transparent;
				}
				.teacher-content::after {
				    content: " ";
				    position: absolute;
				    top: 41px;
				    left: -26px;
				    border-width: 14px;
				    border-style: solid;
				    border-color: transparent #f6f6f6 transparent transparent;
				}
			}
		}
		.student-content-item{
			justify-content: flex-end;
		}
	}
	// 按钮
	.study-btn{
		display: flex;
		width: 750px;
		height: 98px;
		border-top: 2px solid #eeeeee;
		position: fixed;
		bottom: 0;
		p{
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			font-size: 30px;
			font-weight: 600;
			color: #ffffff;
			background-color: #04b2a3;
			cursor: pointer;
			img{
				width: 29px;
				height: 29px;
				margin-right: 7px;
			}
		}
		.question{
			background-color: #ffffff;
			span{
				color: #04b2a3;
				margin-left: 7px;
			}
		}
	}
	// 发起提问
	.make-talk{
		display: flex;
        justify-content: space-between;
        align-items: center;
		width: 750px;
		height: 98px;
		border: 2px solid #d7d7d7;
		background-color: #f2f5f5;
		padding: 0 24px;
		position: fixed;
		bottom: 0;
		z-index: 1;
		.talk-icon{
			width: 46px;
			height: 38px;
			cursor: pointer;
		}
		.talk-input{
			width: 530px;
			height: 70px;
			font-size: 32px;
			color: #323333;
			padding: 0 20px;
			border: 2px solid #d7d7d7;
			border-radius: 10px;
		}
		.talk-btn{
			font-size: 32px;
			color: #02b4a3;
			line-weight: 600;
			cursor: pointer;
		}

	}
}
.wrap-no-scroller{
	max-height: 100vh;
	overflow-y: hidden;
}
</style>