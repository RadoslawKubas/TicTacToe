/**
 * WebSocketService.js
 * WebSocket service for online multiplayer
 * Implements protocol compatible with backend WebSocketServer
 */

class WebSocketService {
    constructor() {
        this.ws = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.gameId = null;
        this.playerId = null;
        this.playerName = null;
        
        // Event handlers
        this.handlers = {
            onMessage: null,
            onConnect: null,
            onDisconnect: null,
            onGameState: null,
            onMoveMade: null,
            onGameOver: null,
            onPlayerJoined: null,
            onPlayerLeft: null,
            onChatMessage: null,
            onError: null,
            onRematchRequest: null,
            onRematchAccepted: null
        };
    }

    /**
     * Set event handler
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    on(event, handler) {
        if (this.handlers.hasOwnProperty(event)) {
            this.handlers[event] = handler;
        }
    }

    /**
     * Connect to WebSocket server
     * @param {string} gameId - Game ID
     * @param {string} playerName - Player name
     * @param {string} playerId - Player ID (optional)
     */
    connect(gameId, playerName = 'Player', playerId = null) {
        this.gameId = gameId;
        this.playerName = playerName;
        this.playerId = playerId || this.generatePlayerId();
        
        // Construct WebSocket URL - use port 3001 for local development
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const hostname = window.location.hostname;
        const port = (hostname === 'localhost' || hostname === '127.0.0.1') ? '3001' : window.location.port;
        const wsURL = `${protocol}//${hostname}:${port}/ws/game/${gameId}`;
        
        try {
            this.ws = new WebSocket(wsURL);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.connected = true;
                this.reconnectAttempts = 0;
                
                // Join the game room
                this.joinGame();
                
                if (this.handlers.onConnect) {
                    this.handlers.onConnect();
                }
                
                // Start heartbeat
                this.startHeartbeat();
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (e) {
                    console.error('Failed to parse WebSocket message:', e);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (this.handlers.onError) {
                    this.handlers.onError(error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.connected = false;
                this.stopHeartbeat();
                
                if (this.handlers.onDisconnect) {
                    this.handlers.onDisconnect();
                }
                
                // Attempt to reconnect
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
        }
    }

    /**
     * Handle incoming message based on type
     * @param {Object} data - Message data
     */
    handleMessage(data) {
        const { type } = data;
        
        // Call generic message handler
        if (this.handlers.onMessage) {
            this.handlers.onMessage(data);
        }
        
        // Call specific handlers based on message type
        switch (type) {
            case 'game_state':
                if (this.handlers.onGameState) {
                    this.handlers.onGameState(data);
                }
                break;
                
            case 'move_made':
                if (this.handlers.onMoveMade) {
                    this.handlers.onMoveMade(data);
                }
                break;
                
            case 'game_over':
                if (this.handlers.onGameOver) {
                    this.handlers.onGameOver(data);
                }
                break;
                
            case 'player_joined':
                if (this.handlers.onPlayerJoined) {
                    this.handlers.onPlayerJoined(data);
                }
                break;
                
            case 'player_left':
                if (this.handlers.onPlayerLeft) {
                    this.handlers.onPlayerLeft(data);
                }
                break;
                
            case 'chat_message':
                if (this.handlers.onChatMessage) {
                    this.handlers.onChatMessage(data);
                }
                break;
                
            case 'error':
                console.error('Server error:', data.message);
                if (this.handlers.onError) {
                    this.handlers.onError(data);
                }
                break;
                
            case 'rematch_request':
                if (this.handlers.onRematchRequest) {
                    this.handlers.onRematchRequest(data);
                }
                break;
                
            case 'rematch_accepted':
                if (this.handlers.onRematchAccepted) {
                    this.handlers.onRematchAccepted(data);
                }
                break;
                
            case 'pong':
                // Heartbeat response, ignore
                break;
                
            default:
                console.log('Unknown message type:', type, data);
        }
    }

    /**
     * Generate unique player ID
     * @returns {string} Player ID
     */
    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Join game room
     */
    joinGame() {
        this.send({
            type: 'join_game',
            gameId: this.gameId,
            playerName: this.playerName,
            playerId: this.playerId
        });
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.stopHeartbeat();
    }

    /**
     * Send message to server
     * @param {Object} data - Message data
     */
    send(data) {
        if (this.ws && this.connected) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket not connected');
        }
    }

    /**
     * Send move to server (compatible with backend protocol)
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    sendMove(row, col) {
        this.send({
            type: 'make_move',
            row,
            col
        });
    }

    /**
     * Send chat message (compatible with backend protocol)
     * @param {string} message - Chat message
     */
    sendChat(message) {
        this.send({
            type: 'chat_message',
            message
        });
    }

    /**
     * Request rematch
     */
    requestRematch() {
        this.send({
            type: 'request_rematch'
        });
    }

    /**
     * Accept rematch request
     */
    acceptRematch() {
        this.send({
            type: 'accept_rematch'
        });
    }

    /**
     * Decline rematch request
     */
    declineRematch() {
        this.send({
            type: 'decline_rematch'
        });
    }

    /**
     * Start heartbeat to keep connection alive
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.connected) {
                this.send({ type: 'ping' });
            }
        }, 30000); // Every 30 seconds
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Attempt to reconnect
     */
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts && this.gameId) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
                this.connect(this.gameId, this.playerName, this.playerId);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Max reconnect attempts reached');
        }
    }

    /**
     * Check if connected
     * @returns {boolean}
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Get player info
     * @returns {Object} Player info
     */
    getPlayerInfo() {
        return {
            playerId: this.playerId,
            playerName: this.playerName,
            gameId: this.gameId
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebSocketService;
}
