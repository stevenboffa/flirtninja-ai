import { OPENROUTER_API_KEY, SITE_URL, SITE_NAME } from './constants';
import { ICEBOT_PERSONA } from './icebot';

const FEEDBACK_KEY = 'icebot_feedback';
const USED_RESPONSES_KEY = 'icebot_used_responses';

interface MessageStyle {
  funny: boolean;
  serious: boolean;
  flirty: boolean;
  foodie: boolean;
  travel: boolean;
  pervy: boolean;
  corny: boolean;
  knockKnock: boolean;
  popCulture: boolean;
  humorousScenarios: boolean;
  asshole: boolean;
}

interface Feedback {
  message: string;
  wasRegenerated: boolean;
  timestamp: string;
}

function saveFeedback(message: string, wasRegenerated: boolean) {
  const feedback: Feedback[] = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  feedback.push({
    message,
    wasRegenerated,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
}

function saveUsedResponse(response: string) {
  const usedResponses: string[] = JSON.parse(localStorage.getItem(USED_RESPONSES_KEY) || '[]');
  usedResponses.push(response);
  if (usedResponses.length > 100) {
    usedResponses.shift();
  }
  localStorage.setItem(USED_RESPONSES_KEY, JSON.stringify(usedResponses));
}

function getUsedResponses(): string[] {
  return JSON.parse(localStorage.getItem(USED_RESPONSES_KEY) || '[]');
}

export interface GenerateMessageParams {
  profile: string;
  messageStyle: MessageStyle;
}

export async function generateAIMessage({ profile, messageStyle }: GenerateMessageParams): Promise<string> {
  try {
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
            "content": ICEBOT_PERSONA.personality
          },
          {
            "role": "user",
            "content": ICEBOT_PERSONA.generatePrompt(profile, messageStyle)
          }
        ],
        "temperature": 1.2,
        "max_tokens": 150,
        "top_p": 0.95,
        "presence_penalty": 0.7,
        "frequency_penalty": 0.9
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate message');
    }

    const data = await response.json();
    let message = data.choices[0].message.content.trim();
    
    message = message
      .replace(/^["']|["']$/g, '')
      .replace(/^(Here's a message:|Message:|Response:|Ice breaker:|Here's an ice breaker:|Here's what I'd say:|I would say:|Try this:|How about:|Suggestion:)/i, '')
      .trim();

    saveUsedResponse(message);
    return message;
  } catch (error) {
    console.error('Error generating message:', error);
    throw new Error('Failed to generate message');
  }
}

export async function enhanceMessage(originalMessage: string): Promise<string> {
  try {
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
            "content": `You are an expert at enhancing messages while maintaining their original intent and tone. Your task is to make subtle improvements to the message without changing its core meaning or style. Focus on:

- Improving clarity and flow
- Enhancing word choice
- Fixing grammar and punctuation
- Making the message more engaging
- Maintaining the original tone and personality

Keep changes minimal and natural. The enhanced version should feel like a polished version of the original, not a completely different message.`
          },
          {
            "role": "user",
            "content": `Enhance this message while keeping its original tone and intent. Make subtle improvements only:

${originalMessage}

Respond with ONLY the enhanced message.`
          }
        ],
        "temperature": 0.7,
        "max_tokens": 150,
        "top_p": 0.9,
        "presence_penalty": 0.3,
        "frequency_penalty": 0.3
      })
    });

    if (!response.ok) {
      throw new Error('Failed to enhance message');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error enhancing message:', error);
    throw new Error('Failed to enhance message');
  }
}

export function recordRegeneratedResponse(message: string) {
  saveFeedback(message, true);
}