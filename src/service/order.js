import axios from './axios'

//生成订单
export const orderPlace = (role_type, order_channel_id, order) => axios('/orders/place', {
	role_type,
	order_channel_id,
	order
}, 'post');

//查询订单
export const orderQuery = (order_no) => axios('/orders/query', {
	order_no
}, 'get');

//支付宝支付
export const aliPay  = (order_no, url) => axios('/pays/alipay', {
	order_no, 
	url
}, 'get');

//微信支付
export const wechatPay   = (order_no, url, pre_pay) => axios('/pays/wechat-pay', {
	order_no, 
	url,
	pre_pay
}, 'get');

//余额支付短信
export const balancePaySms  = (phone, order, order_no) => axios('/pays/balance-pay-sms', {
	phone,
	order,
	order_no
}, 'post');

//余额支付
export const balancePay  = (phone, order, order_no, code) => axios('/pays/balance-pay', {
	phone, 
	order, 
	order_no, 
	code
}, 'post');
