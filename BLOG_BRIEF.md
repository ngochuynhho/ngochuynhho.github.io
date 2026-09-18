# Research blog brief for ChatGPT

The five prompts below gather the **complete current research-note text**, all **20 journal reference papers**, the supplied topic images, and existing YouTube links. There are no publication placeholders. Copy one entire fenced prompt into ChatGPT with web browsing enabled. Each prompt is self-contained.

The website keeps short topic notes as entry points to full research stories. Each note has a View stories button before The problem; there is no separate homepage Scientific Blog section. The article narratives, headlines, and takeaways were revised using the author-supplied draft preserved in `content/research-notes-draft.md`. Their Markdown sources live in `content/blog/`; topic metadata and three-point takeaways live in `data/topics.json`. A shared template and the lightweight Markdown builder generate static pages under `blog/`. To revise an article using these prompts, edit its Markdown file and run `node scripts/build_blog.mjs`. Keep long-form text out of the existing plain-text problem, approach, findings, and perspective fields. The builder synchronizes the homepage fallback and validates related-publication metadata against the references in this brief.

## 01. Dementia & trustworthy AI

```text
You are writing a research blog for the personal academic website of Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. He completed his postdoctoral appointment there in May 2026.

Expand the existing research note below into a compelling, accurate research blog of approximately 900–1,200 words. Audience: researchers, prospective collaborators, students, and scientifically curious readers. Use the supplied journal papers as the evidence base and retain the existing theme. Return a complete publication-ready Markdown draft, not just an outline.

Read the linked papers before writing substantive scientific claims. Prefer the publisher full text or an accessible author manuscript/PMC copy with the same title and DOI. If only an abstract is available, restrict claims about that paper to what its abstract supports and clearly report that limitation in a separate editorial note. If a paper is inaccessible, list it in that editorial note and do not invent methods, results, figure details, or conclusions. Existing note text is a starting draft, not verified evidence: check its claims, numbers, terminology, and publication years against the papers.

Writing and structure:
- Offer three appealing, scientifically accurate headline options, then choose one for the draft. Include a two-sentence standfirst and a short opening that poses a concrete research question. An illustrative scenario may be used, but identify it as hypothetical; do not invent a patient story or clinical outcome.
- Develop a connected narrative with descriptive subheadings: why the problem matters; the scientific challenges; how the papers approach them; significant findings and contributions; limitations and open questions; a thoughtful outlook grounded in the evidence.
- Describe each paper's distinctive contribution, then explain the connections and differences across studies. Define specialized terms briefly when first introduced. Use concrete explanations of attention, graphs, connectomes, imputation, and segmentation where relevant. Avoid lists of unexplained model acronyms.
- Include one short 'Research at a glance' callout with three evidence-supported takeaways. Use a comparison table only if it makes the studies easier to understand. End with a concise invitation to discuss collaboration.
- Use a warm academic voice, clear paragraphs, and varied sentence lengths. Avoid hype, generic promotional language, claims of breakthroughs, or unsupported clinical impact. Do not confuse classification, prediction, association, and causation.

Evidence and attribution:
- Cite study-specific statements with inline Markdown links to the exact supporting paper. Link every quantitative claim and provide its dataset/cohort, endpoint, and evaluation context when reported. Never compare numerical performance across incomparable tasks or datasets as if it were a controlled benchmark.
- Preserve author and collaborator credit. Being a coauthor does not establish which experiments or models Ngoc-Huynh personally led. Use 'our collaborative study' or neutral descriptions only where appropriate; do not claim he developed, supervised, or led particular work unless the paper's contribution statement establishes that role.
- Separate published findings from proposed future directions. Do not present research models as deployed diagnostic tools or imply regulatory approval, treatment effectiveness, or clinical readiness without evidence.
- Paraphrase in original language; do not copy abstracts or long passages. Close with a bibliography containing the supplied full titles, years, DOI links, and source URLs. Include all supplied papers in the bibliography, but identify unread/unavailable sources in the separate editorial note.

Visuals and links:
- Integrate the supplied local figure with Markdown image syntax at a logical point in the blog. Write descriptive alt text and a factual caption. Check a figure against its source if it is accessible; do not invent a figure number or reuse license. Keep unresolved image attribution/license details in the editorial note. Distinguish author-supplied figures from original conceptual artwork.
- Retain each provided YouTube link as a 'Watch the demo' link. Do not imply the video proves a paper's clinical or experimental claims. Do not add a video when none is supplied.

Deliverables: (1) three headline options; (2) the complete Markdown blog, including standfirst, callout, supplied figure, references, and supplied videos; (3) a separate editorial note listing sources actually accessed, access limitations, any corrected existing claims, unverified quantitative statements, and unresolved figure attribution. Keep the editorial note out of the public blog text.

Theme-specific editorial direction:
Build a narrative from detecting dementia patterns to predicting progression and examining fairness across populations. Explain why missing histories, complementary modalities, uncertainty, and population differences matter. Distinguish the separate cohorts and evaluation designs; do not portray these papers as one validated clinical system.

COMPLETE EXISTING RESEARCH NOTE

Current title: Can dementia AI be accurate—and fair?

Project-card title: Dementia & trustworthy AI

Current summary: Learning from incomplete patient histories and complementary imaging and clinical data while examining progression, fairness, and explainability across populations.

Keywords: Neuroimaging, Multimodal learning, Fairness

The problem
Dementia develops over years, but research records capture only parts of that trajectory. Imaging, cognitive scores, and clinical assessments provide complementary information; irregular visits, missing measurements, and differences between populations complicate learning. A useful model must be evaluated for progression, uncertainty, error patterns, and interpretation as well as overall performance.

The research approach
The journal studies connect several stages of this question: imaging-based classification, longitudinal prediction with integrative imputation, multimodal multitask learning for MCI stage and conversion time, and recurrent modeling with modality uncertainty. The 2026 Nature Communications study adds group-balanced evaluation, discrepancy mitigation through RegAlign, and SHAP-based interpretation across racial and ethnic populations.

Significant findings & contributions

Population differences extend beyond sample imbalance
The 2026 study describes performance discrepancies remaining after group-balanced evaluation, matching, and imaging-feature harmonization. The study examines false-positive and false-negative rates alongside predictive performance.

Interpreting predictions across populations
SHAP-based interpretation and an independent neuroimaging meta-analysis examine influential brain regions. Feature-contribution patterns are not identical across populations, motivating population-specific examination of explanations.

Learning progression from incomplete histories
The 2022 study connects imputation and longitudinal prediction using bidirectional learning. The 2025 study addresses modality uncertainty and information flow through recurrent gates.

Learning stage and conversion time together
In the 2023 ADNI evaluation of 249 early-MCI and 427 late-MCI participants, the framework reported a c-index of 0.85 for conversion-time prediction and 83.19% accuracy for MCI-stage classification. These are separate endpoints within that study.

The broader perspective
The direction is to investigate richer multimodal and longitudinal representations while asking how uncertainty propagates, how explanations behave across cohorts, and how performance should be evaluated across populations. These are future research questions, rather than claims of clinical readiness.

REQUIRED JOURNAL REFERENCES

1. Advancing fair and explainable machine learning for neuroimaging dementia pattern classification in multi-racial and multi-ethnic populations (2026).
   Authors: NH Ho , S Charisis, N Honnorat, SR Brandigampala, D Wang, SR Heckbert, PT Fox, D Martinez, DH Wang, TM Hughes, DB Archer, TJ Hohman, S Seshadri, C Davatzikos, M Habes
   Venue: Nature Communications 17 (2026), p. 8026
   Source: https://www.nature.com/articles/s41467-026-74515-w
   DOI: 10.1038/s41467-026-74515-w
   DOI link: https://doi.org/10.1038/s41467-026-74515-w

2. Longitudinal Alzheimer's Disease Progression Prediction with Modality Uncertainty and Optimization of Information Flow (2025).
   Authors: DP Dao, HJ Yang, J Kim, NH Ho
   Venue: IEEE Journal of Biomedical and Health Informatics 29 (2025), p. 259-272
   Source: https://ieeexplore.ieee.org/document/10702601
   DOI: 10.1109/JBHI.2024.3472462
   DOI link: https://doi.org/10.1109/JBHI.2024.3472462

3. Multimodal multitask learning for predicting MCI to AD conversion using stacked polynomial attention network and adaptive exponential decay (2023).
   Authors: NH Ho , HJ Yang, J Kim
   Venue: Scientific Reports 13 (2023), p. 11243
   Source: https://www.nature.com/articles/s41598-023-37500-7
   DOI: 10.1038/s41598-023-37500-7
   DOI link: https://doi.org/10.1038/s41598-023-37500-7

4. Predicting progression of Alzheimer's disease using forward-to-backward bi-directional network with integrative imputation (2022).
   Authors: NH Ho , HJ Yang, J Kim, DP Dao, HR Park, S Pant
   Venue: Neural Networks 150 (2022), p. 422-439
   Source: https://www.sciencedirect.com/science/article/pii/S0893608022000946
   DOI: 10.1016/j.neunet.2022.03.016
   DOI link: https://doi.org/10.1016/j.neunet.2022.03.016

5. Non-white matter tissue extraction and deep convolutional neural network for Alzheimer’s disease detection (2018).
   Authors: TD Vu, NH Ho , HJ Yang, J Kim, HC Song
   Venue: Soft Computing 22 (2018), p. 61672-61686
   Source: https://link.springer.com/article/10.1007/s00500-018-3421-5
   DOI: 10.1007/s00500-018-3421-5
   DOI link: https://doi.org/10.1007/s00500-018-3421-5

SUPPLIED RESEARCH FIGURE

Local image: assets/img/topics/dementia_trustworthyAI.jpg
Dimensions: 2000 × 1615
Existing alt text: Dementia classification workflow with cohort design, cross-validation, discrepancy mitigation, and model interpretation.
Existing caption: Dementia classification workflow with cohort design, cross-validation, discrepancy mitigation, and model interpretation. Figure supplied by the author; related publications are linked below.

EXISTING YOUTUBE LINKS

- Alzheimer’s disease detection demo: https://www.youtube.com/watch?v=5XkSoCVYRNA
```

## 02. Brain aging & vascular health

```text
You are writing a research blog for the personal academic website of Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. He completed his postdoctoral appointment there in May 2026.

Expand the existing research note below into a compelling, accurate research blog of approximately 900–1,200 words. Audience: researchers, prospective collaborators, students, and scientifically curious readers. Use the supplied journal papers as the evidence base and retain the existing theme. Return a complete publication-ready Markdown draft, not just an outline.

Read the linked papers before writing substantive scientific claims. Prefer the publisher full text or an accessible author manuscript/PMC copy with the same title and DOI. If only an abstract is available, restrict claims about that paper to what its abstract supports and clearly report that limitation in a separate editorial note. If a paper is inaccessible, list it in that editorial note and do not invent methods, results, figure details, or conclusions. Existing note text is a starting draft, not verified evidence: check its claims, numbers, terminology, and publication years against the papers.

Writing and structure:
- Offer three appealing, scientifically accurate headline options, then choose one for the draft. Include a two-sentence standfirst and a short opening that poses a concrete research question. An illustrative scenario may be used, but identify it as hypothetical; do not invent a patient story or clinical outcome.
- Develop a connected narrative with descriptive subheadings: why the problem matters; the scientific challenges; how the papers approach them; significant findings and contributions; limitations and open questions; a thoughtful outlook grounded in the evidence.
- Describe each paper's distinctive contribution, then explain the connections and differences across studies. Define specialized terms briefly when first introduced. Use concrete explanations of attention, graphs, connectomes, imputation, and segmentation where relevant. Avoid lists of unexplained model acronyms.
- Include one short 'Research at a glance' callout with three evidence-supported takeaways. Use a comparison table only if it makes the studies easier to understand. End with a concise invitation to discuss collaboration.
- Use a warm academic voice, clear paragraphs, and varied sentence lengths. Avoid hype, generic promotional language, claims of breakthroughs, or unsupported clinical impact. Do not confuse classification, prediction, association, and causation.

Evidence and attribution:
- Cite study-specific statements with inline Markdown links to the exact supporting paper. Link every quantitative claim and provide its dataset/cohort, endpoint, and evaluation context when reported. Never compare numerical performance across incomparable tasks or datasets as if it were a controlled benchmark.
- Preserve author and collaborator credit. Being a coauthor does not establish which experiments or models Ngoc-Huynh personally led. Use 'our collaborative study' or neutral descriptions only where appropriate; do not claim he developed, supervised, or led particular work unless the paper's contribution statement establishes that role.
- Separate published findings from proposed future directions. Do not present research models as deployed diagnostic tools or imply regulatory approval, treatment effectiveness, or clinical readiness without evidence.
- Paraphrase in original language; do not copy abstracts or long passages. Close with a bibliography containing the supplied full titles, years, DOI links, and source URLs. Include all supplied papers in the bibliography, but identify unread/unavailable sources in the separate editorial note.

Visuals and links:
- Integrate the supplied local figure with Markdown image syntax at a logical point in the blog. Write descriptive alt text and a factual caption. Check a figure against its source if it is accessible; do not invent a figure number or reuse license. Keep unresolved image attribution/license details in the editorial note. Distinguish author-supplied figures from original conceptual artwork.
- Retain each provided YouTube link as a 'Watch the demo' link. Do not imply the video proves a paper's clinical or experimental claims. Do not add a video when none is supplied.

Deliverables: (1) three headline options; (2) the complete Markdown blog, including standfirst, callout, supplied figure, references, and supplied videos; (3) a separate editorial note listing sources actually accessed, access limitations, any corrected existing claims, unverified quantitative statements, and unresolved figure attribution. Keep the editorial note out of the public blog text.

Theme-specific editorial direction:
Connect two complementary lines of inquiry: deriving brain-aging biomarkers from functional connectivity and studying vascular burden in a blood-pressure trial. Explain what a functional connectome and a brain-age biomarker represent. Distinguish predictive biomarker associations from randomized treatment evidence and the limitations of a post-hoc analysis.

COMPLETE EXISTING RESEARCH NOTE

Current title: How old is the brain?

Project-card title: Brain aging & vascular health

Current summary: Connecting vascular MRI markers and large-scale functional-connectome modeling to investigate complementary dimensions of brain aging.

Keywords: Connectomics, Brain aging, Population studies

The problem
Two people of the same chronological age can differ in vascular injury, functional organization, and cognition. No single imaging measurement captures all of those dimensions. This theme asks how complementary measurements can describe brain health without treating a predictive age estimate and a trial-based vascular outcome as the same kind of evidence.

The research approach
The SPRINT post-hoc imaging analysis combines periventricular white-matter hyperintensities, white-matter free water, and basal-ganglia perivascular spaces into a global small-vessel-disease burden. A separate connectome study compares transformations and predictors using more than 40,000 functional connectomes from the Framingham Heart Study, Human Connectome Project, MESA, and UK Biobank.

Significant findings & contributions

Studying vascular injury under a trial comparison
The SPRINT analysis reports less progression of the global MRI-derived small-vessel-disease burden under intensive versus standard systolic blood-pressure treatment. This is a post-hoc imaging outcome within the SPRINT trial context.

Respecting the structure of brain networks
The functional-connectome study reports improved age prediction using a transformation motivated by Bures–Wasserstein geometry and examines derived measures in relation to cognitive and health markers.

Matching model complexity to available data
In the connectome study, nonlinear predictors trained with fewer than roughly 2,000 connectomes did not necessarily outperform simpler regularized linear models. A predicted brain-age difference remains a statistical phenotype, not a literal biological clock.

The broader perspective
Vascular burden and functional brain-age measures address different aspects of aging. Future multimodal research can investigate how structural, functional, vascular, molecular, and cognitive measurements interact while retaining their distinct biological meanings.

REQUIRED JOURNAL REFERENCES

1. Intensive versus standard blood pressure control and overall brain small vessel disease burden: a post-hoc analysis of the SPRINT randomized clinical trial (2026).
   Authors: S Charisis, NM Pajewski, LR Price, NH Ho T Rashid, D Wang, Y Zeng, NS Kutty, RN Bryan, KC Kern, BC Dickerson, S Seshadri, I Nasrallah, L Launer, C Davatzikos, JD Williamson, M Habes
   Venue: eClinicalMedicine 99 (2026), p. 104143
   Source: https://www.sciencedirect.com/science/article/pii/S2589537026003962
   DOI: 10.1016/j.eclinm.2026.104143
   DOI link: https://doi.org/10.1016/j.eclinm.2026.104143

2. Derivation of machine learning brain aging biomarkers for a set of forty thousand functional connectomes (2026).
   Authors: N Honnorat, D Wang, NH Ho , D Martinez, SR Brandigampala, SR Heckbert, M Bahrami, JJ Himali, C DeCarli, A Beiser, TM Hughes, S Seshadri, M Habes
   Venue: Brain Research Bulletin 237 (2026), p. 111815
   Source: https://www.sciencedirect.com/science/article/pii/S0361923026001012
   DOI: 10.1016/j.brainresbull.2026.111815
   DOI link: https://doi.org/10.1016/j.brainresbull.2026.111815

SUPPLIED RESEARCH FIGURE

Local image: assets/img/topics/Brain_aging_vascular_health.jpg
Dimensions: 3042 × 1279
Existing alt text: Functional connectome datasets and transformations used for brain-age prediction and brain-health analysis.
Existing caption: Functional connectome datasets and transformations used for brain-age prediction and brain-health analysis. Figure supplied by the author; related publications are linked below.

EXISTING YOUTUBE LINKS

No YouTube link is supplied for this theme.
```

## 03. Multimodal emotion & social AI

```text
You are writing a research blog for the personal academic website of Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. He completed his postdoctoral appointment there in May 2026.

Expand the existing research note below into a compelling, accurate research blog of approximately 900–1,200 words. Audience: researchers, prospective collaborators, students, and scientifically curious readers. Use the supplied journal papers as the evidence base and retain the existing theme. Return a complete publication-ready Markdown draft, not just an outline.

Read the linked papers before writing substantive scientific claims. Prefer the publisher full text or an accessible author manuscript/PMC copy with the same title and DOI. If only an abstract is available, restrict claims about that paper to what its abstract supports and clearly report that limitation in a separate editorial note. If a paper is inaccessible, list it in that editorial note and do not invent methods, results, figure details, or conclusions. Existing note text is a starting draft, not verified evidence: check its claims, numbers, terminology, and publication years against the papers.

Writing and structure:
- Offer three appealing, scientifically accurate headline options, then choose one for the draft. Include a two-sentence standfirst and a short opening that poses a concrete research question. An illustrative scenario may be used, but identify it as hypothetical; do not invent a patient story or clinical outcome.
- Develop a connected narrative with descriptive subheadings: why the problem matters; the scientific challenges; how the papers approach them; significant findings and contributions; limitations and open questions; a thoughtful outlook grounded in the evidence.
- Describe each paper's distinctive contribution, then explain the connections and differences across studies. Define specialized terms briefly when first introduced. Use concrete explanations of attention, graphs, connectomes, imputation, and segmentation where relevant. Avoid lists of unexplained model acronyms.
- Include one short 'Research at a glance' callout with three evidence-supported takeaways. Use a comparison table only if it makes the studies easier to understand. End with a concise invitation to discuss collaboration.
- Use a warm academic voice, clear paragraphs, and varied sentence lengths. Avoid hype, generic promotional language, claims of breakthroughs, or unsupported clinical impact. Do not confuse classification, prediction, association, and causation.

Evidence and attribution:
- Cite study-specific statements with inline Markdown links to the exact supporting paper. Link every quantitative claim and provide its dataset/cohort, endpoint, and evaluation context when reported. Never compare numerical performance across incomparable tasks or datasets as if it were a controlled benchmark.
- Preserve author and collaborator credit. Being a coauthor does not establish which experiments or models Ngoc-Huynh personally led. Use 'our collaborative study' or neutral descriptions only where appropriate; do not claim he developed, supervised, or led particular work unless the paper's contribution statement establishes that role.
- Separate published findings from proposed future directions. Do not present research models as deployed diagnostic tools or imply regulatory approval, treatment effectiveness, or clinical readiness without evidence.
- Paraphrase in original language; do not copy abstracts or long passages. Close with a bibliography containing the supplied full titles, years, DOI links, and source URLs. Include all supplied papers in the bibliography, but identify unread/unavailable sources in the separate editorial note.

Visuals and links:
- Integrate the supplied local figure with Markdown image syntax at a logical point in the blog. Write descriptive alt text and a factual caption. Check a figure against its source if it is accessible; do not invent a figure number or reuse license. Keep unresolved image attribution/license details in the editorial note. Distinguish author-supplied figures from original conceptual artwork.
- Retain each provided YouTube link as a 'Watch the demo' link. Do not imply the video proves a paper's clinical or experimental claims. Do not add a video when none is supplied.

Deliverables: (1) three headline options; (2) the complete Markdown blog, including standfirst, callout, supplied figure, references, and supplied videos; (3) a separate editorial note listing sources actually accessed, access limitations, any corrected existing claims, unverified quantitative statements, and unresolved figure attribution. Keep the editorial note out of the public blog text.

Theme-specific editorial direction:
Begin with an accessible example of a conversation where voice and expression communicate different cues. Connect multimodal feature fusion, relational context, and group emotion/cohesion research. Explain graph learning and attention intuitively. Distinguish conversation emotion, evoked expressions, stress, and group cohesion as different tasks with different datasets.

COMPLETE EXISTING RESEARCH NOTE

Current title: Emotion is more than a face

Project-card title: Multimodal emotion & social AI

Current summary: Learning relationships among language, voice, facial behavior, time, and social context for emotion and group analysis.

Keywords: Graph learning, Audio + visual + text, Social context

The problem
A sentence can appear positive while the voice or surrounding interaction suggests something different. Emotion-related tasks therefore require attention to complementary signals and context. Conversation emotion, evoked expressions, stress, and group cohesion also use different labels and definitions; they should not be treated as interchangeable targets.

The research approach
The papers investigate relation-aware graph-recurrent modeling of conversations, cross-modality interactions, graph-based audiovisual fusion, and multi-level multi-head attention. Dataset work expands the focus from individuals to group emotion and cohesion, and from discrete emotion labels to stress, valence, and arousal.

Significant findings & contributions

Representing conversations as relationships
The conversation study uses a graph to represent utterance relationships within and across speakers, with attention weighting contextual information. Cross-modality work examines relationships between complementary representations.

Studying group emotion and cohesion
The GCE publication describes 1,029 30-second conversational video segments annotated for group emotion and seven-level cohesion. Audio and visual representations are combined with multi-head attention for baseline models.

Keeping affective tasks distinct
The stress-analysis publication describes SADVAW as 1,236 clips from 41 Korean movies annotated for apparent stress, valence, and arousal. These dimensions differ from conversational emotion categories and group cohesion.

The broader perspective
The next questions are relational: who responds to whom, which channel changes another channel’s interpretation, and what happens when a modality is missing or signals disagree? The goal is to characterize observable relationships, rather than claim access to a person’s private internal state.

REQUIRED JOURNAL REFERENCES

1. GCE: An Audio-Visual Dataset for Group Cohesion and Emotion Analysis (2024).
   Authors: E Lim, NH Ho , S Pant, YS Kang, SE Jeon, S Kim, SH Kim, HJ Yang
   Venue: Applied Sciences 14 (2024), p. 6742
   Source: https://www.mdpi.com/2076-3417/14/15/6742
   DOI: 10.3390/app14156742
   DOI link: https://doi.org/10.3390/app14156742

2. Residual Relation-Aware Attention Deep Graph-Recurrent Model for Emotion Recognition in Conversation (2024).
   Authors: AQ Duong, NH Ho , S Pant, S Kim, SH Kim, HJ Yang
   Venue: IEEE Access 12 (2024), p. 11243
   Source: https://ieeexplore.ieee.org/document/10378668
   DOI: 10.1109/ACCESS.2023.3348518
   DOI link: https://doi.org/10.1109/ACCESS.2023.3348518

3. Cross-modality learning by exploring modality interactions for emotion reasoning (2023).
   Authors: TD Tran, NH Ho , S Pant, HJ Yang, SH Kim, G Lee
   Venue: IEEE Access 11 (2023), p. 56634-56648
   Source: https://ieeexplore.ieee.org/abstract/document/10145792
   DOI: 10.1109/ACCESS.2023.3283597
   DOI link: https://doi.org/10.1109/ACCESS.2023.3283597

4. Deep Graph Fusion based Multimodal Evoked Expressions from Large-Scale Videos (2021).
   Authors: NH Ho , HJ Yang, SH Kim, G Lee, SB Yoo
   Venue: IEEE Access 9 (2021)
   Source: https://ieeexplore.ieee.org/document/9521910
   DOI: 10.1109/ACCESS.2021.3107548
   DOI link: https://doi.org/10.1109/ACCESS.2021.3107548

5. Stress Analysis with Dimensions of Valence and Arousal in the Wild (2021).
   Authors: TD Tran, J Kim, NH Ho , HJ Yang, S Pant, SH Kim, G Lee
   Venue: Applied Sciences 11.11 (2021), p. 5194
   Source: https://www.mdpi.com/2076-3417/11/11/5194
   DOI: 10.3390/app11115194
   DOI link: https://doi.org/10.3390/app11115194

6. Multimodal approach of speech emotion recognition using multi-level multi-head fusion attention-based recurrent neural network (2020).
   Authors: NH Ho , HJ Yang, SH Kim, G Lee
   Venue: IEEE Access 8 (2020), p. 61672-61686
   Source: https://ieeexplore.ieee.org/abstract/document/9050806
   DOI: 10.1109/ACCESS.2020.2984368
   DOI link: https://doi.org/10.1109/ACCESS.2020.2984368

SUPPLIED RESEARCH FIGURE

Local image: assets/img/topics/Multimodal_emotion_social_AI.png
Dimensions: 4291 × 1710
Existing alt text: Audio-visual feature extraction and attention-based fusion for group emotion and cohesion analysis.
Existing caption: Audio-visual feature extraction and attention-based fusion for group emotion and cohesion analysis. Figure supplied by the author; related publications are linked below.

EXISTING YOUTUBE LINKS

No YouTube link is supplied for this theme.
```

## 04. Medical image analysis

```text
You are writing a research blog for the personal academic website of Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. He completed his postdoctoral appointment there in May 2026.

Expand the existing research note below into a compelling, accurate research blog of approximately 900–1,200 words. Audience: researchers, prospective collaborators, students, and scientifically curious readers. Use the supplied journal papers as the evidence base and retain the existing theme. Return a complete publication-ready Markdown draft, not just an outline.

Read the linked papers before writing substantive scientific claims. Prefer the publisher full text or an accessible author manuscript/PMC copy with the same title and DOI. If only an abstract is available, restrict claims about that paper to what its abstract supports and clearly report that limitation in a separate editorial note. If a paper is inaccessible, list it in that editorial note and do not invent methods, results, figure details, or conclusions. Existing note text is a starting draft, not verified evidence: check its claims, numbers, terminology, and publication years against the papers.

Writing and structure:
- Offer three appealing, scientifically accurate headline options, then choose one for the draft. Include a two-sentence standfirst and a short opening that poses a concrete research question. An illustrative scenario may be used, but identify it as hypothetical; do not invent a patient story or clinical outcome.
- Develop a connected narrative with descriptive subheadings: why the problem matters; the scientific challenges; how the papers approach them; significant findings and contributions; limitations and open questions; a thoughtful outlook grounded in the evidence.
- Describe each paper's distinctive contribution, then explain the connections and differences across studies. Define specialized terms briefly when first introduced. Use concrete explanations of attention, graphs, connectomes, imputation, and segmentation where relevant. Avoid lists of unexplained model acronyms.
- Include one short 'Research at a glance' callout with three evidence-supported takeaways. Use a comparison table only if it makes the studies easier to understand. End with a concise invitation to discuss collaboration.
- Use a warm academic voice, clear paragraphs, and varied sentence lengths. Avoid hype, generic promotional language, claims of breakthroughs, or unsupported clinical impact. Do not confuse classification, prediction, association, and causation.

Evidence and attribution:
- Cite study-specific statements with inline Markdown links to the exact supporting paper. Link every quantitative claim and provide its dataset/cohort, endpoint, and evaluation context when reported. Never compare numerical performance across incomparable tasks or datasets as if it were a controlled benchmark.
- Preserve author and collaborator credit. Being a coauthor does not establish which experiments or models Ngoc-Huynh personally led. Use 'our collaborative study' or neutral descriptions only where appropriate; do not claim he developed, supervised, or led particular work unless the paper's contribution statement establishes that role.
- Separate published findings from proposed future directions. Do not present research models as deployed diagnostic tools or imply regulatory approval, treatment effectiveness, or clinical readiness without evidence.
- Paraphrase in original language; do not copy abstracts or long passages. Close with a bibliography containing the supplied full titles, years, DOI links, and source URLs. Include all supplied papers in the bibliography, but identify unread/unavailable sources in the separate editorial note.

Visuals and links:
- Integrate the supplied local figure with Markdown image syntax at a logical point in the blog. Write descriptive alt text and a factual caption. Check a figure against its source if it is accessible; do not invent a figure number or reuse license. Keep unresolved image attribution/license details in the editorial note. Distinguish author-supplied figures from original conceptual artwork.
- Retain each provided YouTube link as a 'Watch the demo' link. Do not imply the video proves a paper's clinical or experimental claims. Do not add a video when none is supplied.

Deliverables: (1) three headline options; (2) the complete Markdown blog, including standfirst, callout, supplied figure, references, and supplied videos; (3) a separate editorial note listing sources actually accessed, access limitations, any corrected existing claims, unverified quantitative statements, and unresolved figure attribution. Keep the editorial note out of the public blog text.

Theme-specific editorial direction:
Explain why identifying relevant anatomical regions can help classification when labels are scarce. Connect segmentation-guided knee bone tumor classification with spatial-channel attention for abnormal tissue segmentation. Explain W-network reconstruction and semi-supervised learning only to the extent supported by the papers. Keep segmentation and classification performance separate.

COMPLETE EXISTING RESEARCH NOTE

Current title: Teaching AI where to look

Project-card title: Medical image analysis

Current summary: Using anatomical regions, reconstruction, and spatial-channel attention to support segmentation and classification when medical-image labels are limited.

Keywords: Segmentation, Semi-supervised learning, Radiographs

The problem
An abnormal region may occupy only a small fraction of a medical image. With limited labels, a classifier can spend capacity on irrelevant structure or learn shortcuts. This theme asks how anatomical localization and selective feature transfer can support meaningful representations while keeping segmentation and classification as separate tasks.

The research approach
The knee-radiograph study first segments the femur, tibia, and fibula and incorporates those regions into a regenerative semi-supervised bidirectional W-network for normal, benign, and malignant classification. A separate U-Net study introduces a spatial-channel attention gate to weight where useful information appears and which learned features are passed through skip connections.

Significant findings & contributions

Using bone regions to guide classification
The knee-radiograph study reports a mean Dice score of 98.06% for three-region segmentation and mean accuracy of 85.23% for single-step normal/benign/malignant classification. Dice and accuracy describe different tasks in that study’s evaluation.

Learning from reconstruction as well as labels
The bidirectional W-network incorporates reconstruction and merged representations as additional learning signals within a semi-supervised classification framework.

Selecting information within skip connections
For the CVC-ClinicDB attention-gate comparison in the U-Net paper, the spatial-channel attention method reported Dice of 71.72%, compared with 65.93% for baseline U-Net. The architectural question is which encoder information should reach the decoder.

The broader perspective
Segmentation and attention provide structure for representation learning. Future systems still need to distinguish relevant anatomy from nuisance information, examine shortcuts, and evaluate the endpoint they actually predict. A well-segmented region alone does not establish diagnostic performance or clinical benefit.

REQUIRED JOURNAL REFERENCES

1. Enhancing U-Net with spatial-channel attention gate for abnormal tissue segmentation in medical imaging (2020).
   Authors: TLB Khanh, DP Dao, NH Ho , HJ Yang, ET Baek, G Lee, SH Kim, SB Yoo
   Venue: Applied Sciences 10.17 (2020), p. 5729
   Source: https://www.mdpi.com/2076-3417/10/17/5729
   DOI: 10.3390/app10175729
   DOI link: https://doi.org/10.3390/app10175729

2. Regenerative semi-supervised bidirectional W-network-based knee bone tumor classification on radiographs guided by three-region bone segmentation (2019).
   Authors: NH Ho , HJ Yang, SH Kim, ST Jung, SD Joo
   Venue: IEEE Access 7 (2019), p. 6825-6833
   Source: https://ieeexplore.ieee.org/abstract/document/8880590
   DOI: 10.1109/ACCESS.2019.2949125
   DOI link: https://doi.org/10.1109/ACCESS.2019.2949125

SUPPLIED RESEARCH FIGURE

Local image: assets/img/topics/medical_image_analysis.jpg
Dimensions: 632 × 820
Existing alt text: Bidirectional network architecture showing reconstruction, merged representations, and classification for medical images.
Existing caption: Bidirectional network architecture showing reconstruction, merged representations, and classification for medical images. Figure supplied by the author; related publications are linked below.

EXISTING YOUTUBE LINKS

- Bone tumor detection demo: https://www.youtube.com/watch?v=w9sntPA24XQ
```

## 05. Mobile sensing & intelligent interaction

```text
You are writing a research blog for the personal academic website of Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. He completed his postdoctoral appointment there in May 2026.

Expand the existing research note below into a compelling, accurate research blog of approximately 900–1,200 words. Audience: researchers, prospective collaborators, students, and scientifically curious readers. Use the supplied journal papers as the evidence base and retain the existing theme. Return a complete publication-ready Markdown draft, not just an outline.

Read the linked papers before writing substantive scientific claims. Prefer the publisher full text or an accessible author manuscript/PMC copy with the same title and DOI. If only an abstract is available, restrict claims about that paper to what its abstract supports and clearly report that limitation in a separate editorial note. If a paper is inaccessible, list it in that editorial note and do not invent methods, results, figure details, or conclusions. Existing note text is a starting draft, not verified evidence: check its claims, numbers, terminology, and publication years against the papers.

Writing and structure:
- Offer three appealing, scientifically accurate headline options, then choose one for the draft. Include a two-sentence standfirst and a short opening that poses a concrete research question. An illustrative scenario may be used, but identify it as hypothetical; do not invent a patient story or clinical outcome.
- Develop a connected narrative with descriptive subheadings: why the problem matters; the scientific challenges; how the papers approach them; significant findings and contributions; limitations and open questions; a thoughtful outlook grounded in the evidence.
- Describe each paper's distinctive contribution, then explain the connections and differences across studies. Define specialized terms briefly when first introduced. Use concrete explanations of attention, graphs, connectomes, imputation, and segmentation where relevant. Avoid lists of unexplained model acronyms.
- Include one short 'Research at a glance' callout with three evidence-supported takeaways. Use a comparison table only if it makes the studies easier to understand. End with a concise invitation to discuss collaboration.
- Use a warm academic voice, clear paragraphs, and varied sentence lengths. Avoid hype, generic promotional language, claims of breakthroughs, or unsupported clinical impact. Do not confuse classification, prediction, association, and causation.

Evidence and attribution:
- Cite study-specific statements with inline Markdown links to the exact supporting paper. Link every quantitative claim and provide its dataset/cohort, endpoint, and evaluation context when reported. Never compare numerical performance across incomparable tasks or datasets as if it were a controlled benchmark.
- Preserve author and collaborator credit. Being a coauthor does not establish which experiments or models Ngoc-Huynh personally led. Use 'our collaborative study' or neutral descriptions only where appropriate; do not claim he developed, supervised, or led particular work unless the paper's contribution statement establishes that role.
- Separate published findings from proposed future directions. Do not present research models as deployed diagnostic tools or imply regulatory approval, treatment effectiveness, or clinical readiness without evidence.
- Paraphrase in original language; do not copy abstracts or long passages. Close with a bibliography containing the supplied full titles, years, DOI links, and source URLs. Include all supplied papers in the bibliography, but identify unread/unavailable sources in the separate editorial note.

Visuals and links:
- Integrate the supplied local figure with Markdown image syntax at a logical point in the blog. Write descriptive alt text and a factual caption. Check a figure against its source if it is accessible; do not invent a figure number or reuse license. Keep unresolved image attribution/license details in the editorial note. Distinguish author-supplied figures from original conceptual artwork.
- Retain each provided YouTube link as a 'Watch the demo' link. Do not imply the video proves a paper's clinical or experimental claims. Do not add a video when none is supplied.

Deliverables: (1) three headline options; (2) the complete Markdown blog, including standfirst, callout, supplied figure, references, and supplied videos; (3) a separate editorial note listing sources actually accessed, access limitations, any corrected existing claims, unverified quantitative statements, and unresolved figure attribution. Keep the editorial note out of the public blog text.

Theme-specific editorial direction:
Use everyday movement as the narrative thread: estimating a walking path from smartphone sensors and translating hand movement into computer interaction. Explain pedestrian dead reckoning, changing step length, and RGB-D sensing with concrete examples. Present the older cognitive-radio paper as a separate signal-processing foundation; do not force it into a shared sensing pipeline.

COMPLETE EXISTING RESEARCH NOTE

Current title: From footsteps to fingertips

Project-card title: Mobile sensing & intelligent interaction

Current summary: Turning noisy movement and visual measurements into adaptive step-length estimates, hand-gesture recognition, and fingertip interaction.

Keywords: Mobile sensing, Human interaction, Signal processing

The problem
A smartphone moves with the person carrying it, and walking speed, arm swing, and sensor noise affect the recorded signal. A vision-based interface must distinguish hands and fingertips from changing backgrounds. Both settings require useful estimates from measurements that are imperfect and context-dependent.

The research approach
The smartphone studies combine step detection with adaptive and nonparametric step-length estimation. The gesture studies combine RGB appearance and depth with hand localization, fingertip tracking, and temporal recognition through a 3D convolutional network. Earlier cognitive-radio work separately analyzes relay selection under channel-estimation error.

Significant findings & contributions

Adapting estimates to the movement pattern
The 2016 study combines signal filtering, step-detection rules, and walking-speed-aware step-length estimation. The 2018 study investigates arm-swing walking using relationships involving walking speed and acceleration variability.

Recognizing movement across space and time
RGB-D gesture work connects hand and fingertip localization with 3D convolution over spatial and temporal information. A sequence represents movement that a static frame cannot describe alone.

Connecting fingertip tracking to an interface
The virtual-mouse paper reports its Kinect V2 system operating at 30 frames per second on a desktop using a single CPU, with experiments examining illumination, background, and tracking-distance conditions.

The broader perspective
The common engineering thread is sense, filter, represent, estimate, and act. Newer sensing and representation-learning methods still face questions about measurement uncertainty, environment changes, device movement, and the response time needed for human interaction.

REQUIRED JOURNAL REFERENCES

1. Real-time virtual mouse system using RGB-D images and fingertip detection (2021).
   Authors: DS Tran, NH Ho , HJ Yang, SH Kim, G Lee
   Venue: Multimedia Tools and Applications 80 (2021), p. 10473-10490
   Source: https://link.springer.com/article/10.1007/s11042-020-10156-5
   DOI: 10.1007/s11042-020-10156-5
   DOI link: https://doi.org/10.1007/s11042-020-10156-5

2. Real-time hand gesture spotting and recognition using RGB-D camera and 3D convolutional neural network (2020).
   Authors: DS Tran, NH Ho , HJ Yang, ET Baek, SH Kim, G Lee
   Venue: Applied Sciences 10.2 (2020), p. 722
   Source: https://www.mdpi.com/2076-3417/10/2/722
   DOI: 10.3390/app10020722
   DOI link: https://doi.org/10.3390/app10020722

3. Nonparametric regression-based step-length estimation for arm-swing walking using a smartphone (2018).
   Authors: PH Truong, ND Nguyen, NH Ho , GM Jeong
   Venue: IJCCC 13.4 (2018), p. 566-573
   Source: http://univagora.ro/jour/index.php/ijccc/article/view/3148
   DOI: 10.15837/ijccc.2018.4.3148
   DOI link: https://doi.org/10.15837/ijccc.2018.4.3148

4. Step-detection and adaptive step-length estimation for pedestrian dead-reckoning at various walking speeds using a smartphone (2016).
   Authors: NH Ho , PH Truong, GM Jeong
   Venue: Sensors 16.9 (2016), p. 1423
   Source: https://www.mdpi.com/1424-8220/16/9/1423
   DOI: 10.3390/s16091423
   DOI link: https://doi.org/10.3390/s16091423

5. Impact of channel estimation error on the performance of relay selection in cognitive radio networks (2015).
   Authors: VK Ho, NK Doan, NH Ho
   Venue: Wireless Personal Communications 84 (2015), p. 2513-2536
   Source: https://link.springer.com/article/10.1007/s11277-015-2717-3
   DOI: 10.1007/s11277-015-2717-3
   DOI link: https://doi.org/10.1007/s11277-015-2717-3

SUPPLIED RESEARCH FIGURE

Local image: assets/img/topics/Mobile_sensing_intelligent_interaction.jpg
Dimensions: 546 × 343
Existing alt text: Fingertip tracking, gesture trajectory capture, and gesture recognition workflow.
Existing caption: Fingertip tracking, gesture trajectory capture, and gesture recognition workflow. Figure supplied by the author; related publications are linked below.

EXISTING YOUTUBE LINKS

No YouTube link is supplied for this theme.
```
