# Research blog brief for ChatGPT

The five prompts below gather the **complete current research-note text**, all **20 journal reference papers**, the supplied topic images, and existing YouTube links. There are no publication placeholders. Copy one entire fenced prompt into ChatGPT with web browsing enabled. Each prompt is self-contained.

The website keeps short topic notes as entry points and now also includes full research stories. Their Markdown sources live in `content/blog/`; topic metadata and three-point takeaways live in `data/topics.json`. A shared template and the lightweight Markdown builder generate static pages under `blog/`. To revise an article using these prompts, edit its Markdown file and run `node scripts/build_blog.mjs`. Keep long-form text out of the existing plain-text problem, approach, findings, and perspective fields. The builder synchronizes the homepage fallback and validates related-publication metadata against the references in this brief.

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

Current title: Understanding dementia. Predicting what comes next.

Project-card title: Dementia & trustworthy AI

Current summary: Multimodal learning for earlier detection, disease progression, and fairer dementia classification.

Keywords: Neuroimaging, Multimodal learning, Fairness


The problem
A dementia prediction model must answer more than a diagnostic question. Can it distinguish stages of cognitive impairment, estimate when progression may occur, and work across populations? Clinical assessments and brain images provide complementary evidence, but missing observations and population differences make learning difficult.


The research approach
This research brings together neuroimaging and clinical information through attention, multitask learning, and longitudinal models. The 2023 Scientific Reports study introduced stacked polynomial attention (SPAN) and adaptive exponential decay to jointly learn MCI stage and time to Alzheimer’s conversion. Related journal work explores bidirectional prediction with imputation, modality uncertainty, and fair and explainable dementia classification.


Significant findings & contributions

Learning diagnosis and progression together
On the ADNI cohort, the 2023 model reported a c-index of 0.85 for conversion-time prediction and 83.19% accuracy for MCI-stage classification. These are study results for that cohort.

Making incomplete histories useful
The 2022 Neural Networks paper combines forward-to-backward bidirectional learning with integrative imputation for longitudinal progression prediction.

Extending the question to fairness
The 2026 Nature Communications paper examines fair and explainable neuroimaging dementia pattern classification across racial and ethnic populations.


The broader perspective
The common thread is to learn from complementary patient information while examining how reliable a prediction is, and for whom it works.

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

Current title: Brain aging, beyond a single biomarker.

Project-card title: Brain aging & vascular health

Current summary: Connecting brain networks, vascular burden, and population studies to understand brain health.

Keywords: Connectomics, Brain aging, Population studies


The problem
Brain health reflects multiple interacting processes. Functional connectivity, structural brain changes, and vascular disease each describe a different aspect of aging. A useful research question is how these measurements can be studied together without reducing every change to one diagnosis.


The research approach
This theme groups collaborative journal work on machine learning biomarkers derived from a large functional-connectome collection and on brain small vessel disease in the SPRINT randomized clinical trial. It connects computational biomarker development with cohort-based clinical analysis.


Significant findings & contributions

Studying aging through functional networks
The 2026 Brain Research Bulletin paper derives machine learning brain-aging biomarkers from a collection of forty thousand functional connectomes.

Examining vascular burden in a trial setting
The 2026 eClinicalMedicine paper examines overall brain small vessel disease burden in a post-hoc analysis of intensive versus standard blood pressure control in SPRINT.


The broader perspective
These papers address complementary measurements of brain health. The source articles provide the study designs, effect estimates, and limitations for each investigation.

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

Current title: Understanding emotion in context.

Project-card title: Multimodal emotion & social AI

Current summary: Learning from voices, faces, language, and social relationships to understand affective behavior.

Keywords: Graph learning, Audio + visual + text, Social context


The problem
Emotion is expressed across channels, and the meaning of a cue can change with context. A voice, a facial expression, and a spoken sentence may reinforce or contradict one another. Conversations and group interactions add dependencies between people and over time.


The research approach
The journal papers explore multi-head attention for speech emotion, deep graph fusion for evoked expressions, cross-modality interactions for emotion reasoning, and relation-aware graph-recurrent learning in conversations. The GCE dataset extends the work to group cohesion and emotion analysis.


Significant findings & contributions

Moving from separate signals to interactions
Attention and graph-based models explicitly learn relationships between modalities and contextual representations, rather than treating each channel as an isolated prediction task.

Representing conversational context
The residual relation-aware model studies emotion recognition in conversation through graph-recurrent learning.

Studying people together
The GCE journal publication contributes an audio-visual dataset for investigating group cohesion and emotion.


The broader perspective
Across these studies, the central contribution is the representation of complementary signals and their relationships. Each paper reports evaluations on its own datasets and tasks.

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

Current title: From an image to a meaningful region.

Project-card title: Medical image analysis

Current summary: Segmentation and semi-supervised learning for bone tumors and abnormal tissue analysis.

Keywords: Segmentation, Semi-supervised learning, Radiographs


The problem
Medical images contain structures that matter differently to a diagnostic task. Learning a classifier from limited labeled images can be difficult when the relevant anatomy occupies only a small part of the image, or when normal tissue obscures an abnormal region.


The research approach
This work connects segmentation with classification. The knee bone tumor study uses a regenerative semi-supervised bidirectional W-network guided by three-region bone segmentation. A related journal paper enhances U-Net with a spatial-channel attention gate for abnormal tissue segmentation.


Significant findings & contributions

Using anatomy to guide classification
The W-network study integrates three-region bone segmentation into the knee bone tumor classification pipeline.

Attending to relevant spatial and channel features
The U-Net study investigates a spatial-channel attention gate for abnormal tissue segmentation in medical images.


The broader perspective
The shared idea is to make the region representation part of the learning problem. The publications provide the validation settings and performance comparisons.

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

Current title: Turning everyday signals into interaction.

Project-card title: Mobile sensing & intelligent interaction

Current summary: Smartphone motion, depth cameras, and connected systems for localization and natural interaction.

Keywords: Mobile sensing, Human interaction, Signal processing


The problem
Everyday sensors are noisy, and the way a person moves changes the signal. A smartphone must estimate a walking path despite varying speed and arm swing. A depth camera must distinguish useful gestures and fingertips from background movement.


The research approach
The journal work explores adaptive step detection and step-length estimation for smartphone pedestrian dead reckoning, nonparametric estimation for arm-swing walking, RGB-D hand gesture recognition, and a fingertip-driven virtual mouse. Earlier wireless-network research examines relay selection under channel estimation error.


Significant findings & contributions

Adapting to the person’s movement
The smartphone studies address variable walking speeds and arm-swing walking through adaptive and regression-based step-length estimation.

Connecting perception with an interface
RGB-D studies investigate real-time hand gesture spotting and fingertip detection for a virtual mouse system.

Accounting for imperfect measurements
The relay-selection paper studies the impact of channel estimation error in cognitive radio networks, an earlier foundation in signal analysis.


The broader perspective
These projects share an interest in building useful estimates and interfaces from imperfect measurements in everyday settings.

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
