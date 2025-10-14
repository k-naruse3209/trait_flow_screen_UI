
import { BigFiveScores, PersonalizedMessage, BigFiveTrait, Checkin } from '../types';

// This is a mock service. In a real application, this would interact with the Gemini API.
export const getPersonalizedMessage = async (
  scores: BigFiveScores,
  latestCheckin: Checkin | null
): Promise<PersonalizedMessage> => {
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let baseTrait = BigFiveTrait.Agreeableness;
  let text = "あなたの高い協調性は素晴らしい強みです。今日は誰かの話をじっくり聴いてみてはいかがでしょうか？";
  
  const highTrait = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as BigFiveTrait;
  baseTrait = highTrait;

  switch(highTrait) {
    case BigFiveTrait.Extraversion:
      text = "あなたの外向性を活かして、今日は新しい人と話す機会を見つけてみましょう。きっと良い刺激になります。";
      break;
    case BigFiveTrait.Conscientiousness:
      text = "その誠実さで、今日は一つのタスクに集中して取り組んでみてください。達成感が得られるはずです。";
      break;
    case BigFiveTrait.Openness:
      text = "あなたの好奇心と開放性が輝く日です。いつもと違う道を通ったり、新しいジャンルの音楽を聴いてみたりしては？";
      break;
    case BigFiveTrait.Neuroticism:
        text = "心配事を少し手放してみませんか？今日は5分間だけ、静かな場所で深呼吸する時間を作ってみましょう。";
        break;
    case BigFiveTrait.Agreeableness:
    default:
        text = "あなたの高い協調性は素晴らしい強みです。今日は誰かの話をじっくり聴いてみてはいかがでしょうか？あなたの聴く姿勢が、相手にとって大きな支えになるはずです。";
        break;
  }

  return {
    id: `msg-${new Date().getTime()}`,
    date: new Date(),
    text: text,
    personalizationInfo: {
      baseTrait: baseTrait,
      mood: latestCheckin?.mood ?? 3,
      energy: latestCheckin?.energy ?? 'medium',
    },
  };
};
