<template>
        <div class="wrap">
        <!-- 顶部 -->
        <nav-return :title="curRouteName === 'registerGetCode'?'验证手机号':'找回密码'" :goHome="false"></nav-return>
        <!-- 提示 -->
        <error-tips></error-tips>
        <!-- 内容wrap -->
        <div class="content-wrap">
            <!-- 内容 -->
            <div class="content">
                <p class="operate-tip">验证码已发到以下手机，请在5分钟内完成操作</p>
                <p class="mobile-number">86-{{ mobile }}</p>
                <!-- 验证码 -->
                <verify-code class="verify-code" :type="curRouteName === 'registerGetCode'?'2':'3'" text="重新发送验证码" :loadCountDown="true"></verify-code>
                <!-- 下一步按钮 -->
                <push-button class="push-button" text="下一步" :btnStatus="mobileAndVerifyCodeNoEmpety" @click.native="codeVerify"></push-button>
            </div>
            <!-- 底部 -->
            <direct-access v-if="curRouteName !== 'registerGetCode'" text="使用动态密码登录" @operateOne="goToOther('/mobileLogin')"></direct-access>
        </div>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';//顶部
import verifyCode from './components/verifyCode';//验证码
import pushButton from './components/pushButton';//跳转页面的按钮
import directAccess from './components/directAccess'//底部按钮
import errorTips from './components/errorTips'//提示信息

import Cookies from 'js-cookie';// cookies
import { Indicator } from 'mint-ui';

import { mapState, mapGetters, mapMutations } from 'vuex';
import { registerAuth, findPasswordAuth } from '@/service/account';

export default {
    data() {
        return{
            curRouteName: 'registerGetCode',//当前路由名
            agencysInfo: this.$route.params.agencysInfo,//机构信息
        }
    },
    //离开路由删除store信息s
    beforeRouteLeave(to, from, next) {
        let toName = to.name;
        // 非为注册或者找回密码获取验证码则清除数据
        if (toName !== 'setPassword' && toName !== 'resetPassword') {
            Cookies.remove('getCodeMobile');
            this.InitAcconut();
        }
        next();
    },
    components:{
        navReturn,
        verifyCode,
        pushButton,
        directAccess,
        errorTips
    },
    created: function () {
        // 获取当前路由名
        this.curRouteName = this.$route.name;
        // 每次刷新页面从cookie获取手机号码
        let mobile = Cookies.get('getCodeMobile');
        // 不存在则直接跳转回输入手机页面
        if (mobile === undefined) {
            // 判断当前路由
            if (this.curRouteName === 'registerGetCode') {
                this.goToOther('/register');
            }else{
                this.goToOther('/findPassword');
            }
        }else{
            // 存在则储存到store
            this.SET_ACCOUNT(['mobile',mobile]);
        }
    },
    computed: {
        // 手机号码
        ...mapState({
            mobile: state => state.account.mobile,
            verifyCode: state => state.account.verifyCode
        }),
        // 判断是否允许注册或者重置密码
        ...mapGetters([
           'mobileAndVerifyCodeNoEmpety'
        ])
    },
    methods:{
        ...mapMutations([
            'SET_ACCOUNT',
            'InitAcconut'
        ]),
        // 手机号码验证
        codeVerify: async function () {
            // 获取流水号
            let streamNumber = Cookies.get('streamNumber');
            if (streamNumber === undefined) {
                this.SET_ACCOUNT(['errorTips','验证码超时，请重新获取']);
                return false;
            }
            // 验证码为空
            if (this.verifyCode === '') {
                this.SET_ACCOUNT(['errorTips','验证码不能为空']);
                return false;
            }
            // 定义结果
            let res;
            // 显示loading
            Indicator.open('正在验证...');
            // 判断当前路由名
            if (this.curRouteName === 'registerGetCode') {
                // 注册验证码验证
                res = await registerAuth(this.mobile,streamNumber,this.verifyCode);
            }else{
                // 找回密码验证
                res = await findPasswordAuth(this.mobile,streamNumber,this.verifyCode);
            }
            // 关闭loading
            Indicator.close();
            // 判断结果
            let errCode = res.errCode;
            if (errCode === 0) {
                // 判断当前路由名
                if (this.curRouteName === 'registerGetCode') {
                    // 跳转到设置密码
                    this.goToOther('/setPassword');
                }else{
                    // 储重置密码token,时间为一天
                    Cookies.set('passwordResetToken', res.data.password_reset_token, { expires: 1 });
                    // 跳转到重置密码
                    this.goToOther('/resetPassword');
                }
            }else if(errCode === 10002){
                this.SET_ACCOUNT(['errorTips','手机号未注册']);
            }else if(errCode === 10006){
                this.SET_ACCOUNT(['errorTips','请输入手机号码']);
            }else if(errCode === 10010){
                this.SET_ACCOUNT(['errorTips','验证码超时，请重新获取']);
            }else if(errCode === 10019){
                this.SET_ACCOUNT(['errorTips','验证码错误']);
            }else if(errCode === 10055){
                this.SET_ACCOUNT(['errorTips','验证码不能为空']);
            }else if(errCode === 10067){
                this.SET_ACCOUNT(['errorTips','验证码超时，请重新获取']);
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
.wrap{
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
        //内容
        .content{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 750px;
            .operate-tip{
                font-size: 30px;
                color: #666666;
                margin-top: 120px;
            }
            .mobile-number{
                font-size: 32px;
                color: #333333;
                margin-top: 30px;
            }
            .verify-code{
                margin-top: 96px;
            }
            .push-button{
                margin-top: 192px;
            }
        } 
    } 
}
</style>

