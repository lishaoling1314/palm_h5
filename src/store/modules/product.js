const product = {
    state: {
        coursesVideo: {
            material_url: ''
        },//课程视频链接
        coursesSelect: {},// 课程选择情况
        allCourses: false,//是否课程全选
        materialList: {},//资料id数组
        materialListLength: 0,//资料个数
    },
    getters: { 
        // 下载是否全选
        downLoadAll: state => {
        	let result = 1;
        	let coursesSelect = state.coursesSelect;
        	let keys = Object.keys(coursesSelect)
        	// 判断是否有未选的
        	keys.forEach(function(value) {
        		if (coursesSelect[value] === 0) {
        			result = 0;
        		}
        	})
            return result;
        }
    },
    mutations: {
        // 管理商品状态
        SET_PRODUCT: (state, info) => {
            state[info[0]] = info[1];
        },
        // 设置资料id数组
        SAVE_MATERIAL: (state, info) => {
            // 设置课程id为键,资料id选择情况对象为值
            state.materialList[info[0]] = info[1];
            let number = 0;
            // 获取对应课程已选的资料id列表
            let materialList = state.materialList;
            // 获取对应列表的资料id选择情况
            let materialValues = Object.values(materialList);
            // 遍历获得的id数组
            materialValues.forEach(function(materialSelect){
                // 获取资料id选择情况的键
                let materialSelectKeys = Object.keys(materialSelect);
                // 遍历资料id数组选择情况
                materialSelectKeys.forEach(function(values){
                    if (materialSelect[values] === 1) {
                        number++;
                    }
                })
            })
            state.materialListLength = number;
        }
    }
};

export default product;