import { useState } from 'react';
import './Lobby.css';

interface Room {
  id: string;
  name: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'in-progress';
}

interface LobbyProps {
  onJoinGame: () => void;
}

export function Lobby({ onJoinGame }: LobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');

  // Mock room data — API integration comes later
  const mockRooms: Room[] = [
    { id: '1', name: 'Tetris Masters', playerCount: 2, maxPlayers: 4, status: 'waiting' },
    { id: '2', name: 'Speed Run', playerCount: 1, maxPlayers: 2, status: 'waiting' },
    { id: '3', name: 'Casual Game', playerCount: 4, maxPlayers: 4, status: 'in-progress' },
    { id: '4', name: 'Practice Room', playerCount: 1, maxPlayers: 4, status: 'waiting' },
  ];

  const handleCreateRoom = () => {
    if (!playerName.trim() || !roomName.trim()) {
      alert('Please enter your name and room name');
      return;
    }
    // TODO: API call to create room
    console.log('Creating room:', roomName, 'for player:', playerName);
    onJoinGame();
  };

  const handleJoinRoom = (roomId: string) => {
    if (!playerName.trim()) {
      alert('Please enter your name first');
      return;
    }
    // TODO: API call to join room
    console.log('Joining room:', roomId, 'as player:', playerName);
    onJoinGame();
  };

  return (
    <div className="lobby">
      <header className="lobby-header">
        <h1 className="lobby-title">🎮 Squad Tetris</h1>
        <p className="lobby-subtitle">Multiplayer Tetris Battle</p>
      </header>

      <div className="lobby-content">
        <div className="player-section">
          <label htmlFor="playerName">Your Name</label>
          <input
            id="playerName"
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="input"
          />
        </div>

        <div className="lobby-sections">
          <section className="create-room-section">
            <h2>Create Room</h2>
            <div className="create-room-form">
              <input
                type="text"
                placeholder="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="input"
              />
              <button onClick={handleCreateRoom} className="btn btn-primary">
                Create New Room
              </button>
            </div>
          </section>

          <section className="join-room-section">
            <h2>Join Room</h2>
            <div className="room-list">
              {mockRooms.map((room) => (
                <div key={room.id} className={`room-card ${room.status}`}>
                  <div className="room-info">
                    <h3 className="room-name">{room.name}</h3>
                    <div className="room-meta">
                      <span className="room-players">
                        👥 {room.playerCount}/{room.maxPlayers}
                      </span>
                      <span className={`room-status status-${room.status}`}>
                        {room.status === 'waiting' ? '⏳ Waiting' : '🎮 In Progress'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={room.status === 'in-progress' || room.playerCount >= room.maxPlayers}
                    className="btn btn-secondary"
                  >
                    {room.status === 'in-progress' ? 'Playing' : room.playerCount >= room.maxPlayers ? 'Full' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
