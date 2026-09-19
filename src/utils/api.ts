// Mock API utility for Anthropic calls
// In a real hackathon project, this would hit a Vercel/Supabase Edge Function to protect the key.

export const generateAIDraft = async (prompt: string): Promise<string> => {
  // Try to use a local proxy or edge function if ENV is provided, otherwise return dummy text
  const MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true' || true; // Force mock for safety unless overridden

  if (MOCK_API) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Subject: Request to Waive Fee\n\nDear Customer Service,\n\nI noticed a fee on my account recently. As a loyal customer, I kindly request that this fee be waived.\n\nThank you,\n[Your Name]`);
      }, 1500);
    });
  }

  // Real call (requires API key)
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620', // Explicitly using requested model
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      }),
    });
    const data = await res.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic API', error);
    return "Error generating draft. Please try again later.";
  }
};
