<template>
    <div class="wrap">
        <nav-return title="课程详情页"></nav-return>
		<!-- 课程介绍 -->
    	<courses-introduce :coursesProfile="coursesProfile" :fromName="fromName" @favSuccess="coursesProfile.is_fav = 1" @favFail="coursesProfile.is_fav = 0"></courses-introduce>
    	<!-- 申请进度 -->
    	<apply-progress class="apply-progress" :coursesProfile="coursesProfile" v-if="Number(coursesProfile.is_apply) === 1"></apply-progress>
    	<!-- 课程详细信息切换tab -->
        <div class="nav-tab" ref="navTab">
        	<p :class="tab === 1? 'nav-tab-focus':''" @click="tab = 1">商品详情</p>
        	<p :class="tab === 2? 'nav-tab-focus':''" @click="tab = 2">课程详情</p>
        	<p :class="tab === 3? 'nav-tab-focus':''" @click="tab = 3">课程目录</p>
        </div>
        <div class="nav-tab tab-position" v-if="tabPosition">
            <p :class="tab === 1? 'nav-tab-focus':''" @click="tab = 1">商品详情</p>
            <p :class="tab === 2? 'nav-tab-focus':''" @click="tab = 2">课程详情</p>
            <p :class="tab === 3? 'nav-tab-focus':''" @click="tab = 3">课程目录</p>
        </div>
        <!-- 商品详情 -->
        <goods-detail v-show="tab === 1" :coursesProfile="coursesProfile"></goods-detail>
        <!-- 课程详情 -->
        <courses-detail v-show="tab === 2" :coursesProfile="coursesProfile"></courses-detail>
        <!-- 课程目录 -->
        <courses-directory-list v-show="tab === 3" :coursesProfile="coursesProfile"></courses-directory-list>
        <!-- 课程操作 -->
        <courses-operate @applySuccess="applySuccess" :coursesProfile="coursesProfile"></courses-operate>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';
import coursesIntroduce from './components/coursesIntroduce';
import applyProgress from './components/applyProgress';
import goodsDetail from './components/goodsDetail';
import coursesDetail from './components/coursesDetail';
import coursesDirectoryList from './components/coursesDirectoryList';
import coursesOperate from './components/coursesOperate';

import { Toast,Indicator } from 'mint-ui';

import { mapState } from 'vuex';
import { getProductProfile } from '@/service/product';

export default {
    data() {
        return {
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
            coursesId: '0',//课程id
            coursesProfile: {},//课程详情
			tab: 1,//当前详情tab
            tabPosition: false,//tab固定顶部
            navTabOffSetTop: 0,//tab框距离顶部距离
            fromName: 'null'//前一个路由名字
        }
    },
    // 进入路由获取前一个路由的信息
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.fromName = String(from.name);
        })
    },
    //离开路由删除store信息
    beforeRouteLeave(to, from, next) {
        window.removeEventListener('scroll',this.handleScroll);
        next();
    },
    components: {
        navReturn,
    	coursesIntroduce,
    	applyProgress,
    	goodsDetail,
    	coursesDetail,
    	coursesDirectoryList,
    	coursesOperate
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
    mounted: function () {
        window.addEventListener('scroll', this.handleScroll);
    },
    computed: {
        // app距离顶部高度
        ...mapState({
            appOffSetTop: state => state.common.appOffSetTop
        })
    },
    methods: {
        // 监听滚动
        handleScroll: function  () {
            // navTab标签距离视图顶部的高
            // 若在pc需减去appOffSetTop高度,移动端则appOffSetTop为零
            let navTabOffSetTop = this.$refs.navTab.offsetTop;
            // 滚动高度
            let scrollTop = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) - Number(this.appOffSetTop);
            // 判断是否已经固定
            if (this.tabPosition) {
                // 已固定判断滚动条是小于等于tab距离顶部的高度
                if (scrollTop <= this.navTabOffSetTop) {
                    // 是则取消固定
                    this.tabPosition = false;
                }
            }else{
                if(scrollTop > navTabOffSetTop){
                    // 若为固定,则设为固定
                    this.tabPosition = true;
                    // 储存对应高度
                    this.navTabOffSetTop = navTabOffSetTop;
                }
            }
        },
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
        // 申请报读成功
        applySuccess: function () {
            // 申请状态改为已申请
            this.coursesProfile.is_apply = 1;
            // 审核状态改为对应状态
            this.coursesProfile.pend_status = 1;
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
    min-height: 100vh;
    position: relative;
	.apply-progress{
		margin-top: 20px;
	}
	.nav-tab{
		display: flex;
		width: 750px;
		height: 88px;
		border: 2px solid #eeeeee;
		background-color: #ffffff;
		margin-top: 20px;
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
    .tab-position{
        margin-top: 0;
        position: fixed;
        top: 0;
    }
}
</style>