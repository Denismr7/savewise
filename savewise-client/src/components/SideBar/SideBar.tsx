import React from 'react';
import { INavbarItem } from '../../common/objects/INavbarItem';
import { navbarItems } from '../../common/objects/routes';
import SideBarItem from '../SideBarItem/SideBarItem';
import styles from './SideBar.module.scss';

export default function SideBar() {

    function renderItems(navBarItems: INavbarItem[]) {
        return navBarItems.map((item, index) =>
            <SideBarItem key={index} item={item} />
            );
    }

    return (
        <div className={styles.sideBar}>
            {renderItems(navbarItems)}
        </div>
    )
}
