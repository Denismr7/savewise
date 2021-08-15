import  React from  "react";
import { Route, Redirect } from  "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import { constants } from "../objects/constants";

const  PrivateRoute: React.FC<{
        component: React.FC;
        path: string;
        exact: boolean;
        conditionToRender: boolean;
    }> = (props) => {

    const condition = props.conditionToRender;

    return  condition ? (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div style={{ paddingTop: '50px', width: '100%', height: '95vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                <Route  path={props.path}  exact={props.exact} component={props.component} />
            </div>
        </div>
        ) : 
        (<Redirect  to={constants.routes.login}  />);
};
export  default  PrivateRoute;