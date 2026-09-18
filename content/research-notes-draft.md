# 1. Dementia & Trustworthy AI

**Suggested file:** `dementia-trustworthy-ai.md`

# Can dementia AI be accurate—and fair?

**From predicting disease progression to understanding why neuroimaging models behave differently across populations, this research asks a broader question than whether an AI model can make a correct prediction: can we understand when it works, why it works, and for whom it works?**

Dementia research presents machine learning with an unusually difficult problem. The disease develops over years. Patients are observed at irregular intervals. MRI, clinical assessments, cognitive scores, and other biomarkers provide different pieces of information. Some measurements are missing. And the populations represented in research datasets do not always resemble the populations in which models may eventually be used.

That means a high-performing model is only the beginning.

A clinically meaningful computational framework must also confront **progression, missing information, multimodal uncertainty, population differences, and interpretability**.

My research in this area has evolved along that path—from detecting disease-related patterns, to modeling longitudinal progression, and more recently to examining fairness and explainability across diverse populations.

> ### Research at a glance
>
> * Dementia models can show meaningful performance differences across racial and ethnic populations even after sample size, demographics, and imaging-site effects are carefully controlled.
> * Longitudinal modeling benefits from treating missing observations and uncertain modalities as part of the learning problem rather than simply removing incomplete cases.
> * Trustworthy dementia AI requires more than accuracy: generalizability, error patterns, interpretability, and population-level performance all matter.

## When the same model does not behave the same way for everyone

One of the most important questions in medical AI is deceptively simple:

**If a model performs well overall, does it also perform comparably across populations?**

Our 2026 collaborative study in *Nature Communications*, [*Advancing fair and explainable machine learning for neuroimaging dementia pattern classification in multi-racial and multi-ethnic populations*](https://doi.org/10.1038/s41467-026-74515-w), examined this question using structural MRI data from multiple cohorts.

Rather than assuming that an observed performance gap simply reflects unequal sample sizes, the study constructed controlled, group-balanced evaluations involving non-Hispanic White, non-Hispanic African American, and Hispanic participants. Participants were matched across important characteristics, and imaging features were harmonized to reduce variation associated with acquisition site and demographic differences.

Yet performance discrepancies remained.

This is an important distinction. Increasing representation is essential, but the results suggest that **sample imbalance alone does not explain every difference in model behavior**.

The study therefore moved beyond asking only, “How accurate is the classifier?” It also examined differences in false-positive and false-negative rates between populations and evaluated methods designed to reduce those discrepancies.

A proposed approach, **RegAlign**, combines adaptation to a smaller target population with class-aware learning and alignment between populations. The goal is not to optimize fairness in isolation, because reducing a performance gap while substantially degrading the model would create another problem. Instead, the work treats predictive performance and inter-group discrepancy as objectives that must be considered together.

That trade-off is especially relevant in medicine. A false positive and a false negative are not abstract numbers; they represent different kinds of errors, and their frequencies may differ across populations.

## Explainability changes the question again

Fairness tells us **where performance differs**.

Explainability can help us investigate **what the model is using when those differences occur**.

The *Nature Communications* study used SHAP-based interpretation together with an independent neuroimaging meta-analysis to examine the contribution of individual brain regions. Many influential regions overlapped with structures commonly associated with Alzheimer-related neurodegeneration, including medial temporal and limbic regions.

But the strength and pattern of feature contributions were not identical across populations.

That observation is important because model explanations themselves may not automatically generalize. An explanation generated from one population should not be assumed to describe how the same model reaches predictions in another.

For trustworthy AI, interpretation therefore becomes more than producing an attractive feature-importance map. The deeper question is whether the biological patterns learned by a model remain stable under changes in population and dataset.

![Dementia classification workflow with cohort design, cross-validation, discrepancy mitigation, and model interpretation.](assets/img/topics/dementia_trustworthyAI.jpg)

*Dementia classification workflow with cohort design, cross-validation, discrepancy mitigation, and model interpretation. Figure supplied by the author; related publications are listed below.*

## Before fairness comes another challenge: time

Dementia is not a single event. It is a trajectory.

A patient may move from cognitively normal aging to mild cognitive impairment and, for some individuals, later to dementia. Measurements collected at one visit therefore provide only one frame of a much longer story.

The 2025 *IEEE Journal of Biomedical and Health Informatics* study, [*Longitudinal Alzheimer's Disease Progression Prediction with Modality Uncertainty and Optimization of Information Flow*](https://doi.org/10.1109/JBHI.2024.3472462), focused on this longitudinal setting.

Multimodal longitudinal data create two linked problems. First, the available modalities may differ between visits or participants. Second, a recurrent model must decide what information from earlier visits should be preserved as the sequence evolves.

The study approaches modality uncertainty by mapping complementary inputs into a shared representation and explicitly modeling interactions between them. It also introduces an auxiliary mechanism to improve how information flows through recurrent gates over time.

The underlying idea is intuitive: **a model following disease progression should not treat every measurement as equally certain, nor should it forget clinically relevant history simply because the sequence becomes longer.**

## Learning from incomplete patient histories

Missing data had already been a central challenge in our earlier longitudinal work.

The 2022 *Neural Networks* study, [*Predicting progression of Alzheimer's disease using forward-to-backward bi-directional network with integrative imputation*](https://doi.org/10.1016/j.neunet.2022.03.016), modeled longitudinal records from the TADPOLE cohort while jointly addressing several tasks.

Instead of separating missing-value imputation from disease prediction, the framework connected them.

A bidirectional strategy examined temporal relationships in both directions, while integrative imputation combined statistical information with the evolving structure of the longitudinal sequence. The model then used these representations to forecast clinical status and imaging-related measurements.

The broader lesson remains relevant: **missingness is part of the data-generating process**. Simply discarding incomplete longitudinal records can remove valuable patients and potentially alter the study population. Modeling incomplete histories explicitly provides another way to use the available information while acknowledging that it is incomplete.

## From “what stage?” to “when might progression occur?”

A related question appeared in our 2023 *Scientific Reports* work, [*Multimodal multitask learning for predicting MCI to AD conversion using stacked polynomial attention network and adaptive exponential decay*](https://doi.org/10.1038/s41598-023-37500-7).

Using the ADNI cohort, the study considered two tasks simultaneously:

**What stage of mild cognitive impairment is represented?**

and

**When might conversion to Alzheimer’s disease occur?**

Clinical measurements and MRI-derived radiomic features were processed through a stacked polynomial attention mechanism and combined through an adaptive exponential-decay strategy.

In the study's evaluation of 249 early-MCI and 427 late-MCI participants, the multimodal framework reported a **c-index of 0.85 for conversion-time prediction and 83.19% accuracy for MCI-stage classification**.

Those results belong specifically to that ADNI evaluation and should not be interpreted as a universal clinical performance estimate. Their value is in demonstrating how classification and time-to-event modeling can be learned together rather than treated as unrelated questions.

## Where the research started

Earlier work approached the problem from a more fundamental imaging perspective.

The 2018 *Soft Computing* study, [*Non-white matter tissue extraction and deep convolutional neural network for Alzheimer's disease detection*](https://doi.org/10.1007/s00500-018-3421-5), investigated MRI and PET imaging for classification among normal control, mild cognitive impairment, and Alzheimer's disease groups.

That work belongs to an earlier generation of the research program: identify useful imaging representations and improve disease classification.

The later studies progressively expanded the question.

Classification became progression.

Single visits became longitudinal histories.

Complete data became uncertain and missing modalities.

Overall performance became population-specific performance.

And prediction became something that also needed to be explained.

## What comes next?

The most interesting future direction is not simply a larger classifier.

It is a model that can learn from structural MRI, functional imaging, molecular biomarkers, plasma measurements, longitudinal clinical histories, and potentially other sources while still allowing us to understand **which information drives a prediction and whether that behavior remains reliable across populations**.

That raises difficult questions.

How should uncertainty propagate through a multimodal model?

How stable are explanations across cohorts?

Can a foundation model learn reusable neuroimaging representations without amplifying the demographic structure of its training data?

And how should fairness be evaluated when disease prevalence, data availability, imaging protocols, and clinical context all vary?

These questions push dementia AI away from a narrow competition over accuracy and toward a more demanding goal:

**building models whose behavior we can characterize, challenge, and understand.**

### Watch the demo

[Alzheimer's disease detection demo →](https://www.youtube.com/watch?v=5XkSoCVYRNA)

## Related publications

1. **Ho NH, Charisis S, Honnorat N, et al.** *Advancing fair and explainable machine learning for neuroimaging dementia pattern classification in multi-racial and multi-ethnic populations.* Nature Communications. 2026. [DOI](https://doi.org/10.1038/s41467-026-74515-w)

2. **Dao DP, Yang HJ, Kim J, Ho NH.** *Longitudinal Alzheimer's Disease Progression Prediction with Modality Uncertainty and Optimization of Information Flow.* IEEE Journal of Biomedical and Health Informatics. 2025. [DOI](https://doi.org/10.1109/JBHI.2024.3472462)

3. **Ho NH, Yang HJ, Kim J.** *Multimodal multitask learning for predicting MCI to AD conversion using stacked polynomial attention network and adaptive exponential decay.* Scientific Reports. 2023. [DOI](https://doi.org/10.1038/s41598-023-37500-7)

4. **Ho NH, Yang HJ, Kim J, Dao DP, Park HR, Pant S.** *Predicting progression of Alzheimer's disease using forward-to-backward bi-directional network with integrative imputation.* Neural Networks. 2022. [DOI](https://doi.org/10.1016/j.neunet.2022.03.016)

5. **Vu TD, Ho NH, Yang HJ, Kim J, Song HC.** *Non-white matter tissue extraction and deep convolutional neural network for Alzheimer's disease detection.* Soft Computing. 2018. [DOI](https://doi.org/10.1007/s00500-018-3421-5)

---

# 2. Brain Aging & Vascular Health

**Suggested file:** `brain-aging-vascular-health.md`

# How old is the brain?

**Brain aging cannot be summarized by a birthday. Functional networks, vascular injury, cognition, and cardiovascular health provide different windows into how the brain changes over time. My collaborative research explores two of those windows: MRI markers of cerebral small-vessel disease and machine-learning estimates of functional brain aging.**

Two people can be the same chronological age and have very different brains.

One may show relatively preserved functional organization. Another may have a greater burden of vascular injury. A third may show subtle changes that become visible only when thousands of connections across the brain are considered together.

That is why “brain age” is an appealing idea—but also a complicated one.

There is no single biological clock inside the brain. Instead, different imaging modalities capture different dimensions of aging.

> ### Research at a glance
>
> * A post-hoc analysis of the randomized SPRINT trial found less progression of an MRI-derived global small-vessel-disease burden under intensive versus standard systolic blood-pressure treatment.
> * Functional brain age can be estimated from patterns of connectivity rather than brain anatomy alone.
> * Large neuroimaging datasets are important not only for model accuracy but also for understanding when complex nonlinear models genuinely outperform simpler approaches.

## Blood pressure leaves a footprint in the brain

The most clinically direct study in this research theme comes from the 2026 *eClinicalMedicine* paper, [*Intensive versus standard blood pressure control and overall brain small vessel disease burden: a post-hoc analysis of the SPRINT randomized clinical trial*](https://doi.org/10.1016/j.eclinm.2026.104143).

Cerebral small-vessel disease does not appear as one single MRI abnormality.

Instead, vascular injury may be reflected through several imaging characteristics. The study combined complementary MRI measurements—including periventricular white-matter hyperintensities, white-matter free water, and basal-ganglia perivascular spaces—into an overall small-vessel-disease burden.

The parent SPRINT trial randomized participants to different systolic blood-pressure targets. This post-hoc neuroimaging analysis asked whether those treatment strategies were also associated with different trajectories of vascular brain injury.

Participants assigned to the intensive systolic blood-pressure target showed **less progression in the global MRI-derived small-vessel-disease burden** than those receiving standard treatment.

That result is important because it shifts the perspective from looking at one imaging lesion at a time to asking whether several manifestations of vascular brain injury can be summarized as a broader latent burden.

At the same time, the distinction between the randomized trial and the post-hoc imaging analysis matters. The global SVD measure was a secondary, retrospectively analyzed imaging outcome. It provides meaningful evidence, but it should be interpreted within that study design rather than generalized beyond it automatically.

![Functional connectome datasets and transformations used for brain-age prediction and brain-health analysis.](assets/img/topics/Brain_aging_vascular_health.jpg)

*Functional connectome datasets and transformations used for brain-age prediction and brain-health analysis. Figure supplied by the author; related publications are listed below.*

## A different view of aging: the functional connectome

Vascular injury is one dimension of brain health.

Functional organization is another.

The 2026 *Brain Research Bulletin* study, [*Derivation of machine learning brain aging biomarkers for a set of forty thousand functional connectomes*](https://doi.org/10.1016/j.brainresbull.2026.111815), asks whether patterns of resting-state functional connectivity can be used to estimate age at very large scale.

A **functional connectome** is a mathematical representation of relationships among brain regions. During resting-state functional MRI, spontaneous activity fluctuates over time. Regions whose signals vary together can be considered functionally connected.

With hundreds of brain regions, the resulting connectivity matrix contains a very large number of relationships.

That creates an interesting machine-learning problem.

A connectome is not simply a long list of independent variables. Its mathematical structure matters.

The study assembled more than **40,000 functional connectomes** from four major cohorts—the Framingham Heart Study, Human Connectome Project, Multi-Ethnic Study of Atherosclerosis, and UK Biobank—and compared different connectome transformations and machine-learning strategies.

One important finding was that a transformation motivated by **Bures–Wasserstein geometry** improved age prediction.

The name sounds abstract, but the intuition is useful: instead of pretending every connection in a covariance-like brain network behaves as an ordinary independent number, the transformation better respects the underlying geometry of these structured matrices.

## Bigger models do not automatically mean better biomarkers

Another result is especially relevant in the current era of increasingly complex AI.

The study found that nonlinear predictors trained with fewer than roughly 2,000 connectomes did not necessarily outperform simpler regularized linear models.

That is a useful reminder.

Complexity is valuable when the amount and structure of the data support it. Without sufficient sample size, a sophisticated model may simply have more opportunities to fit noise.

Large-scale datasets make it possible to investigate that transition empirically rather than assuming that deep or nonlinear models will always win.

## From predicted age to brain health

Once a model estimates a person's age from functional connectivity, the difference between predicted brain age and chronological age can be treated as a candidate **functional brain-aging biomarker**.

If a 65-year-old person's connectivity resembles the patterns the model typically observes in older individuals, the brain-age estimate may be higher than chronological age.

But this difference should not be interpreted literally as “the brain is exactly seven years older.”

It is a statistical phenotype.

Its value depends on whether it relates meaningfully to cognition, health, disease, and other biological characteristics.

The functional-connectome study found associations between derived brain-aging measures and multiple cognitive and health markers, motivating their further study as indicators of functional brain health.

## Two papers, two very different meanings of brain aging

These studies should not be collapsed into one biomarker.

The SPRINT analysis asks about **vascular brain injury and blood-pressure treatment**.

The connectome study asks whether **functional organization contains an age-related signature that machine learning can quantify**.

One originates from a randomized clinical trial and MRI markers of small-vessel disease.

The other originates from large observational neuroimaging cohorts and predictive modeling.

Their value lies partly in being different.

Aging affects vessels, tissue, networks, cognition, and many other systems. No single measurement is likely to describe the full process.

## Toward multidimensional models of brain health

This motivates a broader direction for neuroimaging research.

Instead of asking whether there is one perfect brain-age number, we can ask whether multiple complementary markers describe different axes of brain health.

A structural MRI phenotype might capture neurodegeneration.

A functional connectome may characterize network organization.

Small-vessel-disease measures may describe vascular injury.

Plasma biomarkers may provide molecular information.

Cognition supplies behavioral context.

The scientific opportunity is to learn how these measurements interact—without erasing their distinct biological meanings.

The long-term goal is therefore not simply to make a person's brain “one number older or younger.”

It is to build quantitative representations that help us investigate **how different biological processes shape brain aging, where those processes converge, and where they remain distinct.**

## Related publications

1. **Charisis S, Pajewski NM, Price LR, Ho NH, et al.** *Intensive versus standard blood pressure control and overall brain small vessel disease burden: a post-hoc analysis of the SPRINT randomized clinical trial.* eClinicalMedicine. 2026. [DOI](https://doi.org/10.1016/j.eclinm.2026.104143)

2. **Honnorat N, Wang D, Ho NH, et al.** *Derivation of machine learning brain aging biomarkers for a set of forty thousand functional connectomes.* Brain Research Bulletin. 2026. [DOI](https://doi.org/10.1016/j.brainresbull.2026.111815)

---

# 3. Multimodal Emotion & Social AI

**Suggested file:** `multimodal-emotion-social-ai.md`

# Emotion is more than a face

**A sentence can sound positive while a speaker's voice suggests frustration. A smile can coexist with tension. And in a group conversation, one person's expression may make sense only after seeing how everyone else responds. This research explores how AI can learn those relationships rather than treating human signals in isolation.**

Imagine hearing someone say:

*"That's great."*

The words appear positive.

But what if the voice is flat?

What if the speaker avoids eye contact?

What if the previous speaker has just delivered bad news?

Emotion is not encoded in one channel. Humans combine language, voice, facial behavior, timing, social context, and prior interactions almost automatically.

For artificial intelligence, doing the same is considerably harder.

> ### Research at a glance
>
> * Multimodal emotion recognition is not simply about concatenating audio, visual, and language features; the relationships between those modalities matter.
> * Graph models provide a natural way to represent relationships among speakers, utterances, modalities, and time.
> * Moving from individual emotion to group emotion and cohesion changes the scientific question: the social system itself becomes the object of analysis.

## Conversations are networks, not isolated sentences

The 2024 *IEEE Access* study, [*Residual Relation-Aware Attention Deep Graph-Recurrent Model for Emotion Recognition in Conversation*](https://doi.org/10.1109/ACCESS.2023.3348518), focuses on emotion recognition in conversation.

A conversation has structure.

Speaker A responds to Speaker B.

A later statement refers back to an earlier one.

The emotional meaning of an utterance may depend on whether the same speaker was previously angry, whether another participant changed tone, or what happened several turns earlier.

The study represents a conversation as a **graph**.

In simple terms, a graph consists of nodes and connections. Here, utterances can be represented as nodes, while connections describe relationships among them—including interactions from the same speaker and across different speakers.

That allows the model to reason about context rather than judging every sentence independently.

Attention mechanisms then help determine which relationships deserve more weight for a particular prediction.

The broader idea is straightforward: **emotion lives partly in relationships.**

## What happens when part of the signal disappears?

The 2023 *IEEE Access* study, [*Cross-modality learning by exploring modality interactions for emotion reasoning*](https://doi.org/10.1109/ACCESS.2023.3283597), pushes that idea further.

In real situations, the most obvious emotional signal is not always available.

A face may be hidden.

Speech may be inaudible.

The person of interest may not even be directly visible.

Humans can still infer something from context: what others are doing, what is happening in the scene, how the conversation unfolds, or which signals accompany one another.

Rather than thinking of audio, visual information, and language as independent feature vectors, cross-modality learning examines **interactions between representations**.

This matters because complementary information is useful precisely when one modality contains something another does not.

## From feature fusion to graph fusion

Earlier work explored a related problem through evoked emotional expressions.

The 2021 *IEEE Access* paper, [*Deep Graph Fusion Based Multimodal Evoked Expressions From Large-Scale Videos*](https://doi.org/10.1109/ACCESS.2021.3107548), considers the relationship between audiovisual content and the expressions it evokes in viewers.

Here again, the interesting part is not merely having two modalities.

It is modeling how their representations relate.

Graph-based fusion provides a way of constructing those relationships explicitly, allowing information from different audiovisual sources to interact before a final prediction is made.

This line of work reflects a recurring theme across my research: **multimodal learning becomes more powerful when the model learns structure between information sources rather than simply stacking them together.**

## Attention asks: what should the model listen to?

Our 2020 *IEEE Access* work, [*Multimodal Approach of Speech Emotion Recognition Using Multi-Level Multi-Head Fusion Attention-Based Recurrent Neural Network*](https://doi.org/10.1109/ACCESS.2020.2984368), explored multimodal speech-emotion recognition using attention-based fusion.

Attention can be understood as a learned weighting process.

If a segment of speech contains a particularly informative vocal pattern, the model can assign that representation greater importance. Multiple attention heads allow different parts of the model to focus on different relationships.

This is especially useful in emotion recognition because emotional evidence is rarely distributed uniformly across a recording.

Some moments matter more than others.

Some modalities are more informative for one example than for another.

The goal is therefore not only to collect more signals, but to learn **which signals matter, at which level, and in which context**.

## From individuals to groups

![Audio-visual feature extraction and attention-based fusion for group emotion and cohesion analysis.](assets/img/topics/Multimodal_emotion_social_AI.png)

*Audio-visual feature extraction and attention-based fusion for group emotion and cohesion analysis. Figure supplied by the author; related publications are listed below.*

Most emotion-recognition systems focus on an individual.

But many meaningful human behaviors occur in groups.

The 2024 *Applied Sciences* paper, [*GCE: An Audio-Visual Dataset for Group Cohesion and Emotion Analysis*](https://doi.org/10.3390/app14156742), shifts the unit of analysis from a single person to the group itself.

The GCE dataset contains **1,029 30-second video segments** drawn from conversational settings such as interviews, meetings, discussions, and debates.

Psychology graduate students annotated the segments for group emotion—positive, neutral, or negative—and cohesion on a seven-level scale.

Visual and audio representations were then combined through multi-head attention to establish baseline models for studying the two tasks.

Group cohesion is particularly interesting because it is not reducible to whether every individual looks happy.

A cohesive group may disagree.

A positive group may not necessarily be highly coordinated.

The relationships among participants become part of the phenomenon being measured.

## Emotion is not the same as stress

A second *Applied Sciences* study, [*Stress Analysis with Dimensions of Valence and Arousal in the Wild*](https://doi.org/10.3390/app11115194), illustrates why affective-computing tasks also need to remain conceptually distinct.

The SADVAW dataset examined apparent stress together with **valence**—roughly, how positive or negative an affective state appears—and **arousal**, or the level of activation.

The dataset contains 1,236 clips from 41 Korean movies with annotations spanning multiple levels of stress, valence, and arousal.

This is not the same task as conversation emotion recognition or group cohesion.

The distinction matters.

Affect is multidimensional, and datasets operationalize it differently. Combining all such labels under a generic word like “emotion” can hide substantial differences in what models are actually learning.

## The next challenge: multimodal AI that understands context

Modern multimodal models can process increasingly rich combinations of text, image, audio, and video.

But adding modalities is not the same as understanding interactions.

For social AI, the difficult questions remain relational:

Who is responding to whom?

Which signal changes the interpretation of another?

When do modalities disagree?

How should the model behave when one channel is missing?

And can the system distinguish an individual's affect from the emotional dynamics of the group?

Those questions are likely to become even more important as multimodal foundation models move from static inputs toward continuous human interaction.

The goal is not to make an AI system claim that it can “read people's minds.”

It is much more concrete:

**to build representations that capture the observable relationships among signals, people, and context—and to be precise about what those representations can and cannot tell us.**

## Related publications

1. **Duong AQ, Ho NH, Pant S, Kim S, Kim SH, Yang HJ.** *Residual Relation-Aware Attention Deep Graph-Recurrent Model for Emotion Recognition in Conversation.* IEEE Access. 2024. [DOI](https://doi.org/10.1109/ACCESS.2023.3348518)

2. **Tran TD, Ho NH, Pant S, Yang HJ, Kim SH, Lee G.** *Cross-modality learning by exploring modality interactions for emotion reasoning.* IEEE Access. 2023. [DOI](https://doi.org/10.1109/ACCESS.2023.3283597)

3. **Ho NH, Yang HJ, Kim SH, Lee G, Yoo SB.** *Deep Graph Fusion based Multimodal Evoked Expressions from Large-Scale Videos.* IEEE Access. 2021. [DOI](https://doi.org/10.1109/ACCESS.2021.3107548)

4. **Ho NH, Yang HJ, Kim SH, Lee G.** *Multimodal approach of speech emotion recognition using multi-level multi-head fusion attention-based recurrent neural network.* IEEE Access. 2020. [DOI](https://doi.org/10.1109/ACCESS.2020.2984368)

5. **Lim E, Ho NH, Pant S, et al.** *GCE: An Audio-Visual Dataset for Group Cohesion and Emotion Analysis.* Applied Sciences. 2024. [DOI](https://doi.org/10.3390/app14156742)

6. **Tran TD, Kim J, Ho NH, et al.** *Stress Analysis with Dimensions of Valence and Arousal in the Wild.* Applied Sciences. 2021. [DOI](https://doi.org/10.3390/app11115194)

---

# 4. Medical Image Analysis

**Suggested file:** `medical-image-analysis.md`

# Teaching AI where to look

**Medical-image classification becomes especially difficult when the abnormal region is small, labels are scarce, and much of an image contains anatomy unrelated to the diagnostic question. My research in medical image analysis explores a simple but powerful idea: before asking a model what an image means, it can help to teach it where meaningful anatomy is located.**

A radiograph may contain thousands or millions of pixels.

Only a fraction may describe the abnormality of interest.

That creates a fundamental machine-learning problem.

A classifier can technically learn directly from the entire image, but with limited training data it may spend much of its capacity modeling irrelevant structure—or worse, learn shortcuts that correlate with a label without representing the anatomy we actually care about.

Segmentation offers another route.

First identify meaningful regions.

Then use those representations to support the downstream task.

> ### Research at a glance
>
> * Anatomical segmentation can reduce irrelevant image content before classification.
> * Semi-supervised reconstruction provides an additional learning signal when diagnostic labels are limited.
> * Spatial and channel attention address complementary questions: **where** is useful information located, and **which feature representations** are most useful?

## Segment first, classify second

The 2019 *IEEE Access* study, [*Regenerative Semi-Supervised Bidirectional W-Network-Based Knee Bone Tumor Classification on Radiographs Guided by Three-Region Bone Segmentation*](https://doi.org/10.1109/ACCESS.2019.2949125), investigated knee-bone tumor classification from radiographs.

The central idea was not to immediately send the entire radiograph into a classifier.

Instead, the system first separated three major anatomical regions—the **femur, tibia, and fibula**.

That anatomical information was then incorporated into a broader learning architecture for classifying radiographs as normal, benign, or malignant.

The three-region bone-segmentation component achieved a mean Dice score of **98.06%** in the study's evaluation.

When the segmented regions were used for the single-step normal/benign/malignant classification strategy, the reported mean classification accuracy was **85.23%**.

These measurements describe different tasks and should not be conflated: Dice evaluates spatial overlap in segmentation, whereas classification accuracy evaluates diagnostic-category predictions.

That distinction is important because a good segmentation does not automatically guarantee a good diagnosis.

It simply gives the downstream model a more focused representation.

![Bidirectional network architecture showing reconstruction, merged representations, and classification for medical images.](assets/img/topics/medical_image_analysis.jpg)

*Bidirectional network architecture showing reconstruction, merged representations, and classification for medical images. Figure supplied by the author; related publications are listed below.*

## Why a W-network?

The architecture also incorporated reconstruction through a bidirectional W-shaped network.

Reconstruction introduces another question during training:

**Can the model preserve enough information about the image to recreate meaningful structure?**

That task provides an additional source of supervision.

This is particularly relevant when class labels are limited. Medical annotations can be expensive because they may require expert review, while unlabeled or weakly labeled images can be more abundant.

Semi-supervised learning attempts to use that imbalance productively.

Instead of learning only from the final diagnostic labels, the system can also learn structure from the images themselves.

The goal is not to replace clinical labels, but to extract a stronger representation from the available data before using those labels for classification.

## Segmentation has its own problem: not every feature deserves to pass through

A second project approaches medical-image analysis from the segmentation side.

The 2020 *Applied Sciences* study, [*Enhancing U-Net with spatial-channel attention gate for abnormal tissue segmentation in medical imaging*](https://doi.org/10.3390/app10175729), asks what information should flow through a segmentation network.

U-Net became widely used in biomedical imaging partly because of its **skip connections**.

As an image moves through the encoder, its representation becomes increasingly abstract. Spatial detail can be lost. Skip connections send higher-resolution information directly from encoder layers to corresponding decoder layers so that the final segmentation can recover precise boundaries.

But there is a catch:

not everything carried by a skip connection is useful.

## Where—and what—should the network attend to?

The study introduced a **spatial-channel attention gate**.

The two parts answer different questions.

**Spatial attention:** Where in the image is the relevant information?

**Channel attention:** Which types of learned feature are most useful?

Combining them allows the network to selectively emphasize information before passing encoder features into the decoder.

The method was evaluated across several medical-imaging settings, including polyp, lung-tumor, and brain-tumor segmentation.

On the CVC-ClinicDB evaluation described in the paper, the spatial-channel attention approach achieved a Dice score of **71.72%** in the attention-gate comparison, compared with **65.93%** for the baseline U-Net.

But the broader contribution is not the six-point difference alone.

It is the architectural idea that a skip connection does not have to be an indiscriminate pipe.

It can itself become a learned decision about which information deserves to move forward.

## Segmentation and classification solve different problems

These two projects are closely related, but they should not be presented as the same task.

The knee-radiograph study uses segmentation to **guide classification**.

The spatial-channel attention study improves **segmentation itself**.

In the first case, anatomical localization is a step toward predicting a diagnostic category.

In the second, the predicted region is the endpoint being evaluated.

That distinction becomes especially important when reading medical-AI results. A high Dice coefficient, classification accuracy, sensitivity, or AUC each answers a different question.

No single number summarizes the entire system.

## Why this idea still matters

Large foundation models are rapidly changing medical imaging.

Yet the underlying problem has not disappeared.

A model still needs to distinguish relevant anatomy from nuisance information.

It still needs to learn from datasets in which labels may be limited or inconsistent.

And researchers still need to understand whether performance comes from biologically meaningful structures or from shortcuts hidden in the image.

Modern self-supervised and foundation-model approaches offer new tools for representation learning, but segmentation and attention remain valuable precisely because they introduce structure into the learning problem.

They ask the model not merely:

**What is this image?**

but also:

**Which region supports that decision?**

That is a much more useful question for the next generation of interpretable medical-imaging systems.

### Watch the demo

[Bone tumor detection demo →](https://www.youtube.com/watch?v=w9sntPA24XQ)

## Related publications

1. **Ho NH, Yang HJ, Kim SH, Jung ST, Joo SD.** *Regenerative semi-supervised bidirectional W-network-based knee bone tumor classification on radiographs guided by three-region bone segmentation.* IEEE Access. 2019. [DOI](https://doi.org/10.1109/ACCESS.2019.2949125)

2. **Khanh TLB, Dao DP, Ho NH, et al.** *Enhancing U-Net with spatial-channel attention gate for abnormal tissue segmentation in medical imaging.* Applied Sciences. 2020. [DOI](https://doi.org/10.3390/app10175729)

---

# 5. Mobile Sensing & Intelligent Interaction

**Suggested file:** `mobile-sensing-intelligent-interaction.md`

# From footsteps to fingertips

**A smartphone accelerometer, a depth camera, and a wireless receiver appear to have little in common. Yet they share a computational challenge: useful information must be recovered from measurements that are noisy, incomplete, and constantly changing. This early line of my research explored how adaptive models can turn imperfect signals into estimates and interactions people can actually use.**

Consider something as ordinary as walking down a hallway with a phone.

GPS may be unavailable indoors.

The phone measures acceleration, but every step is different.

Walking faster changes step length.

Swinging the phone changes its motion.

Sensor noise adds fluctuations unrelated to movement.

And small errors accumulate with every step.

Estimating a person's trajectory from those signals is an example of **pedestrian dead reckoning**: determining movement incrementally from sensor measurements rather than continuously relying on an external positioning system.

It sounds simple.

Count the steps. Estimate their length. Add them together.

The difficult part is that neither the step nor its length is perfectly known.

> ### Research at a glance
>
> * Pedestrian dead reckoning improves when step detection and step-length estimation adapt to how a person is actually moving.
> * RGB-D sensing combines appearance and depth, making hand and fingertip tracking more robust to challenging visual conditions.
> * Across localization, gesture recognition, and wireless communication, uncertainty in measurements is not an exception—it is part of the engineering problem.

## A smartphone as a navigation sensor

Our 2016 *Sensors* study, [*Step-Detection and Adaptive Step-Length Estimation for Pedestrian Dead-Reckoning at Various Walking Speeds Using a Smartphone*](https://doi.org/10.3390/s16091423), examined walking-distance estimation using smartphone acceleration signals.

A fixed step length is convenient.

It is also unrealistic.

The same person takes different steps when walking slowly, normally, or quickly.

The study therefore combined signal smoothing, step-detection rules, and an **adaptive step-length estimator** based partly on walking speed.

A Fast Fourier Transform–based filtering step was used to reduce unwanted components of the acceleration signal before individual steps were identified.

The important idea is adaptation.

Instead of assuming that one calibration works for every walking condition, the estimator changes with the movement pattern being observed.

## What if the phone is moving too?

The problem becomes more difficult when the smartphone itself swings with the user's arm.

The 2018 study, [*Nonparametric regression-based step-length estimation for arm-swing walking using a smartphone*](https://doi.org/10.15837/ijccc.2018.4.3148), addressed that setting.

Arm swinging changes the acceleration signal measured by the phone, meaning that the sensor records a combination of body locomotion and device motion.

The study modeled step length using relationships involving walking speed and acceleration variability.

Conceptually, this reflects a broader lesson in mobile sensing:

**the sensor is not observing the phenomenon from a fixed laboratory position. It is participating in the movement.**

The model therefore needs to account for how the sensing device is being used, not merely what it measures.

## From estimating movement to understanding gestures

The same principle appears in vision-based interaction.

A computer observing a hand gesture must decide which pixels belong to the hand, where the fingertips are, whether the hand is moving intentionally, and which temporal pattern corresponds to a gesture.

RGB cameras provide appearance.

Depth sensors provide distance.

Together, **RGB-D** data offer complementary information.

The 2020 *Applied Sciences* study, [*Real-Time Hand Gesture Spotting and Recognition Using RGB-D Camera and 3D Convolutional Neural Network*](https://doi.org/10.3390/app10020722), combined depth-based hand and fingertip localization with a 3D convolutional neural network for gesture recognition.

The “3D” in this context does not simply mean that the camera senses depth.

A 3D convolution can also learn across the spatial dimensions of image frames and the temporal dimension of a short video sequence.

That is valuable for gestures because movement is part of their identity.

A static frame may show where a hand is.

A sequence shows **what the hand is doing**.

![Fingertip tracking, gesture trajectory capture, and gesture recognition workflow.](assets/img/topics/Mobile_sensing_intelligent_interaction.jpg)

*Fingertip tracking, gesture trajectory capture, and gesture recognition workflow. Figure supplied by the author; related publications are listed below.*

## Turning a fingertip into a mouse

The 2021 *Multimedia Tools and Applications* study, [*Real-time virtual mouse system using RGB-D images and fingertip detection*](https://doi.org/10.1007/s11042-020-10156-5), translated this sensing problem into an actual human-computer interface.

Using a Kinect V2 RGB-D sensor, the system identified a hand region, extracted its contour, detected fingertips, and mapped fingertip movement to a virtual screen.

The system operated at **30 frames per second on a desktop computer using a single CPU** in the reported experiments.

That implementation detail matters.

An interaction technique is not particularly useful if the user moves a hand and the pointer responds seconds later.

Real-time performance therefore becomes part of the scientific problem rather than an engineering afterthought.

The study also tested conditions such as changing illumination, complex backgrounds, and tracking distance—all situations where a visually elegant demonstration can become much less reliable.

## An earlier lesson from wireless signals

An earlier strand of work approached measurement uncertainty from a different domain.

The 2015 *Wireless Personal Communications* paper, [*Impact of channel estimation error on the performance of relay selection in cognitive radio networks*](https://doi.org/10.1007/s11277-015-2717-3), analyzed how imperfect channel estimates influence communication performance.

This is separate from the later smartphone and computer-vision pipeline and should not be interpreted as part of one unified sensing system.

But conceptually, it introduced a recurring engineering concern:

**algorithms make decisions from measurements, and those measurements are rarely exact.**

Ignoring estimation error can make a theoretically strong method fragile in practice.

The same principle later appears in another form in motion sensing and visual interaction, where noise, changing conditions, and imperfect observations must be incorporated into the design.

## The thread connecting these projects

At first glance, indoor localization and fingertip interaction seem unrelated.

One follows footsteps.

The other follows hands.

But both require translating continuous, noisy physical signals into discrete computational meaning.

Was that acceleration peak really a step?

How long was the step?

Is that contour point actually a fingertip?

Where should the cursor move?

Has the gesture started?

Has it ended?

The algorithms differ, but the pattern is similar:

**sense → filter → represent → estimate → act.**

That pattern now appears in much more sophisticated forms across wearable computing, robotics, multimodal AI, and digital health.

## From engineered features to learned representations

Modern sensing systems increasingly replace hand-designed processing stages with learned representations.

Smartphones now contain richer inertial sensors.

Depth estimation can be performed with newer camera systems.

Transformers can model long temporal sequences.

Multimodal foundation models can connect image, video, language, audio, and sensor measurements.

But better models do not remove the fundamental questions that motivated this earlier work.

Where does uncertainty enter the system?

How does behavior change the measured signal?

Does the model remain reliable when the environment changes?

And can the algorithm run fast enough to support the human interacting with it?

Those questions are as relevant to today's intelligent systems as they were to step-length estimation or fingertip tracking.

The sensors have changed.

The computational challenge remains remarkably familiar:

**extract the right signal from a noisy world, and turn it into something useful.**

## Related publications

1. **Ho NH, Truong PH, Jeong GM.** *Step-detection and adaptive step-length estimation for pedestrian dead-reckoning at various walking speeds using a smartphone.* Sensors. 2016. [DOI](https://doi.org/10.3390/s16091423)

2. **Tran DS, Ho NH, Yang HJ, Kim SH, Lee G.** *Real-time virtual mouse system using RGB-D images and fingertip detection.* Multimedia Tools and Applications. 2021. [DOI](https://doi.org/10.1007/s11042-020-10156-5)

3. **Tran DS, Ho NH, Yang HJ, Baek ET, Kim SH, Lee G.** *Real-time hand gesture spotting and recognition using RGB-D camera and 3D convolutional neural network.* Applied Sciences. 2020. [DOI](https://doi.org/10.3390/app10020722)

4. **Truong PH, Nguyen ND, Ho NH, Jeong GM.** *Nonparametric regression-based step-length estimation for arm-swing walking using a smartphone.* International Journal of Computers, Communications & Control. 2018. [DOI](https://doi.org/10.15837/ijccc.2018.4.3148)

5. **Ho VK, Doan NK, Ho NH.** *Impact of channel estimation error on the performance of relay selection in cognitive radio networks.* Wireless Personal Communications. 2015. [DOI](https://doi.org/10.1007/s11277-015-2717-3)

---

# Shared collaboration footer

## Interested in this research?

My current interests center on **neuroimaging, trustworthy AI, multimodal learning, and foundation models for biomedical data**. I am particularly interested in research that connects methodological development with questions of generalizability, interpretation, population differences, and biological relevance.

If your work intersects with these areas—or if you are a student interested in developing research at their intersection—I would be glad to connect.

**Get in touch →**
