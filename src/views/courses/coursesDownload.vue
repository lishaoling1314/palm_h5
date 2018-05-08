<template>
    <div class="wrap">
	    <!-- 未通过审核 -->
	    <no-study-chance v-if="noStudyChance"></no-study-chance>
        <!-- 顶部 -->
        <nav-return :title="agencysInfo.name"></nav-return>
        <p class="tips">请选择需要下载的资料</p>
        <!-- 目录 -->
		<courses-directory-list :coursesProfile="coursesProfile" :isDownloadPage="true"></courses-directory-list>
        <!-- 下载 -->
        <div class="download">
	        <!-- 全选 -->
        	<p class="all-select">
        		<img class="select-icon" :src="selectIcon[downLoadAll]" alt="选择" @click="coursesAllSelect" />
        		<span class="all-select-btn">全选</span>
                <span class="all-select-number" v-if="materialListLength > 0">已选中<span> {{ materialListLength }} </span>个文件</span>
        	</p>
        	<!-- 确认 -->
        	<p class="confirm" :class="{'btn-click':downMaterial}" @click="confirmDownLoad" @mousedown="downMaterial = true" @mouseup="downMaterial = false" @touchstart="downMaterial = true" @touchend="downMaterial = false">确认下载</p>
        </div>
    </div>
</template>
<script>
import noStudyChance from './components/noStudyChance';
import navReturn from '@/components/common/navReturn';
import coursesDirectoryList from './components/coursesDirectoryList';

import { Toast,Indicator } from 'mint-ui';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { getProductProfile, materialDownload } from '@/service/product';
import { studentLearn } from '@/service/user';
export default {
    data() { 
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	noStudyChance: false,//是否有学习资格
        	coursesId: '',//课程id
        	coursesProfile: {},//课程详情
            downMaterial: false,//下载资料
            selectIcon:[
                require('../../assets/icon/catalog_default@2x.png'),
                require('../../assets/icon/catalog_selected@2x.png')
            ]
        }
    },
    components: {
        noStudyChance,
        navReturn,
        coursesDirectoryList
    },
    computed: {
        // 课程选择情况
        ...mapState({
            coursesSelect: state => state.product.coursesSelect,
            allCourses: state => state.product.allCourses,
            materialList: state => state.product.materialList,
            materialListLength: state => state.product.materialListLength
        }),
        // 是否全选
        ...mapGetters([
           'downLoadAll'
        ])
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
        ...mapMutations([
            'SET_PRODUCT'
        ]),
    	// 获取课程信息
    	getCourseProfile: async function (){
    	    // 获取课程信息
    	    Indicator.open();
    	    let res = await getProductProfile(this.agencysInfo.id,this.coursesId);
    	    Indicator.close();
    	    if (res.errCode === 0 && res.data !== null) {
    	    	// 判断是否有学习权限
    	    	if (Number(res.data.is_read) === 0) {
	                this.noStudyChance = true;
                    return false;
    	    	}
    	        this.coursesProfile = res.data;
    	    }else{
    	        Toast('获取课程信息失败');
    	    }
    	},
        // 设置全选
        coursesAllSelect: function () {
            let result = 1;
            if (this.downLoadAll === 1) {
                result = 0;
            }
            let coursesSelect = this.coursesSelect;
            let keys = Object.keys(coursesSelect)
            // 判断是否有未选的
            keys.forEach(function(value) {
                coursesSelect[value] = result;
            })
            this.SET_PRODUCT(['coursesSelect',coursesSelect]);
            this.SET_PRODUCT(['allCourses',!this.allCourses])
        },
        // 确认下载
        confirmDownLoad: async function () {
            // 定义一个资料id空数组
            let materialArray = [];
            // 获取对应课程已选的资料id列表
            let materialList = this.materialList;
            // 获取对应列表的资料id选择情况
            let materialValues = Object.values(materialList);
            // 遍历获得的id数组
            materialValues.forEach(function(materialSelect){
                // 获取资料id选择情况的键
                let materialSelectKeys = Object.keys(materialSelect);
                // 遍历资料id数组选择情况
                materialSelectKeys.forEach(function(values){
                    if (materialSelect[values] === 1) {
                        materialArray.push(values);
                    }
                })
            })
            // 判断是否有资料id选择
            if (materialArray.length > 0) {
                // 资料下载
                let instance = Toast({
                    message: '文档正在下载中.....',
                    duration: -1
                });
                let res = await materialDownload(materialArray,1);
                instance.close();
                if (res.errCode === 0 && res.data !== null) {
                    this.saveLearn(materialArray);
                    window.open(res.data,'_blank');
                }else{
                    Toast('资料下载失败');
                }
            }else{
                Toast('您未选中任何需下载文档');
            }
        },
        // 储存学习进度
        saveLearn: async function (materialArray) {
            let res = await studentLearn(this.agencysInfo.id,this.coursesId,materialArray);
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	min-height: 100vh;
	background-color: #ffffff;
	padding-bottom: 180px;
	.tips{
		width: 100%;
		font-size: 30px;
		color: #999999;
		text-align: center;
		margin: 50px 0 60px;
	}
	// 下载
	.download{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 750px;
		height: 98px;
		border-top: 2px solid #eeeeee;
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		.all-select{
			display: flex;
			align-items: center;
			.select-icon{
				width: 34px;
				height: 34px;
                cursor: pointer;
				margin: 0 30px;
			}
			.all-select-btn{
				font-size: 34px;
				color: #333333;
                margin-right: 20px;
			}
            .all-select-number{
                font-size: 28px;
                color: #333333;
                span{
                    color: #04b2a3;
                }
            }
		}
		.confirm{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 280px;
			height: 100%;
			font-size: 34px;
			color: #ffffff;
			background-color: #04b2a3;
            cursor: pointer;
		}
	}
}
</style>