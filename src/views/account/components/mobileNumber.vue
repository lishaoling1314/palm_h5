<template>
    <div class="mobile">
        <div class="icon-wrap">
            <img src="../../../assets/icon/signin_phone@2x.png">
        </div>
        <span v-if="areaCode">+86</span>
        <input type="text" v-model="mobile" :placeholder="placeholder" @keyup="inputMobile" maxlength="11" :disabled="mobileDiasbled">
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getLocalStore } from '@/utils';

export default {
    data() {
        return {
            mobile: '',//手机号码
            mobileDiasbled: false//是否允许修改手机号
        }
    },
    props: {
        //显示区号
        areaCode: {
            default: true
        },
        // placeholder
        placeholder: {
            default: '手机号'
        }
    },
    created: function () {
        // 获取手机号,判断是否为安全中心找回密码
        let safeMobile = this.$route.query.mobile;
        // 默认手机号,不允许修改
        if (safeMobile !== undefined) {
            //赋值手机号
            this.mobile = safeMobile;
            //设置为不允许修改
            this.mobileDiasbled = true;
            //修改手机号
            this.inputMobile();
        }
        // 判断是否为快捷登陆
        if (this.$route.name === 'mobileLogin') {
            let quickLogin = getLocalStore('quickLogin');
            if(quickLogin !== null){
                this.mobile = JSON.parse(quickLogin).mobile;
            }
        }
        // 判断是否有密码登陆
        if (this.$route.name === 'passwordLogin') {
            let passwordLogin = getLocalStore('passwordLogin');
            if(passwordLogin !== null){
                this.mobile = JSON.parse(passwordLogin).mobile;
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_ACCOUNT'
        ]),
        // 输入手机号
        inputMobile: function () {
            let mobile = this.mobile;
            // 替换非数字字符
            this.mobile = mobile.replace(/[^0-9]/g, '');
            this.SET_ACCOUNT(['mobile',this.mobile]);
        }
    },
    watch: {
        mobile: function () {
            //修改手机号
            this.inputMobile();
        }
    }
}
</script>
<style lang="scss" scoped>
.mobile {
    display: flex;
    align-items: center;
    width: 670px;
    height: 88px;
    border-bottom: 2px solid #dedede;
    padding-left: 26px;
    .icon-wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        img {
            width: 28px;
            height: 45px;
        }
    }
    span{
        font-size: 32px;
        color: #333333;
        margin-left: 45px;
    }
    input{
        height: 85px;
        font-size: 32px;
        color: #333333;
        border: none;
        background-color: #fff;
        margin-left: 46px;
    }
    input::placeholder {
        font-size: 32px;
        color: #999999;
    }
    input:focus {
        outline: none;
    }
}
</style>
