import axios from './axios'

// 密码登陆
export const passwordLogin = (mobile, agency_id, password) => axios('/users/login', {
	mobile, 
	agency_id, 
	password
}, 'post');

// 快速登陆
export const quickLogin = (mobile, order, agency_id, code) => axios('/users/quick-login', {
	mobile, 
	order, 
	agency_id, 
	code
}, 'post');

// 获取快速登陆验证码
export const loginSms = (mobile, order) => axios('/users/login-sms', {
	mobile, 
	order
}, 'post');

// 获取注册验证码
export const signupSms = (mobile, order) => axios('/users/signup-sms', {
	mobile, 
	order
}, 'post');

// 注册验证码验证
export const registerAuth = (mobile, order, code) => axios('/users/user-auth', {
	mobile, 
	order,
	code
}, 'post');

// 用户注册
export const setPassword = (mobile, password, re_password, agency_id, nickname) => axios('/users/user-signup', {
	mobile, 
	password,
	re_password,
	agency_id,
	nickname
}, 'post');

// 获取找回密码验证码
export const forgotSms = (mobile, order) => axios('/users/forgot-sms', {
	mobile, 
	order
}, 'post');

// 找回密码验证码验证
export const findPasswordAuth = (mobile, order, code) => axios('/users/password-auth', {
	mobile, 
	order,
	code
}, 'post');

// 重置密码
export const resetPassword = (password_reset_token, password, re_password) => axios('/users/reset-password', {
	password_reset_token, 
	password,
	re_password
}, 'post');

// 获取学员加入机构审核信息
export const getStudentJoin = (agency_id) => axios('/users/get-student-join', {
	agency_id
}, 'get');

// 保存学员加入机构审核信息
export const addStudentJoin = (agency_id, truename, email, dept, career,student_no) => axios('/users/add-student-join', {
	agency_id,
	truename, 
	email,
	dept,
	career,
	student_no
}, 'post');

// 首次登录
export const loginStatus = (agency_id) => axios('/users/login-status', {
	agency_id
}, 'post');

// 获取申请状态
export const getPendStatus = (agency_id) => axios('/users/pend-status', {
	agency_id
}, 'get');
