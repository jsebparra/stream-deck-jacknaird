// js/vault.js - Game Vault & Archiving Storage Engine

class GameVaultService {
    constructor() {
        this.storageKey = 'cozy_streamdeck_games';
        this.init();
    }

    normalizeGame(gameData) {
        if (!gameData || typeof gameData !== 'object') {
            return null;
        }

        return {
            ...gameData,
            id: String(gameData.id || 'game_' + Date.now())
        };
    }

    init() {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) {
            // Clean slate by default for new users
            this.saveAll([]);
        }
    }

    getAllGames() {
        try {
            const data = localStorage.getItem(this.storageKey);
            const parsed = data ? JSON.parse(data) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    getActiveGames() {
        const all = this.getAllGames();
        return (Array.isArray(all) ? all : [])
            .filter(g => g && !g.isArchived)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getArchivedGames() {
        const all = this.getAllGames();
        return (Array.isArray(all) ? all : [])
            .filter(g => g && g.isArchived);
    }

    getGameById(id) {
        const targetId = String(id);
        return this.getAllGames().find(g => String(g.id) === targetId);
    }

    saveAll(games) {
        const normalizedGames = Array.isArray(games)
            ? games.map(game => this.normalizeGame(game)).filter(Boolean)
            : [];

        localStorage.setItem(this.storageKey, JSON.stringify(normalizedGames));
    }

    saveGame(gameData) {
        const games = this.getAllGames();
        const normalizedGame = this.normalizeGame(gameData);
        const existingIndex = games.findIndex(g => String(g.id) === String(normalizedGame.id));

        if (existingIndex >= 0) {
            games[existingIndex] = { ...games[existingIndex], ...normalizedGame };
        } else {
            normalizedGame.order = games.length + 1;
            normalizedGame.isArchived = false;
            games.push(normalizedGame);
        }
        this.saveAll(games);
        return normalizedGame;
    }

    archiveGame(id) {
        const games = this.getAllGames();
        const targetId = String(id);
        const game = games.find(g => String(g.id) === targetId);
        if (game) {
            game.isArchived = true;
            this.saveAll(games);
        }
    }

    unarchiveGame(id) {
        const games = this.getAllGames();
        const targetId = String(id);
        const game = games.find(g => String(g.id) === targetId);
        if (game) {
            game.isArchived = false;
            this.saveAll(games);
        }
    }

    deleteGame(id) {
        let games = this.getAllGames();
        const targetId = String(id);
        games = games.filter(g => String(g.id) !== targetId);
        this.saveAll(games);
    }

    clearAll() {
        this.saveAll([]);
    }

    loadSamplePresets() {
        this.saveAll(window.DEFAULT_PRESETS || []);
    }
}

window.gameVault = new GameVaultService();
