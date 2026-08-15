(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,86623,e=>{"use strict";var r=e.i(43476),a=e.i(71645),t=e.i(22016);let i="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=blog_hub&mt=8",o="blog_hub_promise_v2",l=[["/blog/alternatives-to-rp-hypertrophy-app","Alternatives to RP Hypertrophy App"],["/blog/best-hypertrophy-app-ios-review","Best hypertrophy app for iOS"],["/blog/best-workout-app-hypertrophy-2026","Best workout app for hypertrophy"],["/blog/progressive-overload-app-works","Progressive overload apps"],["/blog/import-hevy-to-surpass","Import Hevy to Surpass"],["/blog/rpe-vs-rir-autoregulation-2025","RPE vs RIR"]];function n(){return new URLSearchParams(window.location.search).get("search")||""}function s(e){return!e||Number.isNaN(new Date(e).getTime())?"":new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:"numeric"}).format(new Date(e))}e.s(["default",0,function({allPosts:e,categories:c}){let[p,d]=(0,a.useState)(n),[h,g]=(0,a.useState)(""),[m,x]=(0,a.useState)("newest"),[b,f]=(0,a.useState)(36),u=(0,a.useMemo)(()=>l.map(([r])=>e.find(e=>r.endsWith(e.slug))).filter(Boolean).slice(0,3),[e]),y=(0,a.useMemo)(()=>{let r=e;if(h&&(r=r.filter(e=>e.category===h)),p){let e=p.toLowerCase().trim();r=r.filter(r=>r.title.toLowerCase().includes(e)||r.excerpt.toLowerCase().includes(e))}let a=[...r];return"oldest"===m?a.sort((e,r)=>new Date(e.date)-new Date(r.date)):"title"===m?a.sort((e,r)=>e.title.localeCompare(r.title)):a.sort((e,r)=>new Date(r.date)-new Date(e.date)),a},[e,p,h,m]),w=y.slice(0,b),j=b<y.length;return(0,r.jsxs)("div",{className:"blog-page",children:[(0,r.jsx)("style",{children:`
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

        .library-map {
          margin-top: 34px;
          border-top: 1px solid #cfc5b3;
          border-bottom: 1px solid #cfc5b3;
        }

        .library-map summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          min-height: 58px;
          color: #11100c;
          cursor: pointer;
          font-weight: 850;
          list-style: none;
        }

        .library-map summary::-webkit-details-marker {
          display: none;
        }

        .library-map summary::after {
          content: '+';
          color: #756d60;
          font-size: 1.4rem;
          line-height: 1;
        }

        .library-map[open] summary::after {
          content: '−';
        }

        .library-map summary span:last-child {
          color: #756d60;
          font-size: 0.82rem;
          font-weight: 750;
        }

        .library-map nav {
          padding: 4px 0 24px;
        }

        .library-map-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 8px 18px;
        }

        .library-map-grid a {
          display: block;
          padding: 8px 0;
          color: #302c25;
          font-size: 0.9rem;
          line-height: 1.35;
          text-decoration: underline;
          text-decoration-color: #c2b598;
          text-underline-offset: 3px;
        }

        .library-map-grid a:hover {
          color: #11100c;
          text-decoration-color: #11100c;
        }

        .library-map-grid small {
          display: block;
          margin-bottom: 2px;
          color: #756d60;
          font-size: 0.7rem;
          font-weight: 850;
          letter-spacing: 0.04em;
          text-transform: uppercase;
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
      `}),(0,r.jsx)("section",{className:"blog-hero",children:(0,r.jsxs)("div",{className:"blog-wrap",children:[(0,r.jsx)("h1",{children:"Training library for smarter hypertrophy."}),(0,r.jsx)("p",{children:"Practical articles on progressive overload, RIR, deloads, exercise selection, recovery, supplements, workout imports, and the app decisions that matter inside a real training block."}),(0,r.jsxs)("div",{className:"blog-metrics",children:[(0,r.jsxs)("span",{children:[e.length," articles"]}),(0,r.jsxs)("span",{children:[c.length," topics"]}),(0,r.jsx)("span",{children:"Built for Surpass lifters"})]}),(0,r.jsxs)("div",{className:"blog-hero-actions",children:[(0,r.jsx)("a",{href:i,target:"_blank",rel:"noopener noreferrer","data-global-cta":"blog_hub_hero","data-app-store-placement":"blog_hub_hero","data-app-store-campaign":"blog_hub","data-experiment":"blog_hub_cta","data-experiment-variant":"outcome_v1","data-copy-version":o,children:"Start free on iPhone"}),(0,r.jsx)(t.default,{href:"#library",children:"Browse articles"})]})]})}),(0,r.jsx)("section",{className:"blog-library",id:"library",children:(0,r.jsxs)("div",{className:"blog-wrap",children:[(0,r.jsxs)("div",{className:"library-top",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{children:"Find the reason behind the next set."}),(0,r.jsx)("p",{children:"Search the Surpass library when you want the training logic behind the app: how to progress, when to hold back, what to track, and how to make imported history useful."})]}),(0,r.jsxs)("span",{children:[y.length," matching articles"]})]}),(0,r.jsxs)("div",{className:"library-controls",children:[(0,r.jsx)("input",{type:"text","aria-label":"Search training articles",placeholder:"Search hypertrophy, RIR, creatine, deload...",value:p,onChange:e=>{d(e.target.value),f(36)}}),(0,r.jsxs)("select",{"aria-label":"Sort training articles",value:m,onChange:e=>{x(e.target.value),f(36)},children:[(0,r.jsx)("option",{value:"newest",children:"Newest"}),(0,r.jsx)("option",{value:"oldest",children:"Oldest"}),(0,r.jsx)("option",{value:"title",children:"A-Z"})]})]}),(0,r.jsxs)("div",{className:"category-row","aria-label":"Filter training articles by category",children:[(0,r.jsx)("button",{type:"button",onClick:()=>{g(""),f(36)},className:""===h?"selected":"",children:"All"}),c.map(e=>(0,r.jsx)("button",{type:"button",onClick:()=>{g(e),f(36)},className:h===e?"selected":"",children:e},e))]}),(0,r.jsx)("div",{className:"seo-links",children:l.map(([e,a])=>(0,r.jsx)(t.default,{href:e,children:a},e))}),u.length>0&&(0,r.jsx)("div",{className:"featured-row","aria-label":"Start here",children:u.map(e=>(0,r.jsxs)(t.default,{href:`/blog/${e.slug}`,className:"featured-card",children:[(0,r.jsx)("span",{children:"Start here"}),(0,r.jsx)("h3",{children:e.title}),e.excerpt&&(0,r.jsx)("p",{children:e.excerpt})]},e.slug))}),(0,r.jsx)("div",{className:"article-grid",children:w.map(e=>(0,r.jsx)(t.default,{href:`/blog/${e.slug}`,className:"article-card",children:(0,r.jsxs)("article",{children:[(0,r.jsx)("span",{children:e.category}),(0,r.jsx)("h3",{children:e.title}),e.excerpt&&(0,r.jsx)("p",{children:e.excerpt}),s(e.date)&&(0,r.jsx)("time",{dateTime:e.date,children:s(e.date)})]})},e.slug))}),w.length>11&&(0,r.jsxs)("section",{className:"blog-cta",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{children:"Use the research while you train."}),(0,r.jsx)("p",{children:"Surpass turns RIR, volume, rest timing, imports, and progress history into a faster iPhone workout log."})]}),(0,r.jsx)("a",{href:i,target:"_blank",rel:"noopener noreferrer","data-global-cta":"blog_hub_mid","data-app-store-placement":"blog_hub_mid","data-app-store-campaign":"blog_hub","data-experiment":"blog_hub_cta","data-experiment-variant":"outcome_v1","data-copy-version":o,children:"Start free on iPhone"})]}),j&&(0,r.jsx)("div",{className:"load-more-row",children:(0,r.jsx)("button",{type:"button",onClick:()=>f(e=>e+36),children:"Load more articles"})}),(0,r.jsxs)("details",{className:"library-map",children:[(0,r.jsxs)("summary",{children:[(0,r.jsx)("span",{children:"Browse the complete training library"}),(0,r.jsxs)("span",{children:[e.length," canonical guides"]})]}),(0,r.jsx)("nav",{"aria-label":"Complete training library",children:(0,r.jsx)("div",{className:"library-map-grid",children:e.map(e=>(0,r.jsxs)(t.default,{href:`/blog/${e.slug}`,children:[(0,r.jsx)("small",{children:e.category}),e.title]},`library-map-${e.slug}`))})})]}),0===y.length&&(0,r.jsx)("p",{className:"empty-state",children:"No articles found."})]})})]})}])}]);