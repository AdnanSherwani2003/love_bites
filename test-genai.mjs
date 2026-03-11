import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const keyMatch = envFile.match(/OPENROUTER_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1].trim() : '';

const models = [
    'meta-llama/llama-3-8b-instruct',
    'meta-llama/llama-3.1-8b-instruct',
    'mistralai/mistral-nemo',
    'nousresearch/hermes-3-llama-3.1-405b',
    'openchat/openchat-7b',
];

let results = '';
for (const model of models) {
    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages: [{ role: 'user', content: 'Say hi.' }] })
        });
        const data = await res.json();
        if (data.error) {
            results += `❌ ${model}: ${data.error.message}\n`;
        } else {
            results += `✅ ${model}: ${data.choices?.[0]?.message?.content?.slice(0, 30)}\n`;
        }
    } catch (e) {
        results += `❌ ${model}: ${e.message}\n`;
    }
}
fs.writeFileSync('test-genai.out', results, 'utf8');
