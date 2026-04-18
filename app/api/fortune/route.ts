import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { year, month, day, hour } = await request.json();

  const prompt = `다음 사주 팔자에 대해 간단한 특징과 운세 해석을 해줘. 한국어로 답변해줘:

연주: ${year.heavenlyStem}${year.earthlyBranch}
월주: ${month.heavenlyStem}${month.earthlyBranch}
일주: ${day.heavenlyStem}${day.earthlyBranch}
시주: ${hour.heavenlyStem}${hour.earthlyBranch}

`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const fortune = completion.choices[0].message.content;
    return NextResponse.json({ fortune });
  } catch (error) {
    return NextResponse.json({ error: '운세 해석 실패' }, { status: 500 });
  }
}