import { GoogleGenAI } from "@google/genai";
import { ProductModel, memoryProducts } from "../models/index.js";
import { getDbStatus } from "../config/db.js";

let aiClient = null;
function getGenAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export async function chatConcierge(req, res) {
  try {
    const { message, contextProducts } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Retrieve active catalog
    let catalog = [];
    if (contextProducts && Array.isArray(contextProducts) && contextProducts.length > 0) {
      catalog = contextProducts;
    } else if (getDbStatus()) {
      catalog = await ProductModel.find({ inStock: true }).limit(30);
    } else {
      catalog = memoryProducts.filter(p => p.inStock);
    }

    const catalogSummary = catalog.map(p =>
      `- [${p.productId}] ${p.name} ($${p.price}) in category "${p.category}". Stock: ${p.stock}. Description: ${p.description}. Features: ${p.features ? p.features.join(", ") : "N/A"}`
    ).join("\n");

    const systemPrompt = `You are Aura AI Concierge, a sophisticated, warm, and hyper-knowledgeable luxury design and lifestyle stylist for "Aura Boutique & Atelier".
Your role is to assist discerning customers with product curation, minimalist interior design advice, material choices (organic cashmere, Japanese porcelain, solid walnut, brass), gift ideas, and styling.

Current Boutique Inventory:
${catalogSummary}

Guidelines:
1. Always recommend specific items from our catalog when relevant, mentioning their exact names and prices.
2. Maintain an elegant, minimalist, welcoming, and helpful tone.
3. If asked about shipping or returns: standard shipping is 3-5 business days (free over $150), express is 1-2 business days ($18). Returns are welcomed within 30 days of delivery.
4. Keep recommendations tailored and concise (2-3 paragraphs max).`;

    const ai = getGenAI();
    if (!ai) {
      // Intelligent fallback
      const matched = catalog.find(p => message.toLowerCase().includes(p.name.toLowerCase().split(" ")[0].toLowerCase())) || catalog[0];
      return res.json({
        reply: `Thank you for consulting Aura Concierge. For your consideration, our **${matched ? matched.name : "Minimalist Ceramic Pour-Over Set"}** ($${matched ? matched.price : "68.00"}) is handcrafted from pure, sustainable materials and represents the cornerstone of our atelier collection. May I help you pair this with any complementary textiles or accessories?`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nCustomer Inquiry: ${message}` }] }
      ]
    });

    return res.json({ reply: response.text });
  } catch (error) {
    console.error("AI Concierge error:", error);
    res.status(500).json({
      reply: "Our atelier concierge is currently tending to another guest. However, our signature Ceramic Pour-Over and Linen Bedding collections are currently available for your discovery."
    });
  }
}
