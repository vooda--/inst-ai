/**
 * Parse email response from GPT API
 * Handles different response formats including JSON wrapped in markdown
 */
export function parseEmailResponse(data) {
    console.log('Parsing email response:', data);

    // If data is already in the expected format
    if (data.subject && data.body) {
        return data;
    }

    // If body is a string, it might contain formatted content
    if (typeof data.body === 'string') {
        const bodyText = data.body.trim();

        if (bodyText.includes('```json')) {
            const jsonMatch = bodyText.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[1]);
                    return {
                        subject: parsed.subject || data.subject || 'Generated Email',
                        body: parsed.body || bodyText
                    };
                } catch (error) {
                    console.error('Failed to parse JSON from markdown:', error);
                }
            }
        }

        // Check for plain JSON (without markdown)
        if (bodyText.startsWith('{') && bodyText.endsWith('}')) {
            try {
                const parsed = JSON.parse(bodyText);
                return {
                    subject: parsed.subject || data.subject || 'Generated Email',
                    body: parsed.body || bodyText
                };
            } catch (error) {
                console.error('Failed to parse plain JSON:', error);
            }
        }

        // If it's just plain text, split by first newline for subject/body
        const lines = bodyText.split('\n');
        if (lines.length > 1) {
            return {
                subject: lines[0].trim(),
                body: lines.slice(1).join('\n').trim()
            };
        }

        // Fallback: treat entire text as body
        return {
            subject: data.subject || 'Generated Email',
            body: bodyText
        };
    }

    // Fallback for unexpected formats
    return {
        subject: data.subject || 'Generated Email',
        body: data.body || 'No content generated'
    };
}
