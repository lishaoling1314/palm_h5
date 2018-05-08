import axios from './axios'

//获取用户信息
export const userProfile = (agency_id) => axios('/users/user-profile', {
	agency_id
}, 'post');

//修改用户信息
export const editUserInfo = (agency_id,nickname,email) => axios('/users/user-info', {
	agency_id,
	nickname,
	email
}, 'post');

//修改用户头像
export const userAvatar = (agency_id,avatar_url,width,height,start_x,start_y) => axios('/users/user-avatar', {
	agency_id,
	avatar_url,
	width,
	height,
	start_x,
	start_y
}, 'post','multiple/form-data');

//获取学员消息数量
export const studentMessageNum = (role_type,agency_id ) => axios('/users/student-message-num', {
	role_type,
	agency_id
}, 'get');

//获取学员消息列表
export const studentMessage = (role_type,agency_id ) => axios('/users/student-message', {
	role_type,
	agency_id  
}, 'get');

//获取学员消息详情
export const getMessage = (id) => axios('/users/get-message', {
	id 
}, 'get');

//获取课程数量
export const applyCoursesNum = (agency_id) => axios('/users/apply-course-num', {
	agency_id
}, 'get');

//获取学员课程列表
export const applyCourses = (agency_id, course_type ) => axios('/users/apply-course', {
	agency_id,
	course_type   
}, 'get');

//获取学员收藏数量
export const productFavNum = (agency_id) => axios('/users/product-fav-num', {
	agency_id
}, 'get');

//获取学员收藏
export const productFav = (agency_id) => axios('/users/product-fav', {
	agency_id
}, 'get');

//添加课程收藏
export const addProductFav = (agency_id, product_id) => axios('/users/add-product-fav', {
	agency_id,
	product_id
}, 'post');

//取消课程收藏
export const cancelProductFav = (agency_id, product_id) => axios('/users/cancel-product-fav', {
	agency_id,
	product_id
}, 'post');

//重置密码
export const userResetPassword = (mobile, pr_password, password, re_password) => axios('/users/user-reset-password', {
	mobile,
	pr_password,
	password,
	re_password
}, 'post');

//获取余额
export const myBalance = () => axios('/balances/my-balance', {}, 'get');

//获取课程提问
export const getCourseQuestion = (agency_id, course_id) => axios('/users/get-course-question', {
	agency_id,
	course_id  
}, 'get');

//添加课程提问
export const addCourseQuestion = (agency_id, course_id, content, img_url) => axios('/users/add-course-question', {
	agency_id,
	course_id,
	content,
	img_url  
}, 'post','multiple/form-data');

//添加学习进度
export const studentLearn = (agency_id, product_id, material_ids, course_id) => axios('/users/student-learn', {
	agency_id,
	product_id,
	material_ids,
	course_id
}, 'post');