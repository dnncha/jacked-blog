(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,48580,e=>{"use strict";var a=e.i(43476),r=e.i(22016),n=e.i(71645),s=e.i(18566);function t(e,a){return"string"==typeof e&&e.length<=a&&!/[\u0000-\u001f\u007f]/.test(e)}function i(e){return e&&"string"==typeof e.i&&e.i.length>=1&&e.i.length<=96&&/^[A-Za-z0-9_.-]+$/.test(e.i)&&Number.isInteger(e.s)&&e.s>=1&&e.s<=20&&Number.isInteger(e.a)&&e.a>=1&&e.a<=100&&Number.isInteger(e.b)&&e.b>=1&&e.b<=100&&e.a<=e.b&&Number.isFinite(e.r)&&e.r>=0&&e.r<=5&&Number.isInteger(e.t)&&e.t>=0&&e.t<=1800}async function l(e,a){if(!a?.digest)throw Error("checksum unavailable");return Array.from(new Uint8Array(await a.digest("SHA-256",e)).slice(0,8)).map(e=>e.toString(16).padStart(2,"0")).join("")}async function d({query:e,href:a,subtle:r=globalThis.crypto?.subtle}){let n=e instanceof URLSearchParams?e:new URLSearchParams(e),s=n.get("p"),p=n.get("c");if(!s||s.length>8e3||!p)throw Error("missing payload");let o=function(e){if(!/^[A-Za-z0-9_-]+$/.test(e))throw Error("invalid payload");let a=atob(e.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-e.length%4)%4));return Uint8Array.from(a,e=>e.charCodeAt(0))}(s);if(o.byteLength>6e3)throw Error("payload too large");if("string"!=typeof a||new TextEncoder().encode(a).byteLength>12e3)throw Error("url too large");if(!/^[0-9a-f]{16}$/i.test(p)||p.toLowerCase()!==await l(o,r))throw Error("checksum mismatch");let h=JSON.parse(new TextDecoder().decode(o));if(!function(e){if(!e||1!==e.v||!t(e.t,96)||!Array.isArray(e.d)||e.d.length<1||e.d.length>6)return!1;let a=0;return e.d.every(e=>!!e&&!!t(e.n,72)&&!!Number.isInteger(e.c)&&!(e.c<0)&&!!Number.isInteger(e.s)&&!(e.s<0)&&!!Array.isArray(e.x)&&!(e.x.length>12)&&(null==e.p||!!Array.isArray(e.p)&&!(e.p.length>12)&&!!e.p.every(i))&&(null==e.r||!!t(e.r,32))&&(null==e.q||!!t(e.q,32))&&(a+=e.c,e.x.every(e=>t(e,220))))&&a<=48}(h))throw Error("invalid plan");return h}function p(e,a,r=`${a}s`){return`${e} ${1===e?a:r}`}function o(){return(0,a.jsxs)("div",{className:"shared-plan-actions",children:[(0,a.jsx)("a",{className:"shared-plan-button shared-plan-button-primary",href:"https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=plan_share_web&mt=8",children:"Build your own plan in Surpass"}),(0,a.jsx)(r.default,{className:"shared-plan-button shared-plan-button-secondary",href:"/",children:"See how Surpass works"})]})}function h(){return(0,a.jsxs)("section",{className:"shared-plan-shell",role:"alert",children:[(0,a.jsx)("p",{className:"shared-plan-eyebrow",children:"PLAN LINK UNAVAILABLE"}),(0,a.jsx)("h1",{children:"This plan link is invalid or incomplete."}),(0,a.jsx)("p",{className:"shared-plan-lede",children:"Ask the person who shared it to send the link again, or start a new plan in Surpass."}),(0,a.jsx)(o,{})]})}function c({plan:e}){return(0,a.jsxs)("section",{className:"shared-plan-shell","aria-live":"polite",children:[(0,a.jsx)("p",{className:"shared-plan-eyebrow",children:"READ-ONLY PLAN SHARE"}),(0,a.jsx)("h1",{children:e.t}),(0,a.jsx)("p",{className:"shared-plan-lede",children:"A clear plan for the work ahead, shared from Surpass."}),(0,a.jsx)("div",{className:"shared-plan-days",children:e.d.map((e,r)=>(0,a.jsxs)("article",{className:"shared-plan-day",children:[(0,a.jsxs)("div",{className:"shared-plan-day-heading",children:[(0,a.jsxs)("span",{className:"shared-plan-day-number",children:["DAY ",String(r+1).padStart(2,"0")]}),(0,a.jsx)("h2",{children:e.n})]}),(0,a.jsxs)("p",{className:"shared-plan-meta",children:[p(e.c,"exercise")," · ",p(e.s,"working set","working sets")]}),(e.r||e.q)&&(0,a.jsx)("p",{className:"shared-plan-targets",children:[e.r,e.q].filter(Boolean).join(" · ")}),(0,a.jsx)("ul",{className:"shared-plan-exercises",children:e.x.map((e,r)=>(0,a.jsx)("li",{children:e},`${e}-${r}`))})]},`${e.n}-${r}`))}),(0,a.jsx)(o,{}),(0,a.jsx)("p",{className:"shared-plan-notice",children:"This preview includes plan prescriptions only. It does not include private notes, logged history, account details, or independent training verification."})]})}e.s(["default",0,function(){let e=(0,s.useSearchParams)().toString(),[r,t]=(0,n.useState)({status:"loading",plan:null});return(0,n.useEffect)(()=>{let a=!1;return async function(){try{let r=await d({query:new URLSearchParams(e),href:window.location.href});a||(window.mixpanel?.track?.("plan_share_web_opened",{campaign:"plan_share",source:"web_link"}),t({status:"ready",plan:r}))}catch{a||t({status:"invalid",plan:null})}}(),()=>{a=!0}},[e]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("style",{children:`
        .shared-plan-shell {
          width: min(760px, calc(100% - 32px));
          margin: 0 auto;
          padding: clamp(56px, 9vw, 92px) 0 84px;
          color: #f5f1e8;
        }
        .shared-plan-eyebrow {
          margin: 0 0 16px;
          color: #e2c95f;
          font-size: 0.75rem;
          font-weight: 850;
          letter-spacing: 0.17em;
        }
        .shared-plan-shell h1 {
          max-width: 700px;
          margin: 0;
          font-size: clamp(2.75rem, 8vw, 5.6rem);
          line-height: 0.94;
          letter-spacing: -0.06em;
        }
        .shared-plan-lede {
          max-width: 620px;
          margin: 24px 0 34px;
          color: #bcb6a8;
          font-size: 1.12rem;
          line-height: 1.65;
        }
        .shared-plan-days {
          display: grid;
          gap: 16px;
        }
        .shared-plan-day {
          padding: 24px;
          border: 1px solid rgba(226, 201, 95, 0.22);
          border-radius: 22px;
          background: linear-gradient(145deg, #171713, #0b0b0a);
        }
        .shared-plan-day-heading {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 8px;
        }
        .shared-plan-day-number {
          color: #e2c95f;
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.16em;
        }
        .shared-plan-day h2 {
          margin: 0;
          color: #f5f1e8;
          font-size: 1.5rem;
          letter-spacing: -0.03em;
        }
        .shared-plan-meta {
          margin: 0 0 16px;
          color: #bcb6a8;
          font-size: 0.88rem;
        }
        .shared-plan-targets {
          margin: -5px 0 16px;
          color: #f5f1e8;
          font-size: 0.88rem;
          font-weight: 750;
        }
        .shared-plan-exercises {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .shared-plan-exercises li {
          padding-top: 10px;
          border-top: 1px solid rgba(245, 241, 232, 0.1);
          color: #e9e5dc;
          line-height: 1.5;
        }
        .shared-plan-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .shared-plan-button {
          display: inline-flex;
          box-sizing: border-box;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 11px;
          font-weight: 850;
          text-decoration: none;
        }
        .shared-plan-button-primary {
          color: #17150f;
          background: #e2c95f;
        }
        .shared-plan-button-secondary {
          border: 1px solid rgba(245, 241, 232, 0.2);
          color: #f5f1e8;
        }
        .shared-plan-notice {
          margin: 22px 0 0;
          padding: 18px;
          border: 1px solid rgba(245, 241, 232, 0.1);
          border-radius: 16px;
          color: #9d978b;
          font-size: 0.82rem;
          line-height: 1.55;
        }
        @media (max-width: 560px) {
          .shared-plan-shell { width: min(100% - 28px, 760px); }
          .shared-plan-day { padding: 20px; border-radius: 18px; }
          .shared-plan-actions { display: grid; }
          .shared-plan-button { width: 100%; }
        }
      `}),"ready"===r.status&&r.plan?(0,a.jsx)(c,{plan:r.plan}):"invalid"===r.status?(0,a.jsx)(h,{}):(0,a.jsxs)("section",{className:"shared-plan-shell","aria-live":"polite",children:[(0,a.jsx)("p",{className:"shared-plan-eyebrow",children:"READ-ONLY PLAN SHARE"}),(0,a.jsx)("h1",{children:"Loading shared plan…"}),(0,a.jsx)("p",{className:"shared-plan-lede",children:"A clear plan for the work ahead, shared from Surpass."})]})]})}],48580)},18566,(e,a,r)=>{a.exports=e.r(76562)}]);