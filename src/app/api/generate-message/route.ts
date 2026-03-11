export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return Response.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
        }

        const { moods, occasion, yourName, partnerName, partnerDesc } = await req.json();

        const systemPrompt = `You are a world-class romantic writer and emotional guide for the LoveBites app. 
Your task is to write a deeply personal, vulnerable, and heartfelt love message.
The message should feel like it was written by someone who is truly in love, not an AI.

Guidelines:
- Incorporate the specific "moods" (emotions) and "occasion" naturally.
- Use the names provided (${yourName} and ${partnerName}) to make it intimate.
- Draw directly from the "story/context" provided by the user to add specific details that only they would know.
- The tone should be warm, poetic, and cinematic.
- Keep it to 3-4 powerful sentences.
- Avoid clichés; aim for authentic emotion.
- Do NOT use hashtags, bullet points, or subject lines.`;

        const userPrompt = `From: ${yourName}
To: ${partnerName}
Occasion: ${occasion}
Emotions/Moods: ${Array.isArray(moods) ? moods.join(', ') : moods}
Our Story/Context: ${partnerDesc || 'A special bond that words can barely describe.'}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://lovebites.app',
                'X-Title': 'LoveBites',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-nemo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        const message = data.choices[0]?.message?.content;

        return Response.json({ message });
    } catch (error: any) {
        console.error('Message Generation Error:', error);
        return Response.json({ 
            error: 'Failed to generate message', 
            details: error.message 
        }, { status: 500 });
    }
}
