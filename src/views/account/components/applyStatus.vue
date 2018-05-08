<template>
    <div class="apply-status">
    	<!-- 进度条状态 -->
    	<div class="status">
	    	<!-- 进度条底部 -->
    		<div class="progress-zero"></div>
	    	<!-- 进度条 -->
    		<div class="progress" :class="progress[pendStatus]"></div>
    		<!-- 游标 -->
    		<div class="cursor" :class="cursor[pendStatus]">
	    		<img v-if="pendStatus === 4" class="progress-fail-icon" src="../../../assets/icon/rocket_fail@2x.png" alt="进度icon">
	    		<img v-else-if="pendStatus === 3" class="progress-fail-icon" src="../../../assets/icon/rocket_success@2x.png" alt="进度icon">
	    		<img v-else class="progress-normal-icon" src="../../../assets/icon/rocket_normal@2x.png" alt="进度icon">
    		</div>
    	</div>
    	<!-- 进度描述 -->
    	<p class="explain">
    		<span>{{ pendInit }}</span>
    		<span>{{ pendStatus === 4?'审核失败':'审核中'}}</span>
    		<span>审核通过</span>
    	</p>
    	<!-- 审核失败信息 -->
    	<div class="auth-mark" v-if="pendStatus === 4 && pendRemarks !== null && pendRemarks !== ''">
    	    <p class="triangle"></p>
    	    <p class="content" v-if="showRemark">{{ pendRemarks }}</p>
    	    <p class="content" v-else>{{ pendRemarks | cutString(90) }}</p>
    	    <img class="drop-down" v-if="showRemark" src="../../../assets/icon/triangle_packup@2x.png" @click="showRemark = false">
    	    <img class="drop-down" v-else src="../../../assets/icon/triangle_open@2x.png"  @click="showRemark = true">
    	</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
			progress: {
	            1: 'progress-normal',
	            2: 'progress-normal progress-half',
	            3: 'progress-normal progress-full',
	            4: 'progress-fail progress-half'
			},// 进度条样式
			cursor: {
				1: 'cursor-normal cursor-zero',
				2: 'cursor-normal cursor-half',
				3: 'cursor-normal cursor-full',
				4: 'cursor-fail cursor-half'
			},// 游标样式
		    showRemark: false,// 显示详情

        }
    },
    props: [
		'pendStatus',
		'pendRemarks',
		'pendInit'
    ]
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.apply-status{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 750px;
	background-color: #ffffff;
	margin-top: 85px;
	// 进度条状态
	.status{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 668px;
		height: 60px;
		position: relative;
		// 底部
		.progress-zero{
			width: 668px;
			height: 28px;
			border-radius: 14px;
			background-color: #f2f4f4;
		}
		// 进度条
		.progress{
			height: 28px;
			border-radius: 14px;
			position: absolute;
			top: 16px;
			left: 0;
		}
		// 进度条一半
		.progress-half{
			width: 334px;
		}
		// 进度条全满
		.progress-full{
			width: 668px;
		}
		// 进度条正常
		.progress-normal{
			background: linear-gradient(to right, #4bd1c8 , #4ccbd2);
		}
		// 进度条失败
		.progress-fail{
			background: linear-gradient(to right, #f57b5a , #fa4343);
		}
		// 游标
		.cursor{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 60px;
			height: 60px;
			border-radius: 50%;
			position: absolute;
			top: 0;
			.progress-normal-icon{
				width: 39px;
				height: 29px;
			}
			.progress-fail-icon{
				width: 29px;
				height: 39px;
			}
		}
		.cursor-normal{
			background-color: #4ccdd1;
		}
		.cursor-fail{
			background-color: #fa4343;
		}
		.cursor-zero{
            left: 0;
		}
		.cursor-half{
            left: 304px;
		}
		.cursor-full{
            left: 608px;
		}
	}
	// 进度描述
	.explain{
		display: flex;
		justify-content: space-between;
		width: 668px;
		margin-top: 15px;
		span{
			font-size: 26px;
			color: #333333;
		}
	}
	// 审核失败信息
	.auth-mark{
	    width: 670px;
	    border-radius: 20px;
	    background-color: #f2f4f4;
	    padding: 24px 30px 36px 30px;
	    margin-top: 47px;
	    position: relative;
	    .triangle{
	        width: 0;
	        height: 0;
	        border-left: 17px solid transparent;
	        border-right: 17px solid transparent;
	        border-bottom: 20px solid #f2f4f4;
	        position: absolute;
	        top: -20px;
	        left: 320px;
	    }
	    .content{
	        font-size: 24px;
	        color: #666666;
	        line-height: 36px;
	    }
	    .drop-down{
	        width: 12px;
	        height: 8px;
	        position: absolute;
	        bottom: 30px;
	        right: 35px;
	    }
	}
}
</style>