"use strict";(self.webpackChunktheplotpot_frontend=self.webpackChunktheplotpot_frontend||[]).push([[821],{821:function(e,t,n){n.r(t),n.d(t,{default:function(){return oe}});var o=n(4165),r=n(5861),a=n(9439),c=n(7689),i=n(5705),l=n(8007),s=n(6714),u=n(2298),d=n(4942),p=n(7557),h=n(2621),m=n(732),g=n(187),f=n(3844),v=n(1694),y=n.n(v),b=n(8568),Z=n(4170),C=n(2791),x=n(1113),S=n(1929),I=n(7521),E=n(5564),k=n(9922),w=function(e,t,n,o,r){return(0,d.Z)({backgroundColor:e,border:"".concat(o.lineWidth,"px ").concat(o.lineType," ").concat(t)},"".concat(r,"-icon"),{color:n})},j=function(e){var t,n,o,r=e.componentCls,a=e.motionDurationSlow,c=e.marginXS,i=e.marginSM,l=e.fontSize,s=e.fontSizeLG,u=e.lineHeight,p=e.borderRadiusLG,h=e.motionEaseInOutCirc,m=e.alertIconSizeLG,g=e.colorText,f=e.paddingContentVerticalSM,v=e.alertPaddingHorizontal,y=e.paddingMD,b=e.paddingContentHorizontalLG,Z=e.colorTextHeading;return o={},(0,d.Z)(o,r,Object.assign(Object.assign({},(0,I.Wf)(e)),(t={position:"relative",display:"flex",alignItems:"center",padding:"".concat(f,"px ").concat(v,"px"),wordWrap:"break-word",borderRadius:p},(0,d.Z)(t,"&".concat(r,"-rtl"),{direction:"rtl"}),(0,d.Z)(t,"".concat(r,"-content"),{flex:1,minWidth:0}),(0,d.Z)(t,"".concat(r,"-icon"),{marginInlineEnd:c,lineHeight:0}),(0,d.Z)(t,"&-description",{display:"none",fontSize:l,lineHeight:u}),(0,d.Z)(t,"&-message",{color:g}),(0,d.Z)(t,"&".concat(r,"-motion-leave"),{overflow:"hidden",opacity:1,transition:"max-height ".concat(a," ").concat(h,", opacity ").concat(a," ").concat(h,",\n        padding-top ").concat(a," ").concat(h,", padding-bottom ").concat(a," ").concat(h,",\n        margin-bottom ").concat(a," ").concat(h)}),(0,d.Z)(t,"&".concat(r,"-motion-leave-active"),{maxHeight:0,marginBottom:"0 !important",paddingTop:0,paddingBottom:0,opacity:0}),t))),(0,d.Z)(o,"".concat(r,"-with-description"),(n={alignItems:"flex-start",paddingInline:b,paddingBlock:y},(0,d.Z)(n,"".concat(r,"-icon"),{marginInlineEnd:i,fontSize:m,lineHeight:0}),(0,d.Z)(n,"".concat(r,"-message"),{display:"block",marginBottom:c,color:Z,fontSize:s}),(0,d.Z)(n,"".concat(r,"-description"),{display:"block"}),n)),(0,d.Z)(o,"".concat(r,"-banner"),{marginBottom:0,border:"0 !important",borderRadius:0}),o},N=function(e){var t=e.componentCls,n=e.colorSuccess,o=e.colorSuccessBorder,r=e.colorSuccessBg,a=e.colorWarning,c=e.colorWarningBorder,i=e.colorWarningBg,l=e.colorError,s=e.colorErrorBorder,u=e.colorErrorBg,p=e.colorInfo,h=e.colorInfoBorder,m=e.colorInfoBg;return(0,d.Z)({},t,{"&-success":w(r,o,n,e,t),"&-info":w(m,h,p,e,t),"&-warning":w(i,c,a,e,t),"&-error":Object.assign(Object.assign({},w(u,s,l,e,t)),(0,d.Z)({},"".concat(t,"-description > pre"),{margin:0,padding:0}))})},B=function(e){var t,n=e.componentCls,o=e.iconCls,r=e.motionDurationMid,a=e.marginXS,c=e.fontSizeIcon,i=e.colorIcon,l=e.colorIconHover;return(0,d.Z)({},n,(t={},(0,d.Z)(t,"&-action",{marginInlineStart:a}),(0,d.Z)(t,"".concat(n,"-close-icon"),(0,d.Z)({marginInlineStart:a,padding:0,overflow:"hidden",fontSize:c,lineHeight:"".concat(c,"px"),backgroundColor:"transparent",border:"none",outline:"none",cursor:"pointer"},"".concat(o,"-close"),{color:i,transition:"color ".concat(r),"&:hover":{color:l}})),(0,d.Z)(t,"&-close-text",{color:i,transition:"color ".concat(r),"&:hover":{color:l}}),t))},O=function(e){return[j(e),N(e),B(e)]},z=(0,E.Z)("Alert",(function(e){var t=e.fontSizeHeading3,n=(0,k.TS)(e,{alertIconSizeLG:t,alertPaddingHorizontal:12});return[O(n)]})),H=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n},M={success:p.Z,info:f.Z,error:h.Z,warning:g.Z},T=function(e){var t=e.icon,n=e.prefixCls,o=e.type,r=M[o]||null;return t?(0,x.wm)(t,C.createElement("span",{className:"".concat(n,"-icon")},t),(function(){return{className:y()("".concat(n,"-icon"),(0,d.Z)({},t.props.className,t.props.className))}})):C.createElement(r,{className:"".concat(n,"-icon")})},q=function(e){var t=e.isClosable,n=e.prefixCls,o=e.closeIcon,r=e.handleClose,a=!0===o||void 0===o?C.createElement(m.Z,null):o;return t?C.createElement("button",{type:"button",onClick:r,className:"".concat(n,"-close-icon"),tabIndex:0},a):null};var L=function(e){var t,n=e.description,o=e.prefixCls,r=e.message,c=e.banner,i=e.className,l=e.rootClassName,s=e.style,u=e.onMouseEnter,p=e.onMouseLeave,h=e.onClick,m=e.afterClose,g=e.showIcon,f=e.closable,v=e.closeText,x=e.closeIcon,I=e.action,E=H(e,["description","prefixCls","message","banner","className","rootClassName","style","onMouseEnter","onMouseLeave","onClick","afterClose","showIcon","closable","closeText","closeIcon","action"]),k=C.useState(!1),w=(0,a.Z)(k,2),j=w[0],N=w[1];var B=C.useRef(null),O=C.useContext(S.E_),M=O.getPrefixCls,L=O.direction,A=O.alert,P=M("alert",o),R=z(P),W=(0,a.Z)(R,2),G=W[0],D=W[1],X=function(t){var n;N(!0),null===(n=e.onClose)||void 0===n||n.call(e,t)},_=C.useMemo((function(){return void 0!==e.type?e.type:c?"warning":"info"}),[e.type,c]),Q=C.useMemo((function(){return!!v||("boolean"===typeof f?f:!1!==x&&null!==x&&void 0!==x)}),[v,x,f]),V=!(!c||void 0!==g)||g,$=y()(P,"".concat(P,"-").concat(_),(t={},(0,d.Z)(t,"".concat(P,"-with-description"),!!n),(0,d.Z)(t,"".concat(P,"-no-icon"),!V),(0,d.Z)(t,"".concat(P,"-banner"),!!c),(0,d.Z)(t,"".concat(P,"-rtl"),"rtl"===L),t),null===A||void 0===A?void 0:A.className,i,l,D),F=(0,Z.Z)(E,{aria:!0,data:!0});return G(C.createElement(b.ZP,{visible:!j,motionName:"".concat(P,"-motion"),motionAppear:!1,motionEnter:!1,onLeaveStart:function(e){return{maxHeight:e.offsetHeight}},onLeaveEnd:m},(function(t){var o=t.className,a=t.style;return C.createElement("div",Object.assign({ref:B,"data-show":!j,className:y()($,o),style:Object.assign(Object.assign(Object.assign({},null===A||void 0===A?void 0:A.style),s),a),onMouseEnter:u,onMouseLeave:p,onClick:h,role:"alert"},F),V?C.createElement(T,{description:n,icon:e.icon,prefixCls:P,type:_}):null,C.createElement("div",{className:"".concat(P,"-content")},r?C.createElement("div",{className:"".concat(P,"-message")},r):null,n?C.createElement("div",{className:"".concat(P,"-description")},n):null),I?C.createElement("div",{className:"".concat(P,"-action")},I):null,C.createElement(q,{isClosable:Q,prefixCls:P,closeIcon:v||x,handleClose:X}))})))},A=n(5671),P=n(3144),R=n(136),W=n(7277),G=function(e){(0,R.Z)(n,e);var t=(0,W.Z)(n);function n(){var e;return(0,A.Z)(this,n),(e=t.apply(this,arguments)).state={error:void 0,info:{componentStack:""}},e}return(0,P.Z)(n,[{key:"componentDidCatch",value:function(e,t){this.setState({error:e,info:t})}},{key:"render",value:function(){var e=this.props,t=e.message,n=e.description,o=e.children,r=this.state,a=r.error,c=r.info,i=c&&c.componentStack?c.componentStack:null,l="undefined"===typeof t?(a||"").toString():t,s="undefined"===typeof n?i:n;return a?C.createElement(L,{type:"error",message:l,description:C.createElement("pre",{style:{fontSize:"0.9em",overflowX:"auto"}},s)}):o}}]),n}(C.Component),D=G,X=L;X.ErrorBoundary=D;var _=X,Q=n(3360),V=n(6770),$=n.n(V),F=(n(215),n(1684),n(1413)),K=n(3433),U=n(4376),Y=n(9829),J=n(8261),ee=(n(8281),n(184)),te=l.Ry({title:l.Z_().required("Required").max(100,"Must be 100 characters or less"),content:l.Z_().required("Required")}),ne={title:"",content:"",honeypot:""},oe=function(){var e=(0,c.TH)().state,t=e.storyId,n=e.parentChapter,l=e.navigationStack,d=(0,J.z)().addNotification,p=function(e,t,n,o){var r=(0,c.s0)(),i=(0,U.D)(Y.c$,{update:function(a,c){var i=c.data.createChapter;try{var l=a.readQuery({query:Y.$X,variables:{id:e}}).getStory,s=[].concat((0,K.Z)(l.chapters),[i]);a.writeQuery({query:Y.$X,variables:{id:e},data:{getStory:(0,F.Z)((0,F.Z)({},l),{},{chapters:s})}});var u=a.readQuery({query:Y.SN,variables:{id:t.id}}).getChapterChildren,d=[].concat((0,K.Z)(u),[i]);a.writeQuery({query:Y.SN,variables:{id:t.id},data:{getChapterChildren:d}}),o("".concat(i.title," created successfully!"),2e3,"success"),console.log(i),r("/story/".concat(e),{state:{chapter:i,navigationStack:[].concat((0,K.Z)(n),[t])}})}catch(g){console.error("Error updating cache after adding chapter:",g),o(g.message,2e3,"error")}}}),l=(0,a.Z)(i,2);return[l[0],l[1].error]}(t,n,l,d),h=(0,a.Z)(p,2),m=h[0],g=h[1],f=(0,i.TA)({initialValues:ne,validationSchema:te,onSubmit:function(e){e.honeypot?console.log("Bot detected"):grecaptcha.ready((0,r.Z)((0,o.Z)().mark((function r(){var a;return(0,o.Z)().wrap((function(o){for(;;)switch(o.prev=o.next){case 0:return o.next=2,grecaptcha.execute("6LfY0fooAAAAAKaljIbo723ZiMGApMCVg6ZU805o",{action:"submit"});case 2:a=o.sent,m({variables:{storyId:t,parentChapterId:n.id,branch:n.branch+1,title:e.title,content:e.content,token:a}}).catch((function(e){console.error("There was an error creating the chapter:",e),d(e.message,3e3,"error")}));case 4:case"end":return o.stop()}}),r)}))))}});return(0,ee.jsxs)("div",{className:"add-chapter-container mx-4",children:[(0,ee.jsx)("h2",{children:"Add a New Chapter"}),(0,ee.jsxs)(s.Z,{layout:"vertical",onSubmit:f.handleSubmit,children:[(0,ee.jsx)(s.Z.Item,{label:"Title",help:f.touched.title&&f.errors.title,children:(0,ee.jsx)(u.Z,{type:"text",name:"title",placeholder:"Chapter title",onChange:f.handleChange,onBlur:f.handleBlur,value:f.values.title})}),(0,ee.jsx)(s.Z.Item,{style:{display:"none"},children:(0,ee.jsx)(u.Z,{type:"text",name:"honeypot",onChange:f.handleChange,onBlur:f.handleBlur,value:f.values.honeypot})}),(0,ee.jsxs)(s.Z.Item,{label:"Content",help:f.touched.content&&f.errors.content,children:[(0,ee.jsx)($(),{value:f.values.content,placeholder:"Chapter content goes here...",onChange:function(e){return f.setFieldValue("content",e)},theme:"snow",modules:{characterCounter:{container:"#char-count",maxChars:12e3},toolbar:[[{header:[1,2,3,!1]}],["bold","italic","underline","blockquote"],[{list:"ordered"},{list:"bullet"}]]}}),(0,ee.jsx)("div",{id:"char-count"})]}),(0,ee.jsx)(Q.Z,{variant:"secondary",onClick:function(){return f.handleSubmit()},children:"Submit"})]}),g&&(0,ee.jsx)(_,{type:"error",message:g.message,className:"mt-3"})]})}},1684:function(e,t,n){var o=n(5671),r=n(3144),a=n(6921),c=n.n(a),i=function(){function e(t,n){(0,o.Z)(this,e),this.quill=t,this.options=n,this.container=document.querySelector(n.container),t.on("text-change",this.update.bind(this)),this.update()}return(0,r.Z)(e,[{key:"calculate",value:function(){return this.quill.getText().length}},{key:"update",value:function(){var e=this.calculate();if(e>this.options.maxChars){var t=this.quill.getText().substring(0,this.options.maxChars);this.quill.setText(t)}this.container.innerText=e+" / "+this.options.maxChars}}]),e}();c().register("modules/characterCounter",i)},8281:function(){}}]);
//# sourceMappingURL=821.a5d14f24.chunk.js.map