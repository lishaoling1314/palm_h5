<template>
	<div class="wrap-bg">
		<div class="courses-list">
			<courses class="courses-item" v-for="(item,key) in courseList" :key="key" :courses="item" :jump="true" :onlyName="onlyName" :showPercent="showPercent" :isDelete="isDelete"></courses>
		</div>
	</div>
</template>
<script>
import courses from '@/components/courses/courses';
export default {
    data() {
        return {

        }
    },
    components: {
		courses
    },
    props: {
	    //内容
		courseList: {
			default: []
		},
		// 不显示在读人数和级别
		onlyName: {
            default: false
		},
	    //是否显示进度条
		showPercent: {
			default: false
		},
		//是否能删除
		isDelete: {
			default: false
		}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap-bg{
	width: 750px;
	padding: 30px 0;
	.courses-list{
		background-color: #ffffff;
		padding: 0 25px;
		.courses-item{
			border-bottom: 2px solid #eeeeee;
			padding: 30px 0;
		}
	}
}
</style>