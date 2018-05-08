<template>
    <div class="apply-progress">
    	<div class="top">
    		<p class="line"></p>
    		<p class="title">申请进度</p>
    	</div>
    	<apply-status class="apply-status" :pendStatus="Number(coursesProfile.pend_status)" :pendRemarks="coursesProfile.pend_remarks" pendInit="待审核"></apply-status>
    </div>
</template>
<script>
import applyStatus from '@/views/account/components/applyStatus';

export default {
    data() {
        return {

        }
    },
    components: {
    	applyStatus
    },
    props: {
    	//课程详情
	    coursesProfile: {
	    	type: Object,
            default: function () {
                return {
					course_list: []
                }
            }
	    }
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.apply-progress{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 750px;
	background-color: #ffffff;
	padding-bottom: 42px;
	.top{
		display: flex;
		align-items: center;
		width: 750px;
		padding-top: 25px;
		.line{
			width: 4px;
			height: 28px;
			background-color: #02b4a3;
			border-radius: 2px;
			margin: 0 26px;
		}
		.title{
			font-size: 28px;
			color: #333333;
		}
	}
	.apply-status{
		margin-top: 38px;
	}
}
</style>