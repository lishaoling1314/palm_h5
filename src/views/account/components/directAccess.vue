<template>
    <div class="content">
        <div class="content-try">
            <div class="line"></div>
            <p>您还可以尝试</p>
            <div class="line"></div>
        </div>
        <p class="content-text" v-if="text !== ''" @click="operateOne">{{ text }}</p>
        <p class="content-contact" :class="text !== ''? 'content-contact-margin':''" v-if="contact !== ''" @click="operateTwo">{{ contact }}</p>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props: {
        text: {
            default: ''
        },
        contact: {
            default: ''
        }
    },
    methods: {
        operateOne: function() {
            this.$emit('operateOne');
        },
        operateTwo: function() {
            this.$emit('operateTwo');
        }
    }
}
</script>
<style lang="scss" scoped>
.content{
    .content-try{
        width: 670px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 54px;
            .line{
                width: 224px;
                height: 2px;
                background-color: #f2f4f4;
                margin-top: 15px;
            }
            p{
                font-size: 28px;
                color:#999
            }
    }
    .content-text{
        font-size: 30px;
        color:#666;
        text-align: center;
        cursor: pointer;
        margin-bottom: 84px;
    }
    .content-contact{
        font-size: 28px;
        color:#666;
        text-align: center;
        cursor: pointer;
        margin-bottom: 84px;
    }
    .content-contact-margin{
        margin-top: -30px;
    }
}
</style>

