<template>
    <div class="decorate-title">
    	<img src="../../assets/icon/decorate@2x.png">
    	<img src="../../assets/icon/decorate@2x.png">
    	<span>{{ title }}</span>
    	<img src="../../assets/icon/decorate@2x.png">
    	<img src="../../assets/icon/decorate@2x.png">
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    props: [
		'title'
    ]
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.decorate-title{
	display: flex;
    justify-content: center;
	align-items: center;
	img{
		width: 11px;
		height: 18px;
	}
	span{
		font-size: 32px;
		color: #323333;
		margin: 0 30px;
	}
}
</style>