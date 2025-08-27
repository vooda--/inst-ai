import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
    Box, 
    Typography, 
    Button, 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function ComposePage() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [originalEmail, setOriginalEmail] = useState(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt for AI generation');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Determine classification based on whether this is a reply or new email
            let classification = 'sales'; // Default for new emails
            
            // Check if this is a reply (has original email context)
            if (originalEmail) {
                classification = 'follow-up';
            } else {
                // For new emails, check if it's sales-related
                classification = /sale|offer|product|promotion|discount/i.test(prompt) ? 'sales' : 'sales';
            }
            
            const res = await fetch('/api/generate-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt,
                    classification,
                    original_email: originalEmail ? JSON.stringify(originalEmail) : null
                }),
            });
            
            if (!res.ok) {
                throw new Error('Failed to generate email');
            }
            
            const data = await res.json();
            setSubject(data.subject);
            setBody(data.body);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!to || !subject || !body) {
            setError('Please fill in all required fields (To, Subject, Body)');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, cc, bcc, subject, body }),
            });
            
            if (!res.ok) {
                throw new Error('Failed to send email');
            }
            
            const data = await res.json();
            setSuccess(true);
            setOpen(false);
            
            // Reset form
            setTo('');
            setCc('');
            setBcc('');
            setSubject('');
            setBody('');
            setPrompt('');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    // Handle reply and forward functionality
    useEffect(() => {
        const { replyTo, forward } = router.query;
        
        if (replyTo) {
            // Load email for reply
            fetchEmailForReply(replyTo);
        } else if (forward) {
            // Load email for forward
            fetchEmailForForward(forward);
        }
    }, [router.query]);

    const fetchEmailForReply = async (emailId) => {
        try {
            const response = await fetch(`/api/emails/${emailId}`);
            if (response.ok) {
                const data = await response.json();
                const email = data.email;
                setTo(email.to);
                setSubject(`Re: ${email.subject}`);
                setBody(`\n\n--- Original Message ---\nFrom: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`);
                
                // Store original email for AI generation context
                setOriginalEmail(email);
            }
        } catch (error) {
            console.error('Error loading email for reply:', error);
        }
    };

    const fetchEmailForForward = async (emailId) => {
        try {
            const response = await fetch(`/api/emails/${emailId}`);
            if (response.ok) {
                const data = await response.json();
                const email = data.email;
                setSubject(`Fwd: ${email.subject}`);
                setBody(`\n\n--- Forwarded Message ---\nFrom: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`);
                
                // Store original email for AI generation context
                setOriginalEmail(email);
            }
        } catch (error) {
            console.error('Error loading email for forward:', error);
        }
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Compose Email
                </Typography>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Email sent successfully!
                </Alert>
            )}

            <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                        label="To *"
                        fullWidth
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@example.com"
                    />
                    
                    <TextField
                        label="CC"
                        fullWidth
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        placeholder="cc@example.com"
                    />
                    
                    <TextField
                        label="BCC"
                        fullWidth
                        value={bcc}
                        onChange={(e) => setBcc(e.target.value)}
                        placeholder="bcc@example.com"
                    />
                    
                    <TextField
                        label="Subject *"
                        fullWidth
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject"
                    />
                    
                    <TextField
                        label="Body *"
                        fullWidth
                        multiline
                        rows={6}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Enter email body"
                    />
                    
                    <Box>
                        <Typography variant="h6" mb={2}>
                            AI Assistant ✨
                        </Typography>
                        <TextField
                            label="Describe what you want to write"
                            fullWidth
                            multiline
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Write a follow-up email to a client about our recent meeting"
                        />
                        <Button
                            variant="outlined"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Generate with AI'}
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error">{error}</Alert>
                    )}

                    <Box display="flex" gap={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={handleSend}
                            disabled={loading || !to || !subject || !body}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Send Email'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
