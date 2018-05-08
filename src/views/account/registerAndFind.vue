<template>
    <div class="wrap">
        <!-- 顶部 -->
        <nav-return :title="curRouteName === 'register'?'注册':'找回密码'" :goHome="false"></nav-return>
        <!-- 提示 -->
        <error-tips></error-tips>
        <!-- 内容wrap -->
        <div class="content-wrap">
            <!-- 内容 -->
            <div class="content">
                <!-- 手机号码 -->
                <mobile-number class="mobile-number" placeholder="请输入手机号"></mobile-number>
                <!-- 协议 -->
                <p class="protocol" :class="curRouteName === 'register'?'':'protocol-no'">点击获取验证码即同意 <span @click="goToOther('/registerProtocol')">[棕榈教育注册服务协议]</span></p>
                <!-- 获取验证按钮 -->
                <push-button class="push-button" text="获取验证码" :btnStatus="mobileVaild" @click.native="getCode"></push-button>
            </div>
            <!-- 底部 -->
            <direct-access text="使用动态密码登录" @operateOne="goToOther('/mobileLogin')"></direct-access>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn'; //顶部
import mobileNumber from './components/mobileNumber'; //手机号码
import pushButton from './components/pushButton'; //跳转页面的按钮
import directAccess from './components/directAccess' //底部按钮
import errorTips from './components/errorTips' //提示信息

import Cookies from 'js-cookie';// cookies
import { Indicator } from 'mint-ui';

import { mapState, mapGetters, mapMutations } from 'vuex';
import { signupSms, forgotSms } from '@/service/account';

export default {
    data() {
        return {
        	curRouteName: 'register',//当前路由名
        	agencysInfo: this.$route.params.agencysInfo,//机构信息
        }
    },
    //离开路由删除store信息
    beforeRouteLeave(to, from, next) {
    	let toName = to.name;
    	// 非为注册或者找回密码获取验证码则清除数据
    	if (toName === 'registerGetCode' || toName === 'findGetCode') {
            // 注册或找回验证码需储存一下手机号码,以防用户刷新页面丢失手机号
            if (this.mobile !== '') {
                // 储手机号码,时间为一天
                Cookies.set('getCodeMobile', this.mobile, { expires: 1 });
            }
    	}else{
            this.InitAcconut();
        }
    	next();
    },
    computed: {
    	// 手机号码
    	...mapState({
    	    mobile: state => state.account.mobile
    	}),
        // 判断手机是否合法,合法则允许获取验证码
        ...mapGetters([
           'mobileVaild'
        ])
    },
    components: {
        navReturn,
        mobileNumber,
        pushButton,
        directAccess,
        errorTips
    },
    created: function () {
        // 获取当前路由名
        this.curRouteName = this.$route.name;
    },
    methods: {
    	...mapMutations([
    	    'SET_ACCOUNT',
    	    'InitAcconut'
    	]),
    	// 获取验证码
    	getCode: async function () {
    		// 手机号为空
    		if (this.mobile === '') {
    		    this.SET_ACCOUNT(['errorTips','请输入手机号码']);
    		    return false;
    		}
    		// 手机号不合法
    		if (!this.mobileVaild) {
    		    this.SET_ACCOUNT(['errorTips','您输入的手机号码有误']);
    		    return false;
    		}
            // 获取16位流水号   
            let streamNumber = '';
            for (let i = 0; i < 16; i++) {
                streamNumber = streamNumber + String(Math.floor(Math.random() * 10));
            } 
            // 定义结果
            let res;
            // 显示loading
            Indicator.open();
    		// 判断当前路由
			if (this.curRouteName === 'register') {
                // 获取注册验证码
                res = await signupSms(this.mobile,streamNumber);
			}else{
                // 获取找回密码验证码
                res = await forgotSms(this.mobile,streamNumber);
			}
            // 关闭loading
            Indicator.close();
            let errCode = res.errCode;
            // 判断是否获取成功
            if (errCode === 0) {
                // 储存流水号,时间为5分钟
                let inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
                Cookies.set('streamNumber', streamNumber, { expires: inFiveMinutes });
                // 判断当前路由
                if (this.curRouteName === 'register') {
                    this.goToOther('/registerGetCode');
                }else{
                    this.goToOther('/findGetCode');
                }
            }else if(errCode === 10002){
                this.SET_ACCOUNT(['errorTips','该手机号尚未注册']);
            }else if(errCode === 10006){
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if(errCode === 10010){
                this.SET_ACCOUNT(['errorTips','流水单号不能为空']);
            }else if(errCode === 10011){
                this.SET_ACCOUNT(['errorTips','该手机号已注册，可直接登录']);
            }else if(errCode === 10013){
                this.SET_ACCOUNT(['errorTips','发送失败']);
            }else{
                this.goToOther('/mobileLogin');
            }
    	}
    },
    watch: {
        $route: function () {
            window.location.reload();
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    width: 750px;
    min-height: 100vh;
    background-color: #fff;
    .content-wrap{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        .content {
        	display: flex;
        	flex-direction: column;
        	align-items: center;
        	width: 750px;
            .mobile-number {
    			margin-top: 214px;
            }
            .protocol{
            	font-size: 26px;
            	color: #666666;
                cursor: pointer;
            	margin-top: 221px;
            	span{
    				color: #02b4a3;
            	}
            }
            .protocol-no{
            	opacity: 0;
            }
            .push-button {
    	        margin-top: 38px;
            }
        } 
    }
}
</style>