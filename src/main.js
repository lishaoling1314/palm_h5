// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router'// 路由
import store from './store'// vuex
import mixins from './mixins'// 混合
import * as filters from './filters'// 过滤
import Cookies from 'js-cookie'// cookies
import MintUI from 'mint-ui'// MintUI
import 'mint-ui/lib/style.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'cropperjs/dist/cropper.min.css'
import './assets/style/normalize.css'
import './assets/style/animate.css'
import './assets/style/palm.scss'
import './assets/js/flexible.js'// 手淘适配

import { getLocalStore } from './utils'
import { getAgencysInfoByName } from '@/service/agencys';// 获取机构信息

// 生产环境提示
Vue.config.productionTip = false

Vue.use(MintUI)
Vue.use(VueRouter)

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// register global mixins.
Vue.mixin(mixins)

// register router
const router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

// 获取机构信息
const getAgencysInfo = async (namePy,next) => {
    let res = await getAgencysInfoByName(namePy);
    if (res.errCode === 0 && res.data !== null) {
        // 储存机构信息,时间为一天
        Cookies.set('agencysInfo', res.data, { expires: 1 });
        next();
    }else{
        Cookies.remove('agencysInfo');
        next('/');
    }
}
// 路由白名单
const whiteRoute = [
    'mobileLogin',
    'passwordLogin',
    'register',
    'registerGetCode',
    'setPassword',
    'findPassword',
    'findGetCode',
    'resetPassword', 
    'registerProtocol',
    'authResult',
    'informationAuth'
]
// 禁用Spinner
NProgress.configure({ showSpinner: false });
// 导航守卫
router.beforeEach((to, from, next) => {
    // 进度条
    NProgress.start();
    // 获取当前路径
    let fullPath = to.fullPath;
    // 获取路由对比结果
    let agencysResult = fullPath.indexOf('agencysApprove');
    let coursesResult = fullPath.indexOf('coursesApprove');
    // 判断是否为加入机构申请审批或者报读课程申请审批
    // 是则储存当前路径,用于信息直接进入
    if (agencysResult > -1) {
        // 储存审批页信息,时间为一天
        Cookies.set('msgEnter', '/agencysApprove', { expires: 1 });
        Cookies.set('msgQuery', JSON.stringify(to.query), { expires: 1 });
    }else if(coursesResult > -1){
        // 储存审批页信息,时间为一天
        Cookies.set('msgEnter', '/coursesApprove', { expires: 1 });
        Cookies.set('msgQuery', JSON.stringify(to.query), { expires: 1 });
    }
    // 获取路由名
    let routeName = to.name;
    // 判断当前路由是否为机构列表,机构列表无需进入判断
    if (routeName === 'agencysList') {
        next(); 
        return false;
    }
    // 获取机构名
    let agencysNamePy = to.params.agencysNamePy;
    // 没有机构名则跳转到机构列表
    if (agencysNamePy === undefined) {
        next('/');
    }
    // 获取本地机构信息
    let agencysInfo = Cookies.get('agencysInfo');
    // 判断机构信息是否为空
    if (agencysInfo !== undefined) {
        // 转换为对象
        agencysInfo = JSON.parse(agencysInfo); 
        // 判断当前机构名是否有变化
        if (agencysInfo.name_py === agencysNamePy) {
            // 没变化则在params进行储存
            to.params.agencysInfo = agencysInfo;
            // 判断是否支持匿名登录
            let is_anonymous = Number(agencysInfo.is_anonymous);
            // 若当前有用户信息,且登陆信息为当前机构下信息
            let userInfo = JSON.parse(getLocalStore('userInfo'));
            if (userInfo !== null && Number(userInfo.agency_id) === Number(agencysInfo.id)) {
                // 学员则判断是否为首次登陆
                if (Number(userInfo.first_login) === 1 && Number(userInfo.role) === 10) {
                    //当前机构不支持匿名登录,则跳转到认证审核页
                    if (is_anonymous === 0 && whiteRoute.indexOf(routeName) === -1) {
                        next({ path: '/' + agencysNamePy + '/authResult' });
                    }else{
                        //机构支持匿名登陆,若当前路由为主页和课程详情页,以及相关白名单页面,则允许进入
                        if (routeName === 'home' || routeName === 'coursesInfo' || routeName === 'search' || whiteRoute.indexOf(routeName) > -1) {
                            next();
                        }else{
                            // 否则跳转到审核页
                            next({ path: '/' + agencysNamePy + '/authResult' });
                        }
                    }
                }else{
                  //管理员和非首次登陆学员直接进入
                  next();  
                }
            }else{
                // 不是当前机构下的登陆信息则判断是否支持匿名登陆
                if (is_anonymous === 0 && whiteRoute.indexOf(routeName) === -1) {
                    // 不支持则跳转到登陆页
                    next({ path: '/' + agencysNamePy + '/mobileLogin' });
                }else{
                    //机构支持匿名登陆,若当前路由为主页和课程详情页,以及相关白名单页面,则允许进入
                    if (routeName === 'home' || routeName === 'coursesInfo' || routeName === 'search' || whiteRoute.indexOf(routeName) > -1) {
                        next();
                    }else{
                        // 否则跳转到登陆页
                        next({ path: '/' + agencysNamePy + '/mobileLogin' });
                    }
                }
            }
        }else{
            // 为空则先去获取机构信息
            getAgencysInfo(agencysNamePy,next); 
        }
    }else{
        // 为空则先去获取机构信息
        getAgencysInfo(agencysNamePy,next);
    }
});

router.afterEach((to, from) => {
    NProgress.done();
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})