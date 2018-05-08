<template>
	<div class="web-wrap">
		<transition enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
			<div class="web-top" v-show="showTop">
				<div class="content">
					<div class="content-tips">
						<img src="./assets/icon/code@2x.png">
						<p>使用手机访问效果更佳</p>
					</div>
					<span ref="qrCode"></span>
				</div>
			</div>
		</transition>
		<div id="app" ref="app">
		    <router-view />
		    <token-out-of-date-tip v-if="tokenOutDate"></token-out-of-date-tip>
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import tokenOutOfDateTip from './components/common/tokenOutOfDateTip';
import QRCode from 'qrcodejs2';

export default {
	data() {
	    return {
	    	showTop: false,// 显示二维码
	    	qrcode: undefined
	    }
	},
	components: {
		tokenOutOfDateTip
	},
	mounted: function () {
		// 监听滚动事件
	    window.addEventListener('scroll', this.handleScroll);
	    // 生成二维码
	    this.creteQrCode();
	    // 显示提示
	    this.showTop = true;
	},
	computed: {
	    // token过期
	    ...mapState({
	        tokenOutDate: state => state.common.tokenOutDate
	    })
	},
	methods: {
		...mapMutations([
		    'SET_COMMON'
		]),
		// 生成二维码
		creteQrCode:function () {
			let href = window.location.href;
			if (this.qrcode === undefined) {
				// 生成二维码
				this.qrcode = new QRCode(this.$refs.qrCode, {
				    text: href,
				    width: 115,
				    height: 115,
				    colorDark: "#000000",
				    colorLight: "#ffffff",
				    correctLevel: QRCode.CorrectLevel.H
				});
			}else{
				this.qrcode.makeCode(href);
			}
		},
		// 监听app距离浏览器顶部高度
		handleScroll: function () {
			// app标签距离视图顶部的高
			let appOffSetTop = this.$refs.app.offsetTop;
			this.SET_COMMON(['appOffSetTop',appOffSetTop]);
		}
	},
	watch: {
		$route: function () {
			this.creteQrCode();
		}
	}
}
</script>
<style lang="scss">
@import 'src/style/common';
.web-wrap{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	min-height: 100vh;
	background-color: #02b4a3;
	.web-top{
		display: flex;
		justify-content: center;
		width: 100%;
		height: 170px;
		background-color: #f2f4f4;
		margin-bottom: 52px;
		.content{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 750px;
			.content-tips{
				display: flex;
				align-items: center;
				img{
					width: 58px;
					height: 58px;
					margin-right: 30px;
				}
				p{
					font-size: 26px;
					color: #333333;
				}
			}
		}
	}
	@media screen and (max-width: 1024px) { 
	    .web-top{
	    	display: none
	    } 
	}
	#app{
		width: 750px;
		min-height: 100vh;
		background-color: #f4f4f4;
		position: relative;
	}
}
</style>
