// js/webhook.js - Discord Webhook Integration Engine

class DiscordWebhookService {
    constructor() {
        this.storageKey = 'cozy_streamdeck_webhook_url';
        this.globalLiveUrlKey = 'cozy_streamdeck_global_live_url';
        this.globalMentionKey = 'cozy_streamdeck_global_mention';
        this.globalFooterTextKey = 'cozy_streamdeck_global_footer_text';
        this.globalFooterIconKey = 'cozy_streamdeck_global_footer_icon';
        this.historyKey = 'cozy_streamdeck_history';
    }

    getWebhookUrl() {
        return localStorage.getItem(this.storageKey) || '';
    }

    setWebhookUrl(url) {
        localStorage.setItem(this.storageKey, url.trim());
    }

    getGlobalLiveUrl() {
        return localStorage.getItem(this.globalLiveUrlKey) || 'https://www.tiktok.com/@live';
    }

    setGlobalLiveUrl(url) {
        localStorage.setItem(this.globalLiveUrlKey, url.trim());
    }

    getGlobalMention() {
        return localStorage.getItem(this.globalMentionKey) || '@everyone';
    }

    setGlobalMention(mention) {
        localStorage.setItem(this.globalMentionKey, mention);
    }

    getGlobalFooterText() {
        return localStorage.getItem(this.globalFooterTextKey) || 'TikTok Live Stream';
    }

    setGlobalFooterText(text) {
        localStorage.setItem(this.globalFooterTextKey, text.trim());
    }

    getGlobalFooterIcon() {
        return localStorage.getItem(this.globalFooterIconKey) || 'https://cdn-icons-png.flaticon.com/512/3046/3046124.png';
    }

    setGlobalFooterIcon(url) {
        localStorage.setItem(this.globalFooterIconKey, url.trim());
    }

    isValidUrl(url) {
        if (!url) return false;
        return /^https:\/\/(discord|canary\.discord)\.com\/api\/webhooks\/\d+\/[\w-]+$/i.test(url.trim());
    }

    hexToDecimalColor(hex) {
        if (!hex) return 0xFFB7C5;
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        return parseInt(cleanHex, 16) || 0xFFB7C5;
    }

    buildPayload(gameData) {
        // STRICT GLOBAL INHERITANCE: Always use Global Live URL, Mention & Global Footer
        const streamUrl = this.getGlobalLiveUrl();
        const mentionText = this.getGlobalMention();
        const footerText = this.getGlobalFooterText();
        const footerIcon = this.getGlobalFooterIcon();

        const content = mentionText ? `${mentionText} 🌸 **¡Estamos EN VIVO en TikTok!**` : '🌸 **¡Estamos EN VIVO en TikTok!**';

        const embed = {
            title: gameData.title || `🔴 ¡Estamos en Live streaming ${gameData.gameName}!`,
            description: gameData.description || '¡Únete al directo ahora para convivir, chatear y pasar un gran rato!',
            url: streamUrl,
            color: this.hexToDecimalColor(gameData.accentColor),
            timestamp: new Date().toISOString(),
            footer: {
                text: `${footerText} • ${gameData.gameName || 'Directo'}`,
                icon_url: footerIcon || 'https://cdn-icons-png.flaticon.com/512/3046/3046124.png'
            }
        };

        if (gameData.imageUrl && gameData.imageUrl.trim() !== '') {
            embed.image = { url: gameData.imageUrl.trim() };
        }

        if (gameData.thumbnailUrl && gameData.thumbnailUrl.trim() !== '') {
            embed.thumbnail = { url: gameData.thumbnailUrl.trim() };
        }

        if (gameData.customFields && Array.isArray(gameData.customFields) && gameData.customFields.length > 0) {
            embed.fields = gameData.customFields.filter(f => f.name && f.value);
        } else {
            embed.fields = [
                { name: '🎮 Categoría / Juego', value: gameData.gameName || 'General', inline: true },
                { name: '🔗 Enlace al Live', value: `[Haz clic aquí para entrar](${streamUrl})`, inline: true }
            ];
        }

        return {
            content: content,
            embeds: [embed]
        };
    }

    async sendAnnouncement(gameData) {
        const webhookUrl = this.getWebhookUrl();
        
        if (!webhookUrl) {
            throw new Error('No se ha configurado ninguna URL de Webhook de Discord. Abre los ajustes (⚙️) en la barra superior.');
        }

        if (!this.isValidUrl(webhookUrl)) {
            throw new Error('La URL del Webhook no tiene el formato correcto de Discord (debe empezar con https://discord.com/api/webhooks/...).');
        }

        const payload = this.buildPayload(gameData);

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status === 204 || response.status === 200) {
                const logItem = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString(),
                    gameName: gameData.gameName,
                    status: 'SUCCESS',
                    statusCode: response.status,
                    message: `Anuncio de "${gameData.gameName}" enviado con éxito a Discord.`,
                    payload: payload
                };
                this.addHistoryLog(logItem);
                return logItem;
            } else {
                let errorText = await response.text();
                let errorMsg = `Error de Discord (${response.status}): ${errorText || response.statusText}`;
                
                if (response.status === 404) {
                    errorMsg = 'El Webhook de Discord fue eliminado o no existe (Error 404). Verifica el enlace en Discord.';
                } else if (response.status === 400) {
                    errorMsg = 'Discord rechazó el mensaje (Error 400). Verifica que las imágenes sean URLs públicas válidas.';
                }

                const logItem = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString(),
                    gameName: gameData.gameName,
                    status: 'ERROR',
                    statusCode: response.status,
                    message: errorMsg,
                    payload: payload
                };
                this.addHistoryLog(logItem);
                throw new Error(errorMsg);
            }
        } catch (err) {
            if (err.message && err.message.includes('Discord')) {
                throw err;
            }
            const logItem = {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString(),
                gameName: gameData.gameName,
                status: 'ERROR',
                statusCode: 0,
                message: err.message || 'Error de red al conectar con Discord.',
                payload: payload
            };
            this.addHistoryLog(logItem);
            throw new Error(err.message || 'Error de conexión con el Webhook.');
        }
    }

    getHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.historyKey)) || [];
        } catch (e) {
            return [];
        }
    }

    addHistoryLog(item) {
        const history = this.getHistory();
        history.unshift(item);
        if (history.length > 20) history.pop();
        localStorage.setItem(this.historyKey, JSON.stringify(history));
    }

    clearHistory() {
        localStorage.removeItem(this.historyKey);
    }
}

window.discordService = new DiscordWebhookService();
