const safetyRules={
  'no-undef':'error',
  'no-unreachable':'error',
  'no-dupe-keys':'error',
  'no-constant-binary-expression':'error',
  'valid-typeof':'error'
};

export default [{
  files:['app.js','family.js','sync.js','growth/**/*.js','feedingGuidance/**/*.js'],
  ignores:['growth/referenceData/who-lms.js'],
  languageOptions:{
    ecmaVersion:2023,
    sourceType:'script',
    globals:{window:'readonly',globalThis:'readonly',document:'readonly',localStorage:'readonly',crypto:'readonly',navigator:'readonly',fetch:'readonly',btoa:'readonly',atob:'readonly',TextEncoder:'readonly',TextDecoder:'readonly',Blob:'readonly',URL:'readonly',alert:'readonly',confirm:'readonly',setTimeout:'readonly',clearTimeout:'readonly',setInterval:'readonly',LittleDaysGrowth:'readonly',LittleDaysFeeding:'readonly',LittleDaysFamily:'readonly',LittleDaysSync:'readonly',module:'readonly',require:'readonly'}
  },
  rules:safetyRules
},{
  files:['sw.js'],
  languageOptions:{ecmaVersion:2023,sourceType:'script',globals:{self:'readonly',caches:'readonly',fetch:'readonly',URL:'readonly',Promise:'readonly'}},
  rules:safetyRules
},{
  files:['tests/**/*.js'],
  languageOptions:{
    ecmaVersion:2023,
    sourceType:'commonjs',
    globals:{console:'readonly',__dirname:'readonly',structuredClone:'readonly',global:'readonly',TextEncoder:'readonly',TextDecoder:'readonly',Response:'readonly'}
  },
  rules:safetyRules
}];
