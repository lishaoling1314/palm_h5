<template>
    <div class="courses">
    	<div class="courses-detail" v-for="(item,key) in coursesProfile.course_list">
    		<p class="courses-sort">课程{{ key | numberToChinese }}</p>
    		<div class="courses-content">
				<p class="courses-name">{{ item.name }}</p>
				<p class="courses-title">“海绵城市”雨水系统与绿色建筑、绿色社区、LID雨...</p>
				<p class="courses-description">{{ item.desc }}</p>
				<!-- 时间和难度 -->
				<div class="time-and-level">
					<p class="time-level">
						<img class="time-icon" src="../../../assets/icon/time.png" alt="时间">
						<span class="time-level-text">课程时长：{{ item.duration }}</span>
					</p>
					<p class="time-level">
						<img class="coffee-icon" src="../../../assets/icon/coffee.png" alt="难度">
						<span class="time-level-text">课程难度：{{ item.level | levelToChinese }}</span>
					</p>
				</div>
    		</div>
    	</div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
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
.courses{
	background-color: #ffffff;
	padding: 26px 26px 100px 0;
	.courses-detail{
		padding: 40px 0 55px;
		border-bottom: 1px solid #eeeeee;
		// 排序
		.courses-sort{
			width: 180px;
			height: 64px;
			font-size: 32px;
			color: #333333;
			background-color: #f2f4f4;
			border-radius: 10px;
			text-align: center;
			padding: 14px 37px;
			margin-left: 30px;
		}
		.courses-content{
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			padding-top: 80px;
			// 名称
			.courses-name{
				width: 624px;
				font-size: 34px;
				color: #333333;
			}
			// 标题
			.courses-title{
				width: 624px;
				font-size: 26px;
				color: #666666;
				margin-top: 55px;
			}
			// 描述
			.courses-description{
				width: 624px;
				font-size: 24px;
				color: #999999;
				line-height: 48px;
				margin-top: 32px;
			}
			// 时长,难度
			.time-and-level{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 624px;
				margin-top: 67px;
				.time-level{
					display: flex;
					align-items: center;
					.time-icon{
						width: 28px;
						height: 28px;
					}
					.coffee-icon{
						width: 28px;
						height: 30px;
					}
					.time-level-text{
						font-size: 28px;
						color: #04b2a3;
						margin-left: 8px;
					}
				}
			}
		}
	}
}
</style>