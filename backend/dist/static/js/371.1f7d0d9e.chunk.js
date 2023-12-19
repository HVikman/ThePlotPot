"use strict";(self.webpackChunktheplotpot_frontend=self.webpackChunktheplotpot_frontend||[]).push([[371],{7371:(e,r,t)=>{t.r(r),t.d(r,{default:()=>z});var n=t(2791),a=t(2506),s=t(8007),l=t(4376),o=t(9829),i=t(7689),c=t(3812),u=t(7022),d=t(9795),m=t(2076),h=t(3360),p=t(18),f=t(8261),g=t(2007),v=t.n(g),y=["color","size","title"];function x(){return x=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},x.apply(this,arguments)}function j(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var b=(0,n.forwardRef)((function(e,r){var t=e.color,a=e.size,s=e.title,l=j(e,y);return n.createElement("svg",x({ref:r,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:a,height:a,fill:t},l),s?n.createElement("title",null,s):null,n.createElement("path",{d:"M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"}))}));b.propTypes={color:v().string,size:v().oneOfType([v().string,v().number]),title:v().string},b.defaultProps={color:"currentColor",size:"1em",title:null};const w=b;var Z=["color","size","title"];function O(){return O=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},O.apply(this,arguments)}function C(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var E=(0,n.forwardRef)((function(e,r){var t=e.color,a=e.size,s=e.title,l=C(e,Z);return n.createElement("svg",O({ref:r,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:a,height:a,fill:t},l),s?n.createElement("title",null,s):null,n.createElement("path",{d:"M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"}))}));E.propTypes={color:v().string,size:v().oneOfType([v().string,v().number]),title:v().string},E.defaultProps={color:"currentColor",size:"1em",title:null};const P=E;var B=t(1087),S=t(184);const U=s.Ry().shape({username:s.Z_().min(3,"Username must be at least 3 characters").required("Username is required"),email:s.Z_().email("Invalid email").required("Email is required"),password:s.Z_().min(6,"Password must be at least 6 characters").required("Password is required")}),z=()=>{const{addNotification:e}=(0,f.z)(),[r,t]=(0,n.useState)(null),[s]=(0,l.D)(o.Rw,{update:(r,n)=>{let{data:a}=n;a.createUser.success?(e("Signup successful: ".concat(a.createUser.user.username)),v(a.createUser.user),x("/")):t(a.createUser.message)},onError:r=>{e("Something went wrong: ".concat(r),2e3,"error")}}),{user:g,setUser:v}=(0,c.a)(),y=!!g,x=(0,i.s0)(),j=(0,a.TA)({initialValues:{username:"",email:"",password:"",honeypot:""},validationSchema:U,onSubmit:async e=>{e.honeypot?console.log("Bot detected"):grecaptcha.ready((async()=>{const r=await grecaptcha.execute("6LfY0fooAAAAAKaljIbo723ZiMGApMCVg6ZU805o",{action:"submit"});s({variables:{...e,token:r}})}))}});return y?(x("/"),(0,S.jsx)("p",{children:"You are already logged in."})):(0,S.jsxs)(u.Z,{style:{maxWidth:"400px",marginTop:"50px"},children:[(0,S.jsxs)(d.Z,{onSubmit:j.handleSubmit,children:[(0,S.jsxs)(d.Z.Group,{controlId:"formBasicUsername",className:"mt-4 custom-form",children:[(0,S.jsx)(d.Z.Label,{children:"Username"}),(0,S.jsxs)(m.Z,{className:"mb-3",children:[(0,S.jsx)(m.Z.Text,{children:(0,S.jsx)(w,{})}),(0,S.jsx)(d.Z.Control,{type:"text",name:"username",value:j.values.username,onChange:j.handleChange,onBlur:j.handleBlur,isInvalid:j.touched.username&&j.errors.username,placeholder:"Username"}),(0,S.jsx)(d.Z.Control.Feedback,{type:"invalid",children:j.errors.username})]})]}),(0,S.jsxs)(d.Z.Group,{controlId:"formBasicEmail",className:"mt-4 custom-form",children:[(0,S.jsx)(d.Z.Label,{children:"Email address"}),(0,S.jsxs)(m.Z,{className:"mb-3",children:[(0,S.jsx)(m.Z.Text,{children:"@"}),(0,S.jsx)(d.Z.Control,{type:"email",name:"email",value:j.values.email,onChange:j.handleChange,onBlur:j.handleBlur,isInvalid:j.touched.email&&j.errors.email,placeholder:"Enter email"}),(0,S.jsx)(d.Z.Control.Feedback,{type:"invalid",children:j.errors.email})]})]}),(0,S.jsxs)(d.Z.Group,{controlId:"formBasicPassword",className:"mt-4 custom-form",children:[(0,S.jsx)(d.Z.Label,{children:"Password"}),(0,S.jsxs)(m.Z,{className:"mb-3",children:[(0,S.jsx)(m.Z.Text,{children:(0,S.jsx)(P,{})}),(0,S.jsx)(d.Z.Control,{type:"password",name:"password",value:j.values.password,onChange:j.handleChange,onBlur:j.handleBlur,isInvalid:j.touched.password&&j.errors.password,placeholder:"Password"}),(0,S.jsx)(d.Z.Control.Feedback,{type:"invalid",children:j.errors.password})]})]}),(0,S.jsx)(d.Z.Control,{style:{display:"none"},name:"honeypot",onChange:j.handleChange,value:j.values.honeypot}),(0,S.jsx)(h.Z,{variant:"secondary",className:"mt-2",type:"submit",children:"Signup"})]}),r&&(0,S.jsx)(p.Z,{variant:"danger",className:"mt-3",children:r}),(0,S.jsxs)("div",{className:"mt-3",children:["Already registered? ",(0,S.jsx)(B.rU,{to:"/login",children:"Log in here"})]})]})}}}]);
//# sourceMappingURL=371.1f7d0d9e.chunk.js.map