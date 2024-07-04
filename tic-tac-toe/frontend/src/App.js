import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './Components/Auth/Auth';
import CreateMatch from './Components/CreateMatch';
import Game from './Components/Game';
import ScoreBoard from './Components/ScoreBoard/Scoreboard';
import Logout from './Components/Logout';
import AuthProvider from './Hooks/AuthProvider/AuthProvider';
import { jwtDecode } from 'jwt-decode';
function App() {
  const isAuthenticated = (localStorage.getItem('token') != null);
  // && jwtDecode(localStorage.getItem('token')).exp < Date.now()/1000);
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          {/* <header className="App-header"> */}
            <Routes>
              <Route path='/auth' Component={Auth}/>
              <Route path='/' Component={Auth}/>
              {isAuthenticated && (
                <>
                  <Route path='/create-match' Component={CreateMatch}/>
                  <Route path='/game/:matchId' Component={Game}/>
                  <Route path='/scoreboard' Component={ScoreBoard}/>
                  <Route path='/logout' Component={Logout}/>
                </>
                ) 
              }
            </Routes>
          {/* </header> */}
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
