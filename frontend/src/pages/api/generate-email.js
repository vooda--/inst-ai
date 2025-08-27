import { parseEmailResponse } from '../../utils/emailParser.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/generate-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: req.body.prompt,
                original_email: req.body.original_email || null,
                classification: req.body.classification || 'follow-up'
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        const parsedData = parseEmailResponse(data);
        
        return res.status(200).json(parsedData);
    } catch (error) {
        console.error('Error generating email:', error);
        return res.status(500).json({
            error: 'Failed to generate email',
            details: error.message
        });
    }
}
