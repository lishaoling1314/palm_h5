<template>
	<div class="wrap" :class="showOption? 'wrap-no-scroller':''">
	    <!-- 顶部 -->
	    <nav-return title="我的课程" :goBackToLast="false" leavePath="/studentCenter">></nav-return>
	    <!-- 下拉菜单 -->
        <div class="drop-down">
            <p class="selected" @click="showOption = !showOption">
                <span>{{ tabText[tab] }}</span>
                <img src="../../assets/icon/triangle_open@2x.png">
            </p>
            <div class="options" v-show="showOption">
                <p :class="tab === 0? 'tab-focus':''" @click="tabChange(0)">{{ tabText[0] }}</p>
                <p :class="tab === 1? 'tab-focus':''" @click="tabChange(1)">{{ tabText[1] }}</p>
                <p :class="tab === 2? 'tab-focus':''" @click="tabChange(2)">{{ tabText[2] }}</p>
                <p :class="tab === 3? 'tab-focus':''" @click="tabChange(3)">{{ tabText[3] }}</p>
                <p :class="tab === 4? 'tab-focus':''" @click="tabChange(4)">{{ tabText[4] }}</p>
                <p :class="tab === 5? 'tab-focus':''" @click="tabChange(5)">{{ tabText[5] }}</p>
            </div>
        </div>
        <div class="course-wrap">
            <!-- 遮罩 -->
            <div class="course-mask" v-if="showOption"></div>
            <!-- 课程菜单 -->
            <courses-list class="mask" v-if="coursesList.length > 0" :courseList="curCourseList" :onlyName="true" :showPercent="true"></courses-list>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';
import coursesList from '@/components/courses/coursesList';

import { Toast,Indicator } from 'mint-ui';

import { applyCourses } from '@/service/user';

export default {
    data() {
        return {
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
            coursesList: [],//课程列表
            tab: 0,//类型
			showOption: false,//显示下拉菜单
            tabText: [
                '全部',
                '申请中',
                '未通过',
                '未开始',
                '学习中',
                '已完成'
            ]
        }
    },
    components: {
        navReturn,
        coursesList
    },
    created: function () {
        let tab = this.$route.query.tab;
        if (tab !== undefined) {
            this.tab = Number(tab);
        }
        this.getApplyCourses();
    },
    computed: {
        curCourseList: function () {
            let result = [];
            switch(this.tab){
            //申请中
            case 1:
                this.coursesList.forEach(function(value){
                    if (Number(value.product_type) === 1) {
                        result.push(value);
                    }
                })
                break;
            //未通过
            case 2:
                this.coursesList.forEach(function(value){
                    if (Number(value.product_type) === 2) {
                        result.push(value);
                    }
                })
                break;
            //未开始
            case 3:
                this.coursesList.forEach(function(value){
                    if (Number(value.product_type) === 3) {
                        result.push(value);
                    }
                })
                break;
            // 学习中
            case 4:
                this.coursesList.forEach(function(value){
                    if (Number(value.product_type) === 4) {
                        result.push(value);
                    }
                })
                break;
            // 已完成
            case 5:
                this.coursesList.forEach(function(value){
                    if (Number(value.product_type) === 5) {
                        result.push(value);
                    }
                })
                break;
            default:
                result = this.coursesList;
            }
            return result;
        }
    },
    methods: {
        //获取课程信息
        getApplyCourses : async function () {
            Indicator.open();
            let res = await applyCourses(this.agencysInfo.id);
            Indicator.close();
            if (res.errCode === 0) {
                if (res.data !== null) {
                    this.coursesList = res.data;
                }else{
                    Toast('课程列表为空');
                }
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 80001){
                Toast('机构不存在');
            }else{
                Toast('获取课程列表失败');
            }
        },
        // 切换
        tabChange: function (tab) {
            this.tab = tab;
            this.goToDetail("/studentCourses", {"tab": tab})
            window.location.reload();
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
   .drop-down{
       background-color: #ffffff;
       position: relative;
       .selected{
           display: flex;
           justify-content: center;
           align-items: center;
           width: 100%;
           height: 88px;
           cursor: pointer;
           span{
               font-size: 30px;
               color: #02b4a3;
               margin-right: 10px;
           }
           img{
               width: 12px;
               height: 8px;
               margin-left: 10px;
           }
       }
       .options{
           background-color: #ffffff;
           padding: 0 30px;
           width: 100%;
           position: absolute;
           top: 88px;
           left: 0;
           z-index: 2;
           p{
               display: flex;
               justify-content: center;
               align-items: center;
               height: 78px;
               font-size: 28px;
               color: #666666;
               border-top: 1px solid #eeeeee;
               cursor: pointer;
           }
           .tab-focus{
               color: #02b4a3;
           }
       }
   }
   .course-wrap{
       position: relative;
       .course-mask{
           width: 100%;
           min-height: 100vh;
           background-color: rgba(7,13,12,0.3);
           position: absolute;
           top: 0;
           left: 0;
           z-index: 1;
       }
   }
}
.wrap-no-scroller{
    height: 100vh;
    overflow: hidden;
}
</style>