#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const blogDir = path.join(root, 'content', 'blog')
const reportDir = path.join(root, 'reports', 'seo')

const source = (label, url, scope) => ({ label, url, scope })

const sources = {
  hypertrophy: [
    source('Mechanisms of skeletal-muscle hypertrophy and their application to resistance training', 'https://pubmed.ncbi.nlm.nih.gov/30335577/', 'Mechanisms and practical interpretation of resistance-training adaptations.'),
    source('Dose-response relationship between weekly resistance-training volume and muscle growth', 'https://pubmed.ncbi.nlm.nih.gov/27433992/', 'Volume evidence; not a universal set prescription.'),
    source('Low-load versus high-load resistance training for muscle hypertrophy and strength', 'https://pubmed.ncbi.nlm.nih.gov/31191347/', 'Load and effort evidence; population and protocol limits apply.'),
  ],
  volume: [
    source('Dose-response relationship between weekly resistance-training volume and muscle growth', 'https://pubmed.ncbi.nlm.nih.gov/27433992/', 'Volume evidence; the curve is not an individual prescription.'),
    source('Resistance-training dose response: volume and frequency meta-regressions', 'https://pubmed.ncbi.nlm.nih.gov/41343037/', 'Recent dose-response analysis; interpret estimates with its methods and uncertainty.'),
  ],
  frequency: [
    source('How many times per week should a muscle be trained to maximize hypertrophy?', 'https://pubmed.ncbi.nlm.nih.gov/30558493/', 'Volume-equated frequency evidence.'),
    source('Resistance-training frequency and skeletal-muscle hypertrophy: review of available evidence', 'https://pubmed.ncbi.nlm.nih.gov/30236847/', 'Context for frequency decisions and volume distribution.'),
  ],
  failure: [
    source('Is performing repetitions to failure less important than volume for hypertrophy and strength?', 'https://pubmed.ncbi.nlm.nih.gov/31809457/', 'Failure and volume comparison; not a license to prescribe one effort level to everyone.'),
    source('Low-load versus high-load resistance training for muscle hypertrophy and strength', 'https://pubmed.ncbi.nlm.nih.gov/31191347/', 'Load and effort context.'),
  ],
  autoregulation: [
    source('Autoregulated resistance training for maximal strength enhancement', 'https://pubmed.ncbi.nlm.nih.gov/40791980/', 'Network meta-analysis of APRE, RPE, velocity-based, and percentage-based approaches.'),
    source('Auto-regulation method versus fixed-loading method in maximum-strength training', 'https://pubmed.ncbi.nlm.nih.gov/33776802/', 'Earlier systematic review and meta-analysis; study methods vary.'),
  ],
  periodization: [
    source('Effects of periodization on strength and muscle hypertrophy in volume-equated programs', 'https://pubmed.ncbi.nlm.nih.gov/35044672/', 'Periodization evidence in volume-equated resistance programs.'),
    source('Mixed-session versus block-periodized programs in trained men', 'https://pubmed.ncbi.nlm.nih.gov/36727999/', 'Small trained-men trial; useful as a study, not a universal verdict.'),
  ],
  exerciseOrder: [
    source('The role of intra-session exercise sequence in the interference effect', 'https://pubmed.ncbi.nlm.nih.gov/28917030/', 'Exercise-order evidence; outcomes differ by strength, hypertrophy, and concurrent training.'),
    source('Mechanisms of skeletal-muscle hypertrophy and their application to resistance training', 'https://pubmed.ncbi.nlm.nih.gov/30335577/', 'General context for interpreting exercise selection and effort.'),
  ],
  concurrent: [
    source('Interference between concurrent resistance and endurance exercise', 'https://pubmed.ncbi.nlm.nih.gov/24728927/', 'Molecular and programming context for concurrent training.'),
    source('The role of intra-session exercise sequence in the interference effect', 'https://pubmed.ncbi.nlm.nih.gov/28917030/', 'Order and outcome context.'),
  ],
  sleep: [
    source('Sleep restriction reduces muscle protein synthesis', 'https://pubmed.ncbi.nlm.nih.gov/32078168/', 'Acute sleep restriction study; not evidence that one bad night destroys gains.'),
    source('Sleep and resistance exercise performance: a review', 'https://pubmed.ncbi.nlm.nih.gov/29422383/', 'Sleep, performance, and recovery context.'),
    source('One night of sleep deprivation decreases muscle protein synthesis', 'https://pubmed.ncbi.nlm.nih.gov/33400856/', 'Acute laboratory result; generalisation is limited.'),
  ],
  cold: [
    source('Cold-water immersion attenuates anabolic signaling and hypertrophy after resistance training', 'https://pubmed.ncbi.nlm.nih.gov/31513450/', 'Direct resistance-training study; strength and hypertrophy outcomes are not identical.'),
    source('Interference between concurrent resistance and endurance exercise', 'https://pubmed.ncbi.nlm.nih.gov/24728927/', 'Broader recovery and adaptation context.'),
  ],
  bands: [
    source('Elastic resistance training and muscle strength or hypertrophy', 'https://pubmed.ncbi.nlm.nih.gov/30529477/', 'Candidate resistance-band evidence; protocols and populations vary.'),
    source('Low-load versus high-load resistance training for muscle hypertrophy and strength', 'https://pubmed.ncbi.nlm.nih.gov/31191347/', 'General load and effort context.'),
  ],
  muscleMemory: [
    source('Muscle memory after detraining and retraining', 'https://pubmed.ncbi.nlm.nih.gov/41346689/', 'Recent human evidence; exact response depends on prior training and detraining.'),
    source('Mechanisms of skeletal-muscle hypertrophy and their application to resistance training', 'https://pubmed.ncbi.nlm.nih.gov/30335577/', 'General adaptation context.'),
  ],
  protein: [
    source('Protein supplementation and resistance training: systematic review and meta-analysis', 'https://pubmed.ncbi.nlm.nih.gov/28698222/', 'Protein and fat-free-mass evidence; not a requirement for supplements.'),
    source('International Society of Sports Nutrition position stand: protein and exercise', 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z', 'General sports-nutrition context; recommendations are not medical prescriptions.'),
  ],
  fasted: [
    source('Resistance training performed in the fasted state compared with the fed state', 'https://pubmed.ncbi.nlm.nih.gov/41316673/', '2025 systematic review and meta-analysis; only a small number of trials.'),
    source('Overnight fasted versus fed resistance-training adaptations', 'https://pubmed.ncbi.nlm.nih.gov/40335157/', 'Direct trial context; does not cover prolonged fasting or medical conditions.'),
  ],
  creatine: [
    source('International Society of Sports Nutrition position stand: creatine supplementation', 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z', 'Broad creatine efficacy and safety context.'),
    source('Common questions and misconceptions about creatine supplementation', 'https://pubmed.ncbi.nlm.nih.gov/33557850/', 'Evidence review of loading, timing, safety, and common claims.'),
  ],
  creatineCaffeine: [
    source('Interaction between caffeine and creatine when used as concurrent ergogenic supplements', 'https://pubmed.ncbi.nlm.nih.gov/35016154/', 'Systematic review; findings differ by acute and chronic protocols.'),
    source('Creatine and caffeine ingestion in combination: systematic review', 'https://pubmed.ncbi.nlm.nih.gov/34845944/', 'Concurrent-supplement evidence; not a universal timing rule.'),
  ],
  caffeine: [
    source('The influence of caffeine supplementation on resistance exercise', 'https://pubmed.ncbi.nlm.nih.gov/30298476/', 'Review of strength, endurance, power, and practical dosing questions.'),
    source('Caffeine supplementation and strength training: systematic review and meta-analyses', 'https://pubmed.ncbi.nlm.nih.gov/32551869/', 'Pooled effects vary by exercise and outcome.'),
  ],
  betaine: [
    source('Effects of betaine supplementation on muscle strength and power', 'https://pubmed.ncbi.nlm.nih.gov/28426517/', 'Seven-trial systematic review; most outcomes were null.'),
    source('Effects of betaine supplementation on endurance exercise performance', 'https://pubmed.ncbi.nlm.nih.gov/40765066/', 'Recent review; evidence remains limited.'),
  ],
  coq10: [
    source('Coenzyme Q10 and exercise performance: systematic review and meta-analysis', 'https://pubmed.ncbi.nlm.nih.gov/41457257/', 'Performance effects were limited and inconsistent; certainty was low.'),
    source('Coenzyme Q10, muscle-damage biomarkers, and oxidative stress in athletes', 'https://pubmed.ncbi.nlm.nih.gov/40367843/', 'Biomarker evidence; not a direct muscle-growth outcome.'),
  ],
  citrulline: [
    source('Citrulline malate and exercise performance: systematic review and three-level meta-analysis', 'https://pubmed.ncbi.nlm.nih.gov/42356270/', 'Current performance synthesis; effects vary by protocol and outcome.'),
    source('Citrulline supplementation and aerobic exercise performance: systematic review', 'https://pubmed.ncbi.nlm.nih.gov/36079738/', 'Context for endurance outcomes; not proof of hypertrophy.'),
  ],
  hmb: [
    source('HMB supplementation and resistance training in trained and untrained men', 'https://pubmed.ncbi.nlm.nih.gov/19387395/', 'Older meta-analysis; effects differed by training status.'),
    source('HMB supplementation in trained and competitive athletes', 'https://pubmed.ncbi.nlm.nih.gov/29249685/', 'Meta-analysis reporting no effect on strength and body composition in trained athletes.'),
    source('HMB and resistance exercise in young subjects', 'https://pubmed.ncbi.nlm.nih.gov/32456217/', 'Systematic review and meta-analysis with null strength and fat-free-mass findings.'),
  ],
  carnitine: [
    source('Clinical effects of L-carnitine supplementation on physical performance', 'https://pubmed.ncbi.nlm.nih.gov/34842765/', 'Systematic review in healthy subjects; outcomes and protocols vary.'),
    source('L-carnitine and exercise adaptation: evidence-based nutrition review', 'https://pubmed.ncbi.nlm.nih.gov/37650704/', 'Context for prioritising supplements.'),
  ],
  magnesium: [
    source('Magnesium supplementation and muscle fitness: meta-analysis and systematic review', 'https://pubmed.ncbi.nlm.nih.gov/29637897/', 'No clear benefit in most active people with adequate magnesium status.'),
    source('NIH Office of Dietary Supplements: Magnesium fact sheet', 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/', 'Intake, deficiency, upper-limit, and interaction context.'),
  ],
  nac: [
    source('Performance and side effects of N-acetylcysteine supplementation', 'https://pubmed.ncbi.nlm.nih.gov/28102488/', 'Meta-analysis found a very small pooled performance effect and no basis for routine recommendation.'),
    source('N-acetylcysteine and physical performance in adult males', 'https://pubmed.ncbi.nlm.nih.gov/37299425/', 'Systematic review of controlled trials; outcomes and adverse effects vary.'),
  ],
  myostatin: [
    source('Therapeutic applications and challenges in myostatin inhibition', 'https://pubmed.ncbi.nlm.nih.gov/39340593/', 'Clinical translation remains difficult and functional benefits have been limited.'),
    source('Effects of resistance training on myostatin and follistatin', 'https://pubmed.ncbi.nlm.nih.gov/37328021/', 'Training-related biomarker changes do not prove that supplements can safely manipulate the pathway.'),
  ],
  pqq: [
    source('Dietary PQQ and mitochondrial-related metabolism in human subjects', 'https://pubmed.ncbi.nlm.nih.gov/24231099/', 'Human biomarker study; not a resistance-training or hypertrophy trial.'),
    source('PQQ and cognitive function in healthy volunteers', 'https://pubmed.ncbi.nlm.nih.gov/34415830/', 'Human trial with cognitive outcomes; not evidence of muscle benefit.'),
  ],
  spermidine: [
    source('Spermidine-based nutritional supplement in humans: randomized placebo-controlled study', 'https://pubmed.ncbi.nlm.nih.gov/29214104/', 'Human trial with a hair-follicle outcome; not evidence of muscle growth.'),
    source('Spermidine pilot study in healthy older adults', 'https://pubmed.ncbi.nlm.nih.gov/42169618/', 'Small safety and immune-response study; muscle claims remain unproven.'),
  ],
  urolithin: [
    source('Urolithin A and muscle endurance or mitochondrial health in older adults', 'https://pubmed.ncbi.nlm.nih.gov/35050355/', 'Randomized trial in older adults; outcomes do not establish hypertrophy in young lifters.'),
    source('Urolithin A, muscle strength, exercise performance, and mitochondrial biomarkers', 'https://pubmed.ncbi.nlm.nih.gov/35584623/', 'Randomized middle-aged-adult trial; product and population are specific.'),
  ],
  probiotics: [
    source('Probiotic supplementation and sport performance in athletes: systematic review', 'https://pubmed.ncbi.nlm.nih.gov/38148685/', 'Small heterogeneous trial base with substantial risk-of-bias concerns.'),
    source('Probiotics and muscle mass, strength, and lean mass: meta-analysis', 'https://pubmed.ncbi.nlm.nih.gov/36414567/', 'Direct muscle outcomes; strain and population differences matter.'),
  ],
  gh: [
    source('Impact of growth-hormone administration on athletic performance in healthy young adults', 'https://pubmed.ncbi.nlm.nih.gov/28514721/', 'GH changed body composition but did not improve strength or VO2 max over weeks to months.'),
    source('Systematic review of growth hormone and athletic performance', 'https://pubmed.ncbi.nlm.nih.gov/18347346/', 'Risks, adverse events, and uncertain performance effects.'),
  ],
  testosterone: [
    source('Testosterone and resistance exercise: review of the acute and chronic evidence', 'https://pubmed.ncbi.nlm.nih.gov/28224307/', 'Acute hormone changes do not automatically predict hypertrophy.'),
    source('Endocrine Society clinical practice guideline for testosterone therapy', 'https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy', 'Diagnosis and treatment context; not a bodybuilding protocol.'),
  ],
  vitaminD: [
    source('NIH Office of Dietary Supplements: Vitamin D fact sheet', 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/', 'Status, intake, safety, and interaction context.'),
    source('Vitamin D3 supplementation and strength in athletes', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11163122/', 'Updated systematic review and meta-analysis; results vary by baseline status.'),
  ],
  vitaminK: [
    source('NIH Office of Dietary Supplements: Vitamin K fact sheet', 'https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/', 'Intake, forms, and warfarin interaction context.'),
    source('Vitamin K, bone mineral density, and fracture risk: systematic review', 'https://pubmed.ncbi.nlm.nih.gov/35625785/', 'Adult bone evidence; not a lifter-specific performance trial.'),
  ],
  sleepWearable: [
    source('Sleep and resistance exercise performance: a review', 'https://pubmed.ncbi.nlm.nih.gov/29422383/', 'Sleep and performance context.'),
    source('Consumer sleep technologies and measurement limitations', 'https://pubmed.ncbi.nlm.nih.gov/33957203/', 'Wearable and consumer-device validation context.'),
  ],
  hrv: [
    source('Heart-rate variability-guided training: systematic review and meta-analysis', 'https://pubmed.ncbi.nlm.nih.gov/31584549/', 'HRV-guided training evidence; not proof that a device score diagnoses readiness.'),
    source('Autoregulated resistance training for maximal strength enhancement', 'https://pubmed.ncbi.nlm.nih.gov/40791980/', 'Training-adjustment context.'),
  ],
}

const rules = [
  [/creatine-caffeine/, 'creatineCaffeine'],
  [/creatine-(?:loading|monohydrate|science)/, 'creatine'],
  [/caffeine/, 'caffeine'],
  [/citrulline/, 'citrulline'],
  [/betaine/, 'betaine'],
  [/coq10/, 'coq10'],
  [/hmb/, 'hmb'],
  [/carnitine/, 'carnitine'],
  [/magnesium/, 'magnesium'],
  [/nac-/, 'nac'],
  [/myostatin/, 'myostatin'],
  [/pqq/, 'pqq'],
  [/spermidine/, 'spermidine'],
  [/urolithin/, 'urolithin'],
  [/glycine/, 'glycine'],
  [/gut-(?:microbiome|muscle)|probiotic/, 'probiotics'],
  [/hgh|growth-hormone/, 'gh'],
  [/tongkat|testosterone/, 'testosterone'],
  [/vitamin-d/, 'vitaminD'],
  [/vitamin-k/, 'vitaminK'],
  [/sleep-wearable/, 'sleepWearable'],
  [/hrv|readiness-training|training-load-management/, 'hrv'],
  [/cold-water/, 'cold'],
  [/concurrent/, 'concurrent'],
  [/periodization|wave-loading|block-periodization/, 'periodization'],
  [/autoprogression|auto-progression|autoregulation/, 'autoregulation'],
  [/exercise-order|pre-exhaustion/, 'exerciseOrder'],
  [/frequency|training-split/, 'frequency'],
  [/training-volume|effective-training-volume|minimum-effective-dose|optimal-set-volume/, 'volume'],
  [/rep-range|light-vs-heavy|resistance-training-hypoxia|time-under-tension|mechanical-tension|sarcoplasmic|strength-vs-size/, 'hypertrophy'],
  [/muscle-memory|detraining/, 'muscleMemory'],
  [/sleep-deprivation|sleep-growth|circadian|chronotype|napping/, 'sleep'],
  [/bands/, 'bands'],
  [/fasted|intermittent-fasting|pre-workout-(?:meal|protein)|protein-(?:distribution|muscle|pre-sleep)/, 'fasted'],
  [/protein|building-muscle-budget/, 'protein'],
  [/zone-2|cardio-strength|concurrent/, 'concurrent'],
]

const glycineSources = [
  source('Glycine supplementation for physical performance and recovery: review', 'https://pubmed.ncbi.nlm.nih.gov/39453231/', 'Review concludes that more randomized human trials are needed; it does not establish a standard sports dose.'),
  source('Protein supplementation and resistance training: systematic review and meta-analysis', 'https://pubmed.ncbi.nlm.nih.gov/28698222/', 'General amino-acid and resistance-training context, not direct proof for glycine.'),
]

function chooseSources(slug, category) {
  if (slug.includes('glycine')) return glycineSources
  const match = rules.find(([pattern]) => pattern.test(slug))
  if (match) return sources[match[1]]
  if (category === 'supplement') return sources.creatine
  if (category === 'nutrition') return sources.protein
  if (category === 'health') return sources.hypertrophy
  return sources.hypertrophy
}

function citationSection(items) {
  return `### Sources\n\n${items.map(item => `- [${item.label}](${item.url}). ${item.scope}`).join('\n')}\n`
}

const files = (await fs.readdir(blogDir)).filter(file => file.endsWith('.md')).sort()
const report = []
for (const file of files) {
  const filePath = path.join(blogDir, file)
  const original = await fs.readFile(filePath, 'utf8')
  const parsed = matter(original)
  if (/https?:\/\/|^#{2,3}\s+(?:sources?|references?|citations?|further reading)\s*$/im.test(parsed.content)) continue

  const category = String(parsed.data.category || '')
  const slug = file.replace(/\.md$/, '')
  const selected = chooseSources(slug, category)
  const marker = '{{surpass-inline-cta}}'
  const section = citationSection(selected)
  const updated = original.includes(marker)
    ? original.replace(marker, `${section}\n${marker}`)
    : `${original.trimEnd()}\n\n${section}`
  await fs.writeFile(filePath, updated)
  report.push({ slug, category, sources: selected.map(item => item.url) })
}

await fs.mkdir(reportDir, { recursive: true })
await fs.writeFile(path.join(reportDir, 'citation-coverage.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), pagesUpdated: report.length, pages: report }, null, 2)}\n`)
console.log(JSON.stringify({ pagesUpdated: report.length, report: 'reports/seo/citation-coverage.json' }, null, 2))
