/**
 * 存储localStorage
 */
export const setLocalStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getLocalStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeLocalStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

/**
 * 身份证15,18位正则验证
 */
export const idCardRegexpVaild = idCard => {
    let idCardVaild = new RegExp("^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$|^[1-9]\\d{5}\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{2}[0-9Xx]$");
    let result = idCardVaild.test(String(idCard));
    return result;
}

/**
 * 手机正则验证
 */
export const mobileRegexpVaild = mobile => {
    //匹配1开头第二位跟3.4.5.7.8及后面9位数字
    let mobileVaild = new RegExp("^1[34578]\\d{9}$");
    let result = mobileVaild.test(Number(mobile));
    return result;
}

/**
 * 密码正则验证
 */
export const passwordRegexpVaild = password => {
    //(?![0-9]+$)匹配一次或者更多次不能只是0-9
    //(?![a-zA-Z]+$)匹配一次或者更多次不能只是大小写字母
    //数字和大小写字母
    //{8,20}不小于8位数不大于20位
    let passwordVaild = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$");
    let result = passwordVaild.test(String(password));
    return result;
}

/**
 * 邮箱正则验证
 */
export const emailRegexpVaild = email => {
    let emailVaild = new RegExp("[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?");
    let result = emailVaild.test(String(email));
    return result;
}

/**
 * 昵称正则验证
 */
export const nicknameRegexpVaild = nickname => {
    let nicknameVaild = new RegExp("^[\u4E00-\u9FA5A-Za-z0-9]+$");
    let result = nicknameVaild.test(String(nickname));
    return result;
}

/**
 * 非负正整数正则验证
 */
export const numberRegexpVaild = number => {
    let numberVaild = new RegExp("^[1-9]\\d*$");
    let result = numberVaild.test(String(number));
    return result;
}

/**
 * 非负带两个小数点正则验证
 */
export const floatRegexpVaild = float => {
    let floatVaild = new RegExp("(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)");
    let result = floatVaild.test(Number(float));
    return result;
}
/**
 * 秒转换天时分秒
 */
export const formatSeconds = time => {
    let result = time + '秒';
    if (time > 60) {
        let second = time % 60;
        let min = Math.floor(time / 60);
        result = min + '分' + second + '秒';
        if (min > 60) {
            min = Math.floor((time / 60) % 60);
            let hour = Math.floor((time / 60) / 60);
            result = hour + '小时' + min + '分' + second + '秒';
            if (hour > 24) {
                hour = Math.floor(((time / 60) / 60) % 24);
                let day = Math.floor((((time / 60) / 60) / 24));
                result = day + '天' + hour + '小时' + min + '分' + second + '秒';
            }
        }
    }
    return result;
}
/**
 * 判断终端
 */
export const browserRedirect = () => {
    let checkBrowser;
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        //pc
        checkBrowser = 1;
    }else{
        //wap
        checkBrowser = 2;
    }
    return checkBrowser;
}