import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const ask = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      n: 1,
      max_tokens: 50,
      temperature: 0.5,
    });

    const message = response?.data?.choices?.[0]?.text?.trim() || '';
    return message;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return '';
  }
};
