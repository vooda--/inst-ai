import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
    Box, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';

export default function EmailsPage() {
    const router = useRouter();
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/emails');
            if (!response.ok) {
                throw new Error('Failed to fetch emails');
            }
            const data = await response.json();
            setEmails(data.emails || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Emails
                </Typography>
            </Box>

            {emails.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <EmailIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                        No emails yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Start by composing your first email
                    </Typography>
                </Box>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>To</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Preview</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {emails.map((email) => (
                                    <TableRow 
                                        key={email.id} 
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => router.push(`/emails/${email.id}`)}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                                    {email.to}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 200 }}>
                                                {email.subject}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography 
                                                variant="body2" 
                                                color="textSecondary" 
                                                noWrap
                                                sx={{ maxWidth: 300 }}
                                            >
                                                {email.body}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'grey.500' }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    {formatDate(email.created_at)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {email.cc && (
                                                    <Chip 
                                                        label="CC" 
                                                        size="small" 
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem' }}
                                                    />
                                                )}
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/compose?replyTo=${email.id}`);
                                                    }}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <ReplyIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/compose?forward=${email.id}`);
                                                    }}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <ForwardIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
}
