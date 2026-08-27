// js/app.js - Main Application State & Event Controller

class StreamDeckApp {
    constructor() {
        this.selectedGameForPreview = null;
        this.safetyMode = true;
        this.activeCategoryFilter = 'ALL';
    }

    init() {
        window.sakuraEffect = new SakuraCanvasEffect('sakura-canvas');
        this.checkWebhookStatus();

        this.renderActiveDeck();
        this.renderArchiveList();
        this.renderHistory();
        this.bindEvents();

        const activeGames = window.gameVault.getActiveGames();
        if (activeGames.length > 0) {
            this.selectGameForPreview(activeGames[0].id);
        }
    }

    checkWebhookStatus() {
        const url = window.discordService.getWebhookUrl();
        const indicator = document.getElementById('webhook-status-badge');
        if (indicator) {
            if (window.discordService.isValidUrl(url)) {
                indicator.className = 'status-badge success';
                indicator.innerHTML = '<span class="status-dot"></span> Conectado';
            } else if (url) {
                indicator.className = 'status-badge warning';
                indicator.innerHTML = '<span class="status-dot"></span> Inválido';
            } else {
                indicator.className = 'status-badge danger';
                indicator.innerHTML = '<span class="status-dot"></span> Sin Configurar';
            }
        }
    }

    filterCategory(category) {
        window.cozyAudio.playKeyClick();
        this.activeCategoryFilter = category;
        this.renderActiveDeck();
    }

    renderActiveDeck() {
        const grid = document.getElementById('deck-grid');
        const filterBar = document.getElementById('category-filter-bar');
        if (!grid) return;

        const allActiveGames = window.gameVault.getActiveGames();

        // 1. Render Category Filter Chips Bar
        if (filterBar) {
            const categories = ['ALL', ...new Set(allActiveGames.map(g => g.category || 'Gaming'))];
            filterBar.innerHTML = categories.map(cat => {
                const isSelected = this.activeCategoryFilter === cat;
                const label = cat === 'ALL' ? '🌸 Todos' : cat;
                return `
                    <button class="category-chip ${isSelected ? 'active' : ''}" 
                            onclick="window.app.filterCategory('${this.escapeHtml(cat)}')">
                        ${this.escapeHtml(label)}
                    </button>
                `;
            }).join('');
        }

        // 2. Filter games by category
        const filteredGames = this.activeCategoryFilter === 'ALL'
            ? allActiveGames
            : allActiveGames.filter(g => (g.category || 'Gaming') === this.activeCategoryFilter);

        if (filteredGames.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 36px; text-align: center;">
                    <p style="color: var(--text-secondary); margin-bottom: 10px;">🌸 No hay juegos en "${this.escapeHtml(this.activeCategoryFilter)}".</p>
                    <button class="btn btn-sm btn-outline" onclick="window.app.filterCategory('ALL')">Ver Todos</button>
                </div>
            `;
            return;
        }

        // 3. Render Stream Deck Physical Key Cards
        grid.innerHTML = filteredGames.map(game => `
            <div class="deck-key-card ${this.selectedGameForPreview === game.id ? 'active-selected' : ''}" 
                 style="--accent-color: ${game.accentColor || '#FFB7C5'}"
                 onmouseenter="window.app.onKeyHover('${game.id}')"
                 onclick="window.app.onKeyTap('${game.id}')">
                
                <div class="key-card-header">
                    <div class="key-emoji-container">
                        <span class="key-emoji">${this.escapeHtml(window.modals.sanitizeEmoji(game.emoji))}</span>
                        <span class="key-category">${this.escapeHtml(game.category || 'Gaming')}</span>
                    </div>
                    
                    <div class="key-actions-menu" onclick="event.stopPropagation()">
                        <button class="key-action-btn" title="Editar" onclick="window.modals.openGameEditor('${game.id}')">✏️</button>
                        <button class="key-action-btn" title="Archivar" onclick="window.app.archiveGame('${game.id}')">📦</button>
                    </div>
                </div>

                <div class="key-card-body">
                    <h3 class="key-game-title">${this.escapeHtml(game.gameName)}</h3>
                    <p class="key-subtext">${this.escapeHtml(game.title)}</p>
                </div>

                ${game.imageUrl ? `
                    <div class="key-card-image-bg" style="background-image: url('${this.escapeHtml(game.imageUrl)}')"></div>
                ` : ''}

                <div class="key-card-footer">
                    <span class="key-trigger-hint"><span>⚡</span> Tocar para enviar</span>
                </div>
            </div>
        `).join('') + `
            <div class="deck-key-card add-new-key" onclick="window.modals.openGameEditor()">
                <div class="add-key-content">
                    <span class="add-icon">➕</span>
                    <span>Nuevo Juego</span>
                </div>
            </div>
        `;
    }

    renderArchiveList() {
        const vaultContainer = document.getElementById('archive-vault-list');
        const badge = document.getElementById('vault-count-badge');
        
        const archivedGames = window.gameVault.getArchivedGames();

        if (badge) {
            badge.innerText = `${archivedGames.length}`;
        }

        if (!vaultContainer) return;

        if (archivedGames.length === 0) {
            vaultContainer.innerHTML = `
                <div style="padding: 28px; text-align: center; color: var(--text-secondary);">
                    <p>📦 El archivo está vacío.</p>
                    <small style="color: var(--text-muted); display: block; margin-top: 5px;">Archiva juegos que dejes de transmitir temporalmente para mantener tu deck ordenado.</small>
                </div>
            `;
            return;
        }

        // Rich Treasure Vault Cards
        vaultContainer.innerHTML = `
            <div class="archive-vault-grid">
                ${archivedGames.map(game => `
                    <div class="vault-card-treasure" style="--accent-color: ${game.accentColor || '#FFB7C5'}">
                        ${game.imageUrl ? `
                            <div class="vault-card-bg" style="background-image: url('${this.escapeHtml(game.imageUrl)}')"></div>
                        ` : ''}
                        
                        <div class="vault-card-content">
                            <span class="vault-card-emoji">${this.escapeHtml(window.modals.sanitizeEmoji(game.emoji))}</span>
                            <div>
                                <h4 class="vault-card-title">${this.escapeHtml(game.gameName)}</h4>
                                <span class="vault-card-cat">${this.escapeHtml(game.category || 'Gaming')}</span>
                            </div>
                        </div>

                        <div class="vault-card-actions">
                            <button class="btn btn-sm btn-outline" onclick="window.app.unarchiveGame('${game.id}')">
                                ⬆️ Desarchivar
                            </button>

                            <div style="display: flex; gap: 4px;">
                                <button class="key-action-btn" title="Editar" onclick="window.modals.openGameEditor('${game.id}')">✏️</button>
                                <button class="btn-danger-icon" title="Eliminar" onclick="window.app.deleteGamePermanently('${game.id}')">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    onKeyHover(gameId) {
        if (this.selectedGameForPreview !== gameId) {
            this.selectedGameForPreview = gameId;
            const game = window.gameVault.getGameById(gameId);
            if (game && window.discordPreview) {
                window.discordPreview.render(game);
            }
        }
    }

    onKeyTap(gameId) {
        this.triggerAnnouncement(gameId);
    }

    selectGameForPreview(gameId) {
        this.selectedGameForPreview = gameId;
        const game = window.gameVault.getGameById(gameId);
        if (game && window.discordPreview) {
            window.discordPreview.render(game);
        }
        this.renderActiveDeck();
    }

    async triggerAnnouncement(gameId) {
        window.cozyAudio.playKeyClick();
        const game = window.gameVault.getGameById(gameId);
        if (!game) return;

        const webhookUrl = window.discordService.getWebhookUrl();
        if (!webhookUrl) {
            this.showToast('⚠️ Configura tu Webhook de Discord primero.', 'warning');
            window.modals.openSettingsHub();
            return;
        }

        if (this.safetyMode) {
            this.openConfirmModal(game);
        } else {
            this.executeSend(game);
        }
    }

    openConfirmModal(game) {
        const modal = document.getElementById('confirm-send-modal');
        const gameTitleSpan = document.getElementById('confirm-game-title');
        const mentionSpan = document.getElementById('confirm-mention-tag');
        
        if (gameTitleSpan) gameTitleSpan.innerText = game.gameName;
        if (mentionSpan) mentionSpan.innerText = window.discordService.getGlobalMention();

        const previewContainer = document.getElementById('confirm-embed-preview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
            const tempRenderer = new DiscordPreviewRenderer('confirm-embed-preview');
            tempRenderer.render(game);
        }

        this.pendingGameToSend = game;
        if (modal) modal.classList.add('active');
    }

    closeConfirmModal() {
        const modal = document.getElementById('confirm-send-modal');
        if (modal) modal.classList.remove('active');
        this.pendingGameToSend = null;
    }

    async confirmSendNow() {
        if (!this.pendingGameToSend) return;
        const game = this.pendingGameToSend;
        this.closeConfirmModal();
        await this.executeSend(game);
    }

    async executeSend(game) {
        this.showToast(`🚀 Enviando aviso de ${game.gameName}...`, 'info');

        try {
            const result = await window.discordService.sendAnnouncement(game);
            window.cozyAudio.playSuccessChime();
            this.showToast(`✨ ¡Aviso de ${game.gameName} enviado!`, 'success');
            this.renderHistory();
        } catch (err) {
            window.cozyAudio.playErrorTone();
            this.showToast(`❌ Error: ${err.message}`, 'danger');
            this.renderHistory();
        }
    }

    archiveGame(gameId) {
        window.cozyAudio.playVaultSound();
        window.gameVault.archiveGame(gameId);
        this.renderActiveDeck();
        this.renderArchiveList();
        this.showToast('📦 Juego archivado.', 'info');
    }

    unarchiveGame(gameId) {
        window.cozyAudio.playVaultSound();
        window.gameVault.unarchiveGame(gameId);
        this.renderActiveDeck();
        // Re-render the archive list in place (user stays in archive modal)
        this.renderArchiveList();
        this.showToast('✨ Juego desarchivado y restaurado al deck.', 'success');
    }

    deleteGamePermanently(gameId) {
        if (confirm('¿Eliminar este juego de forma permanente?')) {
            window.gameVault.deleteGame(gameId);
            this.renderActiveDeck();
            // Re-render archive list (user stays in archive modal)
            this.renderArchiveList();
            this.showToast('🗑️ Juego eliminado.', 'info');
        }
    }

    renderHistory() {
        const container = document.getElementById('history-log-list');
        if (!container) return;

        const history = window.discordService.getHistory();

        if (history.length === 0) {
            container.innerHTML = `<p class="empty-history-text">No hay avisos enviados.</p>`;
            return;
        }

        container.innerHTML = history.map(item => `
            <div class="history-item ${item.status.toLowerCase()}">
                <div class="history-item-header">
                    <span class="history-status-badge ${item.status.toLowerCase()}">${item.status === 'SUCCESS' ? '✓ 204' : '✕ ERROR'}</span>
                    <span class="history-time">${item.timestamp}</span>
                </div>
                <div class="history-item-body">
                    <strong>${this.escapeHtml(item.gameName)}</strong>
                    <p>${this.escapeHtml(item.message)}</p>
                </div>
            </div>
        `).join('');
    }

    clearHistoryLogs() {
        window.discordService.clearHistory();
        this.renderHistory();
        this.showToast('Historial limpiado.', 'info');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
        `;

        toastContainer.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 4000);
    }

    toggleSakura(state) {
        if (window.sakuraEffect) {
            window.sakuraEffect.toggle(state);
        }
    }

    toggleAudio(state) {
        if (window.cozyAudio) {
            window.cozyAudio.enabled = state;
        }
    }

    openArchiveModal() {
        window.cozyAudio.playVaultSound();
        this.renderArchiveList(); // Re-render fresh when opening
        const modal = document.getElementById('archive-modal');
        if (modal) modal.classList.add('active');
    }

    closeArchiveModal() {
        const modal = document.getElementById('archive-modal');
        if (modal) modal.classList.remove('active');
    }

    exportBackupJSON() {
        const backupData = {
            webhookUrl: window.discordService.getWebhookUrl(),
            globalLiveUrl: window.discordService.getGlobalLiveUrl(),
            globalMention: window.discordService.getGlobalMention(),
            globalFooterText: window.discordService.getGlobalFooterText(),
            globalFooterIcon: window.discordService.getGlobalFooterIcon(),
            games: window.gameVault.getAllGames()
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `streamdeck-backup-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        this.showToast('💾 Backup descargado.', 'success');
    }

    importBackupJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.webhookUrl) window.discordService.setWebhookUrl(data.webhookUrl);
                if (data.globalLiveUrl) window.discordService.setGlobalLiveUrl(data.globalLiveUrl);
                if (data.globalMention) window.discordService.setGlobalMention(data.globalMention);
                if (data.globalFooterText) window.discordService.setGlobalFooterText(data.globalFooterText);
                if (data.globalFooterIcon) window.discordService.setGlobalFooterIcon(data.globalFooterIcon);
                if (data.games && Array.isArray(data.games)) window.gameVault.saveAll(data.games);

                this.checkWebhookStatus();
                this.renderActiveDeck();
                this.renderArchiveList();
                window.modals.closeSettingsHub();
                this.showToast('✨ Backup importado con éxito.', 'success');
            } catch (err) {
                this.showToast('❌ El archivo JSON no es válido.', 'danger');
            }
        };
        reader.readAsText(file);
    }

    bindEvents() {
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => window.modals.saveSettingsHub());
        }

        const testWebhookBtn = document.getElementById('settings-test-webhook-btn');
        if (testWebhookBtn) {
            testWebhookBtn.addEventListener('click', async () => {
                const input = document.getElementById('settings-webhook-url');
                const url = input.value.trim();
                const statusDiv = document.getElementById('settings-test-status');

                if (!url || !window.discordService.isValidUrl(url)) {
                    statusDiv.innerHTML = '<span style="color: #FF5252;">❌ URL inválida.</span>';
                    return;
                }

                statusDiv.innerHTML = '<span style="color: var(--sakura-pink);">⏳ Probando...</span>';
                const prevUrl = window.discordService.getWebhookUrl();
                window.discordService.setWebhookUrl(url);

                try {
                    await window.discordService.sendAnnouncement({
                        gameName: 'Prueba',
                        category: 'Test',
                        emoji: '🌸',
                        title: '🌸 Prueba de StreamDeck Pro',
                        description: '¡Conexión establecida exitosamente!',
                        accentColor: '#FFB7C5'
                    });
                    statusDiv.innerHTML = '<span style="color: #4CAF50;">✨ ¡Funciona! Mensaje recibido en Discord.</span>';
                    this.checkWebhookStatus();
                } catch (err) {
                    statusDiv.innerHTML = `<span style="color: #FF5252;">❌ ${err.message}</span>`;
                    window.discordService.setWebhookUrl(prevUrl);
                    this.checkWebhookStatus();
                }
            });
        }

        const saveGameBtn = document.getElementById('save-game-editor-btn');
        if (saveGameBtn) {
            saveGameBtn.addEventListener('click', () => {
                const game = window.modals.readFormValues();
                if (!game || !game.gameName) {
                    this.showToast('El nombre del juego es obligatorio.', 'warning');
                    return;
                }

                window.gameVault.saveGame(game);
                window.modals.closeGameEditor();
                this.renderActiveDeck();
                this.selectGameForPreview(game.id);
                this.showToast(`✨ "${game.gameName}" guardado.`, 'success');
            });
        }

        const formInputs = document.querySelectorAll('#game-editor-modal input, #game-editor-modal select, #game-editor-modal textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => window.modals.onFormInputChange());
        });
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

document.addEventListener('DOMContentLoaded', () => {
    window.app = new StreamDeckApp();
    window.app.init();
});
