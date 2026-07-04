import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';
import { openai } from "@ai-sdk/openai";
export async function POST(req: Request) {
  try {
  const prompt =
  "Create exactly three open-ended, engaging questions for an anonymous social messaging platform (like Qooh.me), suitable for a diverse, general audience. " +
  "Avoid personal, sensitive, or controversial topics. Focus on light, universal themes that spark friendly conversation. " +
  "Vary the tone and subject across the three questions (e.g., mix hobbies, hypotheticals, and everyday joys) so they don't feel repetitive. " +
  "Format your response as a single string with each question separated by '||', and nothing else — no numbering, no quotation marks, no markdown, and no introductory text. " +
  "Example format: What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?";
  
    // const { messages }: { messages: UIMessage[] } = await req.json();
  
    const result = streamText({
      model: openai("gpt-5.5"),
      // messages: await convertToModelMessages(messages),
      prompt,
    });
  
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
  console.error("Coming from AI suggestion:", error);

  return new Response("Internal Server Error", {
    status: 500,
  });
}
}