const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.GEMINI_API_KEY) {
  console.error('[AI Service] FATAL: GEMINI_API_KEY is missing from .env');
}
console.log('[AI Service] Initializing with model: gemini-2.5-flash');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── Recipe Generation (upgraded: supports cuisine, diet, time, ingredients array) ──
const generateRecipe = async ({ ingredients, cuisine, dietPreferences, cookingTime }) => {
  try {
    console.log('[Gemini] generateRecipe called:', { ingredients, cuisine, dietPreferences, cookingTime });

    // Build a rich, structured prompt
    const ingredientList = Array.isArray(ingredients)
      ? ingredients.join(', ')
      : String(ingredients);

    const cuisineLine   = cuisine && cuisine !== 'Any' ? `Cuisine style: ${cuisine}.` : '';
    const dietLine      = dietPreferences && dietPreferences.length > 0 ? `Dietary requirements (strictly follow all): ${dietPreferences.join(', ')}.` : '';
    const timeLine      = cookingTime && cookingTime !== 'Any' ? `Total cooking + prep time MUST be ${cookingTime}.` : '';

    const prompt = `
You are a world-class Michelin-star chef and certified nutritionist.

Generate a highly detailed, professional, and creative recipe using PRIMARILY these ingredients: ${ingredientList}.
${cuisineLine}
${dietLine}
${timeLine}

Guidelines:
- The recipe must be realistic, delicious, and clearly explained.
- Provide accurate nutrition estimates based on a typical serving.
- Instructions must be clear, numbered steps that even a beginner can follow.
- Cooking time in the response must match the requested constraint (if given).

IMPORTANT: Return ONLY a single valid raw JSON object. No markdown, no backticks, no commentary outside the JSON.

Use this EXACT schema:
{
  "title": "A creative, appetizing recipe title",
  "ingredients": ["exact quantity + ingredient name", "exact quantity + ingredient name"],
  "instructions": ["Step 1: detailed action...", "Step 2: detailed action..."],
  "cookingTime": "Total time e.g. 25 minutes",
  "difficultyLevel": "Easy | Medium | Hard",
  "cuisineType": "Specific cuisine name",
  "calories": "e.g. 480 kcal per serving",
  "servings": "e.g. 2 servings",
  "nutritionDetails": {
    "protein": "e.g. 32g",
    "carbs": "e.g. 45g",
    "fat": "e.g. 14g",
    "fiber": "e.g. 7g"
  },
  "tags": ["vegetarian", "quick", "high-protein"]
}
`;

    console.log('[Gemini] Sending enriched prompt to gemini-2.5-flash...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    console.log('[Gemini] Raw response received. Length:', rawText.length, 'chars');

    const cleanedText = rawText
      .replace(/^```json\s*/gi, '')
      .replace(/^```\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .trim();

    const parsedRecipe = JSON.parse(cleanedText);

    if (!parsedRecipe.title || !Array.isArray(parsedRecipe.ingredients) || !Array.isArray(parsedRecipe.instructions)) {
      throw new Error('AI response is missing required fields');
    }

    console.log('[Gemini] Successfully parsed recipe:', parsedRecipe.title);
    return parsedRecipe;

  } catch (error) {
    console.error('[Gemini] generateRecipe error:', error.message);

    if (error.message && error.message.includes('429')) {
      console.warn('[Gemini] Quota exceeded — returning fallback recipe');
      const ingredientList = Array.isArray(ingredients) ? ingredients : [String(ingredients)];
      return generateFallbackRecipe(ingredientList, cuisine);
    }

    throw new Error(error.message || 'Recipe generation failed');
  }
};

// ─── Fallback when API quota is exhausted ────────────────────────────────────
const generateFallbackRecipe = (ingredients, cuisine) => {
  console.log('[AI Service] Using fallback recipe');
  const ingList = Array.isArray(ingredients)
    ? ingredients.map(i => `1 portion of ${i.trim()}`)
    : ['Your chosen ingredients'];

  return {
    title: "Chef's Quick Fusion Bowl",
    ingredients: ingList,
    instructions: [
      "Step 1: Wash and prepare all your ingredients.",
      "Step 2: Heat a pan over medium heat with a drizzle of oil.",
      "Step 3: Add your ingredients and sauté for 5-7 minutes.",
      "Step 4: Season with salt, pepper, and your preferred spices.",
      "Step 5: Plate up and serve warm. Enjoy!"
    ],
    cookingTime: "20 minutes",
    difficultyLevel: "Easy",
    cuisineType: cuisine || "Fusion",
    calories: "Approx. 350 kcal per serving",
    servings: "2 servings",
    nutritionDetails: { protein: "~18g", carbs: "~30g", fat: "~10g", fiber: "~5g" },
    tags: ["quick", "fusion"]
  };
};

// ─── Chat Response ────────────────────────────────────────────────────────────
const generateChatResponse = async (message) => {
  try {
    console.log('[Gemini] generateChatResponse called.');
    const prompt = `You are a friendly culinary assistant and nutritionist. Answer this cooking question concisely and helpfully: "${message}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('[Gemini] Chat response generated successfully');
    return text;
  } catch (error) {
    console.error('[Gemini] generateChatResponse error:', error.message);
    throw new Error('Could not generate a response right now. Please try again.');
  }
};

module.exports = { generateRecipe, generateChatResponse };
