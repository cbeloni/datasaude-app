const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const threadKey = process.env.REACT_APP_THREAD_KEY;

export const sendOpenAIMessage = async (content) => {
    const url = `https://api.openai.com/v1/threads/${threadKey}/messages`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'OpenAI-Beta': 'assistants=v2',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            role: 'user',
            content
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
};

export const runOpenAIThread = async (body) => {
    const url = `https://api.openai.com/v1/threads/${threadKey}/runs`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'OpenAI-Beta': 'assistants=v2',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
};

export const getOpenAIRunStatus = async (runId) => {
    const url = `https://api.openai.com/v1/threads/${threadKey}/runs/${runId}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'OpenAI-Beta': 'assistants=v2',
            'Authorization': `Bearer ${apiKey}`,
        }
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
};

export const getOpenAIMessages = async () => {
    const url = `https://api.openai.com/v1/threads/${threadKey}/messages`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'OpenAI-Beta': 'assistants=v2',
            'Authorization': `Bearer ${apiKey}`,
        }
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
};