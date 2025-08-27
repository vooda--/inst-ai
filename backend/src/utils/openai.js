/**
 * OpenAI API utility functions using fetch
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Make a request to OpenAI API
 * @param {Object} options - Request options
 * @param {string} options.apiKey - OpenAI API key
 * @param {string} options.model - Model to use (default: gpt-3.5-turbo)
 * @param {Array} options.messages - Array of message objects
 * @param {number} options.maxTokens - Maximum tokens (default: 500)
 * @param {number} options.temperature - Temperature (default: 0.7)
 * @param {number} options.retries - Number of retries (default: 1)
 * @returns {Promise<Object>} OpenAI response
 */
export async function makeOpenAIRequest({
                                            apiKey,
                                            model = 'gpt-3.5-turbo',
                                            messages,
                                            maxTokens = 500,
                                            temperature = 0.7,
                                            retries = 1
                                        }) {
    if (!apiKey) {
        throw new Error('OpenAI API key is required');
    }

    if (!messages || !Array.isArray(messages)) {
        throw new Error('Messages array is required');
    }

    const requestBody = {
        model,
        max_tokens: maxTokens,
        temperature,
        messages
    };

    console.log('Making OpenAI request:', {
        model,
        maxTokens,
        temperature,
        messageCount: messages.length
    });

    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                console.error(`OpenAI API Error (attempt ${attempt + 1}):`, {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });

                // Don't retry on certain errors
                if (response.status === 401 || response.status === 400) {
                    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
                }

                // Retry on rate limits and server errors
                if (response.status === 429 || response.status >= 500) {
                    if (attempt < retries) {
                        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                        console.log(`Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }

                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            console.log('OpenAI API Success:', {
                model: data.model,
                usage: data.usage,
                choices: data.choices?.length || 0
            });

            return data;
        } catch (error) {
            lastError = error;

            if (attempt < retries) {
                console.log(`Request failed (attempt ${attempt + 1}), retrying...`);
                continue;
            }
        }
    }

    throw lastError;
}

/**
 * Generate email content using OpenAI
 * @param {Object} options - Generation options
 * @param {string} options.apiKey - OpenAI API key
 * @param {string} options.prompt - User prompt
 * @param {string} options.classification - Email classification
 * @param {Object} options.originalEmail - Original email for context
 * @returns {Promise<Object>} Generated email with subject and body
 */
export async function generateEmail({
                                        apiKey,
                                        prompt,
                                        classification = 'sales',
                                        originalEmail = null
                                    }) {
    let emailClassification = classification;

    // If there's original email context, it's a follow-up
    if (originalEmail) {
        emailClassification = 'follow-up';
    }

    const systemMessages = [
        {
            role: "system",
            content: `You are a ${emailClassification} email assistant. Keep it under 40 words. Return only the email content JSON (subject, body) without any markdown formatting.`
        }
    ];

    if (originalEmail) {
        try {
            const parsedEmail =  JSON.parse(originalEmail);
            systemMessages.push({
                role: "system",
                content: `You are responding to this email:\nFrom: ${parsedEmail.to}\nSubject: ${parsedEmail.subject}\nBody: ${parsedEmail.body}`
            });
        } catch (error) {
            console.error('Error parsing original email:', error);
        }
    }

    const messages = [
        ...systemMessages,
        {role: "user", content: prompt}
    ];

    const response = await makeOpenAIRequest({
        apiKey,
        messages,
        maxTokens: 500,
        temperature: 0.7,
        retries: 1
    });
    let parsed = '', parsedOriginal = '';
    const text = response.choices[0].message.content;

    try {
        parsed = JSON.parse(text);
        parsedOriginal = JSON.parse(originalEmail);
        console.log('OpenAI API Response:', response);
        console.log(parsed);
        console.log(originalEmail);
    } catch (error) {
        console.error('Error parsing original email:', error);

    }
    return {
        subject: parsed.subject || parsedOriginal?.subject ||  '',
        body: parsed.body || parsed || text,
    };
}
