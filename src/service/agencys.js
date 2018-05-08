import axios from './axios'

//获取机构列表
export const AgencyList = () => axios('/agencys/agency-list', {}, 'get');

//通过id获取机构信息
export const getAgencyProfileById = (agency_id) => axios('/agencys/get-agency-profile', {
	agency_id
}, 'get');

//通过名字获取机构信息
export const getAgencysInfoByName = (agency_name) => axios('/agencys/get-agency-info', {
	agency_name
}, 'get');

//加入机构申请列表
export const applyJoinList = (agency_id,page,page_size,pend_status) => axios('/agencys/apply-join-list', {
	agency_id,
	page,
	page_size,
	pend_status
}, 'post');

//加入机构申请信息
export const applyJoinProfile = (apply_id) => axios('/agencys/apply-join-profile', {
	apply_id
}, 'post');

//加入机构申请审核
export const applyJoinPend = (apply_id, pend_status, remark) => axios('/agencys/apply-join-pend', {
	apply_id,
	pend_status,
	remark
}, 'post');

//报读申请列表
export const applyReadList = (agency_id,page,page_size,pend_status) => axios('/agencys/apply-read-list', {
	agency_id,
	page,
	page_size,
	pend_status
}, 'post');

//报读申请信息
export const applyReadProfile = (agency_id,apply_id) => axios('/agencys/apply-read-profile', {
	agency_id,
	apply_id
}, 'post');

//报读申请审核
export const applyReadPend = (apply_id, pend_status, remark) => axios('/agencys/apply-read-pend', {
	apply_id,
	pend_status,
	remark
}, 'post');