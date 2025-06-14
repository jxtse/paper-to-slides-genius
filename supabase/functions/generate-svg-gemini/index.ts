
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    console.error("GOOGLE_GEMINI_API_KEY is not set.");
    return new Response(JSON.stringify({ error: "API key not configured." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { imagePrompt, sourcePaperText } = await req.json();

    if (!imagePrompt) {
      return new Response(JSON.stringify({ error: "No image prompt provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Limit sourcePaperText length to avoid overly long prompts (e.g., first 5000 chars)
    const contextualText = sourcePaperText ? sourcePaperText.substring(0, 5000) : "No paper context provided.";

    const prompt = `
You are an AI assistant specialized in generating SVG code for technical and academic illustrations.
Based on the following image description and contextual academic paper text, generate valid, self-contained SVG code.
The SVG should visually represent the image description. Aim for a clear, illustrative style.
The SVG must start with "<svg" and end with "</svg>". Do not include any other text, explanations, or markdown formatting around the SVG code itself.

Image Description:
---
${imagePrompt}
---

Contextual Academic Paper Text (excerpt):
---
${contextualText}
---

Please provide ONLY the SVG code.
If you cannot generate a meaningful or valid SVG for the given description, respond with the exact string "[[CANNOT_GENERATE_SVG]]" and nothing else.
`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        // It's a text model, so expecting SVG as text.
        // No specific "response_mime_type" for SVG for this endpoint.
        // Consider adjusting temperature or maxOutputTokens if needed.
        // temperature: 0.7,
        maxOutputTokens: 4096, // Increased to allow for potentially larger SVG strings
      },
    };

    console.log("Sending request to Gemini API for SVG generation...");
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error for SVG: ${response.status} ${response.statusText}`, errorBody);
      return new Response(JSON.stringify({ error: `Gemini API error: ${response.statusText} - ${errorBody}` }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Received SVG generation response from Gemini API.");

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const generatedText = data.candidates[0].content.parts[0].text.trim();
      if (generatedText === "[[CANNOT_GENERATE_SVG]]") {
        console.log("Gemini indicated it cannot generate SVG for this prompt.");
        return new Response(JSON.stringify({ error: "AI could not generate SVG for this prompt." , svgCode: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // A basic check if it looks like SVG. More robust parsing is hard here.
      if (generatedText.startsWith("<svg") && generatedText.endsWith("</svg>")) {
        console.log("Potential SVG code received from Gemini.");
        return new Response(JSON.stringify({ svgCode: generatedText }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        console.warn("Gemini response did not look like valid SVG:", generatedText.substring(0,100));
        return new Response(JSON.stringify({ error: "AI response was not in expected SVG format.", svgCode: null, rawResponse: generatedText.substring(0, 200) + "..." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else if (data.promptFeedback?.blockReason) {
      console.error(`Content blocked by Gemini API for SVG. Reason: ${data.promptFeedback.blockReason}`);
      return new Response(JSON.stringify({ error: `Content generation blocked. Reason: ${data.promptFeedback.blockReason}.` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      console.error("Unexpected SVG response structure from Gemini API:", JSON.stringify(data, null, 2));
      return new Response(JSON.stringify({ error: "Failed to parse Gemini SVG response or empty content." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in generate-svg-gemini function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
