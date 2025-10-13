
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Text } from 'recharts';
import { BigFiveScores, BigFiveTrait } from '../types';

interface BigFiveRadarChartProps {
  scores: BigFiveScores;
}

const traitShortNames: { [key in BigFiveTrait]: string } = {
    [BigFiveTrait.Extraversion]: "外向性",
    [BigFiveTrait.Agreeableness]: "協調性",
    [BigFiveTrait.Conscientiousness]: "誠実性",
    [BigFiveTrait.Neuroticism]: "神経症性",
    [BigFiveTrait.Openness]: "開放性",
};

const CustomAngleAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
        <Text
            x={x}
            y={y}
            textAnchor={x > payload.coordinate ? "start" : "end"}
            dominantBaseline="central"
            fill="#374151"
            fontSize={14}
        >
            {payload.value}
        </Text>
    );
};


const BigFiveRadarChart: React.FC<BigFiveRadarChartProps> = ({ scores }) => {
  const data = Object.entries(scores).map(([trait, score]) => ({
    trait: traitShortNames[trait as BigFiveTrait],
    score: score,
    fullMark: 7,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="trait" tick={<CustomAngleAxisTick />} />
        <PolarRadiusAxis angle={30} domain={[0, 7]} tick={false} axisLine={false} />
        <Radar name="You" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default BigFiveRadarChart;
