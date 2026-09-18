Dementia research presents machine learning with an unusually difficult problem. The disease develops over years. Patients are observed at irregular intervals. MRI, clinical assessments, cognitive scores, and other biomarkers provide different pieces of information. Some measurements are missing. And the populations represented in research datasets do not always resemble the populations in which models may eventually be used.

That means a high-performing model is only the beginning.

A clinically meaningful computational framework must also confront **progression, missing information, multimodal uncertainty, population differences, and interpretability**.

My research in this area has evolved along that path—from detecting disease-related patterns, to modeling longitudinal progression, and more recently to examining fairness and explainability across diverse populations.


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
