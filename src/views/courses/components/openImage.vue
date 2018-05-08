<template>
    <div class="wrap" @click="hideImage">
    	<img :src="img" alt="图片放大" />
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    props:[
		'img'
    ],
    methods: {
    	hideImage: function() {
			this.$emit('hideImage');
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: #000000;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 9999;
	img{
		max-width: 750px;
	}
}
</style>