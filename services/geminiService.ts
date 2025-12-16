import { GoogleGenAI, Type } from "@google/genai";
import { Strategy, AIAnalysisResult } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Analyzes a specific trading strategy using Gemini.
 */
export const analyzeStrategyWithAI = async (strategy: Strategy): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      你是一位资深的A股量化交易专家和金融分析师。
      请分析以下交易策略：
      
      策略名称: ${strategy.name}
      策略类型: ${strategy.type}
      标的资产: ${strategy.asset}
      当前收益率 (ROI): ${strategy.roi}%
      风险等级: ${strategy.riskLevel}
      策略描述: ${strategy.description}
      
      请提供一个JSON格式的回复，包含简短的策略总结、3个优势、3个潜在风险以及适合的投资者类型。
      请务必使用中文回答，语言风格专业且通俗易懂。
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "2句话概括策略核心逻辑" },
            pros: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3个策略优势"
            },
            cons: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3个主要风险点"
            },
            suitability: { type: Type.STRING, description: "适合什么样的投资者？" }
          },
          required: ["summary", "pros", "cons", "suitability"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Error analyzing strategy:", error);
    return {
      summary: "AI 智能分析服务当前繁忙，请稍后再试。",
      pros: [],
      cons: [],
      suitability: "暂无数据"
    };
  }
};

/**
 * Generates a new strategy idea based on user preferences.
 */
export const generateStrategyIdea = async (
  riskProfile: string, 
  marketOutlook: string, 
  capital: number
): Promise<Partial<Strategy>> => {
  try {
    const prompt = `
      请根据以下用户画像，设计一个A股市场的量化交易策略：
      风险偏好: ${riskProfile}
      市场观点: ${marketOutlook}
      投入本金: ¥${capital}
      
      生成一个包含吸引人的中文名称、类型、详细中文描述的策略概念。
      标的资产请推荐真实的A股股票代码（如 600519, 300750 等）或主流ETF。
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "策略名称" },
            type: { type: Type.STRING, enum: ['Grid', 'DCA', 'Rebalancing', 'Martingale', 'AI Momentum'] },
            description: { type: Type.STRING, description: "策略逻辑描述" },
            minInvestment: { type: Type.NUMBER, description: "建议最低起投金额" },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            asset: { type: Type.STRING, description: "推荐的股票代码或名称" }
          },
          required: ["name", "type", "description", "minInvestment", "riskLevel", "asset"]
        }
      }
    });

    const text = response.text;
    if(!text) throw new Error("Empty AI response");

    return JSON.parse(text);

  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
};