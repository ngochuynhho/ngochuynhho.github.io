(function(root){
  'use strict';
  /** @type {any} */ const F=root.LittleDaysFeeding=root.LittleDaysFeeding||{};

  // Parent-facing reference values based on the sources named below. These are
  // educational ranges, not individualized prescriptions.
  const reference={
    sources:Object.freeze([
      'American Academy of Pediatrics',
      'CDC Infant & Toddler Nutrition',
      'Academy of Breastfeeding Medicine'
    ]),
    sourceUrls:Object.freeze({
      aapFormula:'https://www.healthychildren.org/English/ages-stages/baby/formula-feeding/Pages/Amount-and-Schedule-of-Formula-Feedings.aspx',
      aapNewbornWeight:'https://www.aap.org/en/patient-care/newborn-infant-and-early-childhood-nutrition/newborn-and-infant-health-assessment-and-promotion/first-office-visit-3-5-days/',
      cdcFormula:'https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/how-much-and-how-often.html',
      cdcBreastfeeding:'https://www.cdc.gov/infant-toddler-nutrition/breastfeeding/newborn-basics.html',
      cdcCues:'https://www.cdc.gov/infant-toddler-nutrition/mealtime/signs-your-child-is-hungry-or-full.html',
      abmSupplementation:'https://www.bfmed.org/assets/DOCUMENTS/PROTOCOLS/3-supplementation-protocol-english.pdf'
    }),
    hourMs:3600000,
    dayMs:86400000,
    // AAP/HealthyChildren: average 2.5 oz/lb/day and usually no more than
    // about 32 oz (960 mL)/day for exclusively formula-fed infants.
    formula:Object.freeze({
      mlPerKgDay:165,
      maxMlDay:960,
      weightReferenceMaxAgeDays:180,
      firstWeekHours:168,
      firstWeekMlPerFeed:Object.freeze([30,60]),
      firstWeekFeedsPerDay:Object.freeze([8,12]),
      firstWeekIntervalHours:Object.freeze([2,3]),
      // Product decision margin, not a clinical adequacy cutoff. It prevents a
      // small rounding difference from being described as meaningfully below
      // an approximate population reference.
      materiallyBelowRatio:0.9,
      // A planning calculation is hidden for implausibly sparse/dense logs.
      // These are data-quality guards, not recommended feeding frequencies.
      reasonableFeedCount:Object.freeze([4,16])
    }),
    // ABM Protocol #3, Table 2: average reported colostrum intakes for
    // healthy term breastfed infants. Half-open boundaries avoid overlap.
    expressedMilk:Object.freeze([
      Object.freeze({minHours:0,maxHours:24,minMl:2,maxMl:10,label:'Birth to 24 hours'}),
      Object.freeze({minHours:24,maxHours:48,minMl:5,maxMl:15,label:'24 to 48 hours'}),
      Object.freeze({minHours:48,maxHours:72,minMl:15,maxMl:30,label:'48 to 72 hours'}),
      Object.freeze({minHours:72,maxHours:96,minMl:30,maxMl:60,label:'72 to 96 hours'})
    ]),
    // AAP and CDC describe 8–12 nursing sessions/24 h as a common newborn
    // pattern. Duration thresholds below are context only, never mL estimates.
    breastfeeding:Object.freeze({
      newbornMaxAgeDays:28,
      feedsPerDay:Object.freeze([8,12]),
      contextualShortMinutes:10,
      contextualLongMinutes:50,
      minimumPatternFeeds:3,
      consistentPatternRatio:0.75,
      persistentConcernCount:2
    }),
    // AAP/ABM early output context: roughly one void per day of life through
    // day 3, then about six wets/day from day 4–5. Stool weight is tapered.
    diapers:Object.freeze({
      earlyNewbornMaxDays:42,
      stoolStrictMaxBabyDay:3,
      stoolSupportingMaxBabyDay:7,
      wetMinimumByBabyDay:Object.freeze({1:1,2:2,3:3}),
      wetMinimumDay4Onward:6,
      stoolMinimumByBabyDay:Object.freeze({1:1,2:2,3:3}),
      stoolSupportingDay4To7:3
    }),
    weight:Object.freeze({
      newbornMaxAgeDays:28,
      newbornRecentDays:7,
      olderInfantRecentDays:14,
      reviewLossPercent:10,
      assessLossPercent:8,
      assessLossStartDays:5,
      regainReviewDays:13.5
    }),
    coverage:Object.freeze({good:'High data coverage',moderate:'Moderate data coverage',limited:'Limited data'})
  };

  F.reference=Object.freeze(reference);
  if(typeof module!=='undefined'&&module.exports)module.exports=F.reference;
})(typeof window!=='undefined'?window:globalThis);
