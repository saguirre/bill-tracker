import fetchJson from './fetchJson';

export interface BillData {
  title: string;
  amount: number;
  category: string;
  categoryId?: number;
  dueDate: string;
}

export const extractBillData = async (text: string): Promise<BillData | null> => {
  try {
    const prompt = `Extract the title, amount, dueDate and category from the following text, return it with properties in lowercase. 
    Return the date in ISO format: "${text}".
    Remove currencies from the amount. Don't include any known currencies as the category. Only return amount as a number (without any currency symbols or not surrounded by quotes)
    Please provide the response as a JSON object with property names enclosed in double quotes. Capitalize the first letter of the title and category as well.
    For more additional context, today's date is ${new Date().toISOString().slice(0, 10)}`;

    const response: any = await fetchJson(`/api/chatgpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: prompt,
    });
    const extractedData = JSON.parse(response);
    return extractedData;
  } catch (error) {
    console.error('Error extracting bill data:', error);
  }

  return null;
};
