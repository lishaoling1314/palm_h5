<template>
    <div class="directory">
        <!-- 课程名 -->
    	<p class="courses-name">
    	    <!-- select判断是否显示下载选择按钮 -->
    	    <!-- allHasMaterial,selectChaptersArray,selectSectionArray判断子级是否有可以资料下载 -->
    		<img v-if="select" class="select-icon" :class="[allHasMaterial ? '' : 'select-opacity']" :src="selectIcon[allSelect]" alt="选择" @click="coursesAllSelect" />
    		<span>{{ coursesDirectory.course_name | cutString(35) }}</span>
    	</p>
    	<!-- 大章 -->
    	<div class="chapters" v-for="(chapters,chaptersKey) in coursesDirectory.lesson_list">
    		<div class="chapters-content">
    			<p class="chapters-info">
    				<img v-if="select" class="select-icon" :class="[chaptersHasMaterial[chapters.id] === 1 ? '' : 'select-opacity']" :src="selectChaptersArray[chapters.id] === 1 ? selectIcon[1] : selectIcon[0]" alt="选择" @click="chaptersSelect(chapters.id)" />
    				<span class="chapters-number">{{ chapters.number }}</span>
    				<span class="chapters-name">{{ chapters.name | cutString(35)}}</span>
    			</p>
                <!-- 没有子级则隐藏下拉按钮 -->
    			<img class="dropdown" v-if="chapters['material'].length > 0 || chapters['child'].length > 0" src="../../../assets/icon/open_gray@2x.png" alt="章节展开" @click="toggleChild(1, chapters.id)" />
    		</div>
			<!-- 大章材料 -->
			<p class="chapters-material" v-if="toggleChaptersArray[chapters.id] === 1" v-for="chaptersMaterial in chapters.material">
				<img v-if="select" class="select-icon" :src="selectMaterialArray[chaptersMaterial.id] === 1? selectIcon[1] : selectIcon[0]"  alt="选择" @click="materialSelect(chaptersMaterial.id,1,chapters.id)" />
				<img v-if="Number(chaptersMaterial.type) === 2" class="video-icon" src="../../../assets/icon/catalog_play@2x.png" alt="视频文件" @click="playVideo(chaptersMaterial)" />
				<img v-else class="directory-icon" src="../../../assets/icon/catalog_folder@2x.png" alt="其他文件" />
				<span class="download-name" @click="playVideo(chaptersMaterial)">{{ chaptersMaterial.material_name | cutString(35) }}</span>
			</p>
    		<!-- 小节 -->
    		<div class="section" v-if="toggleChaptersArray[chapters.id] === 1" v-for="(section,sectionKey) in chapters.child">
    			<div class="section-content">
    				<p class="section-info">
    					<img v-if="select" class="select-icon" :class="[sectionHasMaterial[section.id] === 1 ? '' : 'select-opacity']" :src="selectSectionArray[section.id] === 1 ? selectIcon[1] : selectIcon[0]" alt="选择" @click="sectionSelect(chapters.id,section.id)" />
    					<span class="section-number">{{ section.number }}</span>
    					<span class="section-name">{{ section.name | cutString(35) }}</span>
    				</p>
    				<!-- 没有子级则隐藏下拉按钮 -->
    				<img class="dropdown" v-if="section['material'].length > 0 || section['child'].length > 0" src="../../../assets/icon/open_gray@2x.png" alt="章节展开" @click="toggleChild(2, section.id)" />
    			</div>
    			<!-- 小节材料 -->
				<p class="section-material" v-if="toggleSectionArray[section.id] === 1" v-for="sectionMaterial in section.material">
					<img v-if="select" class="select-icon" :src="selectMaterialArray[sectionMaterial.id] === 1 ? selectIcon[1] : selectIcon[0]" alt="选择" @click="materialSelect(sectionMaterial.id,2,chapters.id,section.id)" />
					<img v-if="Number(sectionMaterial.type) === 2" class="video-icon" src="../../../assets/icon/catalog_play@2x.png" alt="视频文件" @click="playVideo(sectionMaterial)" />
					<img v-else class="directory-icon" src="../../../assets/icon/catalog_folder@2x.png" alt="其他文件" />
					<span class="download-name" @click="playVideo(sectionMaterial)">{{ sectionMaterial.material_name | cutString(35)  }}</span>
				</p>
    		</div>
    	</div>
    </div>
</template>
<script>
import { Toast,Indicator } from 'mint-ui';
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
        	allSelect: 0,//当前全选
        	selectChaptersArray: {},//大章资料id选择情况
        	selectSectionArray: {},//小节资料id选择情况
        	selectMaterialArray: {},//资料id选择情况
        	toggleChaptersArray: {},//大章展开情况
        	toggleSectionArray: {},//小节展开情况
        	chaptersHasMaterial: {},//大章是否有资料情况
        	sectionHasMaterial: {},//小节是否有资料情况
			selectIcon:[
				require('../../../assets/icon/catalog_default@2x.png'),
	            require('../../../assets/icon/catalog_selected@2x.png')
			]
        }
    },
    props: {
    	// 课程目录
	    coursesDirectory: {
	    	type: Object,
            default: function () {
                return {
                	lesson_list: []
                }
            }
	    },
		// 是否显示选择按钮
		select: {
			default: false
		},
        // 是否有学习资格
        isRead: {
            default: 0
        }
    },
    created: function () {
		this.directoryInit(true);
		this.materialInit();
    },
    computed:{
    	...mapState({
    	    coursesSelect: state => state.product.coursesSelect,
    	    allCourses: state => state.product.allCourses
    	}),
    	// 判断全选按钮是否显示
    	allHasMaterial: function () {
    		let result = false;
    		// 获取值
    		let selectStatus = Object.values(this.chaptersHasMaterial);
			selectStatus.forEach(function (value) {
				if (value === 1) {
					result = true;
					return false;
				}
			});
			return result;
    	}
    },
    methods: {
    	...mapMutations([
    	    'SET_PRODUCT',
    	    'SAVE_MATERIAL'
    	]),
    	// 设置所有大章小节默认为未全选和未展开
    	directoryInit: function (openDirectory) {
    		// 获取作用域
    		let _this = this;
			// 定义空数组
			let selectChaptersArray = {};
			let selectSectionArray = {};
			let toggleChaptersArray = {};
			let toggleSectionArray = {};
			// 获取课程信息
	        let lessonList = this.coursesDirectory.lesson_list;
	        // 遍历课程信息
	        lessonList.forEach(function(chapters){
	        	// 设置所有大章未未选
	        	selectChaptersArray[chapters.id] = _this.allSelect;
	        	// 设置所有大章未展开
	        	toggleChaptersArray[chapters.id] = 1;
	        	// 遍历小节信息
	        	chapters.child.forEach(function(section){
	        		// 设置所有小节未未选
	        		selectSectionArray[section.id] = _this.allSelect;
	        		// 设置所有小节未展开
	        		toggleSectionArray[section.id] = 1;
	        	})
	        })
	        // 赋值
	        this.selectChaptersArray = selectChaptersArray;
	        this.selectSectionArray = selectSectionArray;
	        this.toggleChaptersArray = toggleChaptersArray;
	        this.toggleSectionArray = toggleSectionArray;
    	},
    	// 获取所有资料id未被选择
    	materialInit: function () {
    		// 获取作用域
    		let _this = this;
			// 定义空数组
			let chaptersHasMaterial = {};
			let sectionHasMaterial = {};
			let selectMaterialArray = {};
			// 获取课程信息
	        let lessonList = this.coursesDirectory.lesson_list;
	        // 遍历课程信息
	        lessonList.forEach(function(chapters){
	        	// 判断是大章包含资料
	        	if (chapters.material.length > 0) {
	        		// 大章包含资料设为1
	        		chaptersHasMaterial[chapters.id] = 1;
	        	}else{
	        		// 大章包含资料设为0
	        		chaptersHasMaterial[chapters.id] = 0;
	        	}
	        	// 获取大章的资料id
	        	chapters.material.forEach(function(chaptersMaterial){
	        		selectMaterialArray[chaptersMaterial.id] = _this.allSelect;
	        	})
	        	// 遍历小节信息
	        	chapters.child.forEach(function(section){
	        		// 判断是小节是否有包含资料
	        		if (section.material.length > 0) {
	        			// 小节有资料设置大章包含资料为1
	        			chaptersHasMaterial[section.parent_id] = 1;
	        			sectionHasMaterial[section.id] = 1;
	        		}else{
	        			sectionHasMaterial[section.id] = 0;
	        		}
	        		// 获取小节的资料id
	        		section.material.forEach(function(sectionMaterial){
	        			selectMaterialArray[sectionMaterial.id] = _this.allSelect;
	        		})
	        	})
	        })
	        this.chaptersHasMaterial = chaptersHasMaterial;
	        this.sectionHasMaterial = sectionHasMaterial;
	        this.selectMaterialArray = selectMaterialArray;
	        //更新store的资料id
	        this.updateStore();
    	},
    	// 展开/缩回子级
    	toggleChild: function (type, id) {
    		//判断层级
    		if (type === 1) {
                // 判断展开还是收回
    			if (this.toggleChaptersArray[id] === 1) {
    				this.toggleChaptersArray[id] = 0;
    			}else{
    				this.toggleChaptersArray[id] = 1;
    			}
    		}else{
	            // 判断展开还是收回
				if (this.toggleSectionArray[id] === 1) {
					this.toggleSectionArray[id] = 0;
				}else{
					this.toggleSectionArray[id] = 1;
				}
    		}

    	},
    	// 课程全选
    	coursesAllSelect: function () {
    		// 判断是否为全选
            this.allSelect === 0? this.allSelect = 1: this.allSelect = 0;
            // 重置结果
            this.directoryInit();
            this.materialInit();
            // 设置store的课程选择情况
            this.setCoursesSelect();
    	},
    	// 设置store的课程选择状态
    	setCoursesSelect: function () {
    		// 设置store的课程选择情况
    		let coursesSelect = this.coursesSelect;
    		let courseId = this.coursesDirectory.course_id;
    		coursesSelect[courseId] = this.allSelect;
    		this.SET_PRODUCT(['coursesSelect',coursesSelect]);
    	},
    	// 判断是否课程全选
    	checkCoursesAll: function () {
			// 获取作用域
			let _this = this;
			// 判断课程全选
			let result = true;
			let chaptersKeys = Object.keys(this.selectChaptersArray);
			chaptersKeys.forEach(function(value){
				//判断是否有大章未选
                if (_this.selectChaptersArray[value] === 0) {
                	result = false;
                }
			})
			// 设置为为全选
			this.allSelect = 0;
			// 判断是否全选
			if (result) {
				// 全选
				this.coursesAllSelect();
			}else{
				// 设置store的课程选择情况
				this.setCoursesSelect();
			}
			//更新store的资料id
			this.updateStore();
    	},
    	// 大章选择
    	chaptersSelect: function (chaptersId) {
    		// 判断是否已选择
    		if (this.selectChaptersArray[chaptersId] === 1) {
    			this.selectChaptersArray[chaptersId] = 0;
    			this.childAllSelect(1,0,chaptersId);
    		}else{
    			this.selectChaptersArray[chaptersId] = 1;
    			this.childAllSelect(1,1,chaptersId);
    		}
    		// 判断是否课程全选
    		this.checkCoursesAll();
    	},
    	// 小节选择
    	sectionSelect: function (chaptersId,sectionId) {
    		// 判断是否已选择
    		if (this.selectSectionArray[sectionId] === 1) {
    			this.selectSectionArray[sectionId] = 0;
    			this.childAllSelect(2,0,chaptersId,sectionId);
    		}else{
    			this.selectSectionArray[sectionId] = 1;
    			this.childAllSelect(2,1,chaptersId,sectionId);
    		}
    	},
    	// 判断章节子级是否全选:章节,是否全选,大章id,小节id
    	childAllSelect: function (type,result,chaptersId,sectionId) {
     		// 获取作用域
     		let _this = this;
 			// 获取课程信息
 	        let lessonList = this.coursesDirectory.lesson_list;
			// 遍历课程信息
			lessonList.forEach(function(chapters){
				if (chapters.id === chaptersId) {
					// 判断是否为大章
					if (type === 1) {
						// 大章下的资料
						chapters.material.forEach(function(chaptersMaterial){
					        _this.selectMaterialArray[chaptersMaterial.id] = result;
						})
						// 大章下的小节
						chapters.child.forEach(function(section){
					        _this.selectSectionArray[section.id] = result;
					        // 小节的资料
					        section.material.forEach(function(sectionMaterial){
					        	_this.selectMaterialArray[sectionMaterial.id] = result;
					        })
						})
					}else{
						// 遍历小节信息
						chapters.child.forEach(function(section){
							if (section.id === sectionId) {
								// 小节的资料
								section.material.forEach(function(sectionMaterial){
									_this.selectMaterialArray[sectionMaterial.id] = result;
								})
								// 判断大章全选情况
								_this.sectionParentSelect(chaptersId);
							}
						})
					}
				}
			})
			//更新store的资料id
			this.updateStore();
    	},
    	// 判断小节父级是否全选
    	sectionParentSelect: function (chaptersId) {
    		// 获取作用域
    		let _this = this;
			// 获取课程信息
	        let lessonList = this.coursesDirectory.lesson_list;
	        // 默认全选
	        let result = 1;
            // 遍历大章下的资料和小节(不包括小节下的资料)
			lessonList.forEach(function(chapters){
				if (chapters.id === chaptersId) {
					// 大章下的资料
					chapters.material.forEach(function(chaptersMaterial){
				        let materialResult = _this.selectMaterialArray[chaptersMaterial.id];
				        if (materialResult === 0) {
				        	result = 0;
				        }
					})
					// 大章下的小节
					chapters.child.forEach(function(section){
						let sectionResult = _this.selectSectionArray[section.id];
						if (sectionResult === 0) {
							result = 0;
						}
					})
				}
			})
			this.selectChaptersArray[chaptersId] = result;
			// 判断是否课程全选
			this.checkCoursesAll();
    	},
    	// 资料下载选择:资料id,父级id,父级层级(1为大章,2为小节)
    	materialSelect: function (materialId,type,chaptersId,sectionId) {
    		// 判断是否已选择
    		if (this.selectMaterialArray[materialId] === 1) {
    			this.selectMaterialArray[materialId] = 0
    		}else{
    			this.selectMaterialArray[materialId] = 1
    		}
    		this.materialParentSelect(type,chaptersId,sectionId);
    	},
    	// 判断资料父级是否全选(大章下的资料父级为大章，小节下的资料父级为小节)
    	materialParentSelect: function (type,chaptersId,sectionId) {
    		// 获取作用域
    		let _this = this;
    		// 定义一个小节数组
    		let sectionArray = [];
    		// 定义一个资料数组
    		let materialArray = [];
			// 获取课程信息
	        let lessonList = this.coursesDirectory.lesson_list;
    		if (type === 1) {
                // 遍历课程信息
                lessonList.forEach(function(chapters){
                	// 获取大章的资料所有资料id
                	if (chapters.id === chaptersId) {
                		// 获取小节id
                		chapters.child.forEach(function(section){
                			sectionArray.push(section.id);
                		})
                		// 获取资料id
                		chapters.material.forEach(function(chaptersMaterial){
                			materialArray.push(chaptersMaterial.id);
                		})
                	}
                })
    		}else{
    			// 遍历课程信息
    			lessonList.forEach(function(chapters){
    				if (chapters.id === chaptersId) {
	    				// 遍历小节信息
	    				chapters.child.forEach(function(section){
	    					if (section.id === sectionId) {
	    						// 获取小节的资料id
	    						section.material.forEach(function(sectionMaterial){
	    							materialArray.push(sectionMaterial.id);
	    						})
	    					}
	    				})
	    			}
    			})
    		}
    		// 获取当前层级的资料个数
    		let curLength = materialArray.length;
    		// 设置已选个数初始为0
    		let selectedlength = 0;
    		materialArray.forEach(function(value){
    			let result = _this.selectMaterialArray[value];
    			if (result === 1) {
    				selectedlength ++;
    			}
    		})
    		// 判读是否全选
            if (curLength === selectedlength) {
            	// 判断是否为设置小节
                if (type === 2) {
                	// 是则设置对应小节未全选
                	this.selectSectionArray[sectionId] = 1;
                }
				// 获取作用域
				let _this = this;
				// 默认大章已全选
				let result = 1;
				// 遍历当前大章下的小节id数组
				sectionArray.forEach(function(value){
					//判断是否有小节未选
	                if (_this.selectSectionArray[value] === 0) {
	                	result = 0;
	                }
				})
            	// 设置大章结果
				this.selectChaptersArray[chaptersId] = result;
            }else{
            	// 当前大章设为未全选
            	this.selectChaptersArray[chaptersId] = 0;
            	// 判断是否为设置小节
            	if (type === 2) {
            		this.selectSectionArray[sectionId] = 0;
            	}
            }
            // 判断是否课程全选
            this.checkCoursesAll();
            //更新store的资料id
            this.updateStore();
    	},
    	// 进行store更新
    	updateStore: function () {
    		this.SAVE_MATERIAL([this.coursesDirectory.course_id,this.selectMaterialArray]);
    	},
    	// 视频播放
    	playVideo: function (materialInfo) {
            let routeName = this.$route.name;
    		//判断类型且在学习页
    		if (Number(materialInfo.type) === 2 && routeName === 'coursesStudy') {
    			//设置新的视频链接
    			this.SET_PRODUCT(['coursesVideo',materialInfo]);
    			// Chrome
    			document.body.scrollTop = 0;
    			// Firefox
    			document.documentElement.scrollTop = 0;
    		}else{
                // 若在课程信息页内
                if (routeName === 'coursesInfo') {
                    if (Number(this.isRead) === 1) {
                        Toast("点击马上学习按钮，进入课程学习~");
                    }else{
                        Toast("请先申请报读或购买课程");
                    }
                }
            }
    	}
    },
    watch: {
    	// 监听是否所有课程全选
    	allCourses: function () {
    		let courseId = this.coursesDirectory.course_id;
			// 判断是否为全选
	        this.allSelect = this.coursesSelect[courseId];
	        // 重置结果
	        this.directoryInit();
	        this.materialInit();
    	}
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.directory{
	padding-left: 30px;
	// 课程名
	.courses-name{
		display: flex;
		align-items: center;
		.select-icon{
			width: 34px;
			height: 34px;
			cursor: pointer;
			margin-right: 13px;
		}
		.select-opacity{
			opacity: 0;
			cursor: default;
		}
		span{
			font-size: 32px;
			color: #333333;
		}
	}
	// 大章
	.chapters{
		.chapters-content{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 43px 30px 30px 0;
			border-bottom: 2px solid #eeeeee;
			// 大章信息
			.chapters-info{
				display: flex;
				align-items: center;
				.select-icon{
					width: 34px;
					height: 34px;
					cursor: pointer;
					margin-right: 13px;
				}
				.select-opacity{
					opacity: 0;
					cursor: default;
				}
				.chapters-number{
					font-size: 28px;
					color: #02b4a3;
					margin-right: 23px;
				}
				.chapters-name{
					font-size: 28px;
					color: #333333;
				}
			}
			// 展开
			.dropdown{
				width: 22px;
				height: 12px;
				cursor: pointer;
			}
		}
		// 大章材料
		.chapters-material{
			display: flex;
			align-items: center;
			padding: 22px 30px 22px 40px;
			border-bottom: 1px solid #eeeeee;
			.select-icon{
				width: 34px;
				height: 34px;
				cursor: pointer;
				margin-right: 13px;
			}
			.video-icon{
				width: 30px;
				height: 30px;
				cursor: pointer;
				margin: 0 16px 0 20px;
			}
			.directory-icon{
				width: 27px;
				height: 25px;
				margin: 0 16px 0 20px;
			}
			.download-name{
				font-size: 24px;
				color: #666666;
				cursor: pointer;
			}
		}
		// 小节
		.section{
			.section-content{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 22px 30px 22px 40px;
				border-bottom: 2px solid #eeeeee;
				// 小节信息
				.section-info{
					display: flex;
					align-items: center;
					.select-icon{
						width: 34px;
						height: 34px;
						cursor: pointer;
						margin-right: 13px;
					}
					.select-opacity{
						opacity: 0;
						cursor: default;
					}
					.section-number{
						font-size: 28px;
						color: #02b4a3;
						margin-right: 23px;
					}
					.section-name{
						font-size: 24px;
						color: #666666;
					}
				}
				// 展开
				.dropdown{
					width: 22px;
					height: 12px;
					cursor: pointer;
				}
			}
			// 小节材料
			.section-material{
				display: flex;
				align-items: center;
				padding: 22px 30px 22px 40px;
				border-bottom: 2px solid #eeeeee;
				.select-icon{
					width: 34px;
					height: 34px;
					cursor: pointer;
					margin-right: 13px;
				}
				.video-icon{
					width: 30px;
					height: 30px;
					cursor: pointer;
					margin: 0 16px 0 95px;
				}
				.directory-icon{
					width: 27px;
					height: 25px;
					margin: 0 16px 0 95px;
				}
				.download-name{
					font-size: 24px;
					color: #666666;
					cursor: pointer;
				}
			}
		}
	}
}
</style>