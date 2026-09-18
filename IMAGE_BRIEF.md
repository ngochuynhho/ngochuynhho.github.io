# Research image brief for ChatGPT

Copy the prompts below into ChatGPT. This is an image brief, not a request to change the current site automatically.

For longer research-note descriptions, [BLOG_BRIEF.md](BLOG_BRIEF.md) provides five complete ChatGPT prompts with the current note text, reference papers, figures, and demos.

## Website context and visual direction

I am Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. I completed my postdoctoral appointment there in May 2026. My website presents five research themes based primarily on my peer-reviewed journal publications.

Create a coherent visual collection for a polished academic research portfolio. Favor sophisticated scientific editorial artwork: softly lit 3D forms, tactile materials, controlled depth, restrained composition, and clear subject hierarchy. Avoid generic clip art, stock robot heads, grids of identical boxes, glowing cyberpunk brains, and dense text. Palette: warm ivory #fafbf7, forest green #173e35, sage #476c58, subtle pale lime #d2e7a9. Keep the theme recognizable even at thumbnail size.

Deliver one 1600 × 900 image for each theme, in WebP or PNG. Put the important subject within the central 65% of the canvas so wider website card crops preserve it. Use an opaque background and no baked-in headings, logos, journal names, author names, or watermarks. Generated art must be described as a conceptual illustration rather than a paper figure or experimental result.

## Prompt A: find authentic images in my publications

```text
Browse the paper URLs listed below. Locate the actual graphical abstract or the most visually useful figure for each research theme, preferably a framework overview or representative image rather than a dense results table.

For each candidate, return:
1. Theme and full paper title.
2. Figure number, accurate short description, and a link to its figure page.
3. A verified direct image/download URL and available pixel dimensions.
4. The article/figure license and any separate third-party credit attached to that specific figure.
5. A ready-to-use attribution caption with the source paper DOI and required license link.
6. Whether it remains readable in a wide project-card crop.

Check the source page and image itself. Do not invent URLs, figure numbers, licenses, or image contents. Prefer accessible publisher or PMC copies; if blocked, say so and propose the next accessible paper. Do not treat a search-result thumbnail as the original figure. Preserve scientific meaning when suggesting crops. If a figure needs permission, identify that requirement and offer an original conceptual illustration instead.

Here are my five themes and source papers:
01. Dementia & trustworthy AI
- Advancing fair and explainable machine learning for neuroimaging dementia pattern classification in multi-racial and multi-ethnic populations (2026). [Source paper](https://www.nature.com/articles/s41467-026-74515-w). DOI: `10.1038/s41467-026-74515-w`.
- Longitudinal Alzheimer's Disease Progression Prediction with Modality Uncertainty and Optimization of Information Flow (2025). [Source paper](https://ieeexplore.ieee.org/document/10702601). DOI: `10.1109/JBHI.2024.3472462`.
- Multimodal multitask learning for predicting MCI to AD conversion using stacked polynomial attention network and adaptive exponential decay (2023). [Source paper](https://www.nature.com/articles/s41598-023-37500-7). DOI: `10.1038/s41598-023-37500-7`.
- Predicting progression of Alzheimer's disease using forward-to-backward bi-directional network with integrative imputation (2022). [Source paper](https://www.sciencedirect.com/science/article/pii/S0893608022000946). DOI: `10.1016/j.neunet.2022.03.016`.
- Non-white matter tissue extraction and deep convolutional neural network for Alzheimer’s disease detection (2018). [Source paper](https://link.springer.com/article/10.1007/s00500-018-3421-5). DOI: `10.1007/s00500-018-3421-5`.

02. Brain aging & vascular health
- Intensive versus standard blood pressure control and overall brain small vessel disease burden: a post-hoc analysis of the SPRINT randomized clinical trial (2026). [Source paper](https://www.sciencedirect.com/science/article/pii/S2589537026003962). DOI: `10.1016/j.eclinm.2026.104143`.
- Derivation of machine learning brain aging biomarkers for a set of forty thousand functional connectomes (2026). [Source paper](https://www.sciencedirect.com/science/article/pii/S0361923026001012). DOI: `10.1016/j.brainresbull.2026.111815`.

03. Multimodal emotion & social AI
- GCE: An Audio-Visual Dataset for Group Cohesion and Emotion Analysis (2024). [Source paper](https://www.mdpi.com/2076-3417/14/15/6742). DOI: `10.3390/app14156742`.
- Residual Relation-Aware Attention Deep Graph-Recurrent Model for Emotion Recognition in Conversation (2024). [Source paper](https://ieeexplore.ieee.org/document/10378668). DOI: `10.1109/ACCESS.2023.3348518`.
- Cross-modality learning by exploring modality interactions for emotion reasoning (2023). [Source paper](https://ieeexplore.ieee.org/abstract/document/10145792). DOI: `10.1109/ACCESS.2023.3283597`.
- Deep Graph Fusion based Multimodal Evoked Expressions from Large-Scale Videos (2021). [Source paper](https://ieeexplore.ieee.org/document/9521910). DOI: `10.1109/ACCESS.2021.3107548`.
- Stress Analysis with Dimensions of Valence and Arousal in the Wild (2021). [Source paper](https://www.mdpi.com/2076-3417/11/11/5194). DOI: `10.3390/app11115194`.
- Multimodal approach of speech emotion recognition using multi-level multi-head fusion attention-based recurrent neural network (2020). [Source paper](https://ieeexplore.ieee.org/abstract/document/9050806). DOI: `10.1109/ACCESS.2020.2984368`.

04. Medical image analysis
- Enhancing U-Net with spatial-channel attention gate for abnormal tissue segmentation in medical imaging (2020). [Source paper](https://www.mdpi.com/2076-3417/10/17/5729). DOI: `10.3390/app10175729`.
- Regenerative semi-supervised bidirectional W-network-based knee bone tumor classification on radiographs guided by three-region bone segmentation (2019). [Source paper](https://ieeexplore.ieee.org/abstract/document/8880590). DOI: `10.1109/ACCESS.2019.2949125`.

05. Mobile sensing & intelligent interaction
- Real-time virtual mouse system using RGB-D images and fingertip detection (2021). [Source paper](https://link.springer.com/article/10.1007/s11042-020-10156-5). DOI: `10.1007/s11042-020-10156-5`.
- Real-time hand gesture spotting and recognition using RGB-D camera and 3D convolutional neural network (2020). [Source paper](https://www.mdpi.com/2076-3417/10/2/722). DOI: `10.3390/app10020722`.
- Nonparametric regression-based step-length estimation for arm-swing walking using a smartphone (2018). [Source paper](http://univagora.ro/jour/index.php/ijccc/article/view/3148). DOI: `10.15837/ijccc.2018.4.3148`.
- Step-detection and adaptive step-length estimation for pedestrian dead-reckoning at various walking speeds using a smartphone (2016). [Source paper](https://www.mdpi.com/1424-8220/16/9/1423). DOI: `10.3390/s16091423`.
- Impact of channel estimation error on the performance of relay selection in cognitive radio networks (2015). [Source paper](https://link.springer.com/article/10.1007/s11277-015-2717-3). DOI: `10.1007/s11277-015-2717-3`.
```

## Prompt B: generate original artwork

Each prompt below includes its visual direction, theme composition, and required publications. Copy one complete prompt into ChatGPT for each image. Use the same palette and materials across the collection.

### 01. Dementia & trustworthy AI

```text
I am Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. Create one original scientific editorial illustration for my academic research portfolio. Use the following publications as required conceptual references if you can access them. Do not recreate their figure layouts or imply the artwork comes from a paper. If the papers are inaccessible, use only the supplied theme description and titles; do not invent findings.

Visual direction: sophisticated scientific editorial artwork, softly lit 3D forms, tactile materials, controlled depth, restrained composition, and a clear central subject. Palette: warm ivory #fafbf7, forest green #173e35, sage #476c58, subtle pale lime #d2e7a9. Avoid generic clip art, stock robot heads, glowing cyberpunk brains, and dense text. No invented quantitative plots, diagnostic labels, clinical accuracy claims, numerical results, headings, logos, author names, journal names, or watermarks.

Deliver one 1600 × 900 WebP or PNG with an opaque warm ivory background. Keep the important subject within the central 65% so website card crops preserve it. Describe the finished image as an original conceptual illustration rather than a paper figure or experimental result.

Theme-specific composition:
Dementia & trustworthy AI: show a carefully rendered translucent brain beside two complementary layers suggesting brain imaging and clinical information. A subtle temporal sequence suggests disease progression; balanced symmetric visual elements suggest evaluation across populations. Keep this a conceptual representation; do not depict a proven treatment or invented predictions.

Required publications for this theme:
- Advancing fair and explainable machine learning for neuroimaging dementia pattern classification in multi-racial and multi-ethnic populations (2026). [Source paper](https://www.nature.com/articles/s41467-026-74515-w). DOI: `10.1038/s41467-026-74515-w`.
- Longitudinal Alzheimer's Disease Progression Prediction with Modality Uncertainty and Optimization of Information Flow (2025). [Source paper](https://ieeexplore.ieee.org/document/10702601). DOI: `10.1109/JBHI.2024.3472462`.
- Multimodal multitask learning for predicting MCI to AD conversion using stacked polynomial attention network and adaptive exponential decay (2023). [Source paper](https://www.nature.com/articles/s41598-023-37500-7). DOI: `10.1038/s41598-023-37500-7`.
- Predicting progression of Alzheimer's disease using forward-to-backward bi-directional network with integrative imputation (2022). [Source paper](https://www.sciencedirect.com/science/article/pii/S0893608022000946). DOI: `10.1016/j.neunet.2022.03.016`.
- Non-white matter tissue extraction and deep convolutional neural network for Alzheimer’s disease detection (2018). [Source paper](https://link.springer.com/article/10.1007/s00500-018-3421-5). DOI: `10.1007/s00500-018-3421-5`.
```

### 02. Brain aging & vascular health

```text
I am Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. Create one original scientific editorial illustration for my academic research portfolio. Use the following publications as required conceptual references if you can access them. Do not recreate their figure layouts or imply the artwork comes from a paper. If the papers are inaccessible, use only the supplied theme description and titles; do not invent findings.

Visual direction: sophisticated scientific editorial artwork, softly lit 3D forms, tactile materials, controlled depth, restrained composition, and a clear central subject. Palette: warm ivory #fafbf7, forest green #173e35, sage #476c58, subtle pale lime #d2e7a9. Avoid generic clip art, stock robot heads, glowing cyberpunk brains, and dense text. No invented quantitative plots, diagnostic labels, clinical accuracy claims, numerical results, headings, logos, author names, journal names, or watermarks.

Deliver one 1600 × 900 WebP or PNG with an opaque warm ivory background. Keep the important subject within the central 65% so website card crops preserve it. Describe the finished image as an original conceptual illustration rather than a paper figure or experimental result.

Theme-specific composition:
Brain aging & vascular health: show a sculptural brain with delicate functional connections and subtle branching vascular structures. Surround it with a restrained arrangement of differently shaped translucent brain-network forms representing variation across people. Emphasize brain networks, aging, and vascular health without a generic demographic stock-photo collage.

Required publications for this theme:
- Intensive versus standard blood pressure control and overall brain small vessel disease burden: a post-hoc analysis of the SPRINT randomized clinical trial (2026). [Source paper](https://www.sciencedirect.com/science/article/pii/S2589537026003962). DOI: `10.1016/j.eclinm.2026.104143`.
- Derivation of machine learning brain aging biomarkers for a set of forty thousand functional connectomes (2026). [Source paper](https://www.sciencedirect.com/science/article/pii/S0361923026001012). DOI: `10.1016/j.brainresbull.2026.111815`.
```

### 03. Multimodal emotion & social AI

```text
I am Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. Create one original scientific editorial illustration for my academic research portfolio. Use the following publications as required conceptual references if you can access them. Do not recreate their figure layouts or imply the artwork comes from a paper. If the papers are inaccessible, use only the supplied theme description and titles; do not invent findings.

Visual direction: sophisticated scientific editorial artwork, softly lit 3D forms, tactile materials, controlled depth, restrained composition, and a clear central subject. Palette: warm ivory #fafbf7, forest green #173e35, sage #476c58, subtle pale lime #d2e7a9. Avoid generic clip art, stock robot heads, glowing cyberpunk brains, and dense text. No invented quantitative plots, diagnostic labels, clinical accuracy claims, numerical results, headings, logos, author names, journal names, or watermarks.

Deliver one 1600 × 900 WebP or PNG with an opaque warm ivory background. Keep the important subject within the central 65% so website card crops preserve it. Describe the finished image as an original conceptual illustration rather than a paper figure or experimental result.

Theme-specific composition:
Multimodal emotion & social AI: show two abstract human profiles in a conversational composition. Integrate a sculptural sound wave, understated face contours, and several soft translucent speech forms as complementary channels. Show relationships through elegant connections, with no readable words or exaggerated emotion emojis.

Required publications for this theme:
- GCE: An Audio-Visual Dataset for Group Cohesion and Emotion Analysis (2024). [Source paper](https://www.mdpi.com/2076-3417/14/15/6742). DOI: `10.3390/app14156742`.
- Residual Relation-Aware Attention Deep Graph-Recurrent Model for Emotion Recognition in Conversation (2024). [Source paper](https://ieeexplore.ieee.org/document/10378668). DOI: `10.1109/ACCESS.2023.3348518`.
- Cross-modality learning by exploring modality interactions for emotion reasoning (2023). [Source paper](https://ieeexplore.ieee.org/abstract/document/10145792). DOI: `10.1109/ACCESS.2023.3283597`.
- Deep Graph Fusion based Multimodal Evoked Expressions from Large-Scale Videos (2021). [Source paper](https://ieeexplore.ieee.org/document/9521910). DOI: `10.1109/ACCESS.2021.3107548`.
- Stress Analysis with Dimensions of Valence and Arousal in the Wild (2021). [Source paper](https://www.mdpi.com/2076-3417/11/11/5194). DOI: `10.3390/app11115194`.
- Multimodal approach of speech emotion recognition using multi-level multi-head fusion attention-based recurrent neural network (2020). [Source paper](https://ieeexplore.ieee.org/abstract/document/9050806). DOI: `10.1109/ACCESS.2020.2984368`.
```

### 04. Medical image analysis

```text
I am Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. Create one original scientific editorial illustration for my academic research portfolio. Use the following publications as required conceptual references if you can access them. Do not recreate their figure layouts or imply the artwork comes from a paper. If the papers are inaccessible, use only the supplied theme description and titles; do not invent findings.

Visual direction: sophisticated scientific editorial artwork, softly lit 3D forms, tactile materials, controlled depth, restrained composition, and a clear central subject. Palette: warm ivory #fafbf7, forest green #173e35, sage #476c58, subtle pale lime #d2e7a9. Avoid generic clip art, stock robot heads, glowing cyberpunk brains, and dense text. No invented quantitative plots, diagnostic labels, clinical accuracy claims, numerical results, headings, logos, author names, journal names, or watermarks.

Deliver one 1600 × 900 WebP or PNG with an opaque warm ivory background. Keep the important subject within the central 65% so website card crops preserve it. Describe the finished image as an original conceptual illustration rather than a paper figure or experimental result.

Theme-specific composition:
Medical image analysis: show an anatomically plausible stylized knee/bone structure with a translucent radiographic layer and a restrained regional segmentation overlay. Use separated layers to convey anatomy-guided analysis. Keep the image clearly illustrative, without labeling a region malignant or claiming it is a real patient scan.

Required publications for this theme:
- Enhancing U-Net with spatial-channel attention gate for abnormal tissue segmentation in medical imaging (2020). [Source paper](https://www.mdpi.com/2076-3417/10/17/5729). DOI: `10.3390/app10175729`.
- Regenerative semi-supervised bidirectional W-network-based knee bone tumor classification on radiographs guided by three-region bone segmentation (2019). [Source paper](https://ieeexplore.ieee.org/abstract/document/8880590). DOI: `10.1109/ACCESS.2019.2949125`.
```

### 05. Mobile sensing & intelligent interaction

```text
I am Ngoc-Huynh Ho, PhD, an Instructor at UT Health Science Center at San Antonio since May 2026. Create one original scientific editorial illustration for my academic research portfolio. Use the following publications as required conceptual references if you can access them. Do not recreate their figure layouts or imply the artwork comes from a paper. If the papers are inaccessible, use only the supplied theme description and titles; do not invent findings.

Visual direction: sophisticated scientific editorial artwork, softly lit 3D forms, tactile materials, controlled depth, restrained composition, and a clear central subject. Palette: warm ivory #fafbf7, forest green #173e35, sage #476c58, subtle pale lime #d2e7a9. Avoid generic clip art, stock robot heads, glowing cyberpunk brains, and dense text. No invented quantitative plots, diagnostic labels, clinical accuracy claims, numerical results, headings, logos, author names, journal names, or watermarks.

Deliver one 1600 × 900 WebP or PNG with an opaque warm ivory background. Keep the important subject within the central 65% so website card crops preserve it. Describe the finished image as an original conceptual illustration rather than a paper figure or experimental result.

Theme-specific composition:
Mobile sensing & intelligent interaction: show a refined smartphone with a simple footstep path and a softly rendered hand/depth-sensing interaction. Integrate motion and spatial estimation through layered forms and subtle trajectory cues. Avoid invented coordinates, device-brand logos, map labels, or numeric sensor readings.

Required publications for this theme:
- Real-time virtual mouse system using RGB-D images and fingertip detection (2021). [Source paper](https://link.springer.com/article/10.1007/s11042-020-10156-5). DOI: `10.1007/s11042-020-10156-5`.
- Real-time hand gesture spotting and recognition using RGB-D camera and 3D convolutional neural network (2020). [Source paper](https://www.mdpi.com/2076-3417/10/2/722). DOI: `10.3390/app10020722`.
- Nonparametric regression-based step-length estimation for arm-swing walking using a smartphone (2018). [Source paper](http://univagora.ro/jour/index.php/ijccc/article/view/3148). DOI: `10.15837/ijccc.2018.4.3148`.
- Step-detection and adaptive step-length estimation for pedestrian dead-reckoning at various walking speeds using a smartphone (2016). [Source paper](https://www.mdpi.com/1424-8220/16/9/1423). DOI: `10.3390/s16091423`.
- Impact of channel estimation error on the performance of relay selection in cognitive radio networks (2015). [Source paper](https://link.springer.com/article/10.1007/s11277-015-2717-3). DOI: `10.1007/s11277-015-2717-3`.
```

## Optional hero image prompt

```text
Create a wide conceptual editorial illustration for a trustworthy AI and human brain health researcher’s website. A translucent anatomical brain form in muted sage, with several subtly connected structures and softly lit translucent layers suggesting complementary neuroimaging and clinical information. Warm ivory background, forest green details, pale lime highlights, refined materials, natural studio lighting, ample negative space. The focus is human health and scientific understanding. No text, labels, robots, medical diagnosis, invented data, or claims of real imaging. Original illustration, 1600 × 1200.
```

## Image filenames and publication reference list

### 01. Dementia & trustworthy AI

Dementia & trustworthy AI: show a carefully rendered translucent brain beside two complementary layers suggesting brain imaging and clinical information. A subtle temporal sequence suggests disease progression; balanced symmetric visual elements suggest evaluation across populations. Keep this a conceptual representation; do not depict a proven treatment or invented predictions.

Target file: `assets/img/topics/dementia_trustworthyAI.jpg`

- Advancing fair and explainable machine learning for neuroimaging dementia pattern classification in multi-racial and multi-ethnic populations (2026). [Source paper](https://www.nature.com/articles/s41467-026-74515-w). DOI: `10.1038/s41467-026-74515-w`.
- Longitudinal Alzheimer's Disease Progression Prediction with Modality Uncertainty and Optimization of Information Flow (2025). [Source paper](https://ieeexplore.ieee.org/document/10702601). DOI: `10.1109/JBHI.2024.3472462`.
- Multimodal multitask learning for predicting MCI to AD conversion using stacked polynomial attention network and adaptive exponential decay (2023). [Source paper](https://www.nature.com/articles/s41598-023-37500-7). DOI: `10.1038/s41598-023-37500-7`.
- Predicting progression of Alzheimer's disease using forward-to-backward bi-directional network with integrative imputation (2022). [Source paper](https://www.sciencedirect.com/science/article/pii/S0893608022000946). DOI: `10.1016/j.neunet.2022.03.016`.
- Non-white matter tissue extraction and deep convolutional neural network for Alzheimer’s disease detection (2018). [Source paper](https://link.springer.com/article/10.1007/s00500-018-3421-5). DOI: `10.1007/s00500-018-3421-5`.

### 02. Brain aging & vascular health

Brain aging & vascular health: show a sculptural brain with delicate functional connections and subtle branching vascular structures. Surround it with a restrained arrangement of differently shaped translucent brain-network forms representing variation across people. Emphasize brain networks, aging, and vascular health without a generic demographic stock-photo collage.

Target file: `assets/img/topics/Brain_aging_vascular_health.jpg`

- Intensive versus standard blood pressure control and overall brain small vessel disease burden: a post-hoc analysis of the SPRINT randomized clinical trial (2026). [Source paper](https://www.sciencedirect.com/science/article/pii/S2589537026003962). DOI: `10.1016/j.eclinm.2026.104143`.
- Derivation of machine learning brain aging biomarkers for a set of forty thousand functional connectomes (2026). [Source paper](https://www.sciencedirect.com/science/article/pii/S0361923026001012). DOI: `10.1016/j.brainresbull.2026.111815`.

### 03. Multimodal emotion & social AI

Multimodal emotion & social AI: show two abstract human profiles in a conversational composition. Integrate a sculptural sound wave, understated face contours, and several soft translucent speech forms as complementary channels. Show relationships through elegant connections, with no readable words or exaggerated emotion emojis.

Target file: `assets/img/topics/Multimodal_emotion_social_AI.png`

- GCE: An Audio-Visual Dataset for Group Cohesion and Emotion Analysis (2024). [Source paper](https://www.mdpi.com/2076-3417/14/15/6742). DOI: `10.3390/app14156742`.
- Residual Relation-Aware Attention Deep Graph-Recurrent Model for Emotion Recognition in Conversation (2024). [Source paper](https://ieeexplore.ieee.org/document/10378668). DOI: `10.1109/ACCESS.2023.3348518`.
- Cross-modality learning by exploring modality interactions for emotion reasoning (2023). [Source paper](https://ieeexplore.ieee.org/abstract/document/10145792). DOI: `10.1109/ACCESS.2023.3283597`.
- Deep Graph Fusion based Multimodal Evoked Expressions from Large-Scale Videos (2021). [Source paper](https://ieeexplore.ieee.org/document/9521910). DOI: `10.1109/ACCESS.2021.3107548`.
- Stress Analysis with Dimensions of Valence and Arousal in the Wild (2021). [Source paper](https://www.mdpi.com/2076-3417/11/11/5194). DOI: `10.3390/app11115194`.
- Multimodal approach of speech emotion recognition using multi-level multi-head fusion attention-based recurrent neural network (2020). [Source paper](https://ieeexplore.ieee.org/abstract/document/9050806). DOI: `10.1109/ACCESS.2020.2984368`.

### 04. Medical image analysis

Medical image analysis: show an anatomically plausible stylized knee/bone structure with a translucent radiographic layer and a restrained regional segmentation overlay. Use separated layers to convey anatomy-guided analysis. Keep the image clearly illustrative, without labeling a region malignant or claiming it is a real patient scan.

Target file: `assets/img/topics/medical_image_analysis.jpg`

- Enhancing U-Net with spatial-channel attention gate for abnormal tissue segmentation in medical imaging (2020). [Source paper](https://www.mdpi.com/2076-3417/10/17/5729). DOI: `10.3390/app10175729`.
- Regenerative semi-supervised bidirectional W-network-based knee bone tumor classification on radiographs guided by three-region bone segmentation (2019). [Source paper](https://ieeexplore.ieee.org/abstract/document/8880590). DOI: `10.1109/ACCESS.2019.2949125`.

### 05. Mobile sensing & intelligent interaction

Mobile sensing & intelligent interaction: show a refined smartphone with a simple footstep path and a softly rendered hand/depth-sensing interaction. Integrate motion and spatial estimation through layered forms and subtle trajectory cues. Avoid invented coordinates, device-brand logos, map labels, or numeric sensor readings.

Target file: `assets/img/topics/Mobile_sensing_intelligent_interaction.jpg`

- Real-time virtual mouse system using RGB-D images and fingertip detection (2021). [Source paper](https://link.springer.com/article/10.1007/s11042-020-10156-5). DOI: `10.1007/s11042-020-10156-5`.
- Real-time hand gesture spotting and recognition using RGB-D camera and 3D convolutional neural network (2020). [Source paper](https://www.mdpi.com/2076-3417/10/2/722). DOI: `10.3390/app10020722`.
- Nonparametric regression-based step-length estimation for arm-swing walking using a smartphone (2018). [Source paper](http://univagora.ro/jour/index.php/ijccc/article/view/3148). DOI: `10.15837/ijccc.2018.4.3148`.
- Step-detection and adaptive step-length estimation for pedestrian dead-reckoning at various walking speeds using a smartphone (2016). [Source paper](https://www.mdpi.com/1424-8220/16/9/1423). DOI: `10.3390/s16091423`.
- Impact of channel estimation error on the performance of relay selection in cognitive radio networks (2015). [Source paper](https://link.springer.com/article/10.1007/s11277-015-2717-3). DOI: `10.1007/s11277-015-2717-3`.

## Images currently used on the website

The supplied images in `assets/img/topics/` are connected to the website:

| Website placement | Image |
| --- | --- |
| Main website visual / website context and visual direction | `assets/img/topics/Research_topic.png` |
| Dementia & trustworthy AI research note | `assets/img/topics/dementia_trustworthyAI.jpg` |
| Brain aging & vascular health research note | `assets/img/topics/Brain_aging_vascular_health.jpg` |
| Multimodal emotion & social AI research note | `assets/img/topics/Multimodal_emotion_social_AI.png` |
| Medical image analysis research note | `assets/img/topics/medical_image_analysis.jpg` |
| Mobile sensing & intelligent interaction research note | `assets/img/topics/Mobile_sensing_intelligent_interaction.jpg` |

`Research_topic.png` replaces the inline brain diagram inside `.hero-science` in `index.html`. Each research-note image also appears on its project card. Cards show the complete figure without cropping; note panels retain each figure's natural aspect ratio.

To replace an image later, update its `image`, `image_width`, `image_height`, `image_alt`, and `image_caption` in `data/topics.json`, the matching `initial-topics` JSON in `index.html`, and its static project-card image path. Main website visual replacements are made directly in `index.html`.

The current research-note captions describe author-supplied figures. Add verified paper attribution and figure-specific license credit when available; source titles and license details have not been inferred from filenames. For generated artwork, use “Original AI-generated conceptual illustration; not an experimental result.” These image changes leave the headshot and collaborator portraits in place.
