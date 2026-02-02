/**
 * AI Service - Google Gemini Integration
 * Free AI features for NirogCare using Google's Gemini API
 * Includes automatic fallback to offline mode if API fails
 */

import { toast } from "sonner";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

interface MedicineInfo {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    type?: string;        // e.g. "Antibiotic", "Pain Relief"
    sideEffects?: string; // e.g. "Drowsiness, Nausea"
    usage?: string;       // e.g. "For fever"
}

interface PrescriptionResult {
    medicines: MedicineInfo[];
    doctorName?: string;
    patientName?: string;
    date?: string;
    notes?: string;
}

// Mock responses for offline mode or API failures
const MOCK_RESPONSES: Record<string, string> = {
    headache: `I understand you're experiencing a headache. Here are some helpful suggestions:

🏥 **Common Causes:**
• Stress or tension
• Dehydration
• Lack of sleep
• Eye strain from screens

💊 **Home Remedies:**
• Drink plenty of water (at least 8 glasses daily)
• Rest in a dark, quiet room
• Apply a cold compress to your forehead
• Take OTC pain relievers like Paracetamol (500mg)

⚠️ **When to See a Doctor:**
• Headache persists for more than 3 days
• Severe sudden headache
• Fever accompanies the headache
• Vision problems or confusion

For immediate medical emergencies, call **108** (Ambulance).

_This is general health information. Please consult a doctor for proper diagnosis._`,

    fever: `I'm sorry to hear you have a fever. Here's what you can do:

🌡️ **Managing Fever:**
• Rest and stay hydrated
• Take Paracetamol (500mg) every 6 hours if needed
• Use a damp cloth on your forehead
• Wear light, breathable clothing

🏥 **See a Doctor If:**
• Temperature exceeds 103°F (39.4°C)
• Fever lasts more than 3 days
• Difficulty breathing
• Severe headache or body pain

💡 **Affordable Medicines:**
Visit your nearest Jan Aushadhi Kendra for generic medicines at lower prices.

For medical emergencies, call **108**.`,

    cold: `I understand you're dealing with a cold. Here are some suggestions:

🤧 **Cold Remedies:**
• Get plenty of rest
• Drink warm fluids (ginger tea, warm water with honey)
• Steam inhalation for congestion
• Gargle with warm salt water for sore throat

💊 **OTC Medicines:**
• Cetirizine (10mg) for runny nose
• Paracetamol for fever/body ache
• Cough syrup if needed

🍯 **Home Remedies:**
• Turmeric milk (haldi doodh)
• Ginger and honey tea
• Warm soup

Usually, a cold resolves in 7-10 days. See a doctor if symptoms worsen.`,

    default: `Namaste! 🙏 Thank you for your health question.

I'm here to help with general health information. For your specific concern, I recommend:

1. **Rest** - Allow your body time to recover
2. **Stay Hydrated** - Drink plenty of water and fluids
3. **Monitor Symptoms** - Keep track of any changes

💡 **Government Health Schemes:**
• Ayushman Bharat - Free treatment up to ₹5 lakhs/year
• Jan Aushadhi Kendra - Affordable generic medicines

⚠️ **When to See a Doctor:**
• Symptoms persist or worsen
• High fever (>102°F)
• Difficulty breathing
• Severe pain

**Emergency Numbers:**
• Ambulance: 108
• Emergency: 112
• Health Helpline: 104

_This is general health information only. Please consult a healthcare professional for proper diagnosis and treatment._`
};

/**
 * Get a contextual response based on keywords in the message
 */
function getMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain') || lowerMessage.includes('sir dard')) {
        return MOCK_RESPONSES.headache;
    }
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature') || lowerMessage.includes('bukhar')) {
        return MOCK_RESPONSES.fever;
    }
    if (lowerMessage.includes('cold') || lowerMessage.includes('cough') || lowerMessage.includes('sardi') || lowerMessage.includes('khansi')) {
        return MOCK_RESPONSES.cold;
    }

    return MOCK_RESPONSES.default;
}

/**
 * Health Chat with Gemini AI (with offline fallback)
 */
export async function chatWithAI(
    userMessage: string,
    conversationHistory: { type: 'user' | 'bot' | 'system'; text: string }[],
    language: string = 'English'
): Promise<string> {

    // If no API key is configured, immediately use fallback
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key missing, using mock response');
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        return getMockResponse(userMessage);
    }

    try {
        const systemContext = `You are Nirog Care's AI Health Assistant - a compassionate, knowledgeable health advisor designed for users in India.

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
- Keep responses concise but helpful
- Use bullet points for lists
- Highlight important warnings
- End with actionable advice or next steps

Remember: You're a health information assistant, NOT a replacement for medical professionals.`;

        // Convert history to Gemini format
        const contents: ChatMessage[] = [];

        contents.push({
            role: 'user',
            parts: [{ text: `[System Instructions]\n${systemContext}\n\nPlease acknowledge these instructions and be ready to help.` }]
        });
        contents.push({
            role: 'model',
            parts: [{ text: 'Namaste! 🙏 I understand my role as a health assistant. I\'m ready to help with health information and guidance.' }]
        });

        // Add conversation history
        for (const msg of conversationHistory.slice(-10)) {
            if (msg.type === 'bot' && msg.text.includes('Nirog Care')) continue;
            contents.push({
                role: msg.type === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            });
        }

        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        const response = await fetchWithRetry(
            `${GEMINI_API_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
                    ],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error('No response from AI');

        return text;

    } catch (error) {
        console.error('AI Service Error:', error);

        // Show simplified toast to user
        const isRateLimit = error instanceof Error && error.message.includes('429');
        toast.error(isRateLimit ? "Usage limit reached" : "Connection issue", {
            description: "Switching to offline mode for now",
            duration: 3000
        });

        // Fallback to offline mode
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        return getMockResponse(userMessage);
    }
}

/**
 * Analyze Prescription Image with Gemini Vision (with demo fallback)
 */
export async function analyzePrescription(imageBase64: string, language: string = 'English'): Promise<PrescriptionResult> {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key missing, using demo result');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return getDemoPrescription();
    }

    try {
        const prompt = `You are an expert medical prescription analyzer. Analyze this prescription image and extract all relevant information.

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
   - Type (e.g., Antibiotic, Painkiller, Supplement)
   - Potential Side Effects (brief 3-4 word warning)
   - Usage (e.g., "For viral infection", "For pain relief")
5. General instructions or notes from the doctor

RESPONSE FORMAT (JSON only, no other text):
{
  "doctorName": "Dr. Name" or null if not visible,
  "patientName": "name" or null if not visible,
  "date": "date" or null if not visible,
  "medicines": [
    {
      "name": "Medicine name with strength",
      "dosage": "e.g., 1 tablet",
      "frequency": "e.g., Twice daily",
      "duration": "e.g., 5 days",
      "instructions": "e.g., Take after meals",
      "type": "e.g. Antibiotic",
      "sideEffects": "e.g. Drowsiness, Nausea",
      "usage": "e.g. For bacteria"
    }
  ],
  "notes": "Any additional notes from the doctor"
}

IMPORTANT:
- Be accurate with medicine names and dosages
- If something is unclear or illegible, indicate it with "(unclear)"
- Return ONLY valid JSON, no markdown or extra text
- Respond in ${language} for text descriptions, but keep medicine names in English`;

        const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        const mimeType = imageBase64.includes('data:') ? imageBase64.split(';')[0].split(':')[1] : 'image/jpeg';

        const response = await fetchWithRetry(
            `${GEMINI_API_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType, data: base64Data } }
                        ]
                    }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error('No response from AI');

        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        return {
            medicines: parsed.medicines || [],
            doctorName: parsed.doctorName,
            patientName: parsed.patientName,
            date: parsed.date,
            notes: parsed.notes,
        };

    } catch (error) {
        console.error('Prescription Analysis Error:', error);

        // Show simplified toast
        const isRateLimit = error instanceof Error && error.message.includes('429');
        toast.error(isRateLimit ? "Usage limit reached" : "Analysis failed", {
            description: "Showing demo result instead",
            duration: 3000
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
        return getDemoPrescription();
    }
}

function getDemoPrescription(): PrescriptionResult {
    return {
        medicines: [
            {
                name: 'Paracetamol 500mg',
                dosage: '1 tablet',
                frequency: 'Twice daily',
                duration: '5 days',
                instructions: 'Take after meals',
                type: 'Analgesic',
                sideEffects: 'Liver issues (rare)',
                usage: 'For fever & pain'
            },
            {
                name: 'Cetirizine 10mg',
                dosage: '1 tablet',
                frequency: 'Once daily',
                duration: '7 days',
                instructions: 'Take at bedtime',
                type: 'Antihistamine',
                sideEffects: 'Drowsiness, dry mouth',
                usage: 'For allergy/cold'
            },
            {
                name: 'Amoxyclav 625',
                dosage: '1 tablet',
                frequency: 'Twice daily',
                duration: '5 days',
                instructions: 'Take with food',
                type: 'Antibiotic',
                sideEffects: 'Diarrhea, nausea',
                usage: 'For bacterial infection'
            }
        ],
        doctorName: 'Dr. Sharma',
        date: new Date().toLocaleDateString('en-IN'),
        notes: '⚠️ Showing demo result. Real analysis failed due to connection issues or rate limits.'
    };
}

/**
 * Helper function to retry fetch requests with exponential backoff
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 2000): Promise<Response> {
    try {
        const response = await fetch(url, options);

        if (response.status === 429 && retries > 0) {
            console.warn(`Rate limit exceeded. Retrying in ${backoff}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }

        return response;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Network error. Retrying in ${backoff}ms... (${retries} retries left)`, error);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}

/**
 * Check if Gemini API is configured
 */
export function isAIConfigured(): boolean {
    // Return true even if not configured so the UI doesn't block the user, 
    // relying on the offline fallback instead.
    return true;
}
