"use strict";(self.webpackChunktheplotpot_frontend=self.webpackChunktheplotpot_frontend||[]).push([[273],{4257:function(e,n,r){r.r(n);var t=r(4165),o=r(5861),a=r(9439),s=r(1610),i=r(5705),c=r(8007),u=r(7022),d=r(9743),l=r(2677),f=r(9140),h=r(9795),m=r(3360),p=r(9410),v=r(2469),Z=r(4376),w=r(9829),x=r(184),j=s.Z.Panel;n.default=function(){var e=(0,Z.D)(w.VC),n=(0,a.Z)(e,1)[0],r=(0,Z.D)(w.oj),y=(0,a.Z)(r,1)[0],C=(0,i.TA)({initialValues:{currentPassword:"",newPassword:"",confirmPassword:"",coffeeName:""},validationSchema:c.Ry({currentPassword:c.Z_().required("Current password is required"),newPassword:c.Z_().required("New password is required"),confirmPassword:c.Z_().oneOf([c.iH("newPassword"),null],"Passwords must match").required("Confirm password is required"),coffeeName:c.Z_().required("Coffee name is required")}),onSubmit:function(e){}}),b=function(){var e=(0,o.Z)((0,t.Z)().mark((function e(){var n,r,o;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=C.values,r=n.currentPassword,o=n.newPassword,e.next=3,y({variables:{oldPassword:r,newPassword:o}});case 3:C.setSubmitting(!1);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),g=function(){var e=(0,o.Z)((0,t.Z)().mark((function e(){var r;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="https://www.buymeacoffee.com/".concat(C.values.coffeeName),console.log(r),e.next=4,n({variables:{link:r}});case 4:C.setSubmitting(!1);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,x.jsx)(u.Z,{children:(0,x.jsx)(d.Z,{className:"justify-content-md-center mt-4",children:(0,x.jsx)(l.Z,{md:6,children:(0,x.jsxs)(s.Z,{accordion:!0,children:[(0,x.jsx)(j,{header:"Change Password",children:(0,x.jsx)(f.Z,{children:(0,x.jsx)(f.Z.Body,{children:(0,x.jsxs)(h.Z,{onSubmit:function(e){e.preventDefault(),b()},children:[(0,x.jsxs)(h.Z.Group,{className:"mt-2",children:[(0,x.jsx)(h.Z.Label,{children:"Current Password"}),(0,x.jsx)(h.Z.Control,{type:"password",name:"currentPassword",onChange:C.handleChange,value:C.values.currentPassword})]}),(0,x.jsxs)(h.Z.Group,{className:"mt-2",children:[(0,x.jsx)(h.Z.Label,{children:"New Password"}),(0,x.jsx)(h.Z.Control,{type:"password",name:"newPassword",onChange:C.handleChange,value:C.values.newPassword})]}),(0,x.jsxs)(h.Z.Group,{className:"mt-2",children:[(0,x.jsx)(h.Z.Label,{children:"Confirm Password"}),(0,x.jsx)(h.Z.Control,{type:"password",name:"confirmPassword",onChange:C.handleChange,value:C.values.confirmPassword})]}),(0,x.jsx)(m.Z,{variant:"secondary",className:"mt-2",type:"submit",children:"Update Password"})]})})})},"1"),(0,x.jsx)(j,{header:"Edit your Buy Me a Coffee link",children:(0,x.jsx)(f.Z,{children:(0,x.jsx)(f.Z.Body,{children:(0,x.jsxs)(h.Z,{onSubmit:function(e){e.preventDefault(),g()},children:[(0,x.jsxs)(h.Z.Group,{children:[(0,x.jsx)(h.Z.Label,{htmlFor:"basic-url",children:"Your Buy Me a Coffee URL"}),(0,x.jsxs)(p.Z,{className:"mb-3",children:[(0,x.jsx)(p.Z.Text,{id:"basic-addon3",children:"https://www.buymeacoffee.com/"}),(0,x.jsx)(h.Z.Control,{id:"basic-url","aria-describedby":"basic-addon3",type:"text",name:"coffeeName",onChange:C.handleChange,value:C.values.coffeeName})]}),C.errors.coffeeName&&(0,x.jsx)(v.Z,{variant:"danger",className:"mt-3",children:C.errors.coffeeName})]}),(0,x.jsx)(m.Z,{variant:"secondary",className:"mt-2",type:"submit",children:"Update"})]})})})},"2")]})})})})}},9464:function(e,n,r){r.d(n,{m:function(){return i}});var t=function(){return{height:0,opacity:0}},o=function(e){return{height:e.scrollHeight,opacity:1}},a=function(e){return{height:e?e.offsetHeight:0}},s=function(e,n){return!0===(null===n||void 0===n?void 0:n.deadline)||"height"===n.propertyName},i=function(e,n,r){return void 0!==r?r:"".concat(e,"-").concat(n)};n.Z=function(){return{motionName:"".concat(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ant","-motion-collapse"),onAppearStart:t,onEnterStart:t,onAppearActive:o,onEnterActive:o,onLeaveStart:a,onLeaveActive:t,onAppearEnd:s,onEnterEnd:s,onLeaveEnd:s,motionDeadline:500}}},4107:function(e,n,r){var t=r(2791),o=r(1815);n.Z=function(e){var n=t.useContext(o.Z);return t.useMemo((function(){return e?"string"===typeof e?null!==e&&void 0!==e?e:n:e instanceof Function?e(n):n:n}),[e,n])}},6753:function(e,n,r){var t=r(4942);n.Z=function(e){var n;return(0,t.Z)({},e.componentCls,(n={},(0,t.Z)(n,"".concat(e.antCls,"-motion-collapse-legacy"),{overflow:"hidden","&-active":{transition:"height ".concat(e.motionDurationMid," ").concat(e.motionEaseInOut,",\n        opacity ").concat(e.motionDurationMid," ").concat(e.motionEaseInOut," !important")}}),(0,t.Z)(n,"".concat(e.antCls,"-motion-collapse"),{overflow:"hidden",transition:"height ".concat(e.motionDurationMid," ").concat(e.motionEaseInOut,",\n        opacity ").concat(e.motionDurationMid," ").concat(e.motionEaseInOut," !important")}),n))}},5501:function(e,n,r){r.d(n,{Z:function(){return a}});var t=r(2791),o=r(3873);function a(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=[];return t.Children.forEach(e,(function(e){(void 0!==e&&null!==e||n.keepEmpty)&&(Array.isArray(e)?r=r.concat(a(e)):(0,o.isFragment)(e)&&e.props?r=r.concat(a(e.props.children,n)):r.push(e))})),r}},9410:function(e,n,r){var t=r(5987),o=r(1413),a=r(1694),s=r.n(a),i=r(2791),c=r(6543),u=r(162),d=r(6882),l=r(1991),f=r(184),h=["bsPrefix","size","hasValidation","className","as"],m=(0,c.Z)("input-group-text",{Component:"span"}),p=i.forwardRef((function(e,n){var r=e.bsPrefix,a=e.size,c=e.hasValidation,d=e.className,m=e.as,p=void 0===m?"div":m,v=(0,t.Z)(e,h);r=(0,u.vE)(r,"input-group");var Z=(0,i.useMemo)((function(){return{}}),[]);return(0,f.jsx)(l.Z.Provider,{value:Z,children:(0,f.jsx)(p,(0,o.Z)((0,o.Z)({ref:n},v),{},{className:s()(d,r,a&&"".concat(r,"-").concat(a),c&&"has-validation")}))})}));p.displayName="InputGroup",n.Z=Object.assign(p,{Text:m,Radio:function(e){return(0,f.jsx)(m,{children:(0,f.jsx)(d.Z,(0,o.Z)({type:"radio"},e))})},Checkbox:function(e){return(0,f.jsx)(m,{children:(0,f.jsx)(d.Z,(0,o.Z)({type:"checkbox"},e))})}})}}]);
//# sourceMappingURL=273.b1813bb8.chunk.js.map