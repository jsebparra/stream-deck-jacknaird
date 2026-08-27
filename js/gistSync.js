// js/gistSync.js - GitHub Gist Cloud Sync Engine

class GistSyncService {
    constructor() {
        this.tokenKey = 'cozy_streamdeck_gist_token';
        this.gistIdKey = 'cozy_streamdeck_gist_id';
        this.autoSyncKey = 'cozy_streamdeck_gist_autosync';
        this.lastSyncKey = 'cozy_streamdeck_gist_last_sync';
    }

    getToken() {
        return localStorage.getItem(this.tokenKey) || '';
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token.trim());
    }

    getGistId() {
        return localStorage.getItem(this.gistIdKey) || '';
    }

    setGistId(gistId) {
        localStorage.setItem(this.gistIdKey, gistId.trim());
    }

    isAutoSyncEnabled() {
        const val = localStorage.getItem(this.autoSyncKey);
        return val === null ? true : val === 'true';
    }

    setAutoSync(enabled) {
        localStorage.setItem(this.autoSyncKey, enabled ? 'true' : 'false');
    }

    getLastSyncTime() {
        return localStorage.getItem(this.lastSyncKey) || '';
    }

    setLastSyncTime() {
        const now = new Date().toLocaleTimeString();
        localStorage.setItem(this.lastSyncKey, now);
        return now;
    }

    isConfigured() {
        return Boolean(this.getToken() && this.getGistId());
    }

    // Prepare standard JSON payload from local data
    buildExportPayload() {
        return {
            webhookUrl: window.discordService ? window.discordService.getWebhookUrl() : '',
            globalLiveUrl: window.discordService ? window.discordService.getGlobalLiveUrl() : '',
            globalMention: window.discordService ? window.discordService.getGlobalMention() : '',
            globalFooterText: window.discordService ? window.discordService.getGlobalFooterText() : '',
            globalFooterIcon: window.discordService ? window.discordService.getGlobalFooterIcon() : '',
            games: window.gameVault ? window.gameVault.getAllGames() : [],
            updatedAt: new Date().toISOString()
        };
    }

    // Create a brand new private Gist automatically
    async createGist(token) {
        if (!token) throw new Error('Ingresa un Personal Access Token de GitHub.');

        const payloadData = this.buildExportPayload();

        const body = {
            description: '🌸 StreamDeck Pro Configuration Sync Data',
            public: false,
            files: {
                'streamdeck-config.json': {
                    content: JSON.stringify(payloadData, null, 2)
                }
            }
        };

        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error de GitHub (${response.status}): ${errText}`);
        }

        const data = await response.json();
        this.setToken(token);
        this.setGistId(data.id);
        this.setLastSyncTime();

        return data.id;
    }

    // Push local config to Cloud (PATCH)
    async pushToCloud() {
        if (!this.isConfigured()) return null;

        const token = this.getToken();
        const gistId = this.getGistId();
        const payloadData = this.buildExportPayload();

        const body = {
            description: '🌸 StreamDeck Pro Configuration Sync Data',
            files: {
                'streamdeck-config.json': {
                    content: JSON.stringify(payloadData, null, 2)
                }
            }
        };

        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error al actualizar Gist (${response.status}): ${errText}`);
        }

        const data = await response.json();
        const syncTime = this.setLastSyncTime();
        return { data, syncTime };
    }

    // Pull config from Cloud (GET)
    async pullFromCloud() {
        if (!this.isConfigured()) {
            throw new Error('Configura tu Token y Gist ID en los ajustes (⚙️) para sincronizar.');
        }

        const token = this.getToken();
        const gistId = this.getGistId();

        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json'
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error al descargar Gist (${response.status}): ${errText}`);
        }

        const data = await response.json();
        const configFile = data.files['streamdeck-config.json'];

        if (!configFile || !configFile.content) {
            throw new Error('El Gist no contiene el archivo streamdeck-config.json.');
        }

        const parsed = JSON.parse(configFile.content);

        // Update local storage with pulled cloud state
        if (parsed.webhookUrl !== undefined && window.discordService) window.discordService.setWebhookUrl(parsed.webhookUrl);
        if (parsed.globalLiveUrl !== undefined && window.discordService) window.discordService.setGlobalLiveUrl(parsed.globalLiveUrl);
        if (parsed.globalMention !== undefined && window.discordService) window.discordService.setGlobalMention(parsed.globalMention);
        if (parsed.globalFooterText !== undefined && window.discordService) window.discordService.setGlobalFooterText(parsed.globalFooterText);
        if (parsed.globalFooterIcon !== undefined && window.discordService) window.discordService.setGlobalFooterIcon(parsed.globalFooterIcon);
        if (parsed.games && Array.isArray(parsed.games) && window.gameVault) window.gameVault.saveAll(parsed.games);

        const syncTime = this.setLastSyncTime();
        return { parsed, syncTime };
    }
}

window.gistSync = new GistSyncService();
