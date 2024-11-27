import { OPENROUTER_API_KEY, SITE_URL, SITE_NAME } from './constants';

interface ProfileStyle {
  funny: boolean;
  mysterious: boolean;
  intellectual: boolean;
  adventurous: boolean;
  romantic: boolean;
  ambitious: boolean;
  creative: boolean;
  athletic: boolean;
}

interface GenerateProfileParams {
  profileStyle: ProfileStyle;
  length: string;
  tone: string;
}

const PROFILE_PERSONA = `You are an expert dating profile writer who creates engaging, authentic, and attractive profile descriptions. Your writing is natural, engaging, and perfectly tailored to the requested style.

Key traits:
- Write in first person
- Show personality through writing
- Use natural language
- Create authentic descriptions
- Include specific details
- Avoid clichés and generic statements
- Make it engaging and memorable
- Keep it positive and upbeat
- Show don't tell
- Use humor appropriately
- Stay classy and tasteful

Remember:
- Be genuine and authentic
- Create a unique voice
- Show personality naturally
- Keep it engaging
- Make it memorable
- Stay positive
- Be specific
- Avoid red flags
- Keep it classy`;

export async function generateProfileDescription({ profileStyle, length, tone }: GenerateProfileParams): Promise<string> {
  try {
    const styles = Object.entries(profileStyle)
      .filter(([_, enabled]) => enabled)
      .map(([style]) => style);

    const prompt = `Create a dating profile description with these characteristics:

Styles: ${styles.join(', ')}
Length: ${length}
Tone: ${tone}

Guidelines:
- Write in first person
- Match the selected tone and style
- Keep length appropriate (${length})
- Make it natural and engaging
- Include specific details
- Avoid clichés and generic statements
- Show personality through writing
- Keep it positive and upbeat
- Make it memorable and unique
- Stay classy and tasteful

Create a profile that combines all selected styles naturally while maintaining the specified tone and length.

Respond with ONLY the profile text.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-70b-instruct",
        "messages": [
          {
            "role": "system",
            "content": PROFILE_PERSONA
          },
          {
            "role": "user",
            "content": prompt
          }
        ],
        "temperature": 1.1,
        "max_tokens": 500,
        "top_p": 0.9,
        "presence_penalty": 0.6,
        "frequency_penalty": 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate profile');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating profile:', error);
    throw new Error('Failed to generate profile');
  }
}