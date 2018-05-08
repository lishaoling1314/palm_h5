import axios from './axios'

//课程过滤
export const getFilterProduct = (type, agency_id, page, page_size, search_name) => axios('/products/get-filter-product', {
	type,
	agency_id, 
	page, 
	page_size, 
	search_name
}, 'get');

//课程详情
export const getProductProfile = (agency_id, product_id) => axios('/products/product-profile', {
	agency_id, 
	product_id
}, 'get');

//课程目录
export const getCourseLesson = (agency_id, product_id, type ,from) => axios('/courses/get-course-lesson', {
	agency_id,
	product_id, 
	type,
	from
}, 'get');

//课程资料下载
export const materialDownload = (material_ids, type) => axios('/courses/material-download', {
	material_ids,
	type
}, 'post');

//查看报读申请进度
export const getApplyStatus = (agency_id, product_id) => axios('/products/get-apply-status', {
	agency_id,
	product_id
}, 'get');

//申请课程报读
export const addApplyRead = (agency_id, product_id) => axios('/users/add-apply-read', {
	agency_id,
	product_id
}, 'post');

//获取教师资料
export const teacherProfile = (agency_id, teacher_id) => axios('/courses/teacher-profile', {
	agency_id,
	teacher_id
}, 'get');

//教师关联商品
export const teacherProduct = (agency_id, teacher_id) => axios('/courses/get-teacher-product', {
	agency_id,
	teacher_id
}, 'get');

//添加关键词
export const searchsAdd = (keywords) => axios('/searchs/add', {
	keywords
}, 'post');

//获取热门关键词
export const searchsHot = () => axios('/searchs/hot', {}, 'get');

