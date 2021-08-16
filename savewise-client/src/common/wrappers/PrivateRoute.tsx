import  React, { useEffect, useState } from  "react";
import { Route, Redirect } from  "react-router-dom";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import SideBar from "../../components/SideBar/SideBar";
import { constants } from "../objects/constants";

const  PrivateRoute: React.FC<{
        component: React.FC;
        path: string;
        exact: boolean;
        conditionToRender: boolean;
    }> = (props) => {
    
    const [showSideBar, setshowSideBar] = useState<boolean>(true);

    const condition = props.conditionToRender;

    function updateVpWidth() {
        setshowSideBar(window.innerWidth > constants.mediaQueries.toggleSideBarBreakpoint);
    }

    useEffect(() => {
        window.addEventListener("resize", updateVpWidth);
        return () => {
            window.removeEventListener("resize", updateVpWidth);
        }
    }, []);

    return  condition ? (
        <div style={{ display: 'flex' }}>
            {showSideBar ?
            <SideBar /> : <NavbarComponent />}
            <div style={{ paddingTop: '50px', width: '100%', height: '95vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                <Route  path={props.path}  exact={props.exact} component={props.component} />
            </div>
        </div>
        ) : 
        (<Redirect  to={constants.routes.login}  />);
};
export  default  PrivateRoute;