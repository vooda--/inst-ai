import "@/styles/globals.css";
import Head from 'next/head';
import Sidebar from "@/components/sidebar";
import { Box, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';

export default function App({Component, pageProps}) {
    const router = useRouter();

    const handleComposeClick = () => {
        router.push('/compose');
    };

    return (
        <>
            <Head>
                <title>Email App</title>
                <meta name="description" content="Email management application"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Box display="flex" minHeight="100vh" position="relative">
                <Sidebar/>
                <Box flex={1} overflow="auto">
                    <Component {...pageProps} />
                </Box>
                
            
                <Tooltip title="Compose Email" placement="left">
                    <Fab
                        color="primary"
                        aria-label="compose email"
                        onClick={handleComposeClick}
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 1000,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>
        </>
    );
}
