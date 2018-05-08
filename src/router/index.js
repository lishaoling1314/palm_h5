// 主页
const agencysList = () => import ('@/views/home/agencysList.vue')
const home = () => import ('@/views/home/home.vue')
// 登陆注册
const login = () => import ('@/views/account/login.vue')
const registerAndFind = () => import ('@/views/account/registerAndFind.vue')
const mobileGetCode = () => import ('@/views/account/mobileGetCode.vue')
const setAndReset = () => import ('@/views/account/setAndReset.vue')
const registerProtocol = () => import ('@/views/account/registerProtocol.vue')
const informationAuth = () => import ('@/views/account/informationAuth.vue')
const authResult = () => import ('@/views/account/authResult.vue')
// 搜索
const search = () => import ('@/views/search/search.vue')
// 课程
const coursesInfo = () => import ('@/views/courses/coursesInfo.vue')
const coursesDownload = () => import ('@/views/courses/coursesDownload.vue')
const coursesStudy = () => import('@/views/courses/coursesStudy.vue')
// 支付
const confirmPay = () => import('@/views/pay/confirmPay.vue')
const orderPay = () => import('@/views/pay/orderPay.vue')
const balancePay = () => import('@/views/pay/balancePay.vue')
// 教师
const teacherInfo = () => import ('@/views/teacher/teacherInfo.vue')
// 学员中心
const studentCenter = () => import ('@/views/student/studentCenter.vue')
const studentCourses = () => import ('@/views/student/studentCourses.vue')
const messageList = () => import ('@/views/student/messageList.vue')
const myMessage = () => import ('@/views/student/myMessage.vue')
const collectList = () => import ('@/views/student/collectList.vue')
// 机构中心
const agencysCenter = () => import ('@/views/agencys/agencysCenter.vue')
const applyList = () => import ('@/views/agencys/applyList.vue')
const applyApprove = () => import ('@/views/agencys/applyApprove.vue')
const agreeApply = () => import ('@/views/agencys/agreeApply.vue')
// 个人中心
const personalInfo = () => import ('@/views/user/personalInfo.vue')
const resetPersonalInfo = () => import ('@/views/user/resetPersonalInfo.vue')
const personalImage = () => import ('@/views/user/personalImage.vue')
// 安全中心
const safeCenter = () => import ('@/views/safeCenter/safeCenter.vue')
const safeResetPassword = () => import ('@/views/safeCenter/safeResetPassword.vue')

export default [
	//机构列表
    {
		path: '/',
		name: 'agencysList',
		component: agencysList
    },
    //机构首页
    {
		path: '/:agencysNamePy',
		name: 'home',
		component: home
	},
	//手机验证码登录
	{
		path: '/:agencysNamePy/mobileLogin',
		name: 'mobileLogin',
		component: login
    },
	//密码登录
	{
		path: '/:agencysNamePy/passwordLogin',
		name: 'passwordLogin',
		component: login
    },
	//注册
	{
		path: '/:agencysNamePy/register',
		name: 'register',
		component: registerAndFind
    },
	//注册-验证码
	{
		path: '/:agencysNamePy/registerGetCode',
		name: 'registerGetCode',
		component: mobileGetCode,
    },
	//注册-设置密码
	{
		path: '/:agencysNamePy/setPassword',
		name: 'setPassword',
		component: setAndReset,
    },
	//找回密码
	{
		path: '/:agencysNamePy/findPassword',
		name: 'findPassword',
		component: registerAndFind
    },
	//找回密码-验证码
	{
		path: '/:agencysNamePy/findGetCode',
		name: 'findGetCode',
		component: mobileGetCode,
    },
	//密码-重置密码
	{
		path: '/:agencysNamePy/resetPassword',
		name: 'resetPassword',
		component: setAndReset,
    },
	//注册协议
	{
		path: '/:agencysNamePy/registerProtocol',
		name: 'registerProtocol',
		component: registerProtocol,
    },
	// 认证信息
	{
		path: '/:agencysNamePy/informationAuth',
		name: 'informationAuth',
		component: informationAuth,
    },
	// 审核结果
	{
		path: '/:agencysNamePy/authResult',
		name: 'authResult',
		component: authResult,
    },
    //搜索页
    {
		path: '/:agencysNamePy/search',
		name: 'search',
		component: search
    },
    //课程信息
    {
		path: '/:agencysNamePy/coursesInfo',
		name: 'coursesInfo',
		component: coursesInfo
    },    
    //课程下载
    {
		path: '/:agencysNamePy/coursesDownload',
		name: 'coursesDownload',
		component: coursesDownload
    }, 
    //课程学习
    {
		path: '/:agencysNamePy/coursesStudy',
		name: 'coursesStudy',
		component: coursesStudy
    },   
    // 支付确认
    {
		path: '/:agencysNamePy/confirmPay',
		name: 'confirmPay',
		component: confirmPay
    },  
    // 订单支付
    {
		path: '/:agencysNamePy/orderPay',
		name: 'orderPay',
		component: orderPay
    },
    // 余额支付
    {
		path: '/:agencysNamePy/balancePay',
		name: 'balancePay',
		component: balancePay
    },
    //老师信息
    {
		path: '/:agencysNamePy/teacherInfo',
		name: 'teacherInfo',
		component: teacherInfo
    },
    //学员中心
    {
		path: '/:agencysNamePy/studentCenter',
		name: 'studentCenter',
		component: studentCenter
    },
    //学员个人信息
    {
        path: '/:agencysNamePy/studentInfo',
        name: 'studentInfo',
        component: personalInfo
    },
    //修改学员个人昵称
    {
        path: '/:agencysNamePy/resetStudentNickname',
        name: 'resetStudentNickname',
        component: resetPersonalInfo
    },
    //修改学员个人邮箱
    {
        path: '/:agencysNamePy/resetStudentEmail',
        name: 'resetStudentEmail',
        component: resetPersonalInfo
    },
    //修改头像
    {
        path: '/:agencysNamePy/personalImage',
        name: 'personalImage',
        component: personalImage
    },
    //学员我的课程
    {
		path: '/:agencysNamePy/studentCourses',
		name: 'studentCourses',
		component: studentCourses
    },
    //学员消息列表
    {
		path: '/:agencysNamePy/messageList',
		name: 'messageList',
		component: messageList
    },
    //学员我的消息
    {
		path: '/:agencysNamePy/myMessage',
		name: 'myMessage',
		component: myMessage
    },
    //学员我的收藏
    {
		path: '/:agencysNamePy/collectList',
		name: 'collectList',
		component: collectList
    },
	//学员安全中心
	{
		path: '/:agencysNamePy/studentSafeCenter',
		name: 'studentSafeCenter',
		component: safeCenter
    },
	//学员安全中心-重置密码
	{
		path: '/:agencysNamePy/studentResetPassword',
		name: 'studentResetPassword',
		component: safeResetPassword
    },
    //机构中心
    {
		path: '/:agencysNamePy/agencysCenter',
		name: 'agencysCenter',
		component: agencysCenter
    },
    //机构管理个人信息
    {
        path: '/:agencysNamePy/agencysInfo',
        name: 'agencysInfo',
        component: personalInfo
    },
    //修改机构管理个人昵称
    {
        path: '/:agencysNamePy/resetAgencysNickname',
        name: 'resetAgencysNickname',
        component: resetPersonalInfo
    },
    //修改机构管理个人邮箱
    {
        path: '/:agencysNamePy/resetAgencysEmail',
        name: 'resetAgencysEmail',
        component: resetPersonalInfo
    },
    //加入机构申请
    {
		path: '/:agencysNamePy/addToAgencys',
		component: applyList,
		meta: { 
			type: 1 
		}
    },
    //报读课程申请
    {
		path: '/:agencysNamePy/enrolCourses',
		component: applyList,
		meta: { 
			type: 2 
		}
    },
    //加入机构审批
    {
		path: '/:agencysNamePy/agencysApprove',
		component: applyApprove,
		meta: { 
			type: 1 
		}
    },
    //报读课程审批
    {
		path: '/:agencysNamePy/coursesApprove',
		component: applyApprove,
		meta: { 
			type: 2 
		}
	},
    //同意报读申请购买
    {
		path: '/:agencysNamePy/agreeApply',
		component: agreeApply
    },
	//机构安全中心
	{
		path: '/:agencysNamePy/agencysSafeCenter',
		name: 'agencysSafeCenter',
		component: safeCenter
    },
	//机构安全中心-重置密码
	{
		path: '/:agencysNamePy/agencysResetPassword',
		name: 'agencysResetPassword',
		component: safeResetPassword
    },
    //地址不存在时跳转error页面
    { 
        path: '*', 
        redirect: '/'
    }
]
