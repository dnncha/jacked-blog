import AcquisitionLanding from './AcquisitionLanding'

// One landing page per first-screen choice in the app ("What do you want
// people to notice first?"). The eyebrow repeats the exact onboarding label so
// an ad, this page and the app's first screen say the same thing.

const APP_STORE_BASE = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689'

const PRICE_ANSWER = 'Logging, history, import and your first Frame Check read are free. Surpass Pro is $12.99 a month or $59.99 a year in the US, with a 7-day free trial on the annual plan. Apple shows your local price before you buy.'
const NO_SCORE_ANSWER = 'No. Frame Check keeps matched photos on your phone and asks you to mark what you see. There is no score and no comparison with anyone else, only with your own past check-ins.'
const VOLUME_SOURCE = 'Schoenfeld, Ogborn and Krieger, 2017'

export const PRIORITY_LANDINGS = {
  'bigger-arms': {
    choice: 'Bigger arms',
    goal: 'bigger arms',
    campaign: 'seo_priority_bigger_arms',
    image: '/marketing/priority/surpass-priority-arms.webp',
    imageAlt: 'The Bigger arms card from the Surpass first screen, with the upper arms lit',
    seoTitle: 'Bigger Arms Workout Plan for iPhone | Surpass',
    seoDescription: 'Pick Bigger arms in Surpass and get a training block that gives your biceps and triceps their own weekly set target, a weight and rep target for every set, and private photos that show the change.',
    keywords: ['bigger arms workout', 'how to get bigger arms', 'arm workout plan', 'biceps and triceps workout app', 'arm hypertrophy program'],
    title: 'Bigger arms, on purpose.',
    intro: 'Surpass asks one question first: what do you want people to notice? Pick Bigger arms and your block puts extra weekly sets on your biceps and triceps, gives every set a weight and rep target, and keeps private photos that show whether your arms are changing.',
    benefitsTitle: 'What actually grows your arms.',
    benefitsIntro: 'Arm size comes from the biceps and triceps getting enough hard sets every week, on lifts whose load keeps climbing.',
    benefits: [
      { title: 'Train the triceps as hard as the biceps', copy: 'The triceps make up more of the upper arm than the biceps. Give them direct work, including an overhead extension, instead of leaving them to presses.' },
      { title: 'Enough sets, every week', copy: 'Surpass gives each priority muscle a second exercise on the days that train it, aiming for about 10 to 20 hard sets a week, and shows how many are left.' },
      { title: 'Proof from the same angles', copy: 'Arms show best from the front and the side. Frame Check takes matched photos from the same angles each time, so you compare like with like.' },
    ],
    exercises: 'Curls for the biceps (incline, cable or hammer) and pushdowns plus an overhead extension for the triceps. Keep the same exercises through the block so the load can climb.',
    poses: 'front and side',
    comparison: [
      ['Weekly arm work', 'Arms get whatever sets are left at the end of a push or pull day.', 'Biceps and triceps get their own weekly set target, shown on the body map.'],
      ['Each session', 'Pick a weight and hope it was the right one.', 'A weight and rep target for every set, beside what you did last time.'],
      ['Knowing it worked', 'A mirror in different light every time.', 'Matched Frame Check photos, compared only with your own past check-ins.'],
    ],
    extraFaq: { question: 'Do I have to stop training the rest of my body?', answer: 'No. The rest of your plan keeps its normal work. Your arms get the extra sets, inside the session length you choose.' },
  },
  'wider-shoulders': {
    choice: 'Wider shoulders',
    goal: 'wider shoulders',
    campaign: 'seo_priority_wider_shoulders',
    image: '/marketing/priority/surpass-priority-shoulders.webp',
    imageAlt: 'The Wider shoulders card from the Surpass first screen, with the shoulders lit',
    seoTitle: 'Wider Shoulders Workout Plan for iPhone | Surpass',
    seoDescription: 'Pick Wider shoulders in Surpass and get a training block led by side-delt work, a weight and rep target for every set, and private photos that show your frame getting wider.',
    keywords: ['wider shoulders workout', 'how to get wider shoulders', 'side delt workout', 'shoulder workout plan', 'boulder shoulders program'],
    title: 'Wider shoulders, on purpose.',
    intro: 'Surpass asks one question first: what do you want people to notice? Pick Wider shoulders and your block puts extra weekly sets on your delts, led by lateral raises for the side delts, then keeps private photos that show your frame getting wider.',
    benefitsTitle: 'What actually makes shoulders look wider.',
    benefitsIntro: 'Width comes mostly from the side delts. Pressing trains the front of the shoulder; the side and rear need their own work.',
    benefits: [
      { title: 'Side delts carry the width', copy: 'Lateral raises train the part of the shoulder that sticks out past your arms from the front. They lead the shoulder work in a Wider shoulders block.' },
      { title: 'Rear delts finish the look', copy: 'Rear delts shape the shoulder from the side and back. A rear-delt fly or face pull keeps the whole cap growing, not just the front.' },
      { title: 'Proof from three angles', copy: 'Shoulders change from every side. Frame Check takes matched front, side and back photos each time, so the comparison is fair.' },
    ],
    exercises: 'Lateral raises (dumbbell, cable or machine) for the side delts, a rear-delt fly or face pull for the rear delts, and one overhead press. High-rep raises taken close to failure work well here.',
    poses: 'front, side and back',
    comparison: [
      ['Weekly shoulder work', 'Presses cover the front delts; the side delts get a few raises when there is time.', 'Your delts get their own weekly set target, led by side-delt raises, shown on the body map.'],
      ['Each session', 'Raises done with whatever dumbbells are free.', 'A weight and rep target for every set, beside what you did last time.'],
      ['Knowing it worked', 'Guessing from how a shirt fits.', 'Matched Frame Check photos, compared only with your own past check-ins.'],
    ],
    extraFaq: { question: 'Will overhead pressing alone make my shoulders wider?', answer: 'Pressing mostly trains the front delts. Side delts get some work from it, but direct lateral raises are the most reliable way to add width.' },
  },
  'bigger-chest': {
    choice: 'More chest',
    goal: 'a bigger chest',
    campaign: 'seo_priority_more_chest',
    image: '/marketing/priority/surpass-priority-chest.webp',
    imageAlt: 'The More chest card from the Surpass first screen, with the chest lit',
    seoTitle: 'Bigger Chest Workout Plan for iPhone | Surpass',
    seoDescription: 'Pick More chest in Surpass and get a training block that gives your chest its own weekly set target, a weight and rep target for every set, and private photos that show the change.',
    keywords: ['bigger chest workout', 'how to build a bigger chest', 'chest workout plan', 'upper chest workout', 'chest hypertrophy program'],
    title: 'More chest, on purpose.',
    intro: 'Surpass asks one question first: what do you want people to notice? Pick More chest and your block puts extra weekly sets on your chest, gives every press and fly a weight and rep target, and keeps private photos that show whether it is filling out.',
    benefitsTitle: 'What actually builds a fuller chest.',
    benefitsIntro: 'A bigger chest comes from pressing and fly work at enough weekly sets, on the same lifts long enough for the load to climb.',
    benefits: [
      { title: 'Press at more than one angle', copy: 'An incline press loads the upper chest that shows above a shirt collar. Pair it with a flat press so the whole chest gets the work.' },
      { title: 'Add a fly for the stretch', copy: 'A cable or machine fly trains the chest through a long stretch without your triceps giving out first.' },
      { title: 'Proof from the front and side', copy: 'Chest shows best from the front and the side. Frame Check takes matched photos from the same angles each time.' },
    ],
    exercises: 'An incline press and a flat press (barbell, dumbbell or machine), plus a cable or machine fly. Keep the same exercises through the block so the load can climb.',
    poses: 'front and side',
    comparison: [
      ['Weekly chest work', 'Bench press on Monday, then whatever chest work fits.', 'Your chest gets its own weekly set target, shown on the body map.'],
      ['Each session', 'Chasing a heavier bench single.', 'A weight and rep target for every set, beside what you did last time.'],
      ['Knowing it worked', 'A mirror in different light every time.', 'Matched Frame Check photos, compared only with your own past check-ins.'],
    ],
    extraFaq: { question: 'Do I need to bench press to build my chest?', answer: 'No. Dumbbell and machine presses build the chest well. Pick the press you can load safely and progress for the whole block.' },
  },
  'wider-back': {
    choice: 'Wider back',
    goal: 'a wider back',
    campaign: 'seo_priority_wider_back',
    image: '/marketing/priority/surpass-priority-back.webp',
    imageAlt: 'The Wider back card from the Surpass first screen, with the upper back lit',
    seoTitle: 'Wider Back and V-Taper Workout Plan for iPhone | Surpass',
    seoDescription: 'Pick Wider back in Surpass and get a training block that gives your lats their own weekly set target, a weight and rep target for every set, and private photos that show your V-taper.',
    keywords: ['wider back workout', 'v taper workout', 'lat workout plan', 'how to get a wider back', 'back width exercises'],
    title: 'A wider back, on purpose.',
    intro: 'Surpass asks one question first: what do you want people to notice? Pick Wider back and your block puts extra weekly sets on your lats, gives every pulldown and row a weight and rep target, and keeps private photos that show your V-taper coming in.',
    benefitsTitle: 'What actually makes a back look wider.',
    benefitsIntro: 'Back width is mostly your lats. Vertical pulls and rows train them; rear delts and biceps help from the side.',
    benefits: [
      { title: 'Pull from overhead', copy: 'Pulldowns and pull-ups train the lats through the full range that builds width. They anchor a Wider back block.' },
      { title: 'Row for thickness', copy: 'A row adds the thickness that makes width read from the side. Rear delts and biceps get worked along the way.' },
      { title: 'Proof you can actually see', copy: 'You rarely see your own back. Frame Check takes matched back and front photos each time so you can.' },
    ],
    exercises: 'A pulldown or pull-up and a row (cable, chest-supported or machine). Keep the same exercises through the block so the load can climb.',
    poses: 'back and front',
    comparison: [
      ['Weekly back work', 'One pull day, with sets spread across whatever machines are free.', 'Your back gets its own weekly set target, shown on the body map.'],
      ['Each session', 'Heavier rows with more body English each week.', 'A weight and rep target for every set, beside what you did last time.'],
      ['Knowing it worked', 'You never see your back.', 'Matched back and front Frame Check photos, compared only with your own past check-ins.'],
    ],
    extraFaq: { question: 'Are pull-ups or pulldowns better for back width?', answer: 'Both train the lats well. Pulldowns are easier to load in small steps, which makes them simple to progress through a block.' },
  },
  'whole-frame': {
    choice: 'Better whole frame',
    goal: 'a bigger upper body',
    campaign: 'seo_priority_whole_frame',
    image: '/marketing/priority/surpass-priority-whole-frame.webp',
    imageAlt: 'The Better whole frame card from the Surpass first screen, showing a lifter in a black T-shirt',
    seoTitle: 'Aesthetic Physique Workout Plan for iPhone | Surpass',
    seoDescription: 'Pick Better whole frame in Surpass and get a training block that builds chest, back and shoulders together, with a weight and rep target for every set and private photos that show the change.',
    keywords: ['aesthetic physique workout plan', 'upper body hypertrophy program', 'v taper workout plan', 'physique workout app', 'build a bigger upper body'],
    title: 'A better whole frame, on purpose.',
    intro: 'Surpass asks one question first: what do you want people to notice? Pick Better whole frame and your block puts extra weekly sets on your chest, back and side delts, the three muscles that shape how your upper body looks in a T-shirt, then keeps private photos that show it.',
    benefitsTitle: 'What actually changes your whole frame.',
    benefitsIntro: 'Chest, back and side delts set the outline of your upper body. Arms and traps follow from the same work.',
    benefits: [
      { title: 'Three priorities, one week', copy: 'A Better whole frame block spreads extra sets across chest, back and side delts, so no one muscle eats the whole session.' },
      { title: 'Supporting muscles still count', copy: 'Presses, pulls and raises also train your front and rear delts, traps, biceps and triceps, so they grow along with the three priorities.' },
      { title: 'Proof from every side', copy: 'Your whole frame changes from every angle. Frame Check takes matched front, side and back photos each time.' },
    ],
    exercises: 'An incline or flat press, a pulldown and a row, and lateral raises. Keep the same exercises through the block so the load can climb.',
    poses: 'front, side and back',
    comparison: [
      ['Weekly upper-body work', 'A split where each muscle gets one day and whatever sets fit.', 'Chest, back and side delts each get a weekly set target, shown on the body map.'],
      ['Each session', 'Pick a weight and hope it was the right one.', 'A weight and rep target for every set, beside what you did last time.'],
      ['Knowing it worked', 'A mirror in different light every time.', 'Matched Frame Check photos, compared only with your own past check-ins.'],
    ],
    extraFaq: { question: 'Should I pick one muscle or the whole frame?', answer: 'Pick one muscle when it clearly lags. Pick Better whole frame when you want your upper body to look bigger overall. You can change your priority later.' },
  },
}

export const PRIORITY_SLUGS = Object.keys(PRIORITY_LANDINGS)

export function priorityMetadata(slug) {
  const page = PRIORITY_LANDINGS[slug]
  const url = `https://jacked.coach/${slug}/`
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Surpass: ${page.choice}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seoTitle,
      description: page.seoDescription,
      images: ['/og-image.png'],
    },
  }
}

export function PriorityLandingPage({ slug }) {
  const page = PRIORITY_LANDINGS[slug]
  const steps = [
    { title: `Pick ${page.choice}`, copy: `The first screen asks what you want people to notice first. Choose ${page.choice}, then set your training days, session length and equipment. Your first workout follows your choice.` },
    { title: 'Train the block', copy: `Today shows the week on a front and back body map. Your priority fills in as you close on this week's set target, and every set has a weight and rep target beside your last result.` },
    { title: 'Check it showing', copy: `Take a Frame Check with matched ${page.poses} photos, mark what you see, and Surpass ranks your next priority. Your photos stay on your phone.` },
  ]
  const faqs = [
    { question: `How many sets a week does it take to build ${page.goal}?`, answer: `Research on weekly volume favours roughly 10 or more hard sets per muscle a week for growth (${VOLUME_SOURCE}). Surpass starter plans give each priority muscle a second exercise on the days that train it, aiming for about 10 to 20 hard sets a week, and Today shows how many are left.` },
    { question: 'Which exercises should I use?', answer: page.exercises },
    page.extraFaq,
    { question: 'Does Surpass rate my physique from a photo?', answer: NO_SCORE_ANSWER },
    { question: 'What does Surpass cost?', answer: PRICE_ANSWER },
  ]
  const related = [
    ...PRIORITY_SLUGS.filter(other => other !== slug).map(other => [`/${other}`, PRIORITY_LANDINGS[other].choice]),
    ['/best-physique-tracker-apps', 'Best physique tracker apps'],
    ['/surpass-vs-hevy', 'Surpass vs Hevy'],
  ]

  return <AcquisitionLanding
    eyebrow={page.choice}
    title={page.title}
    intro={page.intro}
    campaignUrl={`${APP_STORE_BASE}&ct=${page.campaign}&mt=8`}
    campaignKey={page.campaign}
    canonicalPath={`/${slug}`}
    heroImage={page.image}
    heroImageAlt={page.imageAlt}
    heroPresentation="screen"
    benefits={page.benefits}
    benefitsTitle={page.benefitsTitle}
    benefitsIntro={page.benefitsIntro}
    steps={steps}
    flowTitle="From the first screen to your first workout."
    flowIntro="The choice you make on the first screen decides where your extra sets go all block."
    comparison={page.comparison}
    comparisonTitle="A generic split, and a block built for one change."
    comparisonIntro={`Most programmes spread sets evenly. A ${page.choice} block puts them where you want the change to show.`}
    comparisonLabel={`Generic split and Surpass ${page.choice} block comparison`}
    comparisonMomentLabel="Moment"
    comparisonLeftLabel="Generic split"
    comparisonRightLabel={`Surpass, ${page.choice}`}
    faqs={faqs}
    faqTitle={`Questions about building ${page.goal}.`}
    related={related}
    finalTitle={`Pick ${page.choice}. Start the block.`}
    finalCopy="Free on iPhone. The first screen asks what you want people to notice first, and your first workout follows your answer."
    dockTitle="Get bigger on purpose."
  />
}
