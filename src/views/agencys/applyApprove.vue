<template>
    <div class="wrap">
	    <!-- 顶部 -->
        <nav-return :title="type === 1? '加入机构申请审批':'报读课程申请审批'"></nav-return>
        <!-- 信息 -->
        <div class="content">
        	<div class="info">
        		<div class="student" v-if="type === 2">
        			<img src="../../assets/icon/apply_student@2x.png">
        			<p>学员信息</p>
        		</div>
        		<div class="type">
        			<p class="type-item">
        				<span class="title">名字</span>
        				<span class="value">{{ applyInfo.truename }}</span>
        			</p>
        			<p class="type-item type-item-margin">
        				<span class="title">昵称</span>
        				<span class="value">{{ applyInfo.nickname }}</span>
        			</p>
        		</div>
        		<div class="type">
        			<p class="type-item">
        				<span class="title">手机号</span>
        				<span class="value">{{ applyInfo.mobile }}</span>
        			</p>
        			<p class="type-item type-item-margin">
        				<span class="title">应急邮箱</span>
        				<span class="value">{{ applyInfo.email }}</span>
        			</p>
        		</div>
        		<div class="type">
        			<p class="type-item">
        				<span class="title">所属部门</span>
        				<span class="value">{{ applyInfo.dept }}</span>
        			</p>
        			<p class="type-item type-item-margin">
        				<span class="title">职务</span>
        				<span class="value">{{ applyInfo.career }}</span>
        			</p>
        			<p class="type-item type-item-margin">
        				<span class="title" v-if="type === 1">员工证</span>
                        <span class="title" v-else>学生证</span>
        				<span class="value">{{ applyInfo.student_no | cutString(18) }}</span>
        			</p>
        			<p class="type-item type-item-margin">
        				<span class="title">申请时间</span>
        				<span class="value">{{ applyInfo.pend_created | timeToDate(true,true,true) }}</span>
        			</p>
                    <div class="course" v-if="type === 2">
                        <!-- 课程图片 -->
                        <img class="course-img" :src="productInfo.img_url" alt="课程图片" />
                        <!-- 课程信息 -->
                        <div class="course-info">
                            <p class="course-name">{{ productInfo.name }}</p>
                            <p class="course-fee">
                                <span class="fee-free" v-if="Number(productInfo.is_free) === 1">免费</span>
                                <span class="fee-now" v-else>￥{{ productInfo.sale_price }}</span>
                                <span class="fee-old">￥{{ productInfo.origin_price }}</span>
                            </p>
                        </div>
                    </div>
        		</div>
        	</div>
            <!-- 按钮 -->
            <div class="apply-btn">
                <p class="pass" @click="confirmPend = true;pendStatus = 1;" :class="{'btn-click':passClick}" @mousedown="passClick = true" @mouseup="passClick = false" @touchstart="passClick = true" @touchend="passClick = false">{{type === 1?'通过加入申请':'通过报读申请'}}</p>
                <p class="reject" @click="confirmPend = true;pendStatus = 0;" :class="{'white-click':rejectClick}" @mousedown="rejectClick = true" @mouseup="rejectClick = false" @touchstart="rejectClick = true" @touchend="rejectClick = false">{{type === 1?'拒绝加入申请':'拒绝报读申请'}}</p>
            </div>
        </div>
        <!-- 通过审核 -->
        <div class="apply-pend" v-if="confirmPend">
            <div class="apply-wrap">
                <p class="tips" v-if="pendStatus === 1">{{ type === 1? '是否通过该学员加入申请':'是否通过该学员报读申请' }}</p>
                <p class="tips" v-else>{{ type === 1? '是否拒绝该学员加入申请':'是否拒绝该学员报读申请' }}</p>
                <textarea class="remark" v-if="pendStatus === 0" v-model="remark"></textarea>
                <p class="operate">
                    <span class="left-btn" @click="applyPend" :class="{'btn-click':sureApprove}" @mousedown="sureApprove = true" @mouseup="sureApprove = false" @touchstart="sureApprove = true" @touchend="sureApprove = false">确认</span>
                    <span class="right-btn" @click="confirmPend = false" :class="{'white-click':cancelApprove}" @mousedown="cancelApprove = true" @mouseup="cancelApprove = false" @touchstart="cancelApprove = true" @touchend="cancelApprove = false">取消</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';

import { Toast,Indicator } from 'mint-ui';

import { applyJoinProfile, applyJoinPend, applyReadProfile, applyReadPend } from '@/service/agencys';
export default {
    data() {
        return {
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	type: 1,//1为加入机构审批，2为报读课程审批
            applyId: '',//申请id
            applyInfo: {},//申请信息
            productInfo: {},//商品信息
            confirmPend: false,//是否通过审核
            pendStatus: 1,//通过审核
            remark: '',
            passClick: false,//点击通过审核
            rejectClick: false,// 点击拒绝审核
            sureApprove: false,// 确认通过审核
            cancelApprove: false// 取消审核
        }
    },
    components: {
    	navReturn
    },
    created: function () {
    	//获取路由元信息
    	this.type = Number(this.$route.meta.type);
        // 获取申请id
        let applyId = this.$route.query.applyId;
        if (applyId !== undefined) {
            this.applyId = applyId;
            //获取信息
            this.getInfo(); 
        }
    },
    methods: {
        // 获取信息
        getInfo: async function () {
            let res; 
            Indicator.open();
            if (this.type === 1) {
                res = await applyJoinProfile(this.applyId);
            }else{
                res = await applyReadProfile(this.agencysInfo.id,this.applyId);
            }
            Indicator.close();
            if (res.errCode === 0) {
                this.applyInfo = res.data;
                if (res.data.product_info !== undefined) {
                    this.productInfo = res.data.product_info;
                }
            }else if (res.errCode === 10003 || res.errCode === 10005 || res.errCode === 80035) {
                this.tokenOutOfDate();
            }else if(res.errCode === 80001){
                Toast('当前机构不存在');
            }else if(res.errCode === 80014 || res.errCode === 80016){
                Toast('当前暂无申请');
            }else{
                Toast('获取申请信息失败');
            }
        },
        //审核
        applyPend: async function () {
            let res; 
            let remark = '';
            //关闭选择框
            this.confirmPend = false;
            // 判断是否需要审核备注
            if (this.pendStatus === 0) {
                remark = this.remark;
            }
            Indicator.open();
            if (this.type === 1) {
                res = await applyJoinPend(this.applyId,this.pendStatus,remark);
            }else{
                res = await applyReadPend(this.applyId,this.pendStatus,remark);
            }
            Indicator.close();
            if (res.errCode === 0) { 
                //获取作用域
                let _this = this;   
                let str = '';
                //判断当前路由  
                if (this.type === 1) {
                    //判断是通过还是拒绝
                    if (this.pendStatus === 1) {
                        str = '您已成功审批该学员加入机构申请';
                        Toast();
                    }else{
                        str = '您已拒绝该学员加入机构申请';
                    }
                }else{
                    //判断是通过还是拒绝
                    if (this.pendStatus === 1) {
                        str = '您已成功审批该学员报读该课程申请';
                    }else{
                        str = '您已拒绝该学员报读该课程申请';
                    }
                }
                let instance = Toast(str);
                // 3秒后跳转到申请列表
                setTimeout(() => {
                    instance.close();
                    if (_this.type === 1) {
                        _this.goToOther('/addToAgencys');
                    }else{
                        _this.goToOther('/enrolCourses');
                    }
                }, 2000);
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if (res.errCode === 20020) {
                this.goToDetail('/agreeApply',{'applyId': this.applyId});
            }else if(res.errCode === 80010){
                Toast('审核信息不存在');
            }else{
                Toast('审核失败');
            }
        }
    },
    watch:{
        $route: function () {
            window.location.reload();
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
        padding-bottom: 20px;
		.info{
			width: 702px;
			background-color: #ffffff;
			border-radius: 10px;
			padding: 0 40px 10px 54px;
			margin-top: 40px;
            // 学员信息
			.student{
				display: flex;
				align-items: center;
				padding: 20px 0;
				margin: 10px 0 0 0; 
				img{
					width: 25px;
					height: 29px;
					margin-right: 29px;
				}
				p{
					font-size: 34px;
					font-weight: bold;
					color: #333333;
				}
			}
            // 列表
			.type{
				border-top: 2px solid #eeeeee;
				padding: 39px 0;
				.type-item{
					display: flex;
					.title{
						flex: 1;
						font-size: 34px;
						color: #666666;
					}
					.value{
						width: 327px;
						font-size: 34px;
						color: #333333;
					}
				}
				.type-item-margin{
					margin-top: 39px;
				}
                // 课程
                .course{
                    display: flex;
                    justify-content: space-between;
                    margin-top: 57px;
                    .course-img{
                        width: 226px;
                        height: 127px;
                        border-radius: 10px;
                    }
                    .course-info{
                        display: flex;
                        justify-content: space-between;
                        flex-direction: column;
                        .course-name{
                            width: 327px;
                            height: 67px;
                            font-size: 30px;
                            color: #323333;
                            line-height: 39px;
                        }
                        .course-fee{
                            .fee-free{
                                font-size: 28px;
                                color: #02b4a3;
                                margin-right: 26px;
                            }
                            .fee-now{
                                font-size: 28px;
                                color: #fa4343;
                                margin-right: 26px;
                            }
                            .fee-old{
                                font-size: 26px;
                                color: #999899;
                                text-decoration: line-through;
                            }
                        }
                    }
                }
			}
		}
        // 按钮
        .apply-btn{
            display: flex;
            justify-content: center;
            margin-top: 50px;
            p{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 330px;
                height: 88px;
                font-size: 34px;
                border-radius: 10px;
                cursor: pointer;
            }
            .pass{
                color: #ffffff;
                background-color: #02b4a3;
                margin-right: 21px;
            }
            .reject{
                color: #333333;
                background-color: #ffffff;
                margin-left: 21px;
            }
        }
	}
    // 审核
    .apply-pend{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(7,13,12,0.3);
        position: fixed;
        top: 0;
        left: 0;
        .apply-wrap{
            width: 590px;
            background-color: #ffffff;
            border-radius: 10px;
            padding: 84px 43px 74px;
            .tips{
                font-size: 34px;
                color: #101010;
                text-align: center;
            }
            .remark{
                width: 100%;
                min-height: 204px;
                font-size: 30px;
                color: #666666;
                background-color: #f2f4f4;
                border: none;
                resize: none; 
                margin-top: 56px;
                padding: 30px 22px;
            }
            .operate{
                display: flex;
                justify-content: center;
                margin-top: 70px;
                span{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 232px;
                    height: 78px;
                    font-size: 32px;
                    font-weight: 600;
                    border-radius: 10px;
                    cursor: pointer;
                }
                .left-btn{
                    color: #ffffff;
                    background-color: #02b4a3;
                    margin-right: 20px;
                }
                .right-btn{
                    color: #333333;
                    background-color: #ffffff;
                    border: 2px solid #eeeeee;
                    margin-left: 20px;
                }
            }
        }
    }
}
</style>