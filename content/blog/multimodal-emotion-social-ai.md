Imagine hearing someone say:

*"That's great."*

The words appear positive.

But what if the voice is flat?

What if the speaker avoids eye contact?

What if the previous speaker has just delivered bad news?

Emotion is not encoded in one channel. Humans combine language, voice, facial behavior, timing, social context, and prior interactions almost automatically.

For artificial intelligence, doing the same is considerably harder.


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
