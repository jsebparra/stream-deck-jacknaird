// js/vault.js - Game Vault & Archiving Storage Engine

class GameVaultService {
    constructor() {
        this.storageKey = 'cozy_streamdeck_games';
        this.init();
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
        return this.getAllGames().find(g => g.id === id);
    }

    saveAll(games) {
        localStorage.setItem(this.storageKey, JSON.stringify(games));
    }

    saveGame(gameData) {
        const games = this.getAllGames();
        const existingIndex = games.findIndex(g => g.id === gameData.id);

        if (existingIndex >= 0) {
            games[existingIndex] = { ...games[existingIndex], ...gameData };
        } else {
            gameData.id = gameData.id || 'game_' + Date.now();
            gameData.order = games.length + 1;
            gameData.isArchived = false;
            games.push(gameData);
        }
        this.saveAll(games);
        return gameData;
    }

    archiveGame(id) {
        const games = this.getAllGames();
        const game = games.find(g => g.id === id);
        if (game) {
            game.isArchived = true;
            this.saveAll(games);
        }
    }

    unarchiveGame(id) {
        const games = this.getAllGames();
        const game = games.find(g => g.id === id);
        if (game) {
            game.isArchived = false;
            this.saveAll(games);
        }
    }

    deleteGame(id) {
        let games = this.getAllGames();
        games = games.filter(g => g.id !== id);
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
