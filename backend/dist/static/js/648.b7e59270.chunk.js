"use strict";(self.webpackChunktheplotpot_frontend=self.webpackChunktheplotpot_frontend||[]).push([[648],{7309:(e,s,t)=>{t.d(s,{A:()=>l});t(5043);var r=t(3519),a=t(1719),n=t(4282),i=t(579);const l=e=>{let{message:s,onRetry:t}=e;return(0,i.jsx)(r.A,{className:"mt-5",children:(0,i.jsxs)(a.A,{variant:"danger",children:[(0,i.jsx)(a.A.Heading,{children:"Oh snap! An error occurred."}),(0,i.jsx)("p",{children:s||"Something went wrong. Please try again later."}),t&&(0,i.jsx)(n.A,{variant:"primary",onClick:t,children:"Retry"})]})})}},5648:(e,s,t)=>{t.r(s),t.d(s,{default:()=>A});var r=t(8250),a=t(7993),n=t(8628),i=t(4282),l=t(1489),c=t(4743),d=t(5475),o=t(7309),h=(t(4838),t(6133)),x=t(853),m=t(579);const j=()=>(0,m.jsx)("div",{style:{backgroundColor:"#e0e0e0",height:"100%",width:"100%"}}),A=()=>{const{isDarkMode:e}=(0,h.D2)(),{loading:s,error:t,data:A}=(0,r.IT)(c.F4);if(t)return(0,m.jsx)(o.A,{message:t.message});let u=[],g=[];if(A){console.log(A.getAllStories[0].createdAt);g=[...A.getAllStories].sort(((e,s)=>s.read_count-e.read_count)).slice(0,5);u=[...A.getAllStories].sort(((e,s)=>new Date(s.createdAt)-new Date(e.createdAt))).slice(0,9)}return(0,m.jsxs)("div",{className:"home-container",children:[(0,m.jsxs)("section",{className:"carousel-section",children:[(0,m.jsx)("h2",{className:"carousel-heading",children:"Featured Stories"}),(0,m.jsx)(a.A,{className:"carousel",controls:!0,indicators:!0,keyboard:!0,slide:!1,"data-bs-theme":"dark",children:s?Array(5).fill(null).map(((e,s)=>(0,m.jsx)(a.A.Item,{children:(0,m.jsx)(j,{})},s))):g.map(((e,s)=>(0,m.jsx)(a.A.Item,{children:(0,m.jsx)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"400px",width:"100%"},children:(0,m.jsxs)(n.A,{className:"shadow",style:{textAlign:"center",width:"80%",minHeight:"70%"},children:[0===s&&(0,m.jsx)("span",{className:"badge badge-secondary badge-corner",children:"Top Story"}),(0,m.jsxs)(n.A.Body,{children:[(0,m.jsx)(n.A.Title,{className:"truncate-text",children:e.title}),(0,m.jsx)(n.A.Text,{className:"truncate-text",children:e.description}),(0,m.jsxs)(n.A.Text,{children:["Genre: ",e.genre]}),(0,m.jsx)(n.A.Text,{children:(0,m.jsxs)("small",{className:"text-muted",children:["Reads: ",e.read_count]})}),(0,m.jsx)(n.A.Text,{children:(0,m.jsxs)("small",{className:"text-muted",children:["By:",(0,m.jsx)(d.N_,{style:{color:"inherit",textDecoration:"inherit"},to:"/user/".concat(e.author.id),children:e.author.username})]})}),(0,m.jsx)(d.N_,{to:"/story/".concat(e.id),children:(0,m.jsx)(i.A,{variant:"secondary",children:"Read Story"})})]})]})})},e.id)))})]}),(0,m.jsxs)("section",{className:"stories-grid",children:[(0,m.jsx)("h2",{className:"carousel-heading",children:"Recent Stories"}),(0,m.jsx)("div",{className:"card-grid-container",children:(0,m.jsx)(l.A,{children:s?Array(9).fill(null).map(((e,s)=>(0,m.jsx)(n.A,{className:"shadow",style:{margin:"15px"},children:(0,m.jsx)(j,{})},s))):u.map((s=>(0,m.jsx)(n.A,{className:"shadow ".concat(e?"dark-mode":"light-mode"),style:{margin:"15px",maxWidth:"600px"},children:(0,m.jsxs)(n.A.Body,{children:[(0,m.jsx)(n.A.Title,{children:s.title}),(0,m.jsx)(n.A.Text,{children:s.description}),(0,m.jsxs)(n.A.Text,{children:[(0,m.jsxs)("span",{children:["Genre: ",s.genre]}),(0,m.jsxs)("small",{className:"text-muted",style:{display:"block",marginTop:"5px"},children:["Created ",(0,x.m)(new Date(Number(s.createdAt)))," ago by:\xa0",(0,m.jsx)(d.N_,{style:{color:"inherit",textDecoration:"inherit"},to:"/user/".concat(s.author.id),children:s.author.username})]})]}),"                  ",(0,m.jsx)(d.N_,{to:"/story/".concat(s.id),children:(0,m.jsx)(i.A,{variant:"secondary",children:"Read Story"})})]})},s.id)))})})]})]})}},4838:()=>{}}]);
//# sourceMappingURL=648.b7e59270.chunk.js.map