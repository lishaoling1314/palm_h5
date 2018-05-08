import { mobileRegexpVaild } from '@/utils';// 手机正则验证

const account = {
    state: {
    	mobile: '',// 手机号码
    	verifyCode: '',// 验证码
        password: '',// 密码
        rePassword: '',// 重置密码
        errorTips: '',//错误提示
    },
    getters: { 
        // 验证手机是否为合法手机
        mobileVaild: state => {
            let result = false;
            if (state.mobile !== '') {
                result = mobileRegexpVaild(state.mobile);
            }
            return result;
        },
        // 判断是否允许快速登陆,注册账号,重置密码
        mobileAndVerifyCodeNoEmpety: state => {
            // 手机号码,验证码不为空
            if (state.mobile !== '' && state.verifyCode !== '') {
                return true;
            }else{
                return false;
            }
        },
        // 判断是否允许账号密码登陆
        allowPasswordLogin: state => {
            // 手机号码,密码不为空
            if (state.mobile !== '' && state.password !== '') {
                return true;
            }else{
                return false;
            }
        }
    },
    mutations: {
        // 管理账号状态
        SET_ACCOUNT: (state, info) => {
            state[info[0]] = info[1];
        },
        // 初始化account
        InitAcconut: (state) => {
            state.mobile = '';
            state.verifyCode = '';
            state.password = '';
            state.rePassword = '';
            state.errorTips = '';
        }
    }
};

export default account;