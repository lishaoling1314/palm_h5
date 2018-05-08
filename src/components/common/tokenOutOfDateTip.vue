<template>
    <div class="wrap">
        <div class="content-wrap">
        	<p class="tips">未登录或者登陆信息已过期，请重新登陆</p>
        	<p class="login" :class="{'btn-click':btnClick}" @click="goToLogin" @mousedown="btnClick = true" @mouseup="btnClick = false" @touchstart="btnClick = true" @touchend="btnClick = false">去登陆</p>
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
        	btnClick: false
        }
    },
    methods: {
    	...mapMutations([
    	    'SET_COMMON'
    	]),
    	goToLogin: function () {
    		// 隐藏提示
    		this.SET_COMMON(['tokenOutDate',false]);
    		// 跳转到登陆页
    		this.$router.push({path: '/' + this.$route.params.agencysNamePy + '/mobileLogin'});
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
	z-index: 9000;
	.content-wrap{
		width: 590px;
		background-color: #ffffff;
		border-radius: 10px;
		padding: 84px 43px 74px;
		.tips{
			font-size: 34px;
			color: #101010;
			text-align: center;
		}
		.login{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 232px;
			height: 78px;
		    font-size: 32px;
			color: #ffffff;
			background-color: #02b4a3;
			border-radius: 10px;
			cursor: pointer;
			margin: 56px auto 0 auto;
		}
	}
}
</style>