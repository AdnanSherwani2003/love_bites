export async function POST(req: Request) {
    try {
        console.log('=== API CALL STARTED ===');
        
        const apiKey = process.env.OPENROUTER_API_KEY;
        console.log('API Key exists:', !!apiKey);
        console.log('API Key length:', apiKey?.length || 0);
        
        if (!apiKey) {
            console.error('OpenRouter API key not configured in environment variables');
            return Response.json({ 
                error: 'OpenRouter API key not configured', 
                details: 'Please set OPENROUTER_API_KEY in your environment variables'
            }, { status: 500 });
        }

        const requestBody = await req.json();
        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        
        const { moods, occasion, yourName, partnerName, partnerDesc } = requestBody;

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

        console.log('Making OpenRouter API call...');
        
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

        console.log('OpenRouter Response Status:', response.status, response.statusText);
        console.log('OpenRouter Response Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API Error:', response.status, errorText);
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText };
            }
            
            return Response.json({ 
                error: 'OpenRouter API error', 
                details: errorData.error?.message || errorData.error || `API error: ${response.status} ${response.statusText}`,
                status: response.status 
            }, { status: 500 });
        }

        const data = await response.json();
        console.log('OpenRouter Response Data:', JSON.stringify(data, null, 2));
        
        const message = data.choices[0]?.message?.content;
        console.log('Extracted Message:', message);

        if (!message) {
            console.error('No message found in OpenRouter response');
            return Response.json({ 
                error: 'No message generated', 
                details: 'OpenRouter response missing message content'
            }, { status: 500 });
        }

        console.log('=== API CALL SUCCESS ===');
        return Response.json({ message });
    } catch (error: any) {
        console.error('Message Generation Error:', error);
        return Response.json({ 
            error: 'Failed to generate message', 
            details: error.message 
        }, { status: 500 });
    }
}
