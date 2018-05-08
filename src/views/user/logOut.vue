<template>
	<div>
		<p class="log-out" :class="{'white-click': logOutClick}" @click="showLogOutsTips = true" @mousedown="logOutClick = true" @mouseup="logOutClick = false" @touchstart="logOutClick = true" @touchend="logOutClick = false">退出登录</p>
		<confirm-toast v-if="showLogOutsTips" tips="是否退出当前账号？" @confirm="logOut" @cancel="showLogOutsTips = false"></confirm-toast>
	</div>
</template>
<script>
import confirmToast from '@/components/common/confirmToast';
import { removeLocalStore } from '@/utils'

export default {
    data() {
        return {
			agencysInfo: this.$route.params.agencysInfo,// 机构信息
			showLogOutsTips: false,
			logOutClick: false
        }
    },
    components:{
        confirmToast
    },
    methods: {
    	logOut: function () {
    		removeLocalStore('userInfo');
    		this.goToOther('/mobileLogin');
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// 退出登录
.log-out{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 98px;
	font-size: 32px;
	color: #02b4a3;
	background-color: #ffffff;
	cursor: pointer;
	position: absolute;
	left: 0;
	bottom: 0;
}
</style>