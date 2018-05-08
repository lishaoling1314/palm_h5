<template>
    <div class="agencys-info">
    	<img class="logo" :src="agencysInfo.logo_url" />
		<p class="name">{{ agencysInfo.name }}</p>
    </div>
</template>
<script>
export default {
    data() {
        return {
        	agencysInfo: {},//机构信息
        }
    },
    created: function () {
    	// 获取机构信息
    	this.agencysInfo = this.$route.params.agencysInfo;
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.agencys-info{
	display: flex;
	align-items: center;
	width: 670px;
	height: 164px;
	background-color: #f2f4f4;
	border-radius: 10px;
	.logo{
		width: 126px;
		height: 126px;
		border-radius: 100px;
		margin: 0 26px 0 78px;
	}
	.name{
		font-size: 34px;
		color: #333333;
	}
}
</style>