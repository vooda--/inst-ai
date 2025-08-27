export default async function handler(req, res) {
    const { id } = req.query;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    if (req.method === 'GET') {
        try {
            const response = await fetch(`${apiUrl}/emails/${id}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    return res.status(404).json({ error: 'Email not found' });
                }
                throw new Error(`Backend responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching email:', error);
            return res.status(500).json({ 
                error: 'Failed to fetch email',
                details: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
