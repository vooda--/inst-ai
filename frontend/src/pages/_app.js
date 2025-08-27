import "@/styles/globals.css";
import Head from 'next/head';
import Sidebar from "@/components/sidebar";
import { Box } from '@mui/material';

export default function App({Component, pageProps}) {
    return (
        <>
            <Head>
                <title>Email App</title>
                <meta name="description" content="Email management application"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Box display="flex" minHeight="100vh">
                <Sidebar/>
                <Box flex={1} overflow="auto">
                    <Component {...pageProps} />
                </Box>
            </Box>
        </>
    );
}
