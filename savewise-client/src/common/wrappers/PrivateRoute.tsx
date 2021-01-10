import  React from  "react";
import { Route, Redirect } from  "react-router-dom";

const  PrivateRoute: React.FC<{
        component: React.FC;
        path: string;
        exact: boolean;
        conditionToRender: boolean;
    }> = (props) => {

    const condition = props.conditionToRender;

    return  condition ? (<Route  path={props.path}  exact={props.exact} component={props.component} />) : 
        (<Redirect  to="/login"  />);
};
export  default  PrivateRoute;