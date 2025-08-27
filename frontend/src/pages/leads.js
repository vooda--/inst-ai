import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newLead, setNewLead] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'new'
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            // For now, we'll use mock data since we don't have a leads API yet
            // In a real app, you'd fetch from your backend
            const mockLeads = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+1-555-0123',
                    company: 'Tech Corp',
                    status: 'new',
                    created_at: '2024-01-15T10:30:00Z'
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@startup.com',
                    phone: '+1-555-0456',
                    company: 'Startup Inc',
                    status: 'contacted',
                    created_at: '2024-01-14T14:20:00Z'
                }
            ];
            setLeads(mockLeads);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLead = async () => {
        if (!newLead.name || !newLead.email) {
            setError('Name and email are required');
            return;
        }

        try {
            // In a real app, you'd send this to your backend
            const lead = {
                id: leads.length + 1,
                ...newLead,
                created_at: new Date().toISOString()
            };
            
            setLeads([...leads, lead]);
            setNewLead({ name: '', email: '', phone: '', company: '', status: 'new' });
            setOpenDialog(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'primary';
            case 'contacted': return 'warning';
            case 'qualified': return 'success';
            case 'lost': return 'error';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Leads
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add Lead
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'grey.600' }} />
                                            {lead.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <EmailIcon sx={{ mr: 1, fontSize: 20, color: 'grey.600' }} />
                                            {lead.email}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <PhoneIcon sx={{ mr: 1, fontSize: 20, color: 'grey.600' }} />
                                            {lead.phone}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{lead.company}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={lead.status}
                                            color={getStatusColor(lead.status)}
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(lead.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add Lead Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} pt={1}>
                        <TextField
                            label="Name *"
                            fullWidth
                            value={newLead.name}
                            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                        />
                        <TextField
                            label="Email *"
                            fullWidth
                            type="email"
                            value={newLead.email}
                            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            value={newLead.phone}
                            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        />
                        <TextField
                            label="Company"
                            fullWidth
                            value={newLead.company}
                            onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddLead} variant="contained">Add Lead</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
