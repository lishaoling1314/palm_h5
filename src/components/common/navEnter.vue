<template>
	<div class="nav-enter-wrap" :class="{'nav-enter-wrap-focus': enterClick}" @mousedown="enterClick = true" @mouseup="enterClick = false" @touchstart="enterClick = true" @touchend="enterClick = false">
		<div class="nav-enter" :class="border ? 'nav-enter-border':''">
		    <p class="left-text">{{ leftText }}</p>
			<div class="right">
				<p class="right-text" v-if="rightText !== ''">{{ rightText }}</p>
				<img class="icon" v-if="enterBtn" src="../../assets/icon/more_nor@2x.png" />
			</div>
		</div>
	</div>
</template>
<script>
export default {
    data() {
        return {
			enterClick: false
        }
    },
    props: {
	    //内容
		leftText: {
			default: ''
		},
	    //内容
		rightText: {
			default: ''
		},
		//为false则隐藏底部边框
		border: {
			default: true
		},
		//显示按钮
		enterBtn: {
			default: true
		}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.nav-enter-wrap{
	width: 100%;
	cursor: pointer;
	padding: 0 25px;
	.nav-enter{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 702px;
		height: 88px;
		cursor: pointer;
		position: relative;
		.left-text{
			font-size: 32px;
			color: #323333;
		}
		.right{
			display: flex;
			justify-content:flex-end;
			align-items: center;	
			.right-text{
				font-size: 26px;
				color: #666666;
			}
			.icon{
				width: 12px;
				height: 22px;
				margin-left: 24px;
			}	
		}
	}
	.nav-enter-border{
	    border-bottom: 2px solid #eeeeee;
	}
}
.nav-enter-wrap-focus{
	background-color: #f9f9f9;
}
</style> 