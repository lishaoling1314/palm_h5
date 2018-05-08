<template>
    <div class="courses-info" @click="goToDetail('/coursesInfo',{'courses':courses.id})">
        <div class="img-wrapper">
	    	<img class="courses-img" :src="courses.img_url" />
        </div>
        <div class="info-wrap">
        	<p class="courses-name">{{ courses.name | cutString(38)}}</p>
        	<p class="courses-user-fee">
        		<span class="courses-user">{{ courses.read_count }}人在读</span>
        		<span class="courses-fee" v-if="price === 1">免费</span>
        		<span class="courses-fee" style="color: #fa4343;" v-else>￥{{ courses.single_sale_price  }}</span>
        	</p>
        	<div class="courses-btn" @mousedown="toDetail = true" @mouseup="toDetail = false" @touchstart="toDetail = true" @touchend="toDetail = false">
        		<p class="courses-btn-text" :style="toDetail? btnPosition: ''">立即报读</p>
        		<p class="courses-btn-shadow"></p>
        	</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	toDetail: false,
        	btnPosition: {
        		top: '5px'
        	}
        }
    },
    props: {
    	//课程
	    courses: {
	    	type: Object,
            default: function () {
                return {

                }
            }
	    },
	    //价格
	    price: {
	    	type: Number,
	    	default: 1
	    }
	}
   		
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.courses-info{
	width: 340px;
	height: 386px;
	background-color: #ffffff;
	border-radius: 10px;
	overflow: hidden;
	cursor: pointer;
	position: relative;
	.img-wrapper{
		width: 340px;
		height: 200px;
		overflow: hidden;
		img{
			width: 340px;
		}
	}
	.info-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 266px;
		position: absolute;
		top: 120px;
		background: linear-gradient(to top, white, white, white,white,rgba(255, 255, 255, 0.8));
		.courses-name{
			width: 300px;
			height: 66px;
			font-size: 28px;
			color: #333333;
			line-height: 39px;
			margin-top: 28px;
		}
		.courses-user-fee{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 300px;
			margin-top: 22px;
			.courses-user{
				font-size: 22px;
				color: #999999;
			}
			.courses-fee{
				font-size: 28px;
				color: #02b4a3;
			}
		}
		.courses-btn{
			width: 300px;
			height: 52px;
			margin-top: 38px;
			position: relative;
			.courses-btn-text{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 300px;
				height: 52px;
				font-size: 24px;
				color: #ffffff;
				cursor: pointer;
				background-color: #4bd1c9;
				background: linear-gradient(to right, #4bd1c8 , #4ccbd2);
				border-radius: 26px;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
			}
			.courses-btn-shadow{
				width: 280px;
				height: 52px;
				box-shadow: 0px 8px 10px #bdeeeb;
				border-radius: 26px;
				position: absolute;
				top: 0;
				left: 10px;
				z-index: 1;
			}
		}
	}
}
</style>