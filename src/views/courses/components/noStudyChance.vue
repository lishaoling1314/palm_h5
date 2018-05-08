<template>
    <div class="wrap">
        <div class="content-wrap">
        	<p class="tip">暂未获得学习当前课程的权限</p>
        	<p class="leave" @click="goToCrouses">去申请</p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo// 机构信息
        }
    },
    props: [
	    'tipText',
	    'btnText'
    ],
    methods: {
    	goToCrouses: function () {
    		// 跳转到课程详情页
    		this.$router.push({path: '/' + this.agencysInfo.name_py + '/coursesInfo',query:{'courses': this.$route.query.courses}});
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgba(7,13,12,0.3);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	.content-wrap{
		width: 590px;
		background-color: #ffffff;
		border-radius: 10px;
		padding: 84px 43px 74px;
		.tip{
			font-size: 34px;
			font-weight: 600;
			color: #101010;
			text-align: center;
		}
		.leave{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 232px;
			height: 78px;
		    font-size: 32px;
			font-weight: 600;
			color: #ffffff;
			background-color: #02b4a3;
			border-radius: 10px;
			cursor: pointer;
			margin: 56px auto 0 auto;
		}
	}
}
</style>