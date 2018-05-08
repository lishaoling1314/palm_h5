import store from '../store';
export default {
    methods: {
    	// token过期,跳转到登陆页
    	tokenOutOfDate: function () {
            // 显示提示框
            store._mutations.SET_COMMON[0](['tokenOutDate',true]);
            // 删除本地local
            window.localStorage.removeItem('userInfo');
    	},
        // 页面跳转
        goToOther: function (path) {
            this.$router.push({path: '/' + this.agencysInfo.name_py + path});
        },
        // 进入详情
        goToDetail: function (path,params) {
            this.$router.push({path: '/' + this.agencysInfo.name_py + path,query: params});
        }
    }
}