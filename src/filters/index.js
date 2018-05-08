//去除a标签
export function deleteHref(str) {
    str = str.replace(/<a\s*[^>]*>/g,'');
    str = str.replace("</a>",'');
    return str;
}

//字符串截取
export function cutString(str, len) {
    if (str !== undefined && str !== null) {
        //length属性读出来的汉字长度为1 
        if (str.length * 2 <= len) {
            return str;
        }
        let strLength = 0;
        let newStr = '';
        for (let i = 0; i < str.length; i++) {
            newStr = newStr + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strLength = strLength + 2;
                if (strLength >= len) {
                    return newStr.substring(0, newStr.length - 1) + "...";
                }
            } else {
                strLength = strLength + 1;
                if (strLength >= len) {
                    return newStr.substring(0, newStr.length - 2) + "...";
                }
            }
        }
        return newStr;
    }
}

//数字转中文
export function numberToChinese(number) {
    let chineseArray = [
        '一','二','三','四','五',
        '六','七','八','九','十',
        '十一','十二','十三','十四','十五',
        '十六','十七','十八','十九','二十',
        '二十一','二十二','二十三','二十四','二十五',
        '二十六','二十七','二十八','二十九','三十'
    ];
    return chineseArray[number];
}

//级别数字转中文
export function levelToChinese(level) {
    let chineseArray = [
        '简单','中级','高级'
    ];
    return chineseArray[Number(level) - 1];
}

//时间戳转日期
export function timeToDate(time, isYear = false, isMonth = false, isDay = false, spot = false) {
    let date = new Date(parseInt(time) * 1000);
    let result = '';
    //获取年份
    if (isYear) {
        result = result + String(date.getFullYear()) + '-';
    }
    //获取月份
    if (isMonth) {
        result = result + String(date.getMonth() + 1) + '-';
    }
    //获取天
    if (isDay) {
        result = result + String(date.getDate());
    }
    //横线换为点
    if (spot) {
        result = result.replace(/-/g,'.');
    }
    return result;
}

