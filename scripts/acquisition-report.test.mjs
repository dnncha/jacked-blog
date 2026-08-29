import assert from 'node:assert/strict'
import {
  summarizeAppEvents,
  summarizeAppStoreCampaignContinuity,
  summarizeAppStoreConnectMetrics,
  summarizeCtaSegments,
  summarizeSearchConsoleMetrics,
  summarizeSourceCoverage,
  summarizeWebEvents,
} from './acquisition-report.mjs'

const searchWindow = { start_date: '2026-07-18', end_date: '2026-08-14' }
const search = summarizeSearchConsoleMetrics([
  { ...searchWindow, range: 'max', query: 'surpass strength app', brand_class: 'branded', impressions: '900', clicks: '90' },
  { ...searchWindow, range: 'max', query: 'hypertrophy app', brand_class: 'non-branded', impressions: '100', clicks: '12' },
  { ...searchWindow, range: 'trailing-28d', query: 'surpass workout', brand_class: 'branded', impressions: '30', clicks: '4' },
  { ...searchWindow, range: 'trailing-28d', query: 'hypertrophy app', brand_class: 'non-branded', impressions: '20', clicks: '3' },
])
assert.equal(search.available, true)
assert.equal(search.quality, 'usable')
assert.equal(search.range, 'trailing-28d')
assert.equal(search.impressions, 20)
assert.equal(search.clicks, 3)
assert.equal(search.non_brand_rows, 1)
assert.equal(search.coverage.available, true)
assert.equal(search.coverage.start_date, '2026-07-18')
assert.equal(search.coverage.end_date, '2026-08-14')

const pageOnlySearch = summarizeSearchConsoleMetrics([], [
  { ...searchWindow, range: 'trailing-28d', page: 'https://jacked.coach/', impressions: '100', clicks: '10' },
])
assert.equal(pageOnlySearch.available, false)
assert.equal(pageOnlySearch.quality, 'query-level export required for non-brand totals')
assert.equal(pageOnlySearch.impressions, null)

const fallbackClassifiedSearch = summarizeSearchConsoleMetrics([
  { ...searchWindow, range: 'trailing-28d', query: 'Surpass strength training', impressions: '10', clicks: '1' },
  { ...searchWindow, range: 'trailing-28d', query: 'gym workout planner', impressions: '40', clicks: '6' },
])
assert.equal(fallbackClassifiedSearch.available, true)
assert.equal(fallbackClassifiedSearch.impressions, 40)
assert.equal(fallbackClassifiedSearch.clicks, 6)

const appStore = summarizeAppStoreConnectMetrics([
  { start_date: '2026-08-01', end_date: '2026-08-14', app_store_campaign: 'surpass_coach_home_hero_control', product_page_views: '100', downloads: '18' },
  { start_date: '2026-08-01', end_date: '2026-08-14', app_store_campaign: 'surpass_coach_home_hero_outcome_v1', product_page_views: '50', downloads: '12' },
])

assert.equal(appStore.available, true)
assert.equal(appStore.quality, 'usable')
assert.equal(appStore.product_page_views, 150)
assert.equal(appStore.downloads, 30)
assert.equal(appStore.product_page_to_download_rate, 0.2)
assert.equal(appStore.coverage.available, true)
assert.equal(appStore.coverage.start_date, '2026-08-01')
assert.equal(appStore.coverage.end_date, '2026-08-14')
assert.deepEqual(appStore.metric_fields, {
  product_page_views: 'product_page_views',
  downloads: 'downloads',
  app_store_campaign: 'app_store_campaign',
})
assert.deepEqual(appStore.campaigns.map((campaign) => campaign.app_store_campaign), [
  'surpass_coach_home_hero_control',
  'surpass_coach_home_hero_outcome_v1',
])
assert.equal(appStore.campaigns[0].product_page_to_download_rate, 0.18)

const campaignContinuity = summarizeAppStoreCampaignContinuity([
  {
    event_name: 'app_store_outbound_clicked',
    session_id: 'session-a',
    app_store_campaign: 'surpass_coach_home_hero_control',
  },
], appStore)
assert.equal(campaignContinuity.available, true)
assert.equal(campaignContinuity.quality, 'partial campaign continuity')
assert.equal(campaignContinuity.campaigns.find((campaign) => campaign.app_store_campaign === 'surpass_coach_home_hero_control').web_outbound_sessions, 1)
assert.equal(campaignContinuity.campaigns.find((campaign) => campaign.app_store_campaign === 'surpass_coach_home_hero_control').quality, 'usable')
assert.equal(campaignContinuity.campaigns.find((campaign) => campaign.app_store_campaign === 'surpass_coach_home_hero_outcome_v1').quality, 'not observed on web')

const incompleteCampaignContinuity = summarizeAppStoreCampaignContinuity([
  { event_name: 'app_store_outbound_clicked', app_store_campaign: 'surpass_coach_home_hero_control' },
], appStore)
assert.equal(incompleteCampaignContinuity.available, false)
assert.equal(incompleteCampaignContinuity.quality, 'web campaign or identity incomplete')
assert.equal(incompleteCampaignContinuity.campaigns[0].web_outbound_sessions, null)

const incompleteAppStore = summarizeAppStoreConnectMetrics([
  { start_date: '2026-08-01', end_date: '2026-08-14', product_page_views: '100', downloads: '' },
])
assert.equal(incompleteAppStore.available, false)
assert.equal(incompleteAppStore.quality, 'metric values incomplete')
assert.equal(incompleteAppStore.product_page_to_download_rate, null)

const eventCoverage = summarizeSourceCoverage([
  { time: '2026-08-01T09:00:00Z' },
  { time: '2026-08-14T18:00:00Z' },
], { eventTime: true })
assert.equal(eventCoverage.available, true)
assert.equal(eventCoverage.start_date, '2026-08-01')
assert.equal(eventCoverage.end_date, '2026-08-14')

const incompleteCoverage = summarizeSourceCoverage([
  { time: '2026-08-01T09:00:00Z' },
  { event_name: 'web_cta_viewed' },
], { eventTime: true })
assert.equal(incompleteCoverage.available, false)
assert.equal(incompleteCoverage.quality, 'date coverage incomplete')

const reversedCoverage = summarizeSourceCoverage([
  { start_date: '2026-08-14', end_date: '2026-08-01' },
], { startFields: ['start_date'], endFields: ['end_date'] })
assert.equal(reversedCoverage.available, false)
assert.equal(reversedCoverage.quality, 'date coverage invalid')

const mixedAggregateCoverage = summarizeSourceCoverage([
  { start_date: '2026-07-18', end_date: '2026-08-14' },
  { start_date: '2026-07-01', end_date: '2026-07-31' },
], {
  startFields: ['start_date'],
  endFields: ['end_date'],
  requireConsistentRange: true,
})
assert.equal(mixedAggregateCoverage.available, false)
assert.equal(mixedAggregateCoverage.quality, 'date coverage inconsistent')

const web = summarizeWebEvents([
  { event_name: 'web_session_started', session_id: 'session-a' },
  {
    event_name: 'web_cta_viewed',
    session_id: 'session-a',
    source_page: '/',
    cta_placement: 'homepage_hero',
    experiment_name: 'homepage_hero_cta',
    experiment_variant: 'control',
    viewport_class: 'desktop',
    app_store_campaign: 'surpass_coach_home_hero_control',
  },
  {
    event_name: 'app_store_outbound_clicked',
    session_id: 'session-a',
    source_page: '/',
    cta_placement: 'homepage_hero',
    experiment_name: 'homepage_hero_cta',
    experiment_variant: 'control',
    viewport_class: 'desktop',
    app_store_campaign: 'surpass_coach_home_hero_control',
  },
  { event_name: 'web_session_started', session_id: 'session-b' },
  {
    event_name: 'web_cta_viewed',
    session_id: 'session-b',
    source_page: '/workout-tracker/',
    cta_placement: 'seo_hero',
    experiment_name: 'acquisition_hero_cta',
    experiment_variant: 'outcome_v1',
    hero_presentation: 'screen',
    viewport_class: 'mobile',
    app_store_campaign: 'surpass_coach_seo_hero',
  },
  { event_name: 'tool_started', session_id: 'session-b' },
  { event_name: 'tool_completed', session_id: 'session-b' },
  { event_name: 'web_page_view', session_id: 'session-b' },
])

assert.equal(web.sessionCount, 2)
assert.equal(web.ctaViewedSessions, 2)
assert.equal(web.outboundSessions, 1)
assert.equal(web.outboundEventRows, 1)
assert.equal(web.qualifiedOutboundSessions, 1)
assert.equal(web.outboundSessionsWithoutCtaView, 0)
assert.equal(web.qualifiedStoreIntentRate, 0.5)
assert.equal(web.ctaViewRate, 1)
assert.equal(web.toolStarts, 1)
assert.equal(web.toolCompletions, 1)
assert.equal(web.webPageViewRows, 1)
assert.equal(web.ctaSegments.length, 2)
assert.equal(web.ctaSegments[0].cta_viewed_sessions, 1)
assert.equal(web.ctaSegments[0].outbound_sessions, 1)
assert.equal(web.ctaSegments[0].qualified_store_intent_rate, 1)
assert.equal(web.ctaSegments[1].cta_viewed_sessions, 1)
assert.equal(web.ctaSegments[1].outbound_sessions, 0)
assert.equal(web.ctaSegments[1].qualified_store_intent_rate, 0)
assert.equal(web.ctaSegments.find(segment => segment.source_page === '/workout-tracker/').hero_presentation, 'screen')
assert.equal(web.experimentComparisons.length, 2)
assert.equal(web.experimentComparisons.find(comparison => comparison.experiment_name === 'homepage_hero_cta').decision, 'no_treatment')
assert.equal(web.experimentComparisons.find(comparison => comparison.experiment_name === 'acquisition_hero_cta').decision, 'no_control')

const clickBeforeExposure = summarizeWebEvents([
  { event_name: 'web_session_started', session_id: 'session-a' },
  { event_name: 'web_cta_viewed', session_id: 'session-a' },
  { event_name: 'web_session_started', session_id: 'session-b' },
  { event_name: 'app_store_outbound_clicked', session_id: 'session-b' },
])
assert.equal(clickBeforeExposure.ctaViewedSessions, 1)
assert.equal(clickBeforeExposure.outboundSessions, 1)
assert.equal(clickBeforeExposure.qualifiedOutboundSessions, 0)
assert.equal(clickBeforeExposure.outboundSessionsWithoutCtaView, 1)
assert.equal(clickBeforeExposure.qualifiedStoreIntentRate, 0)

const segmentClickBeforeExposure = summarizeCtaSegments([
  {
    event_name: 'web_cta_viewed',
    session_id: 'session-a',
    source_page: '/',
    cta_placement: 'homepage_hero',
  },
  {
    event_name: 'app_store_outbound_clicked',
    session_id: 'session-b',
    source_page: '/',
    cta_placement: 'homepage_hero',
  },
])[0]
assert.equal(segmentClickBeforeExposure.qualified_outbound_sessions, 0)
assert.equal(segmentClickBeforeExposure.outbound_sessions_without_cta_view, 1)
assert.equal(segmentClickBeforeExposure.qualified_store_intent_rate, 0)

const experimentRows = []
for (let index = 0; index < 100; index += 1) {
  const controlSession = `control-session-${index}`
  const treatmentSession = `treatment-session-${index}`
  const base = {
    source_page: '/',
    cta_placement: 'homepage_hero',
    experiment_name: 'homepage_hero_cta',
    viewport_class: 'desktop',
  }
  experimentRows.push(
    {
      event_name: 'web_cta_viewed',
      session_id: controlSession,
      experiment_variant: 'control',
      app_store_campaign: 'surpass_coach_home_hero_control',
      ...base,
    },
    {
      event_name: 'web_cta_viewed',
      session_id: treatmentSession,
      experiment_variant: 'outcome_v1',
      app_store_campaign: 'surpass_coach_home_hero_outcome_v1',
      ...base,
    },
  )
  if (index < 20) {
    experimentRows.push({
      event_name: 'app_store_outbound_clicked',
      session_id: controlSession,
      experiment_variant: 'control',
      app_store_campaign: 'surpass_coach_home_hero_control',
      ...base,
    })
  }
  if (index < 40) {
    experimentRows.push({
      event_name: 'app_store_outbound_clicked',
      session_id: treatmentSession,
      experiment_variant: 'outcome_v1',
      app_store_campaign: 'surpass_coach_home_hero_outcome_v1',
      ...base,
    })
  }
}

const experimentComparison = summarizeWebEvents(experimentRows).experimentComparisons[0]
assert.equal(experimentComparison.control_cta_viewed_sessions, 100)
assert.equal(experimentComparison.treatment_cta_viewed_sessions, 100)
assert.equal(experimentComparison.control_rate, 0.2)
assert.equal(experimentComparison.treatment_rate, 0.4)
assert.equal(experimentComparison.delta, 0.2)
assert.equal(experimentComparison.exposure_sufficient, true)
assert.equal(experimentComparison.decision, 'treatment_ahead_95_ci')
assert.ok(experimentComparison.confidence_interval_95[0] > 0)

const lowVolumeComparison = summarizeWebEvents([
  {
    event_name: 'web_cta_viewed',
    session_id: 'control-low-volume',
    source_page: '/',
    cta_placement: 'homepage_hero',
    experiment_name: 'homepage_hero_cta',
    experiment_variant: 'control',
  },
  {
    event_name: 'web_cta_viewed',
    session_id: 'treatment-low-volume',
    source_page: '/',
    cta_placement: 'homepage_hero',
    experiment_name: 'homepage_hero_cta',
    experiment_variant: 'outcome_v1',
  },
]).experimentComparisons[0]
assert.equal(lowVolumeComparison.exposure_sufficient, false)
assert.equal(lowVolumeComparison.decision, 'below_minimum_exposure')

const app = summarizeAppEvents([
  { event_name: 'app_opened', installation_id: 'installation-a', time: '2026-08-01T09:00:00Z' },
  { event_name: 'activation_entry', installation_id: 'installation-a', app_version: '4.0.2', app_build: '402', time: '2026-08-01T09:01:00Z' },
  { event_name: 'onboarding_path_selected', installation_id: 'installation-a', path: 'recommended', time: '2026-08-01T09:02:00Z' },
  { event_name: 'first_set_logged', installation_id: 'installation-a', time: '2026-08-01T09:20:00Z' },
  { event_name: 'workout_started', installation_id: 'installation-a', time: '2026-08-01T09:10:00Z' },
  { event_name: 'next_session_preview_mounted', installation_id: 'installation-a', source: 'after_workout', planned_exercises_bucket: '4_10', time: '2026-08-02T09:10:00Z' },
  { event_name: 'next_session_preview_activated', installation_id: 'installation-a', source: 'after_workout', planned_exercises_bucket: '4_10', action: 'start_next_session', time: '2026-08-02T09:11:00Z' },
  { event_name: 'weekly_review_surface_mounted', installation_id: 'installation-a', surface: 'weekly_review', data_state: 'empty', time: '2026-08-02T10:00:00Z' },
  { event_name: 'weekly_review_open_today', installation_id: 'installation-a', surface: 'weekly_review', data_state: 'empty', action: 'open_today', time: '2026-08-02T10:01:00Z' },
  { event_name: 'workout_started', installation_id: 'installation-a', source: 'weekly_review', time: '2026-08-02T10:30:00Z' },
  { event_name: 'workout_started', installation_id: 'installation-a', source: 'next_session_preview', time: '2026-08-04T09:10:00Z' },
  { event_name: 'workout_completed', installation_id: 'installation-a', time: '2026-08-04T10:00:00Z' },
  { event_name: 'app_opened', installation_id: 'installation-b', time: '2026-08-01T09:00:00Z' },
  { event_name: 'activation_entry', installation_id: 'installation-b', app_version: '4.0.1', app_build: '401', time: '2026-08-01T09:01:00Z' },
  { event_name: 'onboarding_path_selected', installation_id: 'installation-b', path: 'custom', time: '2026-08-01T09:02:00Z' },
  { event_name: 'next_session_preview_mounted', installation_id: 'installation-b', source: 'manual', planned_exercises_bucket: '1_3', time: '2026-08-02T09:10:00Z' },
  { event_name: 'weekly_review_surface_mounted', installation_id: 'installation-b', surface: 'weekly_review', data_state: 'populated', time: '2026-08-02T10:00:00Z' },
  { event_name: 'workout_started', installation_id: 'installation-b', time: '2026-08-01T09:10:00Z' },
  { event_name: 'workout_started', installation_id: 'installation-c', time: '2026-08-01T09:10:00Z' },
  { event_name: 'workout_started', installation_id: 'installation-c', time: '2026-08-01T18:00:00Z' },
  { event_name: 'app_opened', installation_id: 'installation-c', time: '2026-08-31T10:00:00Z' },
  { event_name: 'app_opened', installation_id: 'installation-b', time: '2026-08-31T10:00:00Z' },
])

assert.equal(app.appOpenedInstallations, 3)
assert.equal(app.activationEntryInstallations, 2)
assert.equal(app.activationDenominatorAvailable, true)
assert.equal(app.firstSetActivatedInstallations, 1)
assert.equal(app.firstSetActivationRate, 0.5)
assert.equal(app.timeToFirstSet.available, true)
assert.equal(app.timeToFirstSet.sampleInstallations, 1)
assert.equal(app.timeToFirstSet.medianSeconds, 1140)
assert.equal(app.timeToFirstSet.p75Seconds, 1140)
assert.deepEqual(app.timeToFirstSet.buckets, {
  under_2m: 0,
  '2_5m': 0,
  '5_10m': 0,
  '10_20m': 1,
  '20m_plus': 0,
})
assert.equal(app.firstWorkoutInstallations, 3)
assert.equal(app.secondWorkoutWithin1dInstallations, 1)
assert.equal(app.oneDayReturnRate, 0.3333)
assert.equal(app.secondWorkoutWithin7dInstallations, 2)
assert.equal(app.sevenDayReturnRate, 0.6667)
assert.equal(app.secondWorkoutWithin30dInstallations, 2)
assert.equal(app.thirtyDayReturnRate, 0.6667)
assert.equal(app.returnWindowSummaries['30d'].eligibleFirstWorkoutInstallations, 3)
assert.equal(app.completedWorkoutInstallations, 1)
assert.equal(app.nextSessionPreviewDiagnostics.available, true)
assert.equal(app.nextSessionPreviewDiagnostics.activationUsers, 2)
assert.equal(app.nextSessionPreviewDiagnostics.startsWithoutIntentEvents, 0)
const nextSessionBySource = Object.fromEntries(
  app.nextSessionPreviewDiagnostics.sources.map(source => [source.source, source]),
)
assert.equal(nextSessionBySource.after_workout.mounted_users, 1)
assert.equal(nextSessionBySource.after_workout.activated_users, 1)
assert.equal(nextSessionBySource.after_workout.started_users, 1)
assert.equal(nextSessionBySource.after_workout.start_from_activated, 1)
assert.equal(nextSessionBySource.manual.mounted_users, 1)
assert.equal(nextSessionBySource.manual.activated_users, 0)
assert.equal(app.weeklyReviewRecoveryDiagnostics.available, true)
assert.equal(app.weeklyReviewRecoveryDiagnostics.quality, 'usable')
assert.equal(app.weeklyReviewRecoveryDiagnostics.intentsWithoutSurfaceEvents, 0)
assert.equal(app.weeklyReviewRecoveryDiagnostics.startsWithoutIntentEvents, 2)
const weeklyReviewByState = Object.fromEntries(
  app.weeklyReviewRecoveryDiagnostics.states.map(state => [state.data_state, state]),
)
assert.equal(weeklyReviewByState.empty.mounted_users, 1)
assert.equal(weeklyReviewByState.empty.open_today_users, 1)
assert.equal(weeklyReviewByState.empty.started_after_intent_users, 1)
assert.equal(weeklyReviewByState.empty.intent_from_mounted, 1)
assert.equal(weeklyReviewByState.empty.start_after_intent, 1)
assert.equal(weeklyReviewByState.populated.mounted_users, 1)
assert.equal(weeklyReviewByState.populated.open_today_users, 0)
assert.deepEqual(app.activationPathSegments.map(segment => segment.path), ['custom', 'recommended'])
assert.equal(app.activationPathSegments.find(segment => segment.path === 'recommended').first_set_activation_rate, 1)
assert.equal(app.activationPathSegments.find(segment => segment.path === 'custom').first_set_activation_rate, 0)
assert.deepEqual(app.activationReleaseSegments.map(segment => segment.app_build), ['401', '402'])
assert.equal(app.activationReleaseSegments.find(segment => segment.app_build === '402').first_set_activation_rate, 1)

const invalidWeeklyReviewState = summarizeAppEvents([
  { event_name: 'activation_entry', installation_id: 'installation-invalid', time: '2026-08-01T09:00:00Z' },
  { event_name: 'weekly_review_surface_mounted', installation_id: 'installation-invalid', surface: 'weekly_review', data_state: 'unknown', time: '2026-08-02T09:00:00Z' },
])
assert.equal(invalidWeeklyReviewState.weeklyReviewRecoveryDiagnostics.available, false)
assert.equal(invalidWeeklyReviewState.weeklyReviewRecoveryDiagnostics.quality, 'invalid data_state')

const sameTimestampWeeklyReview = summarizeAppEvents([
  { event_name: 'activation_entry', installation_id: 'installation-tied', time: '2026-08-01T09:00:00Z' },
  { event_name: 'weekly_review_surface_mounted', installation_id: 'installation-tied', surface: 'weekly_review', data_state: 'empty', time: '2026-08-02T09:00:00Z' },
  { event_name: 'weekly_review_open_today', installation_id: 'installation-tied', surface: 'weekly_review', data_state: 'empty', action: 'open_today', time: '2026-08-02T09:00:00Z' },
  { event_name: 'workout_started', installation_id: 'installation-tied', time: '2026-08-02T09:00:00Z' },
])
const tiedWeeklyReviewState = sameTimestampWeeklyReview.weeklyReviewRecoveryDiagnostics.states[0]
assert.equal(tiedWeeklyReviewState.open_today_users, 1)
assert.equal(tiedWeeklyReviewState.started_after_intent_users, 0)

const missingActivationDenominator = summarizeAppEvents([
  { event_name: 'app_opened', installation_id: 'installation-a', time: '2026-08-01T09:00:00Z' },
  { event_name: 'first_set_logged', installation_id: 'installation-a', time: '2026-08-01T09:20:00Z' },
])
assert.equal(missingActivationDenominator.firstSetActivationRate, null)
assert.equal(missingActivationDenominator.activationDenominatorAvailable, false)
assert.equal(missingActivationDenominator.timeToFirstSet.available, false)
assert.equal(missingActivationDenominator.timeToFirstSet.medianSeconds, null)

const immatureReturnCohort = summarizeAppEvents([
  { event_name: 'workout_started', installation_id: 'installation-new', time: '2026-08-14T09:00:00Z' },
])
assert.equal(immatureReturnCohort.secondWorkoutWithin7dInstallations, null)
assert.equal(immatureReturnCohort.sevenDayReturnRate, null)
assert.equal(immatureReturnCohort.returnWindowSummaries['7d'].cohortMature, false)

const missingIdentity = summarizeWebEvents([
  { event_name: 'web_cta_viewed' },
  { event_name: 'app_store_outbound_clicked' },
])
assert.equal(missingIdentity.qualifiedStoreIntentRate, null)
assert.equal(missingIdentity.missingSessionIdentity, true)
assert.equal(missingIdentity.ctaSegments[0].qualified_store_intent_rate, null)
assert.equal(missingIdentity.ctaSegments[0].missing_session_identity, true)

console.log('acquisition report calculations passed')
