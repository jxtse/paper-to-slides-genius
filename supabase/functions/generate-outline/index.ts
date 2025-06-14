
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
// Updated to use gemini-1.5-flash-latest model
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    console.error("GOOGLE_GEMINI_API_KEY is not set.");
    return new Response(JSON.stringify({ error: "API key not configured. Contact administrator." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { extractedText } = await req.json();

    if (!extractedText) {
      return new Response(JSON.stringify({ error: "No text provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `
You are an expert at creating presentation slide outlines from academic papers.
Based on the following text, generate a concise and structured slide presentation outline in Markdown format.

Each slide should start with a title like '# Slide X: Title'.
Use bullet points for key information within each slide.
Separate each slide with '---'.

Ensure the outline covers:
1. Title of the paper (if discernible) and presenters.
2. Introduction/Abstract summary.
3. Key Problems/Questions addressed.
4. Methodology used.
5. Main Results/Findings.
6. Discussion/Implications.
7. Conclusion.
8. Q&A slide.

Keep the content for each bullet point brief and to the point.

Here is the text:
---
${extractedText}
---
`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      // Optional: Add generationConfig if needed, e.g., for temperature, maxOutputTokens
      // generationConfig: {
      //   temperature: 0.7,
      //   maxOutputTokens: 2048, // You might want to adjust this if outlines are too short/long
      // }
    };

    console.log("Sending request to Gemini API (model: gemini-1.5-flash-latest)...");
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorBody);
      return new Response(JSON.stringify({ error: `Gemini API error: ${response.statusText} - ${errorBody}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Received response from Gemini API.");

    // Adjusted parsing based on common Gemini response structure for generateContent
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const generatedMarkdown = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ slideMarkdown: generatedMarkdown.trim() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (data.promptFeedback && data.promptFeedback.blockReason) {
      // Handle cases where content is blocked
      const blockReason = data.promptFeedback.blockReason;
      const safetyRatings = data.promptFeedback.safetyRatings || [];
      console.error(`Content blocked by Gemini API. Reason: ${blockReason}`, safetyRatings);
      return new Response(JSON.stringify({ error: `Content generation blocked by API. Reason: ${blockReason}. Please check safety ratings.` }), {
        status: 400, // Or an appropriate status
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    else {
      console.error("Unexpected response structure from Gemini API:", JSON.stringify(data, null, 2));
      return new Response(JSON.stringify({ error: "Failed to parse Gemini response or empty content." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in generate-outline function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

