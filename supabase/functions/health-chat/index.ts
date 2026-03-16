import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = "English" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Nirog Care's AI Health Assistant - a compassionate, knowledgeable health advisor designed for users in India.

CORE RESPONSIBILITIES:
1. Provide general health information, wellness tips, and first-aid guidance
2. Help users understand symptoms (without diagnosing)
3. Suggest when to seek professional medical help
4. Explain government health schemes available in India
5. Guide on healthy lifestyle practices

COMMUNICATION STYLE:
- Respond primarily in ${language}, but can use bilingual text if helpful
- Be warm, empathetic, and reassuring
- Use simple language that everyone can understand
- Include relevant emojis to make responses friendly and clear

IMPORTANT GUIDELINES:
- NEVER diagnose conditions - always recommend consulting a doctor for diagnosis
- For emergencies, immediately advise calling 108 (ambulance) or 112 (emergency)
- Mention Jan Aushadhi Kendra for affordable generic medicines when relevant
- Reference Ayushman Bharat scheme for eligible patients
- Be culturally sensitive to Indian context

RESPONSE FORMAT:
- Keep responses concise but helpful
- Use bullet points for lists
- Highlight important warnings
- End with actionable advice or next steps

Remember: You're a health information assistant, NOT a replacement for medical professionals.`;

    const model = Deno.env.get("HEALTH_CHAT_MODEL") || "openai/gpt-5.4-codex";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Health chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
