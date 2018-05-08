<template>
	<div class="wrap">
	    <!-- 顶部 -->
	    <nav-return title="我的收藏" :goBackToLast="false" leavePath="/studentCenter">></nav-return>
        <!-- 课程菜单 -->
        <courses-list v-if="productList.length > 0" :courseList="productList" :isDelete="true"></courses-list>
    </div>
</template>
<script>
import navReturn from '@/components/common/navReturn';
import coursesList from '@/components/courses/coursesList';

import { Toast,Indicator } from 'mint-ui';

import { productFav } from '@/service/user';
export default {
    data() {
        return {
            agencysInfo: this.$route.params.agencysInfo,// 机构信息
            productList: []//收藏列表
        }
    },
    components: {
        navReturn,
        coursesList
    },
    created: function () {
        this.getProductFav();
    },
    methods: {
        //获取用户收藏
        getProductFav: async function () {
            Indicator.open();
            let res = await productFav(this.agencysInfo.id);
            Indicator.close();
            if (res.errCode === 0) {
                this.productList = res.data;
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else if(res.errCode === 20011){
                Toast('收藏列表为空');
            }else{
                Toast('获取用户收藏列表失败');
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>