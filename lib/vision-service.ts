import { OPENROUTER_API_KEY, SITE_URL, SITE_NAME } from './constants';

export async function analyzeProfileImage(imageBase64: string): Promise<string> {
  try {
    // Ensure the image is in the correct base64 format
    const base64Data = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    // Validate image size (max 4MB for API)
    const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
    if (sizeInBytes > 4 * 1024 * 1024) {
      throw new Error('Image size too large. Please use an image under 4MB.');
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-4-vision-preview",
        "messages": [
          {
            "role": "system",
            "content": `You are an expert dating profile analyzer. Analyze this dating profile image and provide insights that can be used to create a personalized ice breaker message.

Focus on:
- Notable interests or hobbies visible
- Style and personality indicators
- Setting and context of the photo
- Unique or interesting elements
- Potential conversation starters

Keep the analysis natural and respectful. Avoid any inappropriate observations or comments.
Provide specific, actionable details that could be used in an ice breaker message.`
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "Analyze this dating profile photo and suggest conversation starters:"
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": base64Data
                }
              }
            ]
          }
        ],
        "max_tokens": 500,
        "temperature": 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('No analysis generated');
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    throw new Error(error.message || 'Failed to analyze image. Please try again.');
  }
}