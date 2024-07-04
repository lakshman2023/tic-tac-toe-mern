import { useState } from "react";
//import AuthContext from "../../Contexts/AuthContext/AuthContext";
import {useNavigate} from "react-router-dom";
import axios from "../../axiosConfig";

const CreateMatch = () => {
    //const {user, login, register, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const [opponentUsername, setOpponentUsername] = useState('');
    const [totalGames, setTotalGames] = useState(1);
    const [boardSize, setBoardSize] = useState(3);
    const [winningLength, setWinningLength] = useState(3);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reqBody = JSON.stringify({opponentUsername, totalGames, boardSize, winningLength});
            const config = {
                                headers : {
                                                'Content-Type': 'application/json', 
                                                'Authorization' : `Bearer ${localStorage.getItem('token')}`
                                          }
                            };
            const res = await axios.post('/api/matches/create', reqBody, config);
            const match = res.data;
            const matchId = match._id;
            navigate(`/game/${matchId}`);
        } catch (error) {
            setError('Error creating match');
            console.error(error);
        }
    };

    return (
        <div className="create-match-container">
            <h2>Create a New Match</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="opponentUsername"> Opponent Username:</label>
                    <input
                        type="text"
                        id="opponentUsername"
                        value={opponentUsername}
                        onChange={(e) => setOpponentUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalGames"> Total Games:</label>
                    <input
                        type="number"
                        id="totalGames"
                        value={totalGames}
                        onChange={(e) => setTotalGames(e.target.value)}
                        min="1"
                        max="10"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="boardSize"> Board Size: </label>
                    <input
                        type="number"
                        id="totalGames"
                        value={boardSize}
                        onChange={(e) => setBoardSize(e.target.value)}
                        min="3"
                        max="9"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="winningLength"> Winning Length: </label>
                    <input
                        type="number"
                        id="winningLength"
                        value={winningLength}
                        onChange={(e) => setWinningLength(e.target.value)}
                        min="3"
                        max="9"
                        required
                    />
                </div>
                <button type="submit"> Create Match</button>
            </form>
        </div>
    )
};

export default CreateMatch;