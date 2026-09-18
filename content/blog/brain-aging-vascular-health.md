Two people can be the same chronological age and have very different brains.

One may show relatively preserved functional organization. Another may have a greater burden of vascular injury. A third may show subtle changes that become visible only when thousands of connections across the brain are considered together.

That is why “brain age” is an appealing idea—but also a complicated one.

There is no single biological clock inside the brain. Instead, different imaging modalities capture different dimensions of aging.


## Blood pressure leaves a footprint in the brain

The most clinically direct study in this research theme comes from the 2026 *eClinicalMedicine* paper, [*Intensive versus standard blood pressure control and overall brain small vessel disease burden: a post-hoc analysis of the SPRINT randomized clinical trial*](https://doi.org/10.1016/j.eclinm.2026.104143).

Cerebral small-vessel disease does not appear as one single MRI abnormality.

Instead, vascular injury may be reflected through several imaging characteristics. The study combined complementary MRI measurements—including periventricular white-matter hyperintensities, white-matter free water, and basal-ganglia perivascular spaces—into an overall small-vessel-disease burden.

The parent SPRINT trial randomized participants to different systolic blood-pressure targets. This post-hoc neuroimaging analysis asked whether those treatment strategies were also associated with different trajectories of vascular brain injury.

Participants assigned to the intensive systolic blood-pressure target showed **less progression in the global MRI-derived small-vessel-disease burden** than those receiving standard treatment.

That result is important because it shifts the perspective from looking at one imaging lesion at a time to asking whether several manifestations of vascular brain injury can be summarized as a broader latent burden.

At the same time, the distinction between the randomized trial and the post-hoc imaging analysis matters. The global SVD measure was a secondary, retrospectively analyzed imaging outcome. It provides meaningful evidence, but it should be interpreted within that study design rather than generalized beyond it automatically.


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

| Research direction | Central question | How to read the evidence |
| --- | --- | --- |
| Functional-connectome modeling | What age-related information can be derived from network measurements? | Examine the prediction task, representation, and evaluation. |
| Blood-pressure trial analysis | How was brain small-vessel disease burden studied under the trial comparison? | Examine the outcome definitions, trial context, and post-hoc analysis. |

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
