webpackJsonp([15],{CACe:function(e,t,n){var i=n("UGQG");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);n("rjj0")("207020a0",i,!0)},QIcz:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("Xxa5"),a=n.n(i),r=n("exGp"),A=n.n(r),o=n("Dd8w"),s=n.n(o),l=n("wE2Q"),p=n("bq1r"),m=n("VduC"),u=n("b4Wq"),c=(n("lbHh"),n("Au9i")),d=n("NYxO"),C=n("jb+T"),f=n("0xDb"),B={data:function(){return{studentInfo:{},agencysInfo:this.$route.params.agencysInfo,realName:"",email:"",dept:"",career:"",studentNo:"",nameEmpty:!1,emailEmpty:!1}},beforeRouteLeave:function(e,t,n){this.InitAcconut(),n()},components:{decorateTitle:l.a,agencysInfo:p.a,pushButton:m.a,errorTips:u.a},created:function(){this.getStudentInfo()},computed:{submitCheck:function(){var e=!1,t=!1;return""!==this.email&&(t=Object(f.b)(this.email)),""!==this.realName&&t&&(e=!0),e}},methods:s()({},Object(d.c)(["SET_ACCOUNT","InitAcconut"]),{getStudentInfo:function(){var e=A()(a.a.mark(function e(){var t,n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(C.e)(this.agencysInfo.id);case 2:0===(t=e.sent).errCode&&t.data?(n=t.data,this.realName=n.truename,this.email=n.email,this.dept=n.dept,this.career=n.career,this.studentNo=n.student_no):10003===t.errCode||10005===t.errCode?this.tokenOutOfDate():this.studentInfo={};case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),submitInfo:function(){var e=A()(a.a.mark(function e(){var t,n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(""!==this.realName&&null!==this.realName){e.next=4;break}return this.nameEmpty=!0,this.SET_ACCOUNT(["errorTips","真实姓名不能为空"]),e.abrupt("return",!1);case 4:if(""!==this.email&&null!==this.email){e.next=8;break}return this.emailEmpty=!0,this.SET_ACCOUNT(["errorTips","邮箱不能为空"]),e.abrupt("return",!1);case 8:if(Object(f.b)(this.email)){e.next=12;break}return this.emailEmpty=!0,this.SET_ACCOUNT(["errorTips","邮箱格式不正确"]),e.abrupt("return",!1);case 12:return c.Indicator.open("正在提交申请"),e.next=15,Object(C.a)(this.agencysInfo.id,this.realName,this.email,this.dept,this.career,this.studentNo);case 15:t=e.sent,c.Indicator.close(),0===(n=t.errCode)?this.goToOther("/authResult"):10026===n?this.SET_ACCOUNT(["errorTips","机构不存在"]):10031===n?this.SET_ACCOUNT(["errorTips","提交失败"]):10032===n?this.SET_ACCOUNT(["errorTips","真实姓名不能为空"]):10033===n?this.SET_ACCOUNT(["errorTips","邮箱不能为空"]):10052===n&&this.goToOther("/authResult");case 19:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()})},b={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"wrap"},[i("error-tips"),e._v(" "),i("agencys-info",{staticClass:"mechanism"}),e._v(" "),i("decorate-title",{staticClass:"decorate-title",attrs:{title:"认证信息"}}),e._v(" "),i("div",{staticClass:"info-input",class:e.nameEmpty?"empty-tips-border":""},[i("img",{staticClass:"must",attrs:{src:n("bwdY"),height:"18",width:"23"}}),e._v(" "),i("p",{staticClass:"info-title"},[e._v("真实姓名")]),e._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:e.realName,expression:"realName"}],attrs:{type:"text",placeholder:"您的姓名"},domProps:{value:e.realName},on:{keyup:function(t){e.nameEmpty=!1},input:function(t){t.target.composing||(e.realName=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"info-input",class:e.emailEmpty?"empty-tips-border":""},[i("img",{staticClass:"must",attrs:{src:n("bwdY"),height:"18",width:"23"}}),e._v(" "),i("p",{staticClass:"info-title"},[e._v("邮箱")]),e._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"text",placeholder:"应急邮箱",maxlength:"20"},domProps:{value:e.email},on:{keyup:function(t){e.emailEmpty=!1},input:function(t){t.target.composing||(e.email=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"info-input"},[i("p",{staticClass:"info-title title-margin"},[e._v("部门/专业")]),e._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:e.dept,expression:"dept"}],attrs:{type:"text",placeholder:"您的部门/专业"},domProps:{value:e.dept},on:{input:function(t){t.target.composing||(e.dept=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"info-input"},[i("p",{staticClass:"info-title title-margin"},[e._v("职务/班级")]),e._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:e.career,expression:"career"}],attrs:{type:"text",placeholder:"您的职务/班级"},domProps:{value:e.career},on:{input:function(t){t.target.composing||(e.career=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"info-input"},[i("p",{staticClass:"info-title title-margin"},[e._v("员工证/学生证")]),e._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:e.studentNo,expression:"studentNo"}],attrs:{type:"text",placeholder:"您的员工证/学生证"},domProps:{value:e.studentNo},on:{input:function(t){t.target.composing||(e.studentNo=t.target.value)}}})]),e._v(" "),i("push-button",{staticClass:"push-button",attrs:{text:"提交申请",btnStatus:e.submitCheck},nativeOn:{click:function(t){e.submitInfo(t)}}})],1)},staticRenderFns:[]},h=n("VU/8")(B,b,!1,function(e){n("CACe")},"data-v-97609ebe",null);t.default=h.exports},UGQG:function(e,t,n){(e.exports=n("FZ+f")(!0)).push([e.i,"\n.wrap[data-v-97609ebe] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: 10rem;\n  min-height: 100vh;\n  background-color: #ffffff;\n  padding-top: 1.333333rem;\n  position: relative;\n}\n.wrap .decorate-title[data-v-97609ebe] {\n  margin: 0.96rem 0 0.533333rem;\n}\n.wrap .info-input[data-v-97609ebe] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: 8.933333rem;\n  height: 1.173333rem;\n  border-bottom: 0.026667rem solid #eeeeee;\n  margin-top: 0.266667rem;\n}\n.wrap .info-input .must[data-v-97609ebe] {\n  width: 0.2rem;\n  height: 0.213333rem;\n  margin: 0 0.133333rem;\n}\n.wrap .info-input .info-title[data-v-97609ebe] {\n  width: 3.133333rem;\n  font-size: 0.453333rem;\n  color: #666666;\n}\n.wrap .info-input .title-margin[data-v-97609ebe] {\n  margin-left: 0.466667rem;\n}\n.wrap .info-input input[data-v-97609ebe] {\n  height: 1.08rem;\n  font-size: 0.453333rem;\n  color: #333333;\n  border: none;\n  padding-top: 0.026667rem;\n}\n.wrap .info-input input[data-v-97609ebe]::-webkit-input-placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]:-ms-input-placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]::-ms-input-placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]::placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]:focus {\n  outline: none;\n}\n.wrap .empty-tips-border[data-v-97609ebe] {\n  border: 0.026667rem solid #fa4343;\n  border-radius: 0.133333rem;\n}\n.wrap .push-button[data-v-97609ebe] {\n  margin-top: 1.6rem;\n}","",{version:3,sources:["D:/项目文件/demo/palm-h5/src/views/account/informationAuth.vue"],names:[],mappings:";AACA;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,6BAA6B;EAC7B,8BAA8B;MAC1B,2BAA2B;UACvB,uBAAuB;EAC/B,0BAA0B;MACtB,uBAAuB;UACnB,oBAAoB;EAC5B,aAAa;EACb,kBAAkB;EAClB,0BAA0B;EAC1B,yBAAyB;EACzB,mBAAmB;CACpB;AACD;EACE,8BAA8B;CAC/B;AACD;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,0BAA0B;MACtB,uBAAuB;UACnB,oBAAoB;EAC5B,mBAAmB;EACnB,oBAAoB;EACpB,yCAAyC;EACzC,wBAAwB;CACzB;AACD;EACE,cAAc;EACd,oBAAoB;EACpB,sBAAsB;CACvB;AACD;EACE,mBAAmB;EACnB,uBAAuB;EACvB,eAAe;CAChB;AACD;EACE,yBAAyB;CAC1B;AACD;EACE,gBAAgB;EAChB,uBAAuB;EACvB,eAAe;EACf,aAAa;EACb,yBAAyB;CAC1B;AACD;EACE,uBAAuB;EACvB,eAAe;CAChB;AACD;EACE,uBAAuB;EACvB,eAAe;CAChB;AACD;EACE,uBAAuB;EACvB,eAAe;CAChB;AACD;EACE,uBAAuB;EACvB,eAAe;CAChB;AACD;EACE,cAAc;CACf;AACD;EACE,kCAAkC;EAClC,2BAA2B;CAC5B;AACD;EACE,mBAAmB;CACpB",file:"informationAuth.vue",sourcesContent:["\n.wrap[data-v-97609ebe] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: 10rem;\n  min-height: 100vh;\n  background-color: #ffffff;\n  padding-top: 1.333333rem;\n  position: relative;\n}\n.wrap .decorate-title[data-v-97609ebe] {\n  margin: 0.96rem 0 0.533333rem;\n}\n.wrap .info-input[data-v-97609ebe] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: 8.933333rem;\n  height: 1.173333rem;\n  border-bottom: 0.026667rem solid #eeeeee;\n  margin-top: 0.266667rem;\n}\n.wrap .info-input .must[data-v-97609ebe] {\n  width: 0.2rem;\n  height: 0.213333rem;\n  margin: 0 0.133333rem;\n}\n.wrap .info-input .info-title[data-v-97609ebe] {\n  width: 3.133333rem;\n  font-size: 0.453333rem;\n  color: #666666;\n}\n.wrap .info-input .title-margin[data-v-97609ebe] {\n  margin-left: 0.466667rem;\n}\n.wrap .info-input input[data-v-97609ebe] {\n  height: 1.08rem;\n  font-size: 0.453333rem;\n  color: #333333;\n  border: none;\n  padding-top: 0.026667rem;\n}\n.wrap .info-input input[data-v-97609ebe]::-webkit-input-placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]:-ms-input-placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]::-ms-input-placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]::placeholder {\n  font-size: 0.453333rem;\n  color: #999999;\n}\n.wrap .info-input input[data-v-97609ebe]:focus {\n  outline: none;\n}\n.wrap .empty-tips-border[data-v-97609ebe] {\n  border: 0.026667rem solid #fa4343;\n  border-radius: 0.133333rem;\n}\n.wrap .push-button[data-v-97609ebe] {\n  margin-top: 1.6rem;\n}"],sourceRoot:""}])},bwdY:function(e,t){e.exports="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+EDjWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjUyMzhhNjZiLTY1MmUtZTE0ZC04YzEwLWE2NjBhNmM0OWU5NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Qzk3QjNCMUI4NjUxMUU3OTdCQ0M1MjhBMjFGN0NGMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Qzk3QjNCMEI4NjUxMUU3OTdCQ0M1MjhBMjFGN0NGMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZWI0MTBkZi0yMTkxLTM2NDYtODEwMi1mNzcxMGVlNWIxZGYiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxOWUxYjNiNy1iODY1LTExZTctOGQ1MS1jNTk0N2Q4MDMxNGMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCAASABcDAREAAhEBAxEB/8QAdgAAAgMBAAAAAAAAAAAAAAAAAAUDBAYIAQACAwEAAAAAAAAAAAAAAAAAAwIEBQEQAAEDBAEEAQUAAAAAAAAAAAIBAwUAERIEEyExFAZhQVEyQiMRAAEDAwQCAwEAAAAAAAAAAAEAEQIxEgMhQVEEYYEiUhMk/9oADAMBAAIRAxEAPwDpmXn4yI4SkDJlp5SRHsDJsVG35kKKgXv0vUoxJoq3Y7ePC15YHdi3s7e0iZ9jh2vZpHbdlGkjvC1SaNXkVnIjdQsEvbJUFO3WmWG0BtXVCPdxjPORmLLIb6VlRPNKfjdyNekmjNNJjNTeNtwLi2ORGIkKEQ2+qJSzEgsr+PtwnAzD2jwRRWJPc8OP2Nrhc2eEFLgaHMzt+op81wBymZslkDJjJhQVKxQ+q7kYge0pqNPzGSvSEc2AYcBW/kwlujjSCioSdSW/3p/6P8dlhjoSxf0Wg5ayiPrxHzHnfXlbrnHxvIwPHDk48V5LWvbDvl8VXW/do6koUkUIRQhf/9k="}});
//# sourceMappingURL=15.fe9db950d2f187bad4d6.js.map