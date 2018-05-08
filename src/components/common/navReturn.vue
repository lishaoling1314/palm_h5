<template>
	<div class="nav-return" :class="border ? 'nav-return-border':''">
		<img class="icon" :class="{'icon-opacity': !goBack,'icon-opacity-click': goBackClick}" src="../../assets/icon/nav_return@2x.png" @click="backTo" @mousedown="goBackClick = true" @mouseup="goBackClick = false" @touchstart="goBackClick = true" @touchend="goBackClick = false" />
		<p class="title">{{ title }}</p>
		<p class="operate" v-if="operate !== ''" @click="navOperate">{{ operate }}</p>
		<img class="home-btns" :class="{'icon-opacity-click': goHomeClick}" v-if="goHome" src="../../assets/icon/home_btn.png" @click="goToOther('')" @mousedown="goHomeClick = true" @mouseup="goHomeClick = false" @touchstart="goHomeClick = true" @touchend="goHomeClick = false" />
	</div>
</template>
<script>
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	goBackClick: false,// 按钮点击改变透明度
        	goHomeClick: false,// 按钮点击改变透明度
        }
    },
    props: {
    	//显示返回按钮
	    goBack: {
            default: true
	    },
    	//是否返回上一页
	    goBackToLast: {
            default: true
	    },
    	//是否返回主页
	    goHome: {
            default: true
	    },
	    //不反回上一页的路径
	    leavePath: {
            default: ''
	    },
	    //标题
		title: {
			default: ''
		},
		//操作按钮
		operate: {
			default: ''
		},
		//为false则隐藏底部边框
		border: {
			default: true
		},
    },
    methods: {
		backTo: function () {
			//判断是否显示返回按钮,以防透明度为0时点击
			if (this.goBack) {
				// 判断是否返回上一页
				if (this.goBackToLast) {
					this.$router.go(-1);
				}else{
					this.goToOther(this.leavePath)
				}
			}
		},
		navOperate: function () {
			this.$emit('navOperate');
		}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.nav-return{
	width: 750px;
	height: 88px;
	background-color: #ffffff;
	position: relative;
	.icon{
		width: 16px;
		height: 30px;
		cursor: pointer;
		position: absolute;
		top: 30px;
		left: 30px;
	}
	.icon-opacity{
		opacity: 0;
	}
	.title{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750px;
		height: 88px;
		font-size: 34px;
		color: #101010;
	}
	.operate{
		min-width: 16px;
		font-size: 30px;
		color: #333333;
		cursor: pointer;
		position: absolute;
		top: 30px;
		right: 30px;
	}
	.home-btns{
		width: 44px;
		height: 44px;
		cursor: pointer;
		position: absolute;
		top: 22px;
		right: 28px;
	}
}
.nav-return-border{
    border-bottom: 2px solid #eeeeee;
}
</style> 