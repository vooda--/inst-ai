import Link from "next/link";
import { useRouter } from "next/router";
import EmailIcon from "@mui/icons-material/Email";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ComposeIcon from "@mui/icons-material/Edit";
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

export default function Sidebar() {
    const router = useRouter();
    
    const menuItems = [
        { href: "/", icon: <EmailIcon />, text: "Emails", exact: true },
        { href: "/compose", icon: <ComposeIcon />, text: "Compose" },
        { href: "/leads", icon: <AccountBoxIcon />, text: "Leads" }
    ];

    return (
        <Box
            sx={{
                width: 240,
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                borderRight: "1px solid #e0e0e0",
                padding: 2
            }}
        >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}>
                Email App
            </Typography>
            
            <List>
                {menuItems.map((item) => {
                    const isActive = item.exact 
                        ? router.pathname === item.href
                        : router.pathname.startsWith(item.href);
                    
                    return (
                        <ListItem
                            key={item.href}
                            component={Link}
                            href={item.href}
                            sx={{
                                borderRadius: 1,
                                mb: 1,
                                backgroundColor: isActive ? "#e3f2fd" : "transparent",
                                color: isActive ? "#1976d2" : "inherit",
                                "&:hover": {
                                    backgroundColor: isActive ? "#e3f2fd" : "#f0f0f0"
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive ? "#1976d2" : "inherit" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}
