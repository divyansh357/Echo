import { GoogleGenAI, Type, Chat } from "@google/genai";
import { InboxItem, AnalysisResult, PrioritizedTask, DailyPlan } from "../types";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzePriorities = async (items: InboxItem[]): Promise<AnalysisResult> => {
  const ai = getAI();

  const prompt = `
    You are an expert Executive Productivity Assistant.
    Analyze the following list of incoming communications (Emails, Slack messages, Jira tickets, Calendar events).
    
    Your goal is to:
    1. Identify the top 3-5 most critical tasks based on Urgency (time sensitivity) and Importance (business impact).
    2. Classify EVERY single input item into one of four categories: "Urgent", "Important", "Routine", or "Noise".
    3. Provide a reasoning for why the top items are prioritized.
    4. Suggest an immediate action for top items.
    5. Calculate a 'Productivity Score' (0-100) representing how well the user is doing based on the volume of urgent vs noise (simulation).
    6. Provide distribution counts.

    Input Data:
    ${JSON.stringify(items)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topPriorities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "A unique ID for the priority item" },
                  originalItemId: { type: Type.STRING, description: "The ID of the input item" },
                  title: { type: Type.STRING, description: "A concise action-oriented title" },
                  summary: { type: Type.STRING, description: "Brief summary of the issue" },
                  urgencyScore: { type: Type.NUMBER, description: "1-10 scale" },
                  importanceScore: { type: Type.NUMBER, description: "1-10 scale" },
                  reason: { type: Type.STRING, description: "Why this is prioritized" },
                  suggestedAction: { type: Type.STRING, description: "Next step: e.g., 'Reply immediately', 'Review doc'" },
                  category: { type: Type.STRING, enum: ["Client", "Internal", "Project", "Admin"] }
                },
                required: ["id", "originalItemId", "title", "summary", "urgencyScore", "importanceScore", "reason", "suggestedAction", "category"]
              }
            },
            productivityScore: { type: Type.NUMBER },
            distribution: {
              type: Type.OBJECT,
              properties: {
                urgent: { type: Type.NUMBER },
                important: { type: Type.NUMBER },
                routine: { type: Type.NUMBER },
                noise: { type: Type.NUMBER }
              },
              required: ["urgent", "important", "routine", "noise"]
            },
            itemClassifications: {
              type: Type.ARRAY,
              description: "Classification for every single item in the input list",
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["Urgent", "Important", "Routine", "Noise"] }
                },
                required: ["itemId", "category"]
              }
            }
          },
          required: ["topPriorities", "productivityScore", "distribution", "itemClassifications"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Error analyzing priorities:", error);
    throw error;
  }
};

export const generateDailyPlan = async (tasks: PrioritizedTask[]): Promise<DailyPlan> => {
  const ai = getAI();
  
  const prompt = `
    Based on the following high-priority tasks, create a structured, realistic, hour-by-hour daily schedule (8-hour workday).
    
    Tasks to fit in:
    ${JSON.stringify(tasks)}
    
    Rules:
    - Start the day at 9:00 AM.
    - Allocate specific time blocks for "Deep Work" on the most urgent items.
    - Include short breaks.
    - Include a block for checking emails/routine comms.
    - Return valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "A short motivational summary of the plan" },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            time: { type: Type.STRING, description: "e.g., '09:00 AM' or '10:30 AM'" },
                            activity: { type: Type.STRING, description: "The main task or activity name" },
                            type: { type: Type.STRING, enum: ["focus", "meeting", "break", "routine"] },
                            duration: { type: Type.STRING, description: "e.g., '45 mins'" },
                            notes: { type: Type.STRING, description: "Optional short detail" }
                        },
                        required: ["time", "activity", "type", "duration"]
                    }
                }
            },
            required: ["summary", "items"]
        }
      }
    });
    if (response.text) {
        return JSON.parse(response.text) as DailyPlan;
    }
    throw new Error("No plan generated");
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const createChatSession = (items: InboxItem[]): Chat => {
  const ai = getAI();
  
  // Create a simplified context of items to save tokens/complexity
  const contextData = items.map(item => ({
    sender: item.sender,
    subject: item.subject,
    content: item.content?.substring(0, 200), // Truncate content for context
    time: item.timestamp,
    source: item.source
  }));

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are Echo Assistant, a helpful AI that helps the user manage their tasks. 
      You have read access to their current inbox and notifications: ${JSON.stringify(contextData)}.
      
      Answer the user's questions about their tasks, deadlines, or specific emails. 
      You can search through the provided context to find answers.
      If the user asks to "find" or "search" for something, look through the inbox data provided.
      Keep answers concise, helpful, and use simple formatting like bullet points if listing items.
      `
    }
  });
};
