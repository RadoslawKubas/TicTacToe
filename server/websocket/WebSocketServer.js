/**
 * WebSocket Server - Serwer multiplayer dla gier online
 */
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const GameRoom = require('./GameRoom');

class WebSocketServer {
  constructor(config = {}) {
    this.port = config.port || 3001;
    this.pingInterval = config.pingInterval || 30000;
    this.pingTimeout = config.pingTimeout || 5000;
    
    this.wss = null;
    this.clients = new Map(); // clientId -> WebSocket
    this.rooms = new Map(); // roomId -> GameRoom
    this.playerRooms = new Map(); // clientId -> roomId
  }

  /**
   * Uruchom serwer WebSocket
   */
  start() {
    this.wss = new WebSocket.Server({ port: this.port });

    this.wss.on('connection', (ws, req) => {
      const clientId = uuidv4();
      this.clients.set(clientId, ws);
      
      logger.info(`Client connected: ${clientId}`);

      // Wyślij ID klienta
      this._send(ws, {
        type: 'connected',
        clientId
      });

      // Obsługa wiadomości
      ws.on('message', (message) => {
        this._handleMessage(clientId, ws, message);
      });

      // Obsługa rozłączenia
      ws.on('close', () => {
        this._handleDisconnect(clientId);
      });

      // Obsługa błędów
      ws.on('error', (error) => {
        logger.error(`WebSocket error for ${clientId}:`, { error: error.message });
      });

      // Heartbeat
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });
    });

    // Heartbeat interval
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, this.pingInterval);

    logger.info(`WebSocket Server running on port ${this.port}`);
  }

  /**
   * Zatrzymaj serwer
   */
  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.wss) {
      this.wss.close(() => {
        logger.info('WebSocket Server closed');
      });
    }
  }

  /**
   * Obsługa wiadomości od klienta
   * @private
   */
  _handleMessage(clientId, ws, message) {
    try {
      const data = JSON.parse(message);
      logger.debug(`Message from ${clientId}:`, data);

      switch (data.type) {
        case 'create_room':
          this._handleCreateRoom(clientId, ws, data);
          break;
        
        case 'join_room':
          this._handleJoinRoom(clientId, ws, data);
          break;
        
        case 'leave_room':
          this._handleLeaveRoom(clientId, ws);
          break;
        
        case 'make_move':
          this._handleMakeMove(clientId, ws, data);
          break;
        
        case 'chat_message':
          this._handleChatMessage(clientId, ws, data);
          break;
        
        case 'request_rematch':
          this._handleRematch(clientId, ws);
          break;
        
        default:
          this._send(ws, {
            type: 'error',
            code: 'UNKNOWN_MESSAGE_TYPE',
            message: `Unknown message type: ${data.type}`
          });
      }
    } catch (error) {
      logger.error('Error handling message:', { error: error.message });
      this._send(ws, {
        type: 'error',
        code: 'INVALID_MESSAGE',
        message: 'Invalid message format'
      });
    }
  }

  /**
   * Tworzy nowy pokój gry
   * @private
   */
  _handleCreateRoom(clientId, ws, data) {
    const { playerName, boardSize = 3, winCondition = 3 } = data;
    
    const roomId = uuidv4();
    const room = new GameRoom(roomId, { boardSize, winCondition });
    
    room.addPlayer(clientId, playerName);
    this.rooms.set(roomId, room);
    this.playerRooms.set(clientId, roomId);

    this._send(ws, {
      type: 'room_created',
      roomId,
      playerName,
      settings: room.settings
    });

    logger.info(`Room created: ${roomId} by ${playerName}`);
  }

  /**
   * Dołącza gracza do pokoju
   * @private
   */
  _handleJoinRoom(clientId, ws, data) {
    const { roomId, playerName } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      return this._send(ws, {
        type: 'error',
        code: 'ROOM_NOT_FOUND',
        message: 'Room not found'
      });
    }

    if (room.isFull()) {
      return this._send(ws, {
        type: 'error',
        code: 'ROOM_FULL',
        message: 'Room is full'
      });
    }

    room.addPlayer(clientId, playerName);
    this.playerRooms.set(clientId, roomId);

    // Powiadom dołączającego gracza
    this._send(ws, {
      type: 'room_joined',
      roomId,
      players: room.getPlayers(),
      gameState: room.getGameState()
    });

    // Powiadom drugiego gracza
    this._broadcastToRoom(roomId, {
      type: 'player_joined',
      playerName,
      players: room.getPlayers()
    }, clientId);

    // Jeśli pokój pełny, rozpocznij grę
    if (room.isFull()) {
      this._broadcastToRoom(roomId, {
        type: 'game_start',
        gameState: room.getGameState()
      });
    }

    logger.info(`Player ${playerName} joined room ${roomId}`);
  }

  /**
   * Opuszcza pokój
   * @private
   */
  _handleLeaveRoom(clientId, ws) {
    const roomId = this.playerRooms.get(clientId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    const playerName = room.getPlayerName(clientId);
    room.removePlayer(clientId);
    this.playerRooms.delete(clientId);

    // Powiadom pozostałych graczy
    this._broadcastToRoom(roomId, {
      type: 'player_left',
      playerName
    });

    // Usuń pusty pokój
    if (room.isEmpty()) {
      this.rooms.delete(roomId);
      logger.info(`Room ${roomId} deleted (empty)`);
    }

    logger.info(`Player ${playerName} left room ${roomId}`);
  }

  /**
   * Wykonuje ruch w grze
   * @private
   */
  _handleMakeMove(clientId, ws, data) {
    const roomId = this.playerRooms.get(clientId);
    if (!roomId) {
      return this._send(ws, {
        type: 'error',
        code: 'NOT_IN_ROOM',
        message: 'You are not in a room'
      });
    }

    const room = this.rooms.get(roomId);
    if (!room) return;

    const { row, col } = data;
    const result = room.makeMove(clientId, row, col);

    if (!result.success) {
      return this._send(ws, {
        type: 'error',
        code: 'INVALID_MOVE',
        message: result.error
      });
    }

    // Powiadom wszystkich graczy o ruchu
    this._broadcastToRoom(roomId, {
      type: 'move_made',
      row,
      col,
      player: result.player,
      gameState: room.getGameState()
    });

    // Jeśli gra się skończyła
    if (result.gameState.status !== 'playing') {
      this._broadcastToRoom(roomId, {
        type: 'game_over',
        winner: result.gameState.winner,
        winningLine: result.gameState.winningLine,
        isDraw: result.gameState.status === 'draw'
      });
    }
  }

  /**
   * Wysyła wiadomość czatu
   * @private
   */
  _handleChatMessage(clientId, ws, data) {
    const roomId = this.playerRooms.get(clientId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    const playerName = room.getPlayerName(clientId);
    
    this._broadcastToRoom(roomId, {
      type: 'chat_message',
      playerName,
      message: data.message,
      timestamp: Date.now()
    });
  }

  /**
   * Prośba o rewanż
   * @private
   */
  _handleRematch(clientId, ws) {
    const roomId = this.playerRooms.get(clientId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    room.reset();

    this._broadcastToRoom(roomId, {
      type: 'game_reset',
      gameState: room.getGameState()
    });
  }

  /**
   * Obsługa rozłączenia klienta
   * @private
   */
  _handleDisconnect(clientId) {
    this._handleLeaveRoom(clientId, null);
    this.clients.delete(clientId);
    logger.info(`Client disconnected: ${clientId}`);
  }

  /**
   * Wysyła wiadomość do klienta
   * @private
   */
  _send(ws, data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  /**
   * Broadcast do wszystkich graczy w pokoju
   * @private
   */
  _broadcastToRoom(roomId, data, excludeClientId = null) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const players = room.getPlayers();
    players.forEach(player => {
      if (player.id !== excludeClientId) {
        const ws = this.clients.get(player.id);
        this._send(ws, data);
      }
    });
  }
}

module.exports = WebSocketServer;
