import axios from 'axios';
import { getLocalStore } from '@/utils';
import { Indicator } from 'mint-ui';

axios.defaults.baseURL = 'http://api.orgjy.com';//正式接口
// axios.defaults.baseURL = 'http://palm-api.yo139.com';//测试接口

export default async(url = '', data = {}, type = 'get', ContentType = '') => {
    let params = {};
    // 获取用户信息
	let userInfo = getLocalStore('userInfo');
	// 判断用户信息是否存在
	if (userInfo !== null && userInfo !== 'null') {
		data['token'] = JSON.parse(userInfo).access_token;
	}
    //如果是get则参数添加到params
    if (type === 'get') {
		Object.keys(data).forEach(key => {
			params[key] = data[key];
		})
	}

	//非文件上传data转为json格式
	if (type === 'post' && ContentType === '') {
		data = JSON.stringify(data);
	}

 	//文件上传data需整合到formData
    if (ContentType !== '') {
 		//文件上传需建立一个formdata进行上传
 		let formData = new FormData();
 		let dataKeys = Object.keys(data);
 	    for (var i = 0; i < dataKeys.length; i++) {
 	    	//多图上传
 	    	if (dataKeys[i] === 'images') {
                 let fileData = data[dataKeys[i]];
                 for (let k = 0; k < fileData.length; k++) {
                 	formData.append('images[]',fileData[k],fileData[k].name);
                 }
 	    	}else{
 	    		formData.append(dataKeys[i],data[dataKeys[i]]);
 	    	}
 	    }
 	    data = formData;
 	    //同时更改Content-Type
 	    axios.defaults.headers.post['Content-Type'] = ContentType;
    }else{
    	//默认Content-Type
 		axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

	let requestConfig = {
		url: url,
		method: type,
        params: params,
		data: data,
		responseType: 'json'
	}
    //进行错误捕捉
	try {
		const response = await axios(url, requestConfig);
		let result;
		//返回结果为字符串则需进行转码
		if (typeof response.data === 'string') {
			result = JSON.parse(response.data);
		}else{
			result = response.data
		}
		return result;
	}
	catch (error) {
		throw new Error(error)
	}
}

