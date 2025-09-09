
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure API_KEY is set in your environment variables for this to work.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateLogo = async (prompt: string, style: string, colors: string[]): Promise<string> => {
  try {
    let refinedPrompt = `A ${style}, modern, flat vector logo for a cryptocurrency or tech company. The logo should be centered on a solid dark background.`;

    if (colors.length > 0) {
      refinedPrompt += ` The dominant colors should be ${colors.join(' and ')}.`;
    }

    refinedPrompt += ` The theme is: "${prompt}". The logo should be simple, memorable, and suitable for a small icon. Avoid text unless specified.`;


    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: refinedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("No images generated.");
  } catch (error) {
    console.error('Error generating logo:', error);
    throw new Error('Failed to generate logo with Gemini API.');
  }
};

export const editLogo = async (base64Image: string, mimeType: string, prompt: string): Promise<{ newImage: string; textResponse: string }> => {
  try {
    const base64Data = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Edit this logo with the following instruction: "${prompt}". Keep the output as a logo on a solid background, maintaining the 1:1 aspect ratio.`,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let newImage = '';
    let textResponse = 'Edit completed.';

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes = part.inlineData.data;
              newImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
              textResponse = part.text;
            }
        }
    }
    
    if (!newImage) {
        throw new Error("No image was returned from the edit operation.");
    }

    return { newImage, textResponse };

  } catch (error) {
    console.error('Error editing logo:', error);
    throw new Error('Failed to edit logo with Gemini API.');
  }
};
