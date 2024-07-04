import {useNavigate} from 'react-router-dom';
import AuthContext from '../../Contexts/AuthContext/AuthContext';
const { useContext, useState } = require("react");

//login/register component
const Auth = () => {
    //console.log("context = " + JSON.stringify(useContext(AuthContext)));
    const { login, register} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if(isRegister){
                await register(email, userName, password);
            } else {
                await login(userName, password); // Redirect to the home page or dashboard after successful login/registration
            }
            navigate('/create-match');
        } catch (error) {
            setError(`${isRegister ? 'Registration' : 'Login'} failed. Please check your inputs and try again.`);
            console.error(`${isRegister ? 'Registration' : 'Login'} failed:`, error);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
    };

    return (
        <div className='auth-container'> 
            <form onSubmit={handleLogin}>
                <h2>{isRegister ? 'Register' : 'Login'}</h2>
                {error && <p className="error-message">{error}</p>}
                {isRegister && (
                    <>
                        <label>Email</label>
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </>
                )}
                <label>Username</label>
                <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} required/>
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type='submit'>{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={toggleMode} className='toggle-button'>
                {isRegister ? "Already have an account? Login" : "New user? Register"}
            </button>
        </div>
);
};

export default Auth;
