import AppStoreRedirectClient from './AppStoreRedirectClient'

export const metadata = {
  title: 'Open Jacked on the App Store',
  description: 'Continue to the Jacked gym workout tracker on the App Store.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TikTokAppStoreRedirectPage() {
  return <AppStoreRedirectClient />
}
