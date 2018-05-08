<template>
    <div class="wrap">
        <!-- 顶部 -->
        <nav-return title="支付" :goHome="false"></nav-return>
        <div class="order">
            <img class="order-icon" src="../../assets/icon/order@2x.png" alt="订单" />
            <p class="order-content">
                <span class="order-fee">订单金额<span>￥{{ orderInfo.pay_amount }}</span></span>
                <span class="order-tips">订单提交成功，请尽快完成付款</span>
            </p>
        </div>
        <div class="pay">
            <div class="pay-way pay-way-border">
                <p class="icon">
                    <img src="../../assets/icon/payment_alipay@2x.png" alt="支付宝" />
                    <span>支付宝</span>
                </p>
                <img class="select" :src="payWay === 1?selectIcon[1]:selectIcon[0]" alt="选择" @click="payWay = 1" />
            </div>
            <div class="pay-way pay-way-border">
                <p class="icon">
                    <img src="../../assets/icon/payment_wechat@2x.png" alt="微信" />
                    <span>微信</span>
                </p>
                <span class="pc-pay-tip">pc访问暂不支持微信支付</span>
                <img class="select" :src="payWay === 2?selectIcon[1]:selectIcon[0]" alt="选择"  @click="payWay = 2" />
            </div>
            <div class="pay-way" v-if="Number(orderInfo.role_type) === 1">
                <p class="icon">
                    <img src="../../assets/icon/payment_my@2x.png" alt="余额" />
                    <span>余额</span>
                </p>
                <img class="select" :src="payWay === 3?selectIcon[1]:selectIcon[0]" alt="选择" @click="payWay = 3" />
            </div>
            <!-- 确认支付 -->
            <p class="pay-btn" :class="{'btn-click': goPay}" @click="goToPay" @mousedown="goPay = true" @mouseup="goPay = false" @touchstart="goPay = true" @touchend="goPay = false">去付款</p>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';

import { Toast,Indicator } from 'mint-ui';

import { orderQuery,aliPay,wechatPay } from '@/service/order';
export default {
    data() { 
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	orderNo: '',//订单id
            callBackUrl: '',//回调url
            orderInfo: {},//订单信息
            payWay: 1,//支付方式
            goPay: false,//去支付
            selectIcon: [
                require('../../assets/icon/choose_selected@2x.png'),
                require('../../assets/icon/choose_defult@2x.png')
            ]
        }
    },
    components: {
        navReturn
    },
    created: function () {
        // 获取订单号
        let orderNo = this.$route.query.orderNo;
        let callBackUrl = this.$route.query.callBackUrl;
        if (orderNo !== undefined && orderNo !== callBackUrl) {
            this.orderNo = orderNo;
            this.callBackUrl = callBackUrl;
            this.getOrder();
        }
    },
    methods: {
        // 获取订单信息
        getOrder: async function () {
            Indicator.open();
            let res = await orderQuery(this.orderNo);
            Indicator.close();
            if (res.errCode === 0 && res.data !== null) {
                this.orderInfo = res.data[0];
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
                Toast('获取订单失败');
            }
        },
        //去支付
        goToPay: async function () {
            // 余额支付跳转到支付页面
            if (this.payWay === 3) {
                this.goToDetail('/balancePay',{'orderNo':this.orderNo,'callBackUrl':this.callBackUrl});
                return false;
            }
            Indicator.open();
            let res
            let payUrl = 'http://api.orgjy.com/pays/';
            // 判断是支付宝还是微信
            if (this.payWay === 1) {
                res = await aliPay(this.orderNo,this.callBackUrl);
                payUrl = payUrl + 'alipay';
            }else{
                res = await wechatPay(this.orderNo,this.callBackUrl,1);
                payUrl = payUrl + 'wechat-pay';
            }
            Indicator.close();
            if (res !== null) {
                Toast('当前订单不可支付');
            }else{
                payUrl = payUrl + '?order_no=' + this.orderNo + '&url=' + this.callBackUrl;
                window.location.href = payUrl;
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
    display: flex;
    flex-direction: column;
	min-height: 100vh;
	background-color: #ffffff;
    .order{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 272px;
        background-color: #f7f7f7;
        .order-icon{
            width: 71px;
            height: 96px;
            margin-right: 31px;
        }
        .order-content{
            display: flex;
            flex-direction: column;
            .order-fee{
                display: flex;
                align-items: center;
                font-size: 32px;
                color: #323333;
                margin-bottom: 14px;
                span{
                    font-size: 42px;
                    color: #fa4343;  
                    margin-left: 30px;
                }
            }
            .order-tips{
                font-size: 28px;
                color: #999999;
                margin-top: 14px;
            }
        }
    }
    .pay{
        flex: 1;
        padding: 0 34px;
        position: relative;
        .pay-way{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 110px;
            .icon{
                display: flex;
                align-items: center;
                img{
                    width: 68px;
                    height: 68px;
                }
                span{
                    font-size: 30px;
                    color: #333333;
                    margin-left: 29px;
                }
            }
            .select{
                width: 38px;
                height: 38px;
                cursor: pointer;
            }
        }
        .pay-way-border{
            border-bottom: 2px solid #eeeeee;
        }
        .pay-btn{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 682px;
            height: 88px;
            font-size: 34px;
            color: #ffffff;
            background-color: #02b4a3;
            border-radius: 10px;
            cursor: pointer;
            position: absolute;
            bottom: 34px;
        }
    }
}


.pc-pay-tip{
    float: right;
    display: block;
    color: red;
    font-size: 32px;
}
@media screen and (max-width: 1024px) {
    .pc-pay-tip{
    	display: none;
    }
}
@media screen and (min-width: 1024px) {
    .select{
    	display: none;
    }
}

</style>