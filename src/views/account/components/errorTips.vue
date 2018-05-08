<template>
    <!--提示-->
    <p class="error-tips" v-if="errorTips !== ''">{{ errorTips }}</p>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {

        }
    },
    computed: {
        //是否显示错误提示
        ...mapState({
            errorTips: state => state.account.errorTips
        })
    },
    methods: {
        ...mapMutations([
            'SET_ACCOUNT'
        ])
    },
    watch: {
        errorTips: function () {
            if (this.errorTips !== '') {
                let _this = this;
                setTimeout(function() {
                    _this.SET_ACCOUNT(['errorTips','']);
                }, 3000);
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// 提示信息
.error-tips{
	display: flex;
	justify-content: center;
	align-items: center;
    width: 750px;
    height: 76px;
    font-size: 30px;
    color: #02b4a3;
    background-color: #e0f2f1;
    position: absolute;
    top: 88px;
    left: 0;
} 
</style>