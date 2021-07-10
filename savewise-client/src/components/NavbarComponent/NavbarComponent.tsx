import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';


interface NavbarItem {
    text: string,
    icon: React.ReactElement,
    link: string
}

export default function NavbarComponent() {
    const [visibility, setVisiblity] = useState<boolean>(false);
    const toggleDrawer = (visibility: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setVisiblity(visibility);
    };

    const navbarItems: NavbarItem[] = [
        {
            text: 'My account',
            icon: <SettingsOutlinedIcon />,
            link: '/user'
        },
        {
            text: 'My vaults',
            icon: <AccountBalanceIcon />,
            link: '/vaults'
        }
    ]

    const list = (navbarItems: NavbarItem[]) => (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List style={{ width: '250px' }}>
                {navbarItems.map((item) => (

                    <Link to={item.link} key={item.text} style={{ textDecoration: 'none', color: 'initial' }}>
                        <ListItem button>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </div>
    );
    return (
        <>
            <Button onClick={toggleDrawer(true)}>
                <MenuIcon />
            </Button>
            <Drawer
                anchor={'left'}
                open={visibility}
                onClose={toggleDrawer(false)}
            >
                {list(navbarItems)}
            </Drawer>
        </>
    );
}
