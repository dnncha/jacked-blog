import Link from 'next/link'
import WebAnalytics from './components/WebAnalytics'

export const metadata = {
  metadataBase: new URL('https://jacked.coach'),
  title: {
    default: 'Surpass — Get Bigger On Purpose',
    template: '%s | Surpass'
  },
  description: 'Build the body people notice with Surpass — a focused iPhone hypertrophy app for visible priorities, guided workouts, and evidence-led progression.',
  keywords: ['strength training app', 'hypertrophy tracker', 'workout planner', 'progressive overload app', 'visible muscle', 'workout receipts', 'weekly muscle targets', 'Hevy import'],
  authors: [{ name: 'Surpass' }],
  creator: 'Surpass',
  publisher: 'Surpass',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jacked.coach',
    siteName: 'Surpass',
    title: 'Surpass — Get Bigger On Purpose',
    description: 'Build the body people notice with Surpass — a focused iPhone hypertrophy app for visible priorities, guided workouts, and evidence-led progression.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Surpass gym workout tracker for iPhone'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surpass — Get Bigger On Purpose',
    description: 'Build the body people notice with Surpass — a focused iPhone hypertrophy app for visible priorities, guided workouts, and evidence-led progression.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://jacked.coach/feed.xml',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/surpass-icon.png" type="image/png" sizes="1024x1024" />
        <link rel="shortcut icon" href="/surpass-icon.png" type="image/png" sizes="1024x1024" />
        <link rel="apple-touch-icon" href="/surpass-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="Surpass training library RSS feed" href="/feed.xml" />
        <meta name="apple-itunes-app" content="app-id=6757132605, affiliate-data=pt=128406689&ct=smart_banner&mt=8" />
        <style dangerouslySetInnerHTML={{ __html: `
          .site-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 10px 18px;
            background: rgba(5, 5, 5, 0.8);
            border-bottom: 1px solid rgba(242, 238, 228, 0.1);
            backdrop-filter: blur(18px) saturate(130%);
            -webkit-backdrop-filter: blur(18px) saturate(130%);
          }
          .site-header-nav {
            width: min(1240px, 100%);
            min-height: 52px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
          }
          .site-header-logo {
            color: #f4cb65;
            text-decoration: none;
            font-size: 1.02rem;
            font-weight: 900;
            letter-spacing: 0.14em;
            line-height: 1;
          }
          .site-header-links {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 4px;
          }
          .site-header-mobile-actions {
            display: none;
            align-items: center;
            gap: 8px;
            margin-left: auto;
          }
          .site-header-link {
            padding: 9px 10px;
            color: #b7b0a3;
            text-decoration: none;
            font-size: 0.82rem;
            font-weight: 720;
            border-radius: 9px;
            transition: color 160ms ease, background 160ms ease;
          }
          .site-header-link:hover,
          .site-header-link:focus-visible {
            color: #fff8ea;
            background: rgba(255, 248, 234, 0.07);
            outline: none;
          }
          .site-header-cta {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 0 15px;
            margin-left: 6px;
            color: #111;
            background: #f4cb65;
            border: 1px solid rgba(255, 245, 193, 0.55);
            border-radius: 11px;
            box-shadow: 0 8px 28px rgba(226, 201, 95, 0.13);
            text-decoration: none;
            font-size: 0.78rem;
            font-weight: 850;
            white-space: nowrap;
            transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
          }
          .site-header-cta:hover,
          .site-header-cta:focus-visible {
            background: #ffda78;
            box-shadow: 0 12px 34px rgba(226, 201, 95, 0.22);
            transform: translateY(-1px);
            outline: none;
          }
          .site-header-cta-mobile { display: none; }
          .site-header-menu { position: relative; }
          .site-header-menu summary { list-style: none; }
          .site-header-menu summary::-webkit-details-marker { display: none; }
          .site-header-menu-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 38px;
            padding: 0 12px;
            border: 1px solid rgba(242, 238, 228, 0.16);
            border-radius: 10px;
            color: #f7f0df;
            background: rgba(255, 255, 255, 0.04);
            cursor: pointer;
            font-size: 0.74rem;
            font-weight: 820;
          }
          .site-header-menu-toggle:focus-visible {
            outline: 2px solid #f4cb65;
            outline-offset: 2px;
          }
          .site-header-menu-panel {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            z-index: 110;
            display: grid;
            min-width: 210px;
            padding: 8px;
            border: 1px solid rgba(242, 238, 228, 0.16);
            border-radius: 12px;
            background: rgba(15, 15, 14, 0.98);
            box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42);
          }
          .site-header-menu-panel .site-header-link {
            display: block;
            padding: 11px 12px;
            color: #f7f0df;
            font-size: 0.86rem;
          }
          .site-header-menu-panel .site-header-link:hover,
          .site-header-menu-panel .site-header-link:focus-visible {
            background: rgba(255, 248, 234, 0.08);
          }
          @media (max-width: 760px) {
            .site-header { padding: 8px 10px; }
            .site-header-nav { min-height: 48px; gap: 8px; }
            .site-header-desktop-links { display: none; }
            .site-header-mobile-actions { display: flex; }
            .site-header-cta-mobile { display: inline-flex; min-height: 38px; padding: 0 11px; margin-left: 0; font-size: 0.72rem; }
            .site-header-menu-toggle { min-height: 38px; }
          }
        ` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Surpass - Strength Training',
          alternateName: 'Surpass',
          operatingSystem: 'iOS',
          applicationCategory: 'HealthApplication',
          description: 'Build the body people notice with focused blocks, clear training targets, and honest progress evidence.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          url: 'https://jacked.coach',
          downloadUrl: 'https://apps.apple.com/app/id6757132605',
          featureList: [
            'Visible-priority training blocks',
            'Focused workout and set logging',
            'Workout receipts that explain what moved',
            'Weekly hard-set targets by muscle',
            'Double progression guidance',
            'Next load and rep-range targets',
            'Compatible Hevy workout history import',
            'Rest timer and active workout resume',
            'Lift and workout history'
          ]
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Surpass',
          url: 'https://jacked.coach',
          logo: 'https://jacked.coach/og-image.png',
          sameAs: [
            'https://apps.apple.com/app/id6757132605'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            url: 'https://jacked.coach/support'
          }
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Surpass',
          url: 'https://jacked.coach',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://jacked.coach/blog?search={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(e,c){if(!c.__SV){var l,h;window.mixpanel=c;c._i=[];c.init=function(q,r,f){function t(d,a){var g=a.split(".");2==g.length&&(d=d[g[0]],a=g[1]);d[a]=function(){d.push([a].concat(Array.prototype.slice.call(arguments,0)))}}var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";b.people=b.people||[];b.toString=function(d){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);d||(a+=" (stub)");return a};b.people.toString=function(){return b.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)t(b,l[h]);var n="set set_once union unset remove delete".split(" ");b.get_group=function(){function d(p){a[p]=function(){b.push([g,[p].concat(Array.prototype.slice.call(arguments,0))])}}for(var a={},g=["get_group"].concat(Array.prototype.slice.call(arguments,0)),m=0;m<n.length;m++)d(n[m]);return a};c._i.push([q,r,f])};c.__SV=1.2;var k=e.createElement("script");k.type="text/javascript";k.async=!0;k.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=e.getElementsByTagName("script")[0];e.parentNode.insertBefore(k,e)}})(document,window.mixpanel||[]);mixpanel.init('32b861825d2e0b1beca8b2a1ae0f52c1',{autocapture:false,track_pageview:false,record_sessions_percent:0,disable_persistence:true,disable_cookie:true,ip:false,save_referrer:false,store_google:false,property_blacklist:['$current_url','$referrer','$referring_domain','$initial_referrer','$initial_referring_domain','mp_keyword'],api_host:'https://api-eu.mixpanel.com'});`
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener('click',function(e){const a=e.target.closest('[data-nav-section]');if(a){window.mixpanel?.track?.('nav_click',{section:a.getAttribute('data-nav-section')||'unknown'});}const c=e.target.closest('[data-global-cta]');if(c){window.mixpanel?.track?.('cta_click',{placement:c.getAttribute('data-global-cta')||'unknown',target:'app_store'});}const r=e.target.closest('[data-related-tool]');if(r){const p=new URLSearchParams(window.location.search);const s=v=>{v=(v||'').trim().replace(/\\s+/g,'_');return /^(?!https?:\\/\\/)(?!.*@)[A-Za-z0-9][A-Za-z0-9._~:/+-]{0,79}$/.test(v)?v:''};window.mixpanel?.track?.('tool_related_tool_clicked',{tool_name:window.location.pathname.split('/').filter(Boolean).pop()||'tools',related_tool:r.getAttribute('data-related-tool')||'unknown',units:'',goal:'',exercise_type:'',source_page:window.location.pathname||'/',utm_source:s(p.get('utm_source')),utm_campaign:s(p.get('utm_campaign'))});}});` }} />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: 1.6,
        color: '#e5e5e5',
        backgroundColor: '#000000'
      }}>
        <WebAnalytics />
        <header className="site-header">
          <nav className="site-header-nav" aria-label="Primary navigation">
            <Link href="/" className="site-header-logo">SURPASS</Link>
            <div className="site-header-links site-header-desktop-links">
              <Link href="/#hiw" className="site-header-link" data-nav-section="how_it_works">How it works</Link>
              <Link href="/tools" className="site-header-link" data-nav-section="tools">Tools</Link>
              <Link href="/blog" className="site-header-link" data-nav-section="training_library">Training Library</Link>
              <Link href="/about" className="site-header-link site-header-optional" data-nav-section="about">About</Link>
              <Link href="/support" className="site-header-link site-header-optional" data-nav-section="support">Support</Link>
              <a href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=surpass_coach&mt=8" target="_blank" rel="noopener noreferrer" aria-label="Start free with Surpass on iPhone" className="site-header-cta site-header-cta-desktop" data-global-cta="header" data-app-store-placement="header" data-copy-version="header_promise_v1">Start free</a>
            </div>
            <div className="site-header-mobile-actions">
              <a href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=surpass_coach_mobile&mt=8" target="_blank" rel="noopener noreferrer" aria-label="Start free with Surpass on iPhone" className="site-header-cta site-header-cta-mobile" data-global-cta="header_mobile" data-app-store-placement="header_mobile" data-copy-version="header_promise_v1">Start free</a>
              <details className="site-header-menu">
                <summary className="site-header-menu-toggle" aria-label="Open navigation">Menu</summary>
                <div className="site-header-menu-panel">
                  <Link href="/#hiw" className="site-header-link" data-nav-section="how_it_works">How it works</Link>
                  <Link href="/tools" className="site-header-link" data-nav-section="tools">Tools</Link>
                  <Link href="/blog" className="site-header-link" data-nav-section="training_library">Training Library</Link>
                  <Link href="/about" className="site-header-link" data-nav-section="about">About</Link>
                  <Link href="/support" className="site-header-link" data-nav-section="support">Support</Link>
                </div>
              </details>
            </div>
          </nav>
        </header>
        <main style={{
          margin: '0 auto',
          padding: 0,
          minHeight: 'calc(100vh - 200px)',
          backgroundColor: '#000000'
        }}>
          {children}
        </main>
        <footer style={{
          backgroundColor: '#0a0a0a',
          borderTop: '1px solid #222',
          color: '#8f897c',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
            <Link href="/workout-tracker" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Workout tracker</Link>
            <Link href="/progressive-overload" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Progressive overload</Link>
            <Link href="/hypertrophy-app" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Hypertrophy app</Link>
            <Link href="/import-workout-history" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Import workout history</Link>
            <Link href="/hevy-alternative" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Hevy alternative</Link>
            <Link href="/alpha-progression-alternative" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Alpha Progression comparison</Link>
            <Link href="/methodology" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Training methodology</Link>
            <Link href="/blog" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Training Library</Link>
            <Link href="/blog/alternatives-to-rp-hypertrophy-app" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>RP Hypertrophy alternatives</Link>
            <Link href="/support" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Support</Link>
            <Link href="/privacy" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Privacy</Link>
            <Link href="/terms" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Terms</Link>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>© 2026 Surpass. Get bigger on purpose.</p>
        </footer>
      </body>
    </html>
  )
}
