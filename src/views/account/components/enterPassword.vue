<template>
    <div class="password">
        <div class="password-item">
            <div class="icon-wrap">
                <img src="../../../assets/icon/signin_password@2x.png" >
            </div>
            <input v-model="password"　type="password" placeholder="密码" @keyup="SET_ACCOUNT(['password',password])" maxlength="16">
        </div>
        <div class="password-item re-password" v-if="showRepassword">
            <div class="icon-wrap">
                <img src="../../../assets/icon/signin_password@2x.png" >
            </div>
            <input v-model="rePassword"　type="password" placeholder="确认密码" @keyup="SET_ACCOUNT(['rePassword',rePassword])" maxlength="16">
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getLocalStore } from '@/utils';

export default {
    data(){
        return{
            password: '',//密码
            rePassword: '',//确认密码
        }
    },
    props:{
        // 是否显示确认密码
        showRepassword: {
            default: false
    	}
    },
    created: function () {
        // 判断是否有密码登陆
        if (this.$route.name === 'passwordLogin') {
            let passwordLogin = getLocalStore('passwordLogin');
            if(passwordLogin !== null){
                this.password = JSON.parse(passwordLogin).password;
            }
        }
    },
    methods: {
        ...mapMutations([
            'SET_ACCOUNT'
        ])
    },
    watch: {
        password: function () {
            this.SET_ACCOUNT(['password',this.password])
        },
        rePassword: function () {
            this.SET_ACCOUNT(['rePassword',this.rePassword])
        }
    }
}  
</script>

<style lang="scss" scoped>
.password{
    .password-item{
        display: flex;
        align-items: center;
        width: 670px;
        height: 88px;
        padding-left: 26px;
        border-bottom: 2px solid #dedede;
        .icon-wrap{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            img {
                width: 36px;
                height: 37px;
            }
        }
        input{
            height: 85px;
            font-size: 32px;
            color: #333333;
            letter-spacing: 3px;
            border: none;
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
    .re-password{
        margin-top: 20px;
    }
}
</style>

