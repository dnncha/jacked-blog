(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,827,i=>{"use strict";var e=i.i(43476),a=i.i(71645),t=i.i(22016),r=i.i(62368),o=i.i(16116);function s({href:i,placement:a,children:t="Start free on iPhone",experimentName:o="",experimentVariant:n="",heroPresentation:c="",copyVersion:l="",className:d="",ariaLabel:p=""}){return(0,e.jsxs)("a",{className:`acquisition-store-link${d?` ${d}`:""}`,href:i,target:"_blank",rel:"noopener noreferrer","aria-label":p||void 0,"data-global-cta":a,"data-app-store-placement":a,"data-app-store-campaign":function(i){try{return new URL(i).searchParams.get("ct")||""}catch{return""}}(i),"data-experiment":o||void 0,"data-experiment-variant":n||void 0,"data-hero-presentation":c||void 0,"data-copy-version":l||void 0,children:[(0,e.jsx)(r.Download,{"aria-hidden":"true",size:23,strokeWidth:2.2}),(0,e.jsxs)("span",{children:[(0,e.jsx)("small",{children:"Free on the App Store"}),t]})]})}i.s(["default",0,function({eyebrow:i,title:r,intro:n,campaignUrl:c,campaignKey:l,heroImage:d,heroImageAlt:p,benefits:u,steps:m,comparison:h,faqs:g,related:x,finalTitle:q,finalCopy:f,canonicalPath:b="/",heroPresentation:w="photo",benefitsTitle:v="Less admin between sets. More useful training context.",benefitsIntro:j="Surpass keeps the details that change your next decision inside the active workout.",flowTitle:y="From your last result to the next working set.",flowIntro:k="The app stays focused on the workout you are running, not a feed or a generic dashboard.",comparisonTitle:N="A training log should help with the next decision.",comparisonIntro:S="History is most useful when it is visible before the set it affects.",comparisonLabel:z="Basic workout log and Surpass comparison",comparisonLeftLabel:$="Basic log",comparisonMomentLabel:_="Training moment",comparisonRightLabel:A="Surpass",faqTitle:L="Questions lifters ask before switching.",sources:P=[],sourcesNote:C="",dockTitle:O="Keep your next set clear."}){let T="acquisition_promise_v2",W=(0,a.useRef)(null),[I,R]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let i=W.current;if(!i)return;if(!("IntersectionObserver"in window))return void R(!0);let e=new IntersectionObserver(([i])=>{R(!i.isIntersecting)},{threshold:.15});return e.observe(i),()=>e.disconnect()},[]);let B={"@context":"https://schema.org","@type":"FAQPage",mainEntity:g.map(({question:i,answer:e})=>({"@type":"Question",name:i,acceptedAnswer:{"@type":"Answer",text:e}}))},E={"@context":"https://schema.org","@type":"WebPage",name:r,description:n,url:`https://jacked.coach${"/"===b?"/":`${b.replace(/\/$/,"")}/`}`,isPartOf:{"@type":"WebSite",name:"Surpass",url:"https://jacked.coach"},about:{"@type":"SoftwareApplication",name:"Surpass",operatingSystem:"iOS",applicationCategory:"HealthApplication"}},H={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Surpass",item:"https://jacked.coach/"},{"@type":"ListItem",position:2,name:r,item:`https://jacked.coach${b}`}]};return(0,e.jsxs)("div",{className:"acquisition-page",children:[(0,e.jsx)("style",{children:`
        :root {
          --acq-gold: #f5b935;
          --acq-gold-bright: #ffd46a;
          --acq-text: #fff8ea;
          --acq-muted: #b8b0a2;
          --acq-line: rgba(255, 248, 234, 0.14);
          --acq-panel: #11110f;
        }

        .acquisition-page,
        .acquisition-page * { box-sizing: border-box; }

        .acquisition-page {
          color: var(--acq-text);
          background: #050505;
        }

        .acquisition-wrap {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto;
        }

        .acquisition-hero {
          min-height: 690px;
          display: grid;
          align-items: center;
          border-bottom: 1px solid var(--acq-line);
          background:
            linear-gradient(90deg, rgba(3,3,3,0.98) 0%, rgba(3,3,3,0.82) 44%, rgba(3,3,3,0.28) 78%, rgba(3,3,3,0.18) 100%),
            linear-gradient(180deg, transparent 52%, #050505 100%),
            var(--acq-hero-image) 68% center / cover no-repeat;
        }

        .acquisition-hero.screen {
          background:
            linear-gradient(90deg, rgba(3,3,3,1) 0%, rgba(3,3,3,0.9) 46%, rgba(3,3,3,0.22) 72%, rgba(3,3,3,0.04) 100%),
            linear-gradient(180deg, transparent 64%, #050505 100%),
            var(--acq-hero-image) calc(100% - 8vw) center / auto 82% no-repeat,
            #050505;
        }

        .acquisition-hero-copy { max-width: 690px; padding: 76px 0 88px; }

        .acquisition-eyebrow {
          margin: 0 0 16px;
          color: var(--acq-gold);
          font-size: 0.8rem;
          font-weight: 850;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .acquisition-hero h1 {
          max-width: 780px;
          margin: 0;
          font-size: clamp(3rem, 7vw, 6rem);
          line-height: 0.96;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .acquisition-hero-copy > p:not(.acquisition-eyebrow) {
          max-width: 650px;
          margin: 24px 0 0;
          color: var(--acq-muted);
          font-size: clamp(1.05rem, 2vw, 1.22rem);
          line-height: 1.65;
        }

        .acquisition-actions { margin-top: 30px; }

        .acquisition-store-link {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          min-height: 62px;
          padding: 0 22px;
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 10px;
          color: #11100c;
          background: linear-gradient(180deg, var(--acq-gold-bright), var(--acq-gold));
          box-shadow: 0 16px 38px rgba(245,185,53,0.2);
          text-decoration: none;
          font-size: 1.04rem;
          font-weight: 850;
        }

        .acquisition-store-link > svg { flex: 0 0 auto; }
        .acquisition-store-link > span:last-child { display: grid; line-height: 1.12; }
        .acquisition-store-link small { font-size: 0.68rem; font-weight: 730; }

        .acquisition-store-note {
          margin: 13px 0 0;
          color: #9d9689;
          font-size: 0.84rem;
          font-weight: 650;
        }

        .acquisition-section { padding: 88px 0; border-bottom: 1px solid var(--acq-line); }
        .acquisition-section.soft { background: #0a0a09; }

        .acquisition-heading { max-width: 740px; margin-bottom: 38px; }
        .acquisition-heading h2 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 1.06;
          letter-spacing: -0.04em;
        }
        .acquisition-heading p { margin: 15px 0 0; color: var(--acq-muted); font-size: 1.04rem; }

        .acquisition-benefits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .acquisition-card {
          padding: 27px;
          border: 1px solid var(--acq-line);
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022));
        }
        .acquisition-card span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          margin-bottom: 18px;
          border-radius: 8px;
          color: #111;
          background: var(--acq-gold);
          font-weight: 900;
        }
        .acquisition-card h3 { margin: 0; font-size: 1.2rem; line-height: 1.25; }
        .acquisition-card p { margin: 11px 0 0; color: var(--acq-muted); line-height: 1.65; }

        .acquisition-flow { display: grid; grid-template-columns: 0.82fr 1.18fr; gap: 56px; align-items: center; }
        .acquisition-photo {
          width: 100%;
          min-height: 520px;
          object-fit: cover;
          border: 1px solid var(--acq-line);
          border-radius: 14px;
          filter: saturate(0.8) contrast(1.05);
        }
        .acquisition-photo.screen {
          max-height: 680px;
          padding: 20px;
          object-fit: contain;
          background: #090a0c;
        }
        .acquisition-steps { display: grid; gap: 12px; }
        .acquisition-step { display: grid; grid-template-columns: 46px 1fr; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--acq-line); }
        .acquisition-step > strong { color: var(--acq-gold); font-size: 1.15rem; }
        .acquisition-step h3 { margin: 0; font-size: 1.12rem; }
        .acquisition-step p { margin: 6px 0 0; color: var(--acq-muted); }

        .acquisition-comparison { overflow: hidden; border: 1px solid var(--acq-line); border-radius: 12px; }
        .acquisition-comparison-row { display: grid; grid-template-columns: 0.72fr 1fr 1fr; }
        .acquisition-comparison-row + .acquisition-comparison-row { border-top: 1px solid var(--acq-line); }
        .acquisition-comparison-row > * { padding: 19px 22px; }
        .acquisition-comparison-row > * + * { border-left: 1px solid var(--acq-line); }
        .acquisition-comparison-row strong { color: #f7f0df; }
        .acquisition-comparison-row span { color: var(--acq-muted); }
        .acquisition-comparison-head { background: #171512; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 850; }
        .acquisition-comparison-head > *:last-child { color: var(--acq-gold); }

        .acquisition-sources { margin-top: 22px; color: var(--acq-muted); font-size: 0.86rem; }
        .acquisition-sources p { margin: 0 0 8px; }
        .acquisition-sources ul { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 0; padding: 0; list-style: none; }
        .acquisition-sources a { color: var(--acq-muted); text-decoration: underline; text-underline-offset: 3px; }

        .acquisition-faq { display: grid; gap: 10px; }
        .acquisition-faq details { padding: 21px 23px; border: 1px solid var(--acq-line); border-radius: 10px; background: var(--acq-panel); }
        .acquisition-faq summary { cursor: pointer; font-weight: 800; }
        .acquisition-faq p { margin: 12px 0 0; color: var(--acq-muted); }

        .acquisition-related { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
        .acquisition-related a { padding: 9px 13px; border: 1px solid var(--acq-line); border-radius: 999px; color: #e8d67b; text-decoration: none; font-size: 0.88rem; font-weight: 720; }

        .acquisition-final { padding: 96px 0; text-align: center; background: radial-gradient(circle at 50% 20%, rgba(245,185,53,0.13), transparent 28rem), #050505; }
        .acquisition-final h2 { max-width: 760px; margin: 0 auto; font-size: clamp(2.2rem, 5vw, 4.3rem); line-height: 1; letter-spacing: -0.045em; }
        .acquisition-final p { max-width: 620px; margin: 20px auto 28px; color: var(--acq-muted); font-size: 1.08rem; }

        .acquisition-mobile-dock {
          display: none;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(calc(100% + 20px));
          transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
        }

        .acquisition-mobile-dock[aria-hidden="true"] { display: none; }

        @media (max-width: 820px) {
          .acquisition-page { padding-bottom: 78px; }
          .acquisition-hero { min-height: 620px; background-position: 61% center; }
          .acquisition-hero-copy { padding: 70px 0; }
          .acquisition-benefits { grid-template-columns: 1fr; }
          .acquisition-flow { grid-template-columns: 1fr; gap: 34px; }
          .acquisition-photo { min-height: 390px; }
          .acquisition-comparison-row { grid-template-columns: 1fr; }
          .acquisition-comparison-row > * + * { border-left: 0; border-top: 1px solid var(--acq-line); }
          .acquisition-comparison-head { display: none; }
          .acquisition-comparison-row span[data-label]::before { content: attr(data-label); display: block; margin-bottom: 4px; color: var(--acq-gold); font-size: 0.72rem; font-weight: 850; letter-spacing: 0.08em; text-transform: uppercase; }
          .acquisition-hero.screen {
            min-height: 1040px;
            align-items: start;
            background:
              linear-gradient(180deg, rgba(3,3,3,1) 0%, rgba(3,3,3,0.96) 42%, rgba(3,3,3,0.18) 60%, rgba(3,3,3,0.04) 82%, #050505 100%),
              var(--acq-hero-image) center calc(100% - 18px) / auto 35% no-repeat,
              #050505;
          }
          .acquisition-hero.screen .acquisition-hero-copy { padding: 56px 0 430px; }
          .acquisition-mobile-dock {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 90;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
            border-top: 1px solid rgba(255, 248, 234, 0.16);
            background: rgba(5, 5, 5, 0.95);
            box-shadow: 0 -12px 32px rgba(0, 0, 0, 0.34);
            backdrop-filter: blur(18px) saturate(130%);
            -webkit-backdrop-filter: blur(18px) saturate(130%);
          }
          .acquisition-mobile-dock.acquisition-mobile-dock-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateY(0);
          }
          @media (prefers-reduced-motion: reduce) {
            .acquisition-mobile-dock { transition: none; }
          }
          .acquisition-mobile-dock-copy {
            min-width: 0;
            flex: 1 1 auto;
          }
          .acquisition-mobile-dock-copy strong,
          .acquisition-mobile-dock-copy span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .acquisition-mobile-dock-copy strong { color: #fff8ea; font-size: 0.84rem; }
          .acquisition-mobile-dock-copy span { margin-top: 2px; color: #aaa294; font-size: 0.72rem; }
          .acquisition-mobile-dock-link {
            flex: 0 0 auto;
            min-height: 48px;
            padding: 0 13px;
            border-radius: 9px;
            box-shadow: 0 8px 22px rgba(245,185,53,0.18);
            font-size: 0.88rem;
          }
          .acquisition-mobile-dock-link > span:first-child { display: none; }
          .acquisition-mobile-dock-link small { display: none; }
          .acquisition-mobile-dock-link > span:last-child { display: block; color: #11100c; }
        }
      `}),(0,e.jsx)("link",{rel:"preload",as:"image",href:d,fetchPriority:"high",precedence:"default"}),(0,e.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(E)}}),(0,e.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(H)}}),(0,e.jsx)("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(B)}}),(0,e.jsx)("section",{className:`acquisition-hero ${w}`,style:{"--acq-hero-image":`url('${d}')`},children:(0,e.jsx)("div",{className:"acquisition-wrap",children:(0,e.jsxs)("div",{className:"acquisition-hero-copy",children:[(0,e.jsx)("p",{className:"acquisition-eyebrow",children:i}),(0,e.jsx)("h1",{children:r}),(0,e.jsx)("p",{children:n}),(0,e.jsx)("div",{ref:W,className:"acquisition-actions",children:(0,e.jsx)(s,{href:c,placement:`${l}_hero`,experimentName:"acquisition_hero_cta",experimentVariant:"outcome_v1",heroPresentation:w,copyVersion:T})}),(0,e.jsx)("p",{className:"acquisition-store-note",children:"Free to download. No account required. Workout history stays on your iPhone."})]})})}),(0,e.jsx)("section",{className:"acquisition-section",children:(0,e.jsxs)("div",{className:"acquisition-wrap",children:[(0,e.jsxs)("div",{className:"acquisition-heading",children:[(0,e.jsx)("h2",{children:v}),(0,e.jsx)("p",{children:j})]}),(0,e.jsx)("div",{className:"acquisition-benefits",children:u.map((i,a)=>(0,e.jsxs)("article",{className:"acquisition-card",children:[(0,e.jsx)("span",{children:a+1}),(0,e.jsx)("h3",{children:i.title}),(0,e.jsx)("p",{children:i.copy})]},i.title))})]})}),(0,e.jsx)("section",{className:"acquisition-section soft",children:(0,e.jsxs)("div",{className:"acquisition-wrap acquisition-flow",children:[/\/marketing\/screens\/surpass-(\d{2})-/.test(d)?(0,e.jsx)(o.default,{className:`acquisition-photo ${w}`,index:Number(d.match(/surpass-(\d{2})-/)[1]),alt:p,sizes:"(max-width: 760px) 70vw, 280px"}):(0,e.jsx)("img",{className:`acquisition-photo ${w}`,src:d,alt:p,width:1287,height:2796,loading:"lazy",decoding:"async"}),(0,e.jsxs)("div",{children:[(0,e.jsxs)("div",{className:"acquisition-heading",children:[(0,e.jsx)("h2",{children:y}),(0,e.jsx)("p",{children:k})]}),(0,e.jsx)("div",{className:"acquisition-steps",children:m.map((i,a)=>(0,e.jsxs)("div",{className:"acquisition-step",children:[(0,e.jsxs)("strong",{children:["0",a+1]}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h3",{children:i.title}),(0,e.jsx)("p",{children:i.copy})]})]},i.title))})]})]})}),(0,e.jsx)("section",{className:"acquisition-section",children:(0,e.jsxs)("div",{className:"acquisition-wrap",children:[(0,e.jsxs)("div",{className:"acquisition-heading",children:[(0,e.jsx)("h2",{children:N}),(0,e.jsx)("p",{children:S})]}),(0,e.jsxs)("div",{className:"acquisition-comparison",role:"table","aria-label":z,children:[(0,e.jsxs)("div",{className:"acquisition-comparison-row acquisition-comparison-head",role:"row",children:[(0,e.jsx)("span",{role:"columnheader",children:_}),(0,e.jsx)("span",{role:"columnheader",children:$}),(0,e.jsx)("span",{role:"columnheader",children:A})]}),h.map(([i,a,t])=>(0,e.jsxs)("div",{className:"acquisition-comparison-row",role:"row",children:[(0,e.jsx)("strong",{role:"cell",children:i}),(0,e.jsx)("span",{role:"cell","data-label":$,children:a}),(0,e.jsx)("span",{role:"cell","data-label":A,children:t})]},i))]}),P.length>0&&(0,e.jsxs)("div",{className:"acquisition-sources",children:[C&&(0,e.jsx)("p",{children:C}),(0,e.jsx)("ul",{children:P.map(([i,a])=>(0,e.jsx)("li",{children:(0,e.jsx)("a",{href:i,target:"_blank",rel:"noopener noreferrer",children:a})},i))})]})]})}),(0,e.jsx)("section",{className:"acquisition-section soft",children:(0,e.jsxs)("div",{className:"acquisition-wrap",children:[(0,e.jsx)("div",{className:"acquisition-heading",children:(0,e.jsx)("h2",{children:L})}),(0,e.jsx)("div",{className:"acquisition-faq",children:g.map(({question:i,answer:a})=>(0,e.jsxs)("details",{children:[(0,e.jsx)("summary",{children:i}),(0,e.jsx)("p",{children:a})]},i))}),(0,e.jsx)("div",{className:"acquisition-related","aria-label":"Related Surpass guides",children:x.map(([i,a])=>(0,e.jsx)(t.default,{href:i,children:a},i))})]})}),(0,e.jsx)("section",{className:"acquisition-final",children:(0,e.jsxs)("div",{className:"acquisition-wrap",children:[(0,e.jsx)("h2",{children:q}),(0,e.jsx)("p",{children:f}),(0,e.jsx)(s,{href:c,placement:`${l}_final`,copyVersion:T})]})}),(0,e.jsxs)("div",{className:`acquisition-mobile-dock${I?" acquisition-mobile-dock-visible":""}`,"aria-hidden":!I,"aria-label":"Start Surpass on iPhone",children:[(0,e.jsxs)("div",{className:"acquisition-mobile-dock-copy",children:[(0,e.jsx)("strong",{children:O}),(0,e.jsx)("span",{children:"Free on the App Store · no account required"})]}),(0,e.jsx)(s,{href:c,placement:`${l}_mobile_dock`,experimentName:"acquisition_mobile_cta",experimentVariant:"sticky_outcome_v1",className:"acquisition-mobile-dock-link",ariaLabel:"Start free with Surpass on iPhone",heroPresentation:w,copyVersion:T,children:"Start free"})]})]})}])},16116,i=>{"use strict";var e=i.i(43476);let a=[320,480,640,960];i.s(["default",0,function({index:i,alt:t,sizes:r="(max-width: 760px) 72vw, 320px",priority:o=!1,className:s=""}){let n,c=(n=String(i).padStart(2,"0"),{avif:a.map(i=>`/marketing/screens/surpass-${n}-${i}.avif ${i}w`).join(", "),webp:a.map(i=>`/marketing/screens/surpass-${n}-${i}.webp ${i}w`).join(", "),fallback:`/marketing/screens/surpass-${n}-640.webp`,preload:`/marketing/screens/surpass-${n}-480.webp`});return(0,e.jsxs)("picture",{children:[(0,e.jsx)("source",{type:"image/avif",srcSet:c.avif,sizes:r}),(0,e.jsx)("source",{type:"image/webp",srcSet:c.webp,sizes:r}),(0,e.jsx)("img",{className:s,src:c.fallback,width:1287,height:2796,alt:t,decoding:o?"sync":"async",loading:o?"eager":"lazy",fetchPriority:o?"high":"low"})]})}])},62368,56420,i=>{"use strict";var e=i.i(71645);let a=(...i)=>i.filter((i,e,a)=>!!i&&""!==i.trim()&&a.indexOf(i)===e).join(" ").trim(),t=i=>{let e=i.replace(/^([A-Z])|[\s-_]+(\w)/g,(i,e,a)=>a?a.toUpperCase():e.toLowerCase());return e.charAt(0).toUpperCase()+e.slice(1)};var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,e.createContext)({}),s=(0,e.forwardRef)(({color:i,size:t,strokeWidth:s,absoluteStrokeWidth:n,className:c="",children:l,iconNode:d,...p},u)=>{let{size:m=24,strokeWidth:h=2,absoluteStrokeWidth:g=!1,color:x="currentColor",className:q=""}=(0,e.useContext)(o)??{},f=n??g?24*Number(s??h)/Number(t??m):s??h;return(0,e.createElement)("svg",{ref:u,...r,width:t??m??r.width,height:t??m??r.height,stroke:i??x,strokeWidth:f,className:a("lucide",q,c),...!l&&!(i=>{for(let e in i)if(e.startsWith("aria-")||"role"===e||"title"===e)return!0;return!1})(p)&&{"aria-hidden":"true"},...p},[...d.map(([i,a])=>(0,e.createElement)(i,a)),...Array.isArray(l)?l:[l]])}),n=(i,r)=>{let o=(0,e.forwardRef)(({className:o,...n},c)=>(0,e.createElement)(s,{ref:c,iconNode:r,className:a(`lucide-${t(i).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${i}`,o),...n}));return o.displayName=t(i),o};i.s(["default",0,n],56420);let c=n("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);i.s(["Download",0,c],62368)}]);