<template>
    <div class="star-list">
    	<img v-for="item in starArray" :src="starIcon[item]" alt="星星" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            starIcon: [
                require('../../../assets/icon/star_empty@2x.png'),
                require('../../../assets/icon/star_half_full@2x.png'),
                require('../../../assets/icon/star_full@2x.png')
            ]
        }
    },   
    props: {
        score: {
            type: Number,
            default: 0
        }
    },
    computed: {
        starArray: function () {
            let result = [];
            // 获取全星个数
            let fullNum = Math.floor(this.score);
            for (let i = 0; i < fullNum; i++) {
                result.push(2);
            }
            // 获取半星个数
            let halfNum = Math.ceil(this.score) - fullNum;
            for (let i = 0; i < halfNum; i++) {
                result.push(1);
            }
            // 获取无个数
            let zeroNum = 5 - fullNum - halfNum;
            for (let i = 0; i < zeroNum; i++) {
                result.push(0);
            }
            return result;
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.star-list{
	img{
		width: 24px;
		height: 24px;
		margin-right: 12px
	}
}
</style>