export default function LibraryStyles() {
  return (
    <style>{`
      .lib-page {
        background: #050505;
        color: #f2eee4;
        min-height: 100vh;
        padding-bottom: 12px;
      }
      .lib-wrap {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
      }
      .lib-crumbs {
        padding-top: 26px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        color: #8f897c;
        font-size: 0.84rem;
      }
      .lib-crumbs a { color: #b7b0a3; text-decoration: none; }
      .lib-crumbs a:hover { color: #f4cb65; }
      .lib-hero {
        padding: 26px 0 30px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
        gap: 32px;
        align-items: end;
      }
      .lib-hero h1 {
        margin: 0 0 16px;
        color: #f7f2e8;
        font-size: clamp(2.1rem, 5.2vw, 4rem);
        line-height: 1;
        letter-spacing: 0;
        font-weight: 780;
      }
      .lib-hero p {
        margin: 0;
        color: #b7b0a3;
        font-size: 1.04rem;
        line-height: 1.65;
        max-width: 720px;
      }
      .lib-eyebrow {
        margin: 0 0 12px;
        color: #d9c26c;
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      .lib-facts {
        border: 1px solid rgba(242, 238, 228, 0.12);
        background: #0d0d0c;
        border-radius: 8px;
        padding: 16px 18px;
        display: grid;
        gap: 10px;
        margin: 0;
      }
      .lib-facts div { display: flex; justify-content: space-between; gap: 14px; }
      .lib-facts dt { color: #8f897c; font-size: 0.86rem; }
      .lib-facts dd { margin: 0; color: #f7f2e8; font-weight: 700; font-size: 0.9rem; text-align: right; }
      .lib-section {
        padding: 34px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .lib-section h2 {
        margin: 0 0 16px;
        color: #f7f2e8;
        font-size: clamp(1.36rem, 3vw, 2rem);
        line-height: 1.15;
        letter-spacing: 0;
        font-weight: 720;
      }
      .lib-section h3 {
        margin: 0 0 8px;
        color: #f7f2e8;
        font-size: 1.04rem;
        font-weight: 720;
      }
      .lib-section p, .lib-section li {
        color: #c9c2b5;
        line-height: 1.65;
        font-size: 0.99rem;
      }
      .lib-section p { margin: 0 0 12px; max-width: 760px; }
      .lib-two {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
      }
      .lib-steps { margin: 0; padding-left: 22px; display: grid; gap: 8px; }
      .lib-mistakes { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .lib-card {
        border: 1px solid rgba(242, 238, 228, 0.1);
        background: #0e0e0d;
        border-radius: 8px;
        padding: 16px;
      }
      .lib-card p { margin: 0; font-size: 0.94rem; }
      .lib-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 12px;
      }
      .lib-link-card {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 14px 16px;
        border-radius: 8px;
        background: #0e0e0d;
        border: 1px solid rgba(242, 238, 228, 0.1);
        color: inherit;
        text-decoration: none;
        transition: border-color 160ms ease;
      }
      .lib-link-card:hover, .lib-link-card:focus-visible { border-color: rgba(244, 203, 101, 0.55); outline: none; }
      .lib-link-card strong { color: #f7f2e8; font-size: 0.98rem; font-weight: 720; }
      .lib-link-card span { color: #a7a094; font-size: 0.86rem; line-height: 1.45; }
      .lib-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
      .lib-chips a, .lib-chips span {
        display: inline-block;
        padding: 6px 11px;
        border-radius: 999px;
        border: 1px solid rgba(242, 238, 228, 0.14);
        color: #e6dfd0;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 650;
      }
      .lib-chips a:hover { border-color: #f4cb65; color: #f4cb65; }
      .lib-table-wrap { overflow-x: auto; border: 1px solid rgba(242, 238, 228, 0.1); border-radius: 8px; }
      .lib-table { width: 100%; border-collapse: collapse; min-width: 560px; table-layout: fixed; }
      .lib-table th:first-child, .lib-table td:first-child { width: 46%; }
      .lib-table th, .lib-table td {
        text-align: left;
        padding: 11px 14px;
        border-bottom: 1px solid rgba(242, 238, 228, 0.08);
        font-size: 0.93rem;
        color: #d9d2c4;
        vertical-align: top;
      }
      .lib-table th { color: #8f897c; font-weight: 700; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; background: #0b0b0a; }
      .lib-table tr:last-child td { border-bottom: 0; }
      .lib-table td a { color: #f7f2e8; text-decoration: none; border-bottom: 1px solid rgba(244, 203, 101, 0.45); }
      .lib-table td a:hover { color: #f4cb65; }
      .lib-table .lib-note { display: block; color: #8f897c; font-size: 0.84rem; margin-top: 4px; }
      .lib-day { margin-bottom: 26px; }
      .lib-day-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px 14px; margin-bottom: 10px; }
      .lib-day-head h3 { margin: 0; font-size: 1.16rem; }
      .lib-day-head span { color: #8f897c; font-size: 0.88rem; }
      .lib-cta {
        border: 1px solid rgba(244, 203, 101, 0.35);
        background: linear-gradient(180deg, #14120c, #0d0d0c);
        border-radius: 10px;
        padding: 20px;
        display: grid;
        gap: 12px;
      }
      .lib-cta h2, .lib-cta strong { margin: 0; color: #f7f2e8; }
      .lib-cta p { margin: 0; color: #c9c2b5; line-height: 1.6; }
      .lib-actions { display: flex; flex-wrap: wrap; gap: 10px; }
      .lib-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border-radius: 11px;
        text-decoration: none;
        font-weight: 820;
        font-size: 0.92rem;
      }
      .lib-button-primary { background: #f4cb65; color: #111; }
      .lib-button-primary:hover { background: #ffda78; }
      .lib-button-secondary { border: 1px solid rgba(242, 238, 228, 0.2); color: #f7f2e8; }
      .lib-button-secondary:hover { border-color: #f4cb65; }
      .lib-small { color: #8f897c !important; font-size: 0.84rem !important; }
      .lib-bars { display: grid; gap: 8px; max-width: 620px; }
      .lib-bar { display: grid; grid-template-columns: 110px 1fr 36px; gap: 10px; align-items: center; font-size: 0.9rem; color: #d9d2c4; }
      .lib-bar-track { height: 8px; background: rgba(242, 238, 228, 0.08); border-radius: 99px; overflow: hidden; }
      .lib-bar-fill { height: 100%; background: #d9c26c; border-radius: 99px; }
      .lib-faq article { margin-bottom: 18px; }
      @media (max-width: 820px) {
        .lib-hero, .lib-two { grid-template-columns: 1fr; }
        .lib-mistakes { grid-template-columns: 1fr; }
      }
    `}</style>
  )
}
