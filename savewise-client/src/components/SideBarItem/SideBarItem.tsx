import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

import styles from "./SideBarItem.module.scss";
import { INavbarItem } from '../../common/objects/INavbarItem';


export default function SideBarItem({ item }: { item: INavbarItem }) {
    const route = useLocation();

    function isActive(): boolean {
        return route.pathname.includes(item.link);
    }

    return (
        <Link to={item.link} key={item.text} className={`${styles.sideBarItem} ${isActive() ? (styles.active) : undefined}`}>
            {item.icon}
            {item.text}
        </Link>
    )
}
