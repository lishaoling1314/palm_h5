<template>
    <div class="confirm">
        <div class="confirm-wrap">
            <p class="tips">{{ tips }}</p>
            <p class="operate">
                <span class="left-btn" :class="{'btn-click':sureClick}" @click="$emit('confirm')" @mousedown="sureClick = true" @mouseup="sureClick = false" @touchstart="sureClick = true" @touchend="sureClick = false">确认</span>
                <span class="right-btn" :class="{'white-click':cancelClick}" @click="$emit('cancel')" @mousedown="cancelClick = true" @mouseup="cancelClick = false" @touchstart="cancelClick = true" @touchend="cancelClick = false">取消</span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sureClick: false,
            cancelClick: false
        }
    },
    props:[
        'tips'
    ]
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.confirm{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(7,13,12,0.3);
    position: fixed;
    top: 0;
    left: 0;
    .confirm-wrap{
        width: 590px;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 84px 43px 74px;
        .tips{
            font-size: 34px;
            color: #101010;
            text-align: center;
        }
        .remark{
            width: 100%;
            min-height: 204px;
            font-size: 30px;
            color: #666666;
            background-color: #f2f4f4;
            border: none;
            resize: none; 
            margin-top: 56px;
            padding: 30px 22px;
        }
        .operate{
            display: flex;
            justify-content: center;
            margin-top: 70px;
            span{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 232px;
                height: 78px;
                font-size: 32px;
                border-radius: 10px;
                cursor: pointer;
            }
            .left-btn{
                color: #ffffff;
                background-color: #02b4a3;
                margin-right: 20px;
            }
            .right-btn{
                color: #333333;
                background-color: #ffffff;
                border: 2px solid #eeeeee;
                margin-left: 20px;
            }
        }
    }
}
</style>