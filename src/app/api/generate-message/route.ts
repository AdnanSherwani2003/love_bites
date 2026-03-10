import Groq from 'groq-sdk'

console.log('API route loaded');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
    console.log('POST request received');
    
    try {
        // Log if API key is available
        console.log('GROQ_API_KEY available:', !!process.env.GROQ_API_KEY);
        console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length);
        
        const { moods, occasion, yourName, partnerName, partnerDesc } = await req.json()
        console.log('Request data:', { moods, occasion, yourName, partnerName, partnerDesc });

        const prompt = `Write a deeply romantic, emotional love message.
From: ${yourName}. To: ${partnerName}.
Moods: ${moods.join(', ')}. Occasion: ${occasion}.
About them: ${partnerDesc || 'someone very special'}.
Tone: warm, poetic, personal. 3-4 sentences. No bullet points. No hashtags.`

        console.log('Sending request to Groq...');
        const chat = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
        })

        console.log('Groq response received');
        const message = chat.choices[0].message.content;
        console.log('Generated message length:', message?.length);
        
        return Response.json({ message })
    } catch (error: unknown) {
        console.error('=== GROQ API ERROR ===');
        console.error('Groq error details:', error);
        console.error('Error type:', typeof error);
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('=== END ERROR ===');
        
        const errorResponse = { 
            error: 'Failed to generate message',
            details: error instanceof Error ? error.message : 'Unknown error'
        };
        console.log('Sending error response:', errorResponse);
        
        return Response.json(errorResponse, { status: 500 })
    }
}
