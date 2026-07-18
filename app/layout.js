import Link from 'next/link'

export const metadata = {
  metadataBase: new URL('https://jacked.coach'),
  title: {
    default: 'Jacked | Free Gym Workout Tracker with Weekly Muscle Targets',
    template: '%s | Jacked'
  },
  description: 'Free iPhone workout tracker with weekly muscle targets, double progression, next-lift guidance, fast set logging, rest timers, and compatible Hevy import.',
  keywords: ['gym workout tracker', 'workout log', 'strength training app', 'hypertrophy tracker', 'progressive overload app', 'double progression', 'weekly muscle targets', 'Hevy import'],
  authors: [{ name: 'Jacked' }],
  creator: 'Jacked',
  publisher: 'Jacked',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jacked.coach',
    siteName: 'Jacked',
    title: 'Jacked | Free Gym Workout Tracker with Weekly Muscle Targets',
    description: 'Know the next lift, hit weekly muscle targets, and log workouts fast with Jacked on iPhone.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jacked gym workout tracker for iPhone'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jacked | Free Gym Workout Tracker with Weekly Muscle Targets',
    description: 'Know the next lift, hit weekly muscle targets, and log workouts fast with Jacked on iPhone.',
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
        <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="shortcut icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="Jacked training library RSS feed" href="/feed.xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Jacked - Gym Workout Tracker',
          alternateName: 'Jacked',
          operatingSystem: 'iOS',
          applicationCategory: 'HealthApplication',
          description: 'Free iPhone workout tracker with weekly muscle targets, double progression, next-lift guidance, fast set logging, rest timers, and compatible Hevy import.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          url: 'https://jacked.coach',
          downloadUrl: 'https://apps.apple.com/app/id6757132605',
          featureList: [
            'Fast workout and set logging',
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
          name: 'Jacked',
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
          name: 'Jacked',
          url: 'https://jacked.coach',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://jacked.coach/blog?search={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(e,c){if(!c.__SV){var l,h;window.mixpanel=c;c._i=[];c.init=function(q,r,f){function t(d,a){var g=a.split(".");2==g.length&&(d=d[g[0]],a=g[1]);d[a]=function(){d.push([a].concat(Array.prototype.slice.call(arguments,0)))}}var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";b.people=b.people||[];b.toString=function(d){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);d||(a+=" (stub)");return a};b.people.toString=function(){return b.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)t(b,l[h]);var n="set set_once union unset remove delete".split(" ");b.get_group=function(){function d(p){a[p]=function(){b.push([g,[p].concat(Array.prototype.slice.call(arguments,0))])}}for(var a={},g=["get_group"].concat(Array.prototype.slice.call(arguments,0)),m=0;m<n.length;m++)d(n[m]);return a};c._i.push([q,r,f])};c.__SV=1.2;var k=e.createElement("script");k.type="text/javascript";k.async=!0;k.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=e.getElementsByTagName("script")[0];e.parentNode.insertBefore(k,e)}})(document,window.mixpanel||[]);mixpanel.init('32b861825d2e0b1beca8b2a1ae0f52c1',{autocapture:false,record_sessions_percent:0,api_host:'https://api-eu.mixpanel.com'});`
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener('click',function(e){const a=e.target.closest('[data-nav-section]');if(a){window.mixpanel?.track?.('nav_click',{section:a.getAttribute('data-nav-section')||'unknown'});}const c=e.target.closest('[data-global-cta]');if(c){window.mixpanel?.track?.('cta_click',{placement:c.getAttribute('data-global-cta')||'unknown',target:'app_store'});}const r=e.target.closest('[data-related-tool]');if(r){const p=new URLSearchParams(window.location.search);window.mixpanel?.track?.('tool_related_tool_clicked',{tool_name:window.location.pathname.split('/').filter(Boolean).pop()||'tools',related_tool:r.getAttribute('data-related-tool')||'unknown',units:'',goal:'',exercise_type:'',source_page:document.referrer||'',utm_source:p.get('utm_source')||'',utm_campaign:p.get('utm_campaign')||''});}});` }} />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: 1.6,
        color: '#e5e5e5',
        backgroundColor: '#000000'
      }}>
        <header style={{
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(242,238,228,0.1)',
          color: 'white',
          padding: '0.85rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <nav style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <Link href="/" style={{ color: '#d9c26c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontSize: '1.22rem', 
                fontWeight: '760', 
                letterSpacing: '0.02em', 
                fontStyle: 'normal',
                background: 'linear-gradient(135deg, #ead878 0%, #c7aa44 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                JACKED
              </span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/tools" style={{ color: '#b7b0a3', textDecoration: 'none', fontWeight: '650', fontSize: '0.88rem' }}>Tools</Link>
              <Link href="/blog" style={{ color: '#b7b0a3', textDecoration: 'none', fontWeight: '650', fontSize: '0.88rem' }}>Training Library</Link>
              <Link href="/about" style={{ color: '#b7b0a3', textDecoration: 'none', fontWeight: '650', fontSize: '0.88rem' }}>About</Link>
              <Link href="/support" style={{ color: '#b7b0a3', textDecoration: 'none', fontWeight: '650', fontSize: '0.88rem' }}>Support</Link>
              <a href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach&mt=8" target="_blank" rel="noopener noreferrer" style={{ 
                color: '#111', 
                textDecoration: 'none', 
                fontWeight: '720',
                background: '#e2c95f',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-block'
              }} data-global-cta="header">Get the iPhone App</a>
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
            <Link href="/blog" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Training Library</Link>
            <Link href="/blog/alternatives-to-rp-hypertrophy-app" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>RP Hypertrophy alternatives</Link>
            <Link href="/support" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Support</Link>
            <Link href="/privacy" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Privacy</Link>
            <Link href="/terms" style={{ color: '#b7b0a3', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 650 }}>Terms</Link>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>© 2026 Jacked. Hypertrophy training for iPhone.</p>
        </footer>
      </body>
    </html>
  )
}
