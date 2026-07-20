(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[831],{2841:(e,r,t)=>{Promise.resolve().then(t.bind(t,5905))},5905:(e,r,t)=>{"use strict";t.d(r,{default:()=>p});var a=t(9587),o=t(1203),i=t(8020),l=t.n(i);let n="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=blog_hub&mt=8",s=[["/blog/alternatives-to-rp-hypertrophy-app","Alternatives to RP Hypertrophy App"],["/blog/best-hypertrophy-app-ios-review","Best hypertrophy app for iOS"],["/blog/best-workout-app-hypertrophy-2026","Best workout app for hypertrophy"],["/blog/progressive-overload-app-works","Progressive overload apps"],["/blog/import-hevy-to-jacked","Import Hevy to Jacked"],["/blog/rpe-vs-rir-autoregulation-2025","RPE vs RIR"]];function c(){return new URLSearchParams(window.location.search).get("search")||""}function d(e){return!e||Number.isNaN(new Date(e).getTime())?"":new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:"numeric"}).format(new Date(e))}function p({allPosts:e,categories:r}){let[t,i]=(0,o.useState)(c),[h,g]=(0,o.useState)(""),[x,m]=(0,o.useState)("newest"),[f,b]=(0,o.useState)(36),u=(0,o.useMemo)(()=>s.map(([r])=>e.find(e=>r.endsWith(e.slug))).filter(Boolean).slice(0,3),[e]),w=(0,o.useMemo)(()=>{let r=e;if(h&&(r=r.filter(e=>e.category===h)),t){let e=t.toLowerCase().trim();r=r.filter(r=>r.title.toLowerCase().includes(e)||r.excerpt.toLowerCase().includes(e))}let a=[...r];return"oldest"===x?a.sort((e,r)=>new Date(e.date)-new Date(r.date)):"title"===x?a.sort((e,r)=>e.title.localeCompare(r.title)):a.sort((e,r)=>new Date(r.date)-new Date(e.date)),a},[e,t,h,x]),y=w.slice(0,f),j=f<w.length;return(0,a.jsxs)("div",{className:"blog-page",children:[(0,a.jsx)("style",{children:`
        .blog-page {
          min-height: 100vh;
          background: #050505;
          color: #fff8ea;
        }

        .blog-wrap {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .blog-hero {
          padding: 76px 0 54px;
          border-bottom: 1px solid rgba(255,248,234,0.13);
          background:
            radial-gradient(circle at 72% 0%, rgba(245,185,53,0.14), transparent 34rem),
            #050505;
        }

        .blog-hero h1 {
          max-width: 850px;
          margin: 0;
          color: #fffaf0;
          font-size: clamp(3rem, 8vw, 6.2rem);
          line-height: 0.94;
          font-weight: 950;
          letter-spacing: 0;
        }

        .blog-hero p {
          max-width: 720px;
          margin: 22px 0 0;
          color: #b8b0a2;
          font-size: 1.14rem;
          line-height: 1.7;
        }

        .blog-metrics {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .blog-metrics span {
          border: 1px solid rgba(245,185,53,0.38);
          border-radius: 8px;
          padding: 10px 13px;
          color: #e2c95f;
          background: #10100f;
          font-weight: 850;
        }

        .blog-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .blog-hero-actions a {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 0 18px;
          text-decoration: none;
          font-weight: 850;
        }

        .blog-hero-actions a:first-child {
          background: #e2c95f;
          color: #11100c;
        }

        .blog-hero-actions a:last-child {
          border: 1px solid rgba(245,185,53,0.38);
          color: #e2c95f;
        }

        .blog-library {
          padding: 48px 0 88px;
          background: #f3eee2;
          color: #11100c;
        }

        .library-top {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .library-top h2 {
          margin: 0;
          color: #11100c;
          font-size: clamp(2.1rem, 5vw, 3.4rem);
          line-height: 1.05;
          letter-spacing: 0;
        }

        .library-top p {
          max-width: 760px;
          margin: 12px 0 0;
          color: #5f584d;
          font-size: 1.03rem;
          line-height: 1.65;
        }

        .library-top > span {
          color: #5f584d;
          font-weight: 850;
          white-space: nowrap;
        }

        .library-controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .library-controls input,
        .library-controls select {
          min-height: 46px;
          border-radius: 8px;
          border: 1px solid #cfc5b3;
          background: #fffaf0;
          color: #11100c;
          font-size: 0.96rem;
          font-weight: 650;
        }

        .library-controls input {
          flex: 1 1 300px;
          padding: 0 14px;
        }

        .library-controls select {
          padding: 0 14px;
        }

        .category-row,
        .seo-links {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 14px;
        }

        .category-row button {
          min-height: 42px;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid #cfc5b3;
          background: #fffaf0;
          color: #11100c;
          cursor: pointer;
          font-weight: 800;
          white-space: nowrap;
        }

        .category-row button.selected {
          border-color: #11100c;
          background: #11100c;
          color: #fffaf0;
        }

        .seo-links {
          flex-wrap: wrap;
          overflow: visible;
          margin-bottom: 24px;
        }

        .seo-links a {
          color: #11100c;
          font-weight: 820;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .featured-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin: 0 0 24px;
        }

        .featured-card {
          display: block;
          min-height: 170px;
          padding: 18px;
          border-radius: 8px;
          background: #11100c;
          color: #fffaf0;
          text-decoration: none;
        }

        .featured-card span {
          color: #e2c95f;
          font-size: 0.76rem;
          font-weight: 850;
        }

        .featured-card h3 {
          margin: 10px 0 12px;
          font-size: 1.08rem;
          line-height: 1.3;
        }

        .featured-card p {
          margin: 0;
          color: #c8c1b6;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .article-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }

        .article-card {
          color: inherit;
          text-decoration: none;
        }

        .article-card article {
          display: flex;
          flex-direction: column;
          min-height: 190px;
          height: 100%;
          border-radius: 8px;
          padding: 18px;
          border: 1px solid #d8cfbd;
          background: #fffaf0;
          transition: transform 160ms ease, border-color 160ms ease;
        }

        .article-card:hover article {
          transform: translateY(-1px);
          border-color: #11100c;
        }

        .article-card span {
          color: #756d60;
          font-weight: 850;
          font-size: 0.75rem;
          margin-bottom: 11px;
        }

        .article-card h3 {
          margin: 0 0 14px;
          color: #11100c;
          font-size: 1.04rem;
          line-height: 1.34;
        }

        .article-card p {
          margin: 0;
          color: #756d60;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .article-card time {
          margin-top: auto;
          padding-top: 14px;
          color: #756d60;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .blog-cta {
          margin: 32px 0;
          padding: 26px;
          border-radius: 8px;
          background: #11100c;
          color: #fffaf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .blog-cta h2 {
          margin: 0 0 8px;
          font-size: 1.45rem;
          line-height: 1.15;
        }

        .blog-cta p {
          margin: 0;
          color: #c8c1b6;
          line-height: 1.55;
        }

        .blog-cta a {
          flex: 0 0 auto;
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 0 18px;
          background: #e2c95f;
          color: #11100c;
          text-decoration: none;
          font-weight: 850;
        }

        .load-more-row {
          margin-top: 28px;
          text-align: center;
        }

        .load-more-row button {
          min-height: 46px;
          padding: 0 23px;
          border-radius: 8px;
          border: 1px solid #11100c;
          background: #11100c;
          color: #fffaf0;
          cursor: pointer;
          font-weight: 850;
        }

        .empty-state {
          padding: 38px;
          text-align: center;
          color: #5f584d;
          font-weight: 760;
        }

        @media (max-width: 760px) {
          .blog-hero {
            padding: 56px 0 42px;
          }

          .library-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .featured-row {
            grid-template-columns: 1fr;
          }

          .blog-cta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .article-card article {
            transition: none;
          }

          .article-card:hover article {
            transform: none;
          }
        }
      `}),(0,a.jsx)("section",{className:"blog-hero",children:(0,a.jsxs)("div",{className:"blog-wrap",children:[(0,a.jsx)("h1",{children:"Training library for smarter hypertrophy."}),(0,a.jsx)("p",{children:"Practical articles on progressive overload, RIR, deloads, exercise selection, recovery, supplements, workout imports, and the app decisions that matter inside a real training block."}),(0,a.jsxs)("div",{className:"blog-metrics",children:[(0,a.jsxs)("span",{children:[e.length," articles"]}),(0,a.jsxs)("span",{children:[r.length," topics"]}),(0,a.jsx)("span",{children:"Built for Jacked lifters"})]}),(0,a.jsxs)("div",{className:"blog-hero-actions",children:[(0,a.jsx)("a",{href:n,target:"_blank",rel:"noopener noreferrer","data-global-cta":"blog_hero",children:"Get the iPhone app"}),(0,a.jsx)(l(),{href:"#library",children:"Browse articles"})]})]})}),(0,a.jsx)("section",{className:"blog-library",id:"library",children:(0,a.jsxs)("div",{className:"blog-wrap",children:[(0,a.jsxs)("div",{className:"library-top",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{children:"Find the reason behind the next set."}),(0,a.jsx)("p",{children:"Search the Jacked library when you want the training logic behind the app: how to progress, when to hold back, what to track, and how to make imported history useful."})]}),(0,a.jsxs)("span",{children:[w.length," matching articles"]})]}),(0,a.jsxs)("div",{className:"library-controls",children:[(0,a.jsx)("input",{type:"text","aria-label":"Search training articles",placeholder:"Search hypertrophy, RIR, creatine, deload...",value:t,onChange:e=>{i(e.target.value),b(36)}}),(0,a.jsxs)("select",{"aria-label":"Sort training articles",value:x,onChange:e=>{m(e.target.value),b(36)},children:[(0,a.jsx)("option",{value:"newest",children:"Newest"}),(0,a.jsx)("option",{value:"oldest",children:"Oldest"}),(0,a.jsx)("option",{value:"title",children:"A-Z"})]})]}),(0,a.jsxs)("div",{className:"category-row","aria-label":"Filter training articles by category",children:[(0,a.jsx)("button",{type:"button",onClick:()=>{g(""),b(36)},className:""===h?"selected":"",children:"All"}),r.map(e=>(0,a.jsx)("button",{type:"button",onClick:()=>{g(e),b(36)},className:h===e?"selected":"",children:e},e))]}),(0,a.jsx)("div",{className:"seo-links",children:s.map(([e,r])=>(0,a.jsx)(l(),{href:e,children:r},e))}),u.length>0&&(0,a.jsx)("div",{className:"featured-row","aria-label":"Start here",children:u.map(e=>(0,a.jsxs)(l(),{href:`/blog/${e.slug}`,className:"featured-card",children:[(0,a.jsx)("span",{children:"Start here"}),(0,a.jsx)("h3",{children:e.title}),e.excerpt&&(0,a.jsx)("p",{children:e.excerpt})]},e.slug))}),(0,a.jsx)("div",{className:"article-grid",children:y.map(e=>(0,a.jsx)(l(),{href:`/blog/${e.slug}`,className:"article-card",children:(0,a.jsxs)("article",{children:[(0,a.jsx)("span",{children:e.category}),(0,a.jsx)("h3",{children:e.title}),e.excerpt&&(0,a.jsx)("p",{children:e.excerpt}),d(e.date)&&(0,a.jsx)("time",{dateTime:e.date,children:d(e.date)})]})},e.slug))}),y.length>11&&(0,a.jsxs)("section",{className:"blog-cta",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{children:"Use the research while you train."}),(0,a.jsx)("p",{children:"Jacked turns RIR, volume, rest timing, imports, and progress history into a faster iPhone workout log."})]}),(0,a.jsx)("a",{href:n,target:"_blank",rel:"noopener noreferrer","data-global-cta":"blog_mid_cta",children:"Open App Store"})]}),j&&(0,a.jsx)("div",{className:"load-more-row",children:(0,a.jsx)("button",{type:"button",onClick:()=>b(e=>e+36),children:"Load more articles"})}),0===w.length&&(0,a.jsx)("p",{className:"empty-state",children:"No articles found."})]})})]})}}},e=>{e.O(0,[20,914,330,358],()=>e(e.s=2841)),_N_E=e.O()}]);