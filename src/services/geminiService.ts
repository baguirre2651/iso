
import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration } from "@google/genai";
import { aiInsightsData } from "../data";

// Lazy initialization to prevent crash if API_KEY is missing during initial load
let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.warn("API Key is missing. AI features will be disabled.");
            return null;
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

// --- Feature 1: AI Powered Chatbot (gemini-2.5-flash) ---
export async function chatWithAssistant(message: string): Promise<string> {
    try {
        const client = getAiClient();
        if (!client) return "AI services are currently unavailable (Missing API Key).";

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: "You are the 'ISO Guide', a helpful AI assistant for a reverse marketplace (Bulletin Board) where buyers post ISOs and sellers contact them directly. Important: The platform does NOT handle payments, shipping, or escrow. All deals happen off-platform (e.g. PayPal, Grailed). There are NO selling fees on ISO. Advise users to use safe payment methods like PayPal G&S when transacting off-platform. Be concise, friendly, and helpful. Keep responses under 3 sentences unless asked for details."
            }
        });
        return response.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting right now.";
    }
}

// --- Feature 2: Google Search Grounding (gemini-2.5-flash) ---
export interface MarketInsightResult {
    text: string;
    sources: Array<{ title: string; uri: string }>;
}

export async function getMarketInsights(itemName: string): Promise<MarketInsightResult> {
    try {
        const client = getAiClient();
        // Fallback to mock data if no key
        if (!client) {
             return {
                text: aiInsightsData[itemName] || "Market insights unavailable (Missing API Key).",
                sources: []
             };
        }

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a concise market summary for: ${itemName}. 
            
            Rules:
            1. Keep it under 80 words.
            2. Focus on the current resale price range and one key trend.
            3. Do not use complex formatting, just a clean summary paragraph.`,
            config: {
                // Grounding with Google Search for real-time market info
                tools: [{ googleSearch: {} }] 
            }
        });

        // Extract grounding sources
        const sources: Array<{ title: string; uri: string }> = [];
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (chunks) {
            chunks.forEach((chunk: any) => {
                if (chunk.web) {
                    sources.push({
                        title: chunk.web.title || "Source",
                        uri: chunk.web.uri
                    });
                }
            });
        }

        return {
            text: response.text || "Market insights unavailable.",
            sources: sources
        };

    } catch (error) {
        console.error("Gemini Insights Error:", error);
        return { text: "Unable to fetch market insights at this time.", sources: [] };
    }
}

// --- Feature 3: Interactive Creation Chat (gemini-2.5-flash with Tools) ---

const finalizeDraftTool: FunctionDeclaration = {
    name: "finalize_draft",
    description: "Call this when you have collected enough information (Name, Category, Price, Details) to create the ISO listing.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The specific name of the item" },
            category: { type: Type.STRING, enum: ["Sneakers", "Watches", "Archival Fashion", "Collectibles"] },
            details: { type: Type.STRING, description: "Condition, size, year, etc." },
            estimatedValue: { type: Type.NUMBER, description: "The target price or budget in USD" },
        },
        required: ["name", "category", "estimatedValue"]
    }
};

export interface ChatDraftResult {
    text?: string;
    draft?: {
        name: string;
        category: string;
        details: string;
        estimatedValue: number;
    };
}

export async function chatForIsoCreation(history: any[], newMessage: string, imageBase64?: string): Promise<ChatDraftResult> {
    try {
        const client = getAiClient();
        if (!client) return { text: "AI Unavailable" };

        const parts: any[] = [{ text: newMessage }];
        
        if (imageBase64) {
            const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
            parts.push({ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } });
        }

        const contents = [
            ...history,
            { role: 'user', parts: parts }
        ];

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: `You are a Listing Agent helping a user create a "In Search Of" post. 
                
                CRITICAL RULES:
                1. If the user asks a question (e.g., "What is this worth?", "Is this rare?", "How much should I offer?"), ANSWER it directly and helpfully. Do not ignore their question.
                2. After answering, THEN guide them to provide missing info: Name, Category, Target Price, and Details.
                3. If the user uploads an image, analyze it to infer the Name and Category, then confirm details with the user.
                4. Be concise and conversational.
                5. ONLY when you have clear values for Name, Category, and Price, CALL the 'finalize_draft' tool.`,
                tools: [{ functionDeclarations: [finalizeDraftTool] }]
            }
        });

        // Check for function call
        const functionCall = response.functionCalls?.[0];
        
        if (functionCall && functionCall.name === 'finalize_draft') {
            const args = functionCall.args as any;
            return {
                draft: {
                    name: args.name,
                    category: args.category || "Collectibles",
                    details: args.details || "No details provided",
                    estimatedValue: args.estimatedValue || 0
                }
            };
        }

        return { text: response.text || "I didn't catch that. Could you repeat?" };

    } catch (error) {
        console.error("Creation Chat Error:", error);
        return { text: "I'm having trouble processing that right now." };
    }
}
