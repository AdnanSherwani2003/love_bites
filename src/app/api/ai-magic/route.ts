import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { feeling, mood } = await req.json();

        if (!feeling) {
            return NextResponse.json({ error: 'Feeling is required' }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
        }

        const systemPrompt = `You are a romantic and emotional AI poet for the LoveBites app. 
Your goal is to transform the user's current feelings and mood into a deeply personal, heartfelt love message.
The message must feel authentic, vulnerable, and cinematic.

Write the message in 3 parts:
1. opening: A poetic, intimate opening line (1 sentence).
2. message: A warm, deeply emotional main body (3-4 sentences) that speaks directly to the shared feelings.
3. closing: A tender, memorable signature-style closing (1 sentence).

Respond ONLY with valid JSON in this format:
{
  "opening": "...",
  "message": "...",
  "closing": "..."
}
Do not include any other text or markdown.`;

        const userPrompt = `Feeling: ${feeling}\nMood/Occasion: ${mood || 'Not specified'}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://lovebites.app', // Optional
                'X-Title': 'LoveBites', // Optional
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-nemo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenRouter Error:', data);
            return NextResponse.json({ error: 'Failed to generate message', details: data }, { status: response.status });
        }

        const content = data.choices[0].message.content;
        return NextResponse.json(JSON.parse(content));

    } catch (error: any) {
        console.error('AI Magic Error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
