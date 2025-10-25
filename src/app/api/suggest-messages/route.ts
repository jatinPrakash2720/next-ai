import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { OpenAI } from "openai";

export const runtime = "edge";

// export async function GET(req: Request) {
//   try {
//     console.log("Starting suggest-messages SSE request");

//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const result = streamText({
//       model: openai("gpt-3.5-turbo"),
//       system: "You are a helpful assistant.",
//       maxOutputTokens: 100,
//       messages: [{ role: "user", content: prompt }],
//     });

//     // Create a readable stream for SSE
//     const encoder = new TextEncoder();
//     const stream = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of result.textStream) {
//             const data = JSON.stringify({ text: chunk });
//             controller.enqueue(encoder.encode(`data: ${data}\n\n`));
//           }
//           controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
//           controller.close();
//         } catch (error) {
//           console.error("Stream error:", error);
//           controller.error(error);
//         }
//       },
//     });

//     return new Response(stream, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         Connection: "keep-alive",
//       },
//     });
//   } catch (error) {
//     console.error("Error in suggest-messages SSE API:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "Internal server error",
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

export async function GET() {
  try {
    console.log("Starting suggest-messages request");

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // const { messages } = await req.json();
    // console.log("Received messages:", messages?.length || 0, "messages");

    // const modelMessages = convertToModelMessages(prompt);
    console.log("Converted to model messages");

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      system: "You are a helpful assistant.",
      maxOutputTokens: 100,
      messages: [{ role: "user", content: prompt }],
      onChunk: ({ chunk }) => {
        if ("text" in chunk) {
          console.log("Received chunk:", chunk.text.length, "characters");
        }
      },
      onFinish: ({ steps, totalUsage }) => {
        console.log(
          "Stream completed successfully. Steps:",
          steps.length,
          "Usage:",
          totalUsage
        );
      },
      onAbort: ({ steps }) => {
        console.log("Stream aborted after", steps.length, "steps");
      },
    });

    console.log("Returning streaming response");
    return result.toUIMessageStreamResponse({
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
      onError: (error) => {
        console.error("Stream error in response:", error);
        return "An error occurred while processing your request";
      },
    });
  } catch (error) {
    console.error("Error in suggest-messages API:", error);

    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", {
        status: error.status,
        code: error.code,
        message: error.message,
      });
      return new Response(
        JSON.stringify({
          success: false,
          name: error.name,
          message: "AI service error",
          error: error.message,
        }),
        {
          status: error.status,
          headers: error.headers,
        }
      );
    } else {
      console.error("Unexpected error occurred:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Internal server error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
