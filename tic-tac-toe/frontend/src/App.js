import tic_tac_toe from './tic_tac_toe.webp';

import './App.css';
import Board from './Components/Board/Board';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={tic_tac_toe} className="App-logo" alt="logo" />
        <p>
          Welcome buddy, let's play!
        </p>
        <Board/>
      </header>
      
    </div>
  );
}

export default App;
