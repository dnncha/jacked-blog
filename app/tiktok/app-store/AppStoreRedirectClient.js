'use client'

import { useEffect } from 'react'
import styles from '../TikTokLanding.module.css'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach_tiktok_direct&mt=8'

export default function AppStoreRedirectClient() {
  useEffect(() => {
    window.mixpanel?.track?.('tiktok_direct_app_store_handoff', {
      landing_variant: 'tiktok_direct_v1',
    })
    window.location.replace(APP_STORE_URL)
  }, [])

  return (
    <div id="jacked-tiktok-app-store" className={styles.redirectPage}>
      <span className={styles.brand}>JACKED</span>
      <p>Opening Jacked on the App Store…</p>
      <a href={APP_STORE_URL} data-global-cta="tiktok_direct_fallback">
        Continue to the App Store
      </a>
    </div>
  )
}
