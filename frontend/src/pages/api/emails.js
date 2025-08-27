export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/emails`);
        
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching emails:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch emails',
            details: error.message 
        });
    }
}
