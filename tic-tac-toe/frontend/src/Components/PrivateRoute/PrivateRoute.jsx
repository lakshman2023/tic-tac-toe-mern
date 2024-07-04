import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({component : Component, ...rest}) => {
    return (
        <Route
        {...rest}
        Component={props => localStorage.getItem('token') ? (<Component {...props}/>) : (<Navigate to="/auth"/>)}
        />
    );
};

export default PrivateRoute;