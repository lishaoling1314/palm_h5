import Vue from 'vue';
import Vuex from 'vuex';
import account from './modules/account';
import product from './modules/product';
import common from './modules/common';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        account,
        product,
        common
    }
})