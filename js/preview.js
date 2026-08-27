// js/preview.js - Real-time Discord Dark Theme Embed Simulator

class DiscordPreviewRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(gameData) {
        if (!this.container) return;

        if (!gameData) {
            this.container.innerHTML = `
                <div class="discord-empty-preview">
                    <p>🌸 Selecciona o edita un juego para ver la vista previa del mensaje de Discord.</p>
                </div>
            `;
            return;
        }

        const accentColor = gameData.accentColor || '#FFB7C5';
        const mention = gameData.mention || '@everyone';
        const streamUrl = gameData.streamUrl || 'https://www.tiktok.com/@live';

        let fieldsHtml = '';
        if (gameData.customFields && gameData.customFields.length > 0) {
            fieldsHtml = `
                <div class="discord-embed-fields">
                    ${gameData.customFields.map(f => `
                        <div class="discord-field ${f.inline ? 'inline' : ''}">
                            <div class="discord-field-name">${this.escapeHtml(f.name)}</div>
                            <div class="discord-field-value">${this.escapeHtml(f.value)}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            fieldsHtml = `
                <div class="discord-embed-fields">
                    <div class="discord-field inline">
                        <div class="discord-field-name">🎮 Categoría / Juego</div>
                        <div class="discord-field-value">${this.escapeHtml(gameData.gameName || 'General')}</div>
                    </div>
                    <div class="discord-field inline">
                        <div class="discord-field-name">🔗 Enlace al Live</div>
                        <div class="discord-field-value"><a href="${streamUrl}" target="_blank">Entrar al Live</a></div>
                    </div>
                </div>
            `;
        }

        let thumbnailHtml = '';
        if (gameData.thumbnailUrl && gameData.thumbnailUrl.trim() !== '') {
            thumbnailHtml = `<img class="discord-embed-thumbnail" src="${this.escapeHtml(gameData.thumbnailUrl)}" alt="Thumbnail" onerror="this.style.display='none'"/>`;
        }

        let imageHtml = '';
        if (gameData.imageUrl && gameData.imageUrl.trim() !== '') {
            imageHtml = `
                <div class="discord-embed-image-container">
                    <img class="discord-embed-image" src="${this.escapeHtml(gameData.imageUrl)}" alt="Game Banner" onerror="this.style.display='none'"/>
                </div>
            `;
        }

        this.container.innerHTML = `
            <div class="discord-message-box">
                <div class="discord-avatar">
                    <img src="https://cdn-icons-png.flaticon.com/512/3046/3046124.png" alt="Bot Avatar"/>
                </div>
                <div class="discord-content">
                    <div class="discord-header">
                        <span class="discord-username">StreamDeck Pro</span>
                        <span class="discord-bot-tag">BOT</span>
                        <span class="discord-timestamp">Hoy a las ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    
                    <div class="discord-text">
                        <span class="discord-mention">${this.escapeHtml(mention)}</span> 🌸 <strong>¡Estamos EN VIVO en TikTok!</strong>
                    </div>

                    <div class="discord-embed" style="border-left-color: ${accentColor};">
                        <div class="discord-embed-content">
                            <div class="discord-embed-text">
                                <a href="${streamUrl}" target="_blank" class="discord-embed-title">
                                    ${this.escapeHtml(gameData.title || `🔴 En Vivo: ${gameData.gameName}`)}
                                </a>
                                <div class="discord-embed-description">
                                    ${this.escapeHtml(gameData.description || '¡Únete al directo ahora!')}
                                </div>
                                ${fieldsHtml}
                            </div>
                            ${thumbnailHtml}
                        </div>
                        ${imageHtml}
                        <div class="discord-embed-footer">
                            <img class="discord-footer-icon" src="https://cdn-icons-png.flaticon.com/512/3046/3046124.png" alt="icon"/>
                            <span>TikTok Live • ${this.escapeHtml(gameData.gameName || 'Directo')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

window.discordPreview = new DiscordPreviewRenderer('discord-preview-container');
