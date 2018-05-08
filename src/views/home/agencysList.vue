<template>
    <div class="wrap">
        <!-- 顶部 -->
        <nav-return title="机构列表" :goBack="false" :goHome="false"></nav-return>
        <!-- 操作提示 -->
        <p class="operate-tip">请选择要加入的机构</p>
        <!-- 机构列表 -->
        <div class="agencys-list">
            <div class="agencys-info" :class="key === agencysKey? 'agencys-info-focus':''" v-for="(item,key) in list" @click="goToAgencys(item)" @mousedown="agencysKey = key" @mouseup="agencysKey = -1" @touchstart="agencysKey = key" @touchend="agencysKey = -1">
                <div class="logo-wrap">
                    <img class="logo" :src="item.logo_url" />
                </div>
                <p class="name">{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import navReturn from '@/components/common/navReturn';
import agencysInfo from '@/components/agencys/agencysInfo';

import { Indicator } from 'mint-ui';

import { AgencyList } from '@/service/agencys';

export default {
    data() {
        return {
            list: [],//机构列表
            agencysKey: -1
        }
    },
    components: {
        navReturn,
        agencysInfo
    },
    created: function () {
        // 获取机构列表
        this.getAgencyList();
    },
    methods: {
        //获取机构列表
        getAgencyList: async function () {
            Indicator.open();
            let res = await AgencyList();
            Indicator.close();
            if (res.errCode === 0 && res.data !== null) {
                this.list = res.data;
            }
        },
        //进入相应机构首页
        goToAgencys: function (agencys) {
            // 获取当前机构信息
            if (agencys !== undefined) {
                // 储存机构信息,时间为一天
                Cookies.set('agencysInfo', agencys, { expires: 1 });
                // 进入机构详情
                this.$router.push({path: agencys.name_py }); 
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
    min-height: 100vh;
    background: #ffffff;
    .operate-tip{
        font-size: 34px;
        color: #101010;
        margin: 55px 0 0 44px;
    }
    // 机构列表
    .agencys-list{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 750px;
        margin-top: 40px;
        .agencys-info{
            display: flex;
            align-items: center;
            width: 670px;
            height: 164px;
            background-color: #f2f4f4;
            border-radius: 10px;
            cursor: pointer;
            margin-bottom: 12px;
            .logo-wrap{
                width: 126px;
                height: 126px;
                overflow: hidden;
                border-radius: 50%;
                margin: 0 26px 0 78px;
                .logo{
                    width: 126px;
                }
            }
            .name{
                font-size: 34px;
                color: #333333;
            }
        }
        .agencys-info-focus{
            background-color: #e4e4e4;
        }
    }
}
</style>