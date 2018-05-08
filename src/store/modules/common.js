const common = {
    state: {
        tokenOutDate: false,//token过期
        appOffSetTop: 0,//app距离顶部的距离
    },
    getters: { 

    },
    mutations: {
        // 管理通用
        SET_COMMON: (state, info) => {
            state[info[0]] = info[1];
        }
    }
};

export default common;