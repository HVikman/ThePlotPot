"use strict";(self.webpackChunktheplotpot_frontend=self.webpackChunktheplotpot_frontend||[]).push([[59],{7309:(e,t,r)=>{r.d(t,{A:()=>c});r(5043);var a=r(3519),s=r(1719),n=r(4282),o=r(579);const c=e=>{let{message:t,onRetry:r}=e;return(0,o.jsx)(a.A,{className:"mt-5",children:(0,o.jsxs)(s.A,{variant:"danger",children:[(0,o.jsx)(s.A.Heading,{children:"Oh snap! An error occurred."}),(0,o.jsx)("p",{children:t||"Something went wrong. Please try again later."}),r&&(0,o.jsx)(n.A,{variant:"primary",onClick:r,children:"Retry"})]})})}},59:(e,t,r)=>{r.r(t),r.d(t,{default:()=>F});var a=r(5043),s=r(8250),n=r(6410),o=r(3216),c=r(5475),i=r(6213),l=r.n(i),d=r(4282),h=r(2855),m=r(7012),u=r(8944),p=r(1881),g=r(4743),x=r(1898);var y=r(3519),j=r(8628),A=r(1072),v=r(8602),C=r(4520),f=r(6133),w=r(579);const b=e=>{let{comment:t,user:r,deleteComment:a}=e;const{addNotification:s}=(0,x.E)(),[n]=(0,p.n)(g.i4),{isDarkMode:o}=(0,f.D2)(),i=async()=>{try{const{data:e}=await n({variables:{commentId:t.id}});console.log(e),a(t.id),s("Comment deleted successfully!",3e3,"success")}catch(e){console.error("There was an error deleting the comment:",e),s(e.message,3e3,"error")}};return(0,w.jsx)(j.A,{className:"shadow mt-3 ".concat(o?"dark-mode":"light-mode"),children:(0,w.jsx)(j.A.Body,{children:(0,w.jsxs)(A.A,{children:[(0,w.jsx)(v.A,{xs:3,md:1,children:(0,w.jsx)("img",{src:"https://www.gravatar.com/avatar/".concat(t.user.email,"?s=400&d=robohash"),className:"img-fluid rounded-circle",alt:"User Gravatar"})}),(0,w.jsxs)(v.A,{xs:8,md:10,children:[(0,w.jsx)(j.A.Title,{children:(0,w.jsx)(c.N_,{style:{color:"inherit",textDecoration:"inherit"},to:"/user/".concat(t.user.id),children:t.user.username})}),(0,w.jsx)(j.A.Text,{children:t.content})]}),(0,w.jsx)(v.A,{xs:1,md:1,className:"d-flex align-items-start justify-content-end",children:r&&(0,w.jsxs)(w.Fragment,{children:[r.id===t.user.id&&(0,w.jsx)(C.A,{title:"Delete your comment?",description:"Are you sure you want to delete your comment?",onConfirm:i,okText:"Yes",cancelText:"No",children:(0,w.jsx)(d.A,{variant:"danger",children:"Delete"})}),r.has_superpowers&&(0,w.jsx)(C.A,{title:"Admin Delete",description:"Are you sure you want to delete this user's comment as an admin?",onConfirm:i,okText:"Yes",cancelText:"No",children:(0,w.jsx)(d.A,{variant:"warning",children:"Admin Delete"})})]})})]})})})};var k=r(3516),S=r(899),N=r(3722);const T=S.Ik({content:S.Yj().required("Required").min(10,"Comment must be atleast 10 characters").max(1e3,"Must be 1000 characters or less")}),I={content:"",honeypot:""},D=e=>{let{chapterId:t,addNewComment:r}=e;const{addNotification:a}=(0,x.E)(),[s]=(0,p.n)(g.Og),n=(0,k.Wx)({initialValues:I,validationSchema:T,onSubmit:async e=>{console.log(t),e.honeypot?console.log("Bot detected"):grecaptcha.ready((async()=>{const o=await grecaptcha.execute("6LfY0fooAAAAAKaljIbo723ZiMGApMCVg6ZU805o",{action:"submit"});try{const{data:c}=await s({variables:{Input:{content:e.content,chapterId:t},token:o}});r(c.addComment),a("Comment added successfully!",3e3,"success"),n.resetForm()}catch(c){console.error("There was an error adding the comment:",c),a(c.message,3e3,"error")}}))}});return(0,w.jsxs)("div",{className:"add-comment-container mt-3",children:[(0,w.jsx)("h2",{children:"Add a Comment"}),(0,w.jsxs)(N.A,{onSubmit:n.handleSubmit,children:[(0,w.jsxs)(N.A.Group,{controlId:"commentContent",className:"my-2 custom-form",children:[(0,w.jsx)(N.A.Control,{as:"textarea",name:"content",placeholder:"Your comment...",onChange:n.handleChange,onBlur:n.handleBlur,value:n.values.content,isInvalid:n.touched.content&&n.errors.content}),(0,w.jsx)(N.A.Control.Feedback,{type:"invalid",children:n.errors.content})]}),(0,w.jsx)(N.A.Control,{style:{display:"none"},name:"honeypot",onChange:n.handleChange,value:n.values.honeypot}),(0,w.jsx)(d.A,{variant:"secondary",type:"submit",children:"Submit"})]})]})},_=e=>{let{comments:t,chapterId:r}=e;const{user:s}=(0,h.A)(),n=!!s,[o,c]=(0,a.useState)(t),i=e=>{c((t=>t.filter((t=>t.id!==e))))};return(0,w.jsxs)(y.A,{fluid:!0,className:"my-4 py-2",children:[(0,w.jsx)("h1",{children:"Comments"}),o&&o.length>0?o.map((e=>(0,w.jsx)(b,{comment:e,user:s,deleteComment:i},e.id))):n?(0,w.jsx)("p",{children:"No comments yet, be first to comment!"}):(0,w.jsxs)("p",{children:["No comments yet, ",(0,w.jsx)("a",{href:"/login",children:"login"})," or ",(0,w.jsx)("a",{href:"/signup",children:"signup"})," to comment!"]}),n&&(0,w.jsx)(D,{chapterId:r,addNewComment:e=>{c((t=>[...t,e]))}})]})};r(4838);const E=e=>{let{chapter:t,childChapters:r,onNavigate:n,onAddChapter:c,onGoBack:i,isLoading:y}=e;const{addNotification:j}=(0,x.E)(),A=(0,o.Zp)(),[v]=(0,p.n)(g.w7),[b]=(0,p.n)(g.Wg),[k,S]=(0,a.useState)(null),[N,T]=(0,a.useState)(!1),{isDarkMode:I}=(0,f.D2)(),D=(e=>{const{data:t}=(0,s.I)(g.Vq,{variables:{id:e}});return!!t&&t.isChapterLiked})(t.id);(0,a.useEffect)((()=>{S(D)}),[D]);const E=(()=>{const{addNotification:e}=(0,x.E)(),[t]=(0,p.n)(g.me),[r]=(0,p.n)(g.vo);return async(a,s)=>{if(a){const{data:r}=await t({variables:{id:s}});return e("Chapter liked",1e3,"success"),r.likeChapter}{const{data:t}=await r({variables:{id:s}});return e("Like removed",1e3,"error"),t.unlikeChapter}}})(),Y=async()=>{console.log(t);try{if(0===t.branch){const e=await b({variables:{id:t.story.id}});e.data.deleteStory.success?(j(e.data.deleteStory.message,3e3,"success"),A("/"),console.log("Story deleted successfully")):(console.error(e.data.deleteStory.message),j(e.data.deleteStory.message,3e3,"error"))}else{const e=await v({variables:{id:t.id}});e.data.deleteChapter.success?(j(e.data.deleteChapter.message,3e3,"success"),A("/"),console.log("Chapter deleted successfully")):(console.error(e.data.deleteChapter.message),j(e.data.deleteChapter.message,3e3,"error"))}}catch(e){console.error("Error deleting:",e)}},{user:B}=(0,h.A)(),L=!!B,M=l().sanitize(t.content);return(0,w.jsxs)("div",{className:"chapter",children:[(0,w.jsx)(d.A,{variant:"secondary",className:"mb-3",onClick:()=>i(),children:(0,w.jsx)(m.A,{})}),(0,w.jsx)("div",{className:"chapter-content shadow my-2 ".concat(I?"dark-mode":"light-mode"),dangerouslySetInnerHTML:{__html:M}}),(0,w.jsxs)("div",{className:"chapter-stats m-2",children:[L?B.id===t.author.id?0===r.length?(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(C.A,{title:0===t.branch?"Delete story":"Delete chapter",description:0===t.branch?"Are you sure you want to delete this story":"Are you sure you want to delete this chapter",onConfirm:Y,okText:"Yes",cancelText:"No",children:(0,w.jsx)(d.A,{variant:"danger",children:"Delete"})}),(0,w.jsx)("span",{children:"Likes:"})]}):(0,w.jsx)("span",{children:"Likes: "}):(0,w.jsx)(d.A,{disabled:N,variant:k?"success":"secondary",className:"mt-2",onClick:()=>(async()=>{if(T(!0),k){const e=await E(!1,t.id);S(!1),t.votes_count=t.votes_count-1,console.log("Unlike result:",e)}else{const e=await E(!0,t.id);t.votes_count=t.votes_count+1,S(!0),console.log("Like result:",e)}setTimeout((()=>{T(!1)}),1e3)})(),children:(0,w.jsx)(u.A,{})}):(0,w.jsx)("span",{children:"Likes:"}),B?B.has_superpowers&&(0,w.jsx)(C.A,{title:0===t.branch?"Delete story":"Delete chapter",description:0===t.branch?"Are you sure you want to delete this story":"Are you sure you want to delete this chapter",onConfirm:Y,okText:"Yes",cancelText:"No",children:(0,w.jsx)(d.A,{variant:"danger",children:"Admin delete"})}):(0,w.jsx)(w.Fragment,{}),(0,w.jsx)("span",{children:t.votes_count})]}),(0,w.jsxs)("div",{className:"next-chapters m-2",children:[!y&&L&&r.length<3&&t.branch<9&&(0,w.jsx)(d.A,{variant:"secondary",className:"mr-3 mt-2",onClick:()=>c(),children:"Add Chapter"}),r.map((e=>(0,w.jsxs)(d.A,{variant:"secondary",className:"mr-3 mt-2",onClick:()=>n(e.id),children:["Continue to: ",e.title]},e.id)))]}),(0,w.jsx)(_,{comments:t.comments,chapterId:t.id},t.id)]})};var Y=r(9029);const B=["Your epic saga is so vast, even our scrolls are taking a while. Hang tight!","Your tale's intrigue has our library elves on their toes. One moment!","Such a legendary story requires some extra ink and quill. Bear with us...","Even the grand storytellers of old would be impressed! Prepping your narrative...","Your chapters are so gripping, our books needed a breather. Stay tuned...","Paging all scribes! Your monumental tale is on the way...","Even our magic mirrors need a second to capture the grandeur of your plot. Patience!","Your story has so many layers, even the onions are jealous. Peeling back the pages...","With tales as epic as yours, even the stars stop to listen. Setting the stage...","Weaving tales this intricate takes a touch of sorcery. Conjuring your story..."],L=()=>{const{isDarkMode:e}=(0,f.D2)();return(0,w.jsx)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"80vh"},children:(0,w.jsx)(j.A,{style:{width:"300px",textAlign:"center"},className:"shadow ".concat(e?"dark-mode":"light-mode"),children:(0,w.jsxs)(j.A.Body,{children:[(0,w.jsx)(Y.A,{size:"large",className:"my-3"}),(0,w.jsx)(j.A.Title,{children:"Fetching the Story..."}),(0,w.jsx)(j.A.Text,{children:B[Math.floor(Math.random()*B.length)]})]})})})};var M=r(7309);const F=()=>{const{isDarkMode:e}=(0,f.D2)(),t=(0,o.Zp)(),{storyId:r,chapterId:i}=(0,o.g)(),{data:l,loading:d,error:h}=(0,s.I)(g.Vm,{variables:{id:r,chapterId:i}}),[m,{data:u,loading:p}]=(0,n._)(g.VE),[x,{data:C}]=(0,n._)(g.Tx),b=(0,o.zy)(),{chapter:k,navigationStack:S}=b.state||{},[N,T]=(0,a.useState)(null),[I,D]=(0,a.useState)([]);if((0,a.useEffect)((()=>{k?(T(k),window.history.replaceState(null,"","/story/".concat(r,"/chapter/").concat(k.id)),S&&D(S)):l&&l.getStory&&l.getStory.chapters&&T(l.getStory.chapters[0])}),[k,l,S,r]),(0,a.useEffect)((()=>{N&&m({variables:{id:N.id}})}),[N,m]),(0,a.useEffect)((()=>{C&&C.getChapter&&(T(C.getChapter),window.history.replaceState(null,"","/story/".concat(r,"/chapter/").concat(C.getChapter.id)))}),[C,r]),d)return(0,w.jsx)(L,{});if(h)return(0,w.jsx)(M.A,{message:h.message});return(0,w.jsx)(y.A,{className:"mt-5",children:(0,w.jsxs)(A.A,{children:[(0,w.jsx)(v.A,{md:9,children:N&&(0,w.jsx)(E,{chapter:N,childChapters:u?u.getChapterChildren:[],onNavigate:e=>{let t;u&&u.getChapterChildren?t=u.getChapterChildren:l&&l.getStory&&Array.isArray(l.getStory.chapters)&&(t=l.getStory.chapters),window.scrollTo({top:0,behavior:"smooth"}),D([...I,N]);const a=t.find((t=>t.id===e));a?(T(a),window.history.replaceState(null,"","/story/".concat(r,"/chapter/").concat(a.id)),m({variables:{id:a.id}})):console.log("Chapter not found with the given ID:",e)},onAddChapter:()=>{t("/add-chapter",{state:{storyId:r,parentChapter:N,navigationStack:I}})},onGoBack:()=>{const e=I.pop();window.scrollTo({top:0,behavior:"smooth"}),console.log(N),D([...I]),e?(T(e),window.history.replaceState(null,"","/story/".concat(r,"/chapter/").concat(e.id))):N&&N.parentChapterId?x({variables:{getChapterId:N.parentChapterId}}):t("/")},isLoading:p})}),(0,w.jsx)(v.A,{md:3,children:N&&(0,w.jsx)(j.A,{className:"shadow mt-3 ".concat(e?"dark-mode":"light-mode"),children:(0,w.jsxs)(j.A.Body,{children:[(0,w.jsx)(j.A.Title,{children:l.getStory.title}),(0,w.jsx)(j.A.Subtitle,{className:"mb-2 text-muted",children:l.getStory.genre}),N.title&&(0,w.jsxs)(j.A.Text,{children:["Chapter ",N.branch+1,":",(0,w.jsx)("br",{})," ",N.title]}),(0,w.jsx)(j.A.Text,{children:(0,w.jsxs)("span",{children:["Reads: ",N&&N.reads_count]})}),(0,w.jsx)(j.A.Text,{children:(0,w.jsxs)("small",{className:"text-muted",children:["Written by: ",N?(0,w.jsx)(c.N_,{to:"/user/".concat(N.author.id),children:N.author.username}):(0,w.jsx)(c.N_,{to:"/user/".concat(l.getStory.author.id),children:l.getStory.author.username})]})}),0===N.branch?(0,w.jsx)(j.A.Text,{children:l.getStory.description}):null,N.author.coffee&&(0,w.jsxs)(j.A.Text,{children:["Enjoying what ",N.author.username," is writing? ",(0,w.jsx)("a",{href:N.author.coffee,target:"_blank",rel:"noreferrer",children:" Buy them a coffee "}),"  "]})]})})})]})})}},4838:()=>{}}]);
//# sourceMappingURL=59.f02abb74.chunk.js.map