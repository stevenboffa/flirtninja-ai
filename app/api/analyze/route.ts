import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OPENROUTER_API_KEY, SITE_URL, SITE_NAME } from '@/lib/constants';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME,
  }
});

const VISION_PROMPT = `You are an expert dating profile analyzer. Analyze this dating profile image and provide insights that can be used to create a personalized ice breaker message.

Focus on:
- Notable interests or hobbies visible
- Style and personality indicators
- Setting and context of the photo
- Unique or interesting elements
- Potential conversation starters

Keep the analysis natural and respectful. Avoid any inappropriate observations or comments.
Provide specific, actionable details that could be used in an ice breaker message.`;

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate base64 image data
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Extract base64 data
    const base64Data = image.split(',')[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: VISION_PROMPT
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this dating profile photo and suggest conversation starters:"
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No analysis generated');
    }

    return NextResponse.json({
      analysis: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}