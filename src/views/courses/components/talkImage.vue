<template>
    <div class="dialog" :class="[typeClass[type],directionClass[direction]]" :style="'background-image: url('+src+')'">
        <img ref="image" :src="src" :style="type === 1? 'border-color: #bdbdbd':'border-color: #04b2a3'">
    </div>
</template>
<script>
export default {
    data() {
        return {
            direction: 0, //0为横线，1为纵向
            directionClass: [
               'landscape',
               'vertical'
            ],
            typeClass: [
               'student',
               'teacher'
            ]
        }
    },
    props: [
        'src',
        'type'
    ],
    mounted: function() {
        let image = this.$refs.image;
        let width = image.width;
        let height = image.height;
        // 判断显示方向
        if (width / height < 1) {
            // 高比宽大则为纵向
            this.direction = 1;
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.dialog {
    border-radius: 4px;
    background-position: -9999px 0;
    background-repeat: no-repeat;
    position: relative;
    img {
        display: block;
        border: 2px solid;
        border-radius: 3px;
        margin: 0 -1px -1px -1px;
    }
}

// 横向
.landscape {
    height: auto;
    background-size: 180px auto;
    img {
        width: 180px;
    }
}

// 竖向
.vertical {
    height: 180px;
    background-size: auto 180px;
    img {
        height: 180px;
    }
}
// 学生
.student:after {
    content: '';
    position: absolute;
    top: 30px;
    right: -28px;
    border-width: 14px;
    border-style: solid;
    border-color: #ffffff #ffffff #ffffff transparent;
}
.student:before {
    content: '';
    position: absolute;
    top: 30px;
    right: -27px;
    border: solid #04b2a3;
    border-left-color: transparent;
    border-width: 14px;
    background-image: inherit;
    background-size: inherit;
    background-repeat: no-repeat;
    background-clip: border-box;
    background-origin: border-box;
}
// 老师
.teacher:after {
    content: '';
    position: absolute;
    top: 30px;
    left: -28px;
    border-width: 14px;
    border-style: solid;
    border-color: #ffffff transparent #ffffff #ffffff;
}
.teacher:before {
    content: '';
    position: absolute;
    top: 30px;
    left: -27px;
    border: solid #898888;
    border-right-color: transparent;
    border-width: 14px;
    background-image: inherit;
    background-size: inherit;
    background-repeat: no-repeat;
    background-clip: border-box;
    background-origin: border-box;
    background-position: 0px -6px;
}
</style>