
export enum BigFiveTrait {
  Extraversion = "Extraversion",
  Agreeableness = "Agreeableness",
  Conscientiousness = "Conscientiousness",
  Neuroticism = "Neuroticism",
  Openness = "Openness",
}

export type BigFiveScores = {
  [key in BigFiveTrait]: number;
};

export interface TIPIQuestion {
  id: number;
  text: string;
  trait: BigFiveTrait;
  isReversed: boolean;
}

export type EnergyLevel = "low" | "medium" | "high";

export interface Checkin {
  id: string;
  date: Date;
  mood: number; // 1-5
  energy: EnergyLevel;
  note?: string;
}

export interface PersonalizedMessage {
  id: string;
  date: Date;
  text: string;
  rating?: number; // 1-5
  personalizationInfo: {
    baseTrait: BigFiveTrait;
    mood: number;
    energy: EnergyLevel;
  };
}
