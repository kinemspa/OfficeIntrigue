// Game state
let currentGameId = null;
let currentPlayerId = null;
let selectedEnvironment = 'office';
let refreshInterval = null;

// Utility functions
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    setTimeout(() => errorEl.classList.add('hidden'), 5000);
}

function showScreen(screenId) {
    ['menuScreen', 'lobbyScreen', 'gameScreen'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

// API calls
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

// Create game
async function createGame() {
    const data = await apiCall('/api/game/create', {
        method: 'POST',
        body: JSON.stringify({ environment: selectedEnvironment }),
    });
    
    currentGameId = data.gameId;
    
    // Prompt for player name and auto-join
    const playerName = prompt('Enter your name:');
    if (!playerName) {
        showError('Name required to join game');
        return;
    }
    
    await joinGame(data.gameId, playerName);
}

// Join game
async function joinGame(gameId, playerName) {
    const data = await apiCall('/api/game/join', {
        method: 'POST',
        body: JSON.stringify({ gameId, playerName }),
    });
    
    currentGameId = gameId;
    currentPlayerId = data.id;
    
    loadLobby();
}

// Load lobby
async function loadLobby() {
    const game = await apiCall(`/api/game/state/${currentGameId}`);
    
    document.getElementById('lobbyGameId').textContent = game.id;
    document.getElementById('lobbyEnvironment').textContent = game.environment.theme;
    
    const statusEl = document.getElementById('lobbyStatus');
    statusEl.textContent = game.status;
    statusEl.className = `status-badge status-${game.status}`;
    
    document.getElementById('playerCount').textContent = game.players.length;
    
    const playersContainer = document.getElementById('lobbyPlayers');
    playersContainer.innerHTML = game.players.map(p => `
        <div class="player-card">
            ${p.displayName}
            ${p.id === currentPlayerId ? ' (You)' : ''}
        </div>
    `).join('');
    
    showScreen('lobbyScreen');
    
    // Auto-refresh lobby
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(async () => {
        const updatedGame = await apiCall(`/api/game/state/${currentGameId}`);
        if (updatedGame.status === 'active') {
            clearInterval(refreshInterval);
            loadGame();
        }
    }, 3000);
}

// Start game
async function startGame() {
    await apiCall(`/api/game/start/${currentGameId}`, { method: 'POST' });
    clearInterval(refreshInterval);
    loadGame();
}

// Load game
async function loadGame() {
    const game = await apiCall(`/api/game/state/${currentGameId}`);
    
    // Display role
    const currentPlayer = game.players.find(p => p.id === currentPlayerId);
    const roleEl = document.getElementById('yourRole');
    if (currentPlayer) {
        const roleClass = currentPlayer.role.loyalty === 'impostor' ? 'role-impostor' : 'role-crew';
        roleEl.innerHTML = `Your Role: <span class="${roleClass}">${currentPlayer.role.name.toUpperCase()}</span>`;
    }
    
    // Integrity meter
    const integrityBar = document.getElementById('integrityBar');
    integrityBar.style.width = `${game.integrityMeter}%`;
    integrityBar.textContent = `${game.integrityMeter}%`;
    
    // Tasks
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = game.environment.tasks.map(task => {
        const isParticipant = task.participants.includes(currentPlayerId);
        const isFull = task.participants.length >= task.slotsAvailable;
        
        return `
            <div class="task-card ${task.completed ? 'completed' : ''}">
                <div class="task-title">${task.title}</div>
                <div>${task.description}</div>
                <div class="task-slots">
                    Slots: ${task.participants.length}/${task.slotsAvailable} | 
                    Duration: ${task.duration} | 
                    Points: ${task.rewards?.points || 0}
                </div>
                <div class="action-buttons">
                    ${!task.completed && !isParticipant && !isFull ? 
                        `<button onclick="joinTask('${task.id}')">Join Task</button>` : ''}
                    ${isParticipant && !task.completed ? 
                        `<button onclick="completeTask('${task.id}')">Complete Task</button>` : ''}
                    ${task.completed ? '<span style="color: #28a745;">✓ Completed</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Players
    const playersContainer = document.getElementById('gamePlayers');
    playersContainer.innerHTML = game.players.map(p => {
        const isYou = p.id === currentPlayerId;
        const isImpostor = p.role.loyalty === 'impostor';
        const playerClass = isImpostor && isYou ? 'impostor' : '';
        
        return `
            <div class="player-card ${playerClass}">
                <div>${p.displayName}${isYou ? ' (You)' : ''}</div>
                <div style="font-size: 0.85em; color: #666;">
                    Tasks: ${p.stats.tasksCompleted} | 
                    Votes: ${p.stats.votesReceived}
                </div>
                ${!isYou && p.isAlive ? 
                    `<button onclick="castVote('${p.id}')" style="width: 100%; margin-top: 8px; padding: 6px; font-size: 0.9em;">
                        Vote Out
                    </button>` : ''}
            </div>
        `;
    }).join('');
    
    showScreen('gameScreen');
}

// Join task
async function joinTask(taskId) {
    try {
        await apiCall('/api/task/join', {
            method: 'POST',
            body: JSON.stringify({ gameId: currentGameId, taskId }),
        });
        loadGame();
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Complete task
async function completeTask(taskId) {
    try {
        await apiCall('/api/task/complete', {
            method: 'POST',
            body: JSON.stringify({ gameId: currentGameId, taskId }),
        });
        loadGame();
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Cast vote
async function castVote(suspectId) {
    if (!confirm('Are you sure you want to vote out this player?')) return;
    
    try {
        await apiCall('/api/vote/cast', {
            method: 'POST',
            body: JSON.stringify({ gameId: currentGameId, suspectId }),
        });
        loadGame();
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Environment selection
    document.querySelectorAll('.env-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.env-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedEnvironment = option.dataset.env;
        });
    });
    
    // Create game
    document.getElementById('createGameBtn').addEventListener('click', createGame);
    
    // Join game
    document.getElementById('joinGameBtn').addEventListener('click', () => {
        const gameId = document.getElementById('joinGameId').value.trim();
        const playerName = document.getElementById('playerName').value.trim();
        
        if (!gameId || !playerName) {
            showError('Please enter both Game ID and your name');
            return;
        }
        
        joinGame(gameId, playerName);
    });
    
    // Start game
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    
    // Back to menu
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        if (refreshInterval) clearInterval(refreshInterval);
        currentGameId = null;
        currentPlayerId = null;
        showScreen('menuScreen');
    });
    
    // Refresh game
    document.getElementById('refreshBtn').addEventListener('click', loadGame);
    
    // Leave game
    document.getElementById('leaveGameBtn').addEventListener('click', () => {
        currentGameId = null;
        currentPlayerId = null;
        showScreen('menuScreen');
    });
});
