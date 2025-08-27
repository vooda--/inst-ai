import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Avatar,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';

export default function EmailDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchEmail();
        }
    }, [id]);

    const fetchEmail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/emails/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch email');
            }
            const data = await response.json();
            setEmail(data.email);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBack = () => {
        router.back();
    };

    const handleReply = () => {
        router.push(`/compose?replyTo=${email.id}`);
    };

    const handleForward = () => {
        router.push(`/compose?forward=${email.id}`);
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
                <Button 
                    variant="outlined" 
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    if (!email) {
        return (
            <Box p={3}>
                <Alert severity="warning">Email not found</Alert>
                <Button 
                    variant="outlined" 
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Email Details
                </Typography>
            </Box>

            {/* Email Content */}
            <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                {/* Email Header */}
                <Box mb={3}>
                    <Typography variant="h5" component="h2" mb={2}>
                        {email.subject}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            <PersonIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                To: {email.to}
                            </Typography>
                            <Box display="flex" alignItems="center" mt={0.5}>
                                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'grey.500' }} />
                                <Typography variant="body2" color="textSecondary">
                                    {formatDate(email.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* CC and BCC */}
                    {(email.cc || email.bcc) && (
                        <Box mb={2}>
                            {email.cc && (
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                                        CC:
                                    </Typography>
                                    <Typography variant="body2">
                                        {email.cc}
                                    </Typography>
                                </Box>
                            )}
                            {email.bcc && (
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                                        BCC:
                                    </Typography>
                                    <Typography variant="body2">
                                        {email.bcc}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Status Chip */}
                    <Chip 
                        label="Sent" 
                        color="success" 
                        size="small"
                        icon={<EmailIcon />}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Email Body */}
                <Box mb={3}>
                    <Typography variant="h6" mb={2}>
                        Message
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6
                        }}
                    >
                        {email.body}
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        startIcon={<ReplyIcon />}
                        onClick={handleReply}
                    >
                        Reply
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ForwardIcon />}
                        onClick={handleForward}
                    >
                        Forward
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
