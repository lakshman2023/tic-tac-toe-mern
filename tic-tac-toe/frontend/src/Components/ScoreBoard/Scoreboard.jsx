import './ScoreBoard.css';

const ScoreBoard = ({title, playerScores}) => {

    return (
        <div className="scoreboard">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Rating</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {playerScores.map((playerScore, index) => (
                        <tr key={index} className="player">
                            <td>{playerScore.username}</td>
                            <td>{playerScore?.rating }</td>
                            <td>{playerScore.score ?? 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <div className="scoreboard-title">Match Scoreboard</div>
            <div className="scoreboard">
                <ul>
                    {playerScores.map(playerScore => (
                        <li className="player">
                            <h4>{playerScore.username}</h4>
                            <p>Rating : {playerScore?.rating }</p>
                            <p>Score : {playerScore.score ?? 0}</p>
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
};

export default ScoreBoard;