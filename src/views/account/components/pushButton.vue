<template>
    <p class="push-button" :class="{'btn-status': btnStatus,'btn-click':btnClick}" @mousedown="btnClick = true" @mouseup="btnClick = false" @touchstart="btnClick = true" @touchend="btnClick = false">{{ text }}</p>
</template>
<script>
export default {
    data() {
        return {
           btnClick: false
        }
    },
    props: [
        'text',
        'btnStatus'
    ]
}
</script>
<style lang="scss" scoped>
.push-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 670px;
    height: 88px;
    border-radius: 10px;
    background-color: #02b4a3;
    font-size: 34px;
    color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
}
.btn-status{
    color: rgba(255, 255, 255, 1);
}
</style>
