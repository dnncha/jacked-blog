(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,86623,e=>{"use strict";var r=e.i(43476),t=e.i(71645),a=e.i(22016);let o="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=blog_hub&mt=8",i=[["/blog/alternatives-to-rp-hypertrophy-app","Alternatives to RP Hypertrophy App"],["/blog/best-hypertrophy-app-ios-review","Best hypertrophy app for iOS"],["/blog/best-workout-app-hypertrophy-2026","Best workout app for hypertrophy"],["/blog/progressive-overload-app-works","Progressive overload apps"],["/blog/import-hevy-to-jacked","Import Hevy to Jacked"],["/blog/rpe-vs-rir-autoregulation-2025","RPE vs RIR"]];function l(){return new URLSearchParams(window.location.search).get("search")||""}function n(e){return!e||Number.isNaN(new Date(e).getTime())?"":new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:"numeric"}).format(new Date(e))}e.s(["default",0,function({allPosts:e,categories:s}){let[c,d]=(0,t.useState)(l),[p,h]=(0,t.useState)(""),[g,x]=(0,t.useState)("newest"),[m,f]=(0,t.useState)(36),b=(0,t.useMemo)(()=>i.map(([r])=>e.find(e=>r.endsWith(e.slug))).filter(Boolean).slice(0,3),[e]),u=(0,t.useMemo)(()=>{let r=e;if(p&&(r=r.filter(e=>e.category===p)),c){let e=c.toLowerCase().trim();r=r.filter(r=>r.title.toLowerCase().includes(e)||r.excerpt.toLowerCase().includes(e))}let t=[...r];return"oldest"===g?t.sort((e,r)=>new Date(e.date)-new Date(r.date)):"title"===g?t.sort((e,r)=>e.title.localeCompare(r.title)):t.sort((e,r)=>new Date(r.date)-new Date(e.date)),t},[e,c,p,g]),w=u.slice(0,m),y=m<u.length;return(0,r.jsxs)("div",{className:"blog-page",children:[(0,r.jsx)("style",{children:`
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
      `}),(0,r.jsx)("section",{className:"blog-hero",children:(0,r.jsxs)("div",{className:"blog-wrap",children:[(0,r.jsx)("h1",{children:"Training library for smarter hypertrophy."}),(0,r.jsx)("p",{children:"Practical articles on progressive overload, RIR, deloads, exercise selection, recovery, supplements, workout imports, and the app decisions that matter inside a real training block."}),(0,r.jsxs)("div",{className:"blog-metrics",children:[(0,r.jsxs)("span",{children:[e.length," articles"]}),(0,r.jsxs)("span",{children:[s.length," topics"]}),(0,r.jsx)("span",{children:"Built for Jacked lifters"})]}),(0,r.jsxs)("div",{className:"blog-hero-actions",children:[(0,r.jsx)("a",{href:o,target:"_blank",rel:"noopener noreferrer","data-global-cta":"blog_hero",children:"Get the iPhone app"}),(0,r.jsx)(a.default,{href:"#library",children:"Browse articles"})]})]})}),(0,r.jsx)("section",{className:"blog-library",id:"library",children:(0,r.jsxs)("div",{className:"blog-wrap",children:[(0,r.jsxs)("div",{className:"library-top",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{children:"Find the reason behind the next set."}),(0,r.jsx)("p",{children:"Search the Jacked library when you want the training logic behind the app: how to progress, when to hold back, what to track, and how to make imported history useful."})]}),(0,r.jsxs)("span",{children:[u.length," matching articles"]})]}),(0,r.jsxs)("div",{className:"library-controls",children:[(0,r.jsx)("input",{type:"text","aria-label":"Search training articles",placeholder:"Search hypertrophy, RIR, creatine, deload...",value:c,onChange:e=>{d(e.target.value),f(36)}}),(0,r.jsxs)("select",{"aria-label":"Sort training articles",value:g,onChange:e=>{x(e.target.value),f(36)},children:[(0,r.jsx)("option",{value:"newest",children:"Newest"}),(0,r.jsx)("option",{value:"oldest",children:"Oldest"}),(0,r.jsx)("option",{value:"title",children:"A-Z"})]})]}),(0,r.jsxs)("div",{className:"category-row","aria-label":"Filter training articles by category",children:[(0,r.jsx)("button",{type:"button",onClick:()=>{h(""),f(36)},className:""===p?"selected":"",children:"All"}),s.map(e=>(0,r.jsx)("button",{type:"button",onClick:()=>{h(e),f(36)},className:p===e?"selected":"",children:e},e))]}),(0,r.jsx)("div",{className:"seo-links",children:i.map(([e,t])=>(0,r.jsx)(a.default,{href:e,children:t},e))}),b.length>0&&(0,r.jsx)("div",{className:"featured-row","aria-label":"Start here",children:b.map(e=>(0,r.jsxs)(a.default,{href:`/blog/${e.slug}`,className:"featured-card",children:[(0,r.jsx)("span",{children:"Start here"}),(0,r.jsx)("h3",{children:e.title}),e.excerpt&&(0,r.jsx)("p",{children:e.excerpt})]},e.slug))}),(0,r.jsx)("div",{className:"article-grid",children:w.map(e=>(0,r.jsx)(a.default,{href:`/blog/${e.slug}`,className:"article-card",children:(0,r.jsxs)("article",{children:[(0,r.jsx)("span",{children:e.category}),(0,r.jsx)("h3",{children:e.title}),e.excerpt&&(0,r.jsx)("p",{children:e.excerpt}),n(e.date)&&(0,r.jsx)("time",{dateTime:e.date,children:n(e.date)})]})},e.slug))}),w.length>11&&(0,r.jsxs)("section",{className:"blog-cta",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{children:"Use the research while you train."}),(0,r.jsx)("p",{children:"Jacked turns RIR, volume, rest timing, imports, and progress history into a faster iPhone workout log."})]}),(0,r.jsx)("a",{href:o,target:"_blank",rel:"noopener noreferrer","data-global-cta":"blog_mid_cta",children:"Open App Store"})]}),y&&(0,r.jsx)("div",{className:"load-more-row",children:(0,r.jsx)("button",{type:"button",onClick:()=>f(e=>e+36),children:"Load more articles"})}),0===u.length&&(0,r.jsx)("p",{className:"empty-state",children:"No articles found."})]})})]})}])}]);