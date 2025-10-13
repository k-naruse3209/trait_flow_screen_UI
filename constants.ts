
import { TIPIQuestion, BigFiveTrait } from './types';

export const TIPI_QUESTIONS: TIPIQuestion[] = [
  { id: 1, text: "外向的で、熱意にあふれた (Extraverted, enthusiastic)", trait: BigFiveTrait.Extraversion, isReversed: false },
  { id: 2, text: "批判的で、もめ事を起こしやすい (Critical, quarrelsome)", trait: BigFiveTrait.Agreeableness, isReversed: true },
  { id: 3, text: "頼りになり、自己規律ができる (Dependable, self-disciplined)", trait: BigFiveTrait.Conscientiousness, isReversed: false },
  { id: 4, text: "心配性で、うろたえやすい (Anxious, easily upset)", trait: BigFiveTrait.Neuroticism, isReversed: false },
  { id: 5, text: "新しい体験に対しオープンで、複雑な (Open to new experiences, complex)", trait: BigFiveTrait.Openness, isReversed: false },
  { id: 6, text: "控えめで、物静かな (Reserved, quiet)", trait: BigFiveTrait.Extraversion, isReversed: true },
  { id: 7, text: "思いやりがあり、優しい (Sympathetic, warm)", trait: BigFiveTrait.Agreeableness, isReversed: false },
  { id: 8, text: "だらしなく、そそっかしい (Disorganized, careless)", trait: BigFiveTrait.Conscientiousness, isReversed: true },
  { id: 9, text: "冷静で、感情的に安定している (Calm, emotionally stable)", trait: BigFiveTrait.Neuroticism, isReversed: true },
  { id: 10, text: "ありきたりで、創造的でない (Conventional, uncreative)", trait: BigFiveTrait.Openness, isReversed: true },
];
