import { INavbarItem } from "./INavbarItem";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { constants } from "./constants";

export const navbarItems: INavbarItem[] = [
    {
        text: 'Account',
        icon: <SettingsOutlinedIcon />,
        link: constants.routes.account
    },
    {
        text: 'Dashboard',
        icon: <AssessmentIcon />,
        link: constants.routes.dashboard
    },
    {
        text: 'Vaults',
        icon: <AccountBalanceIcon />,
        link: constants.routes.vaults
    }
];