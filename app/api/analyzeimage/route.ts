import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// Route Handlers let us create API logic
// POST api/analyzeImage
export async function POST(request: Request) {
  // { image: "ASDFASDFASDF base64 string" }
  const { image } = await request.json();

  const response = await openai.createChatCompletion({
    model: "gpt-4-vision-preview",
    stream: true,
    max_tokens: 4096, // No max tokens: super short / cut off response.
    messages: [
      {
        role: "user",
        //@ts-ignore
        content: [
          {
            type: "text",
            text: "solve all the questions step by step until the end with the right answer and best approach. if it does not look like a question or If you find any image uploaded which doesnt look like question then just tell the user to upload a proper question.",
          },
          {
            type: "image_url",
            image_url: image, // base64 images
          },
        ],
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
