const fs = require('fs');
const OpenAI = require('openai');

// NOTE: Do NOT commit your OpenAI API key. Set OPENAI_API_KEY in your local .env
if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. Set it in .env to enable card extraction.');
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * extractCardFromImage(filePath)
 * - Reads image file, calls OpenAI to extract structured fields.
 * - Returns object: { name, title, phones: [], emails: [], website }
 *
 * Important: this is a template implementation using the OpenAI Responses API.
 * Depending on the model availability you may need to change model name to a
 * vision-capable model (e.g., a GPT-4o-vision family model) or perform OCR first.
 */
async function extractCardFromImage(filePath) {
  if (!process.env.OPENAI_API_KEY) {
    // Return a helpful error to the API client instead of throwing key leak info
    throw new Error('OpenAI API key not configured on server');
  }

  const imageBytes = fs.readFileSync(filePath);
  const b64 = imageBytes.toString('base64');

  // Build a strong prompt instructing the model to parse the business card.
  // The Responses API supports mixed input including images for vision-capable models.
  const prompt = `Extract the following fields from the business card image exactly as JSON with keys: name, title, phones (array), emails (array), website. If a field is not present, use null or empty array. Respond only with JSON.`;

  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini-vision', // <-- adjust to a vision-capable model available on your account
      input: [
        { role: 'user', content: prompt },
        // send the image as a data URL -- the SDK/server will handle it for vision models
        { role: 'user', content: [{ type: 'input_image', image: `data:image/jpeg;base64,${b64}` }] }
      ],
      // limit tokens/timeout as appropriate
      max_output_tokens: 700
    });

    // Responses API returns structured output — try to find JSON in the output
    const output = response.output ?? response; // fallback
    const text = (output[0] && output[0].content && output[0].content[0] && output[0].content[0].text) ||
      JSON.stringify(output);

    // Try to parse JSON from returned text
    const jsonMatch = text.trim();
    try {
      const parsed = JSON.parse(jsonMatch);
      return parsed;
    } catch (e) {
      // If not pure JSON, attempt to locate a JSON block inside text
      const maybe = jsonMatch.match(/\{[\s\S]*\}/);
      if (maybe) return JSON.parse(maybe[0]);
      // last resort: return raw text in `raw` field
      return { raw: text };
    }
  } catch (err) {
    console.error('OpenAI extract error:', err);
    throw err;
  }
}

module.exports = { extractCardFromImage };
