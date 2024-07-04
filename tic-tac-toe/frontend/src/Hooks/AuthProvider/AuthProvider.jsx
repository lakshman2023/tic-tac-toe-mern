import axios from '../../axiosConfig';
import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import AuthContext from '../../Contexts/AuthContext/AuthContext';

const AuthProvider = ({children}) => {
    //save user info from decoded jwt
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decoded = jwtDecode(token);
            setUser(decoded.user);
        }
    },[]);

    const login = async (username, password) => {
        //receive jwt from backend and save the token to local storage, and userId in a variable
        const res = await axios.post('/api/auth/login', {username, password});
        const {token} = res.data;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded.user);
        localStorage.setItem('userId', user.id);
        console.log(`saving user id for ${username} as ${user.id} to local storage while logging in`);
        navigate('/create-match');
    };

    const register = async (email, username, password) => {
        //receive jwt from backend and save the token to local storage, and userId in a variable
        console.log('API URL:', process.env.REACT_APP_API_URL);

        const res = await axios.post('/api/auth/register', {email, username, password});
        const {token} = res.data;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded.user);
        localStorage.setItem('userId', user.id);
        console.log(`saving user id for ${username} as ${user.id} to local storage while registering`);
        navigate('/create-match');
    };

    const logout = async () => {
        //reset token and userId
        localStorage.removeItem('token');
        setUser(null);
        navigate('/auth');
    };

    //return AuthContext Provider with user, login, register, logout as props
    //children param will be placed inside AuthContext.Provider element

    return (
        <AuthContext.Provider value={{user, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};