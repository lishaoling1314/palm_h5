<template>
    <div class="courses-directory">
	    <div class="courses-directory-item" v-for="(item,key) in coursesDirectoryList.course_list">
	    	<p class="courses-sort" v-if="!isDownloadPage">课程{{ key | numberToChinese }}</p>
	    	<courses-directory :coursesDirectory="item" :select="isDownloadPage" :isRead="coursesProfile.is_read"></courses-directory>
	    </div>
    </div>
</template>
<script>
import coursesDirectory from './coursesDirectory';

import { Toast,Indicator } from 'mint-ui';

import { mapMutations } from 'vuex';
import { getCourseLesson } from '@/service/product';
export default {
    data() {
        return {
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
			coursesDirectoryList: []//课程目录
        }
    },
    components: {
    	coursesDirectory
    },
    props: {
        //课程详情
        coursesProfile: {
            type: Object,
            default: function () {
                return {
                    id: undefined
                }
            }
        },
        //是否为下载页
        isDownloadPage:{
            default: false
        }
    },
    created: function () {
    	// 判断是否有课程id
        if (this.coursesProfile.id !== undefined) {
            this.coursesId = coursesId;
			this.getCourseDirectory();
        }
    },
    methods: {
        ...mapMutations([
            'SET_PRODUCT'
        ]),
    	// 获取课程目录
        getCourseDirectory: async function () {
        	// 获取课程目录
        	Indicator.open();
            let type = 0;
            if (this.isDownloadPage) type = 1;
            // 详情页无需传token,学习页和下载页需要
            let routeName = this.$route.name;
            let from = 2;
            if (routeName === 'coursesInfo') {
                from = 1;
            }
        	let res = await getCourseLesson(this.agencysInfo.id,this.coursesProfile.id,type,from);
        	Indicator.close();
        	// 判断结果
        	if (res.errCode === 0 &&　res.data !== null) {
                this.coursesDirectoryList = res.data;
                this.getFirstMaterial();
                // 判断是否有资料
                if (this.$route.name === 'coursesDownload' && Number(this.coursesDirectoryList.material_total) === 0) {
                    Toast("当前课程无资料下载");
                }
                let coursesSelect = {};
                // 设置所有课程默认为未选
                this.coursesDirectoryList.course_list.forEach(function(value){
                    coursesSelect[value.course_id] = 0;
                })
                this.SET_PRODUCT(['coursesSelect',coursesSelect]);
        	}else if(res.data === null){
        		Toast('暂无课程目录');
        	}else{
        		Toast('获取课程目录失败');
        	}
        },
        // 获取第一个视频资料
        getFirstMaterial: function () {
            let allMaterial = [];
            let courseList = this.coursesDirectoryList.course_list;
            // 遍历数组
            courseList.forEach(function(courseInfo){
                let lessonList = courseInfo.lesson_list;
                lessonList.forEach(function(chapter){
                    // 判断大章是否有资料
                    if (chapter.material.length > 0) {
                        // 获取章节资料
                        chapter.material.forEach(function(chapterMaterial){
                            if (Number(chapterMaterial.type) === 2) {
                                allMaterial.push(chapterMaterial);
                            }
                        })
                    }
                    // 遍历小节
                    chapter.child.forEach(function(section){
                        section.material.forEach(function(sectionMaterial){
                            if (Number(sectionMaterial.type) === 2) {
                                allMaterial.push(sectionMaterial);
                            }
                        })
                    })
                })
            });
            //设置第一个视频
            if (allMaterial.length > 0) {
                this.SET_PRODUCT(['coursesVideo',allMaterial[0]]);
            }
        }
    },
    watch: {
        // 监听课程信息变化
        coursesProfile: function () {
            // 判断是否有课程id
            if (this.coursesProfile.id !== undefined) {
                this.getCourseDirectory();
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.courses-directory{
    background-color: #ffffff;
    padding-bottom: 100px;
    // 排序
    .courses-directory-item{
    	padding-top: 40px;
    	.courses-sort{
    	    width: 180px;
    	    height: 64px;
    	    font-size: 32px;
    	    color: #333333;
    	    background-color: #f2f4f4;
    	    border-radius: 10px;
            text-align: center;
    	    margin: 0 0 55px 25px;
    	    padding: 14px 37px;
    	}
    }
}
</style>