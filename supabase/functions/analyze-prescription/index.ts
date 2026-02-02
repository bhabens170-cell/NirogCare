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
    const { imageBase64, language = "English" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!imageBase64) {
      throw new Error("No image provided");
    }

    const systemPrompt = `You are an expert medical prescription analyzer. Analyze the prescription image and extract all relevant information.

EXTRACT THE FOLLOWING:
1. Doctor's name (if visible)
2. Date (if visible)
3. Patient name (if visible)
4. Each medication with:
   - Medicine name (generic and brand if both mentioned)
   - Dosage (mg/ml/units)
   - Frequency (how many times per day)
   - Duration (number of days)
   - Instructions (before/after food, etc.)
5. General instructions or notes from the doctor

RESPONSE FORMAT (JSON):
{
  "doctorName": "Dr. Name" or "Not visible",
  "date": "date" or "Not visible",
  "patientName": "name" or "Not visible",
  "medications": [
    {
      "name": "Medicine name with strength",
      "dosage": "e.g., 1 tablet twice daily",
      "duration": "e.g., 5 days",
      "purpose": "General purpose if known, e.g., For fever and pain",
      "instructions": "e.g., Take after meals"
    }
  ],
  "generalInstructions": "Any additional notes from the doctor",
  "warnings": ["List any important warnings based on medications identified"]
}

IMPORTANT:
- Be accurate with medicine names and dosages
- If something is unclear or illegible, indicate it
- Include common drug interactions or precautions if relevant
- Respond in ${language} for text descriptions, but keep medicine names in English
- Do NOT make up information - if something isn't visible, say so`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Please analyze this prescription image and extract all medication details." },
              { 
                type: "image_url", 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
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
      return new Response(JSON.stringify({ error: "Failed to analyze prescription" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Try to extract JSON from the response
    let prescriptionData;
    try {
      // Look for JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        prescriptionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse prescription data:", parseError);
      // Return a structured response with the raw content
      prescriptionData = {
        doctorName: "Not extracted",
        date: new Date().toLocaleDateString("en-IN"),
        patientName: "Not visible",
        medications: [],
        generalInstructions: content,
        warnings: [],
        rawAnalysis: content
      };
    }

    return new Response(JSON.stringify({ success: true, data: prescriptionData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Prescription analysis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze prescription" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
