<template>
    <div class="wrap">
    	<img class="head-image" ref="userImage" :src="userImage" alt="图像" />
    	<div class="bottom-btn">
    		<p class="cancel" @click="$router.go(-1);">取消</p>
    		<p class="confirm" @click="uploadImage">选取</p>
    	</div>
    </div>
</template>
<script>
import Cropper from 'cropperjs'
import { Toast,Indicator } from 'mint-ui';

import { userAvatar } from '@/service/user';

export default {
    data() {
        return {
        	agencysInfo: this.$route.params.agencysInfo,// 机构信息
        	userImage: '',//用户头像
        	cropper: '',
            imgWidth: 0,
            imgHeight: 0,
            startX: 0,
            startY: 0,

        }
    },
    created: function () {
        let imageInfo = this.$route.params.imageInfo;
        if (imageInfo !== undefined) {
        	this.userImage = window.URL.createObjectURL(imageInfo);
        }else{
            this.$router.go(-1)
        }
    },
    mounted: function () {
        // 获取作用域
        let _this = this;
    	let image = this.$refs.userImage;
        // 实例化插件
    	this.cropper = new Cropper(image, {
    		viewMode: 1,  
    		aspectRatio: 1,//图像的纵横比
    		autoCropArea: 1,//自动裁剪面积大小(百分比)
    		dragMode: 'move',//裁剪框只允许托单
    		background: false,//不显示网格背景
    		guides: false,//不显示虚线
    		cropBoxMovable: false,//不允许拖动裁剪框
    		cropBoxResizable: false,//不允通过拖动改变裁剪框大小
            crop: function(e) {
                _this.imgWidth = e.detail.width;
                _this.imgHeight = e.detail.height;
                _this.startX = e.detail.x;
                _this.startY = e.detail.y;
    		}   
    	});
    },
    methods: {
    	uploadImage: async function () {
            let imgFile = this.$route.params.imageInfo;
            Indicator.open();
            //判断水平起始点是否为负数
            if (this.startX < 0) {
                this.startX = 0;
            }
            let res = await userAvatar(this.agencysInfo.id,imgFile,this.imgWidth,this.imgHeight,this.startX,this.startY);
            Indicator.close();
            if (res.errCode === 0) {
                this.$router.go(-1);
            }else if (res.errCode === 10003 || res.errCode === 10005) {
                this.tokenOutOfDate();
            }else{
                Toast('修改头像失败');
            }
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.wrap{
    max-height: 100vh;
    background-color: #000000;
    position: relative;
    .bottom-btn{
    	display: flex;
    	justify-content: space-between;
    	align-items: center;
    	width: 750px;
    	height: 120px;
    	background-color: #0b0b0b;
    	padding: 0 30px;
    	position: fixed;
    	bottom: 0;
    	p{
    		font-size: 36px;
    		color: #ffffff;
    		cursor: pointer;
    	}
    }
}
</style>