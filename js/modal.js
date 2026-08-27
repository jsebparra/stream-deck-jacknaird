// js/modal.js - Modals Controller (Settings Hub, Game Editor, Category Combobox)

class ModalController {
    constructor() {
        this.currentGameEditing = null;
        this.categoryDropdownVisible = false;
        this.initBackdropDismiss();
    }

    initBackdropDismiss() {
        // Click on overlay background (not on modal-card) closes the modal
        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
                e.target.classList.remove('active');
            }
        });

        // Close category dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const wrapper = document.querySelector('.category-combobox-wrapper');
            if (wrapper && !wrapper.contains(e.target)) {
                this.hideCategoryDropdown();
            }
        });
    }

    // ⚙️ UNIFIED SETTINGS HUB MODAL
    openSettingsHub() {
        const modal = document.getElementById('settings-hub-modal');
        const webhookInput = document.getElementById('settings-webhook-url');
        const globalLiveInput = document.getElementById('settings-global-live-url');
        const globalMentionSelect = document.getElementById('settings-global-mention');
        const globalFooterTextInput = document.getElementById('settings-global-footer-text');
        const globalFooterIconInput = document.getElementById('settings-global-footer-icon');
        
        const safetyToggle = document.getElementById('settings-safety-toggle');
        const sakuraToggle = document.getElementById('settings-sakura-toggle');
        const audioToggle = document.getElementById('settings-audio-toggle');
        const testStatus = document.getElementById('settings-test-status');

        if (webhookInput) webhookInput.value = window.discordService.getWebhookUrl();
        if (globalLiveInput) globalLiveInput.value = window.discordService.getGlobalLiveUrl();
        if (globalMentionSelect) globalMentionSelect.value = window.discordService.getGlobalMention();
        if (globalFooterTextInput) globalFooterTextInput.value = window.discordService.getGlobalFooterText();
        if (globalFooterIconInput) globalFooterIconInput.value = window.discordService.getGlobalFooterIcon();
        
        if (safetyToggle) safetyToggle.checked = window.app.safetyMode;
        if (sakuraToggle) sakuraToggle.checked = window.sakuraEffect ? window.sakuraEffect.enabled : true;
        if (audioToggle) audioToggle.checked = window.cozyAudio ? window.cozyAudio.enabled : true;
        
        if (testStatus) testStatus.innerHTML = '';

        // Populate Gist fields
        const gistTokenInput = document.getElementById('settings-gist-token');
        const gistIdInput = document.getElementById('settings-gist-id');
        const gistAutoSyncToggle = document.getElementById('settings-gist-autosync');

        if (gistTokenInput) gistTokenInput.value = window.gistSync.getToken();
        if (gistIdInput) gistIdInput.value = window.gistSync.getGistId();
        if (gistAutoSyncToggle) gistAutoSyncToggle.checked = window.gistSync.isAutoSyncEnabled();

        this.updateGistStatusBadge();

        if (modal) modal.classList.add('active');
    }

    updateGistStatusBadge() {
        const badge = document.getElementById('gist-sync-status-badge');
        if (!badge) return;

        if (window.gistSync.isConfigured()) {
            const lastTime = window.gistSync.getLastSyncTime();
            badge.className = 'status-badge success';
            badge.innerHTML = `<span class="status-dot"></span> Sincronizado ${lastTime ? '(' + lastTime + ')' : ''}`;
        } else {
            badge.className = 'status-badge warning';
            badge.innerHTML = '<span class="status-dot"></span> Sin Configurar';
        }
    }

    closeSettingsHub() {
        const modal = document.getElementById('settings-hub-modal');
        if (modal) modal.classList.remove('active');
    }

    async autoCreateGist() {
        const tokenInput = document.getElementById('settings-gist-token');
        const token = tokenInput ? tokenInput.value.trim() : '';

        if (!token) {
            window.app.showToast('Ingresa un Personal Access Token de GitHub primero.', 'warning');
            return;
        }

        window.app.showToast('⏳ Creando Gist privado en GitHub...', 'info');

        try {
            const gistId = await window.gistSync.createGist(token);
            document.getElementById('settings-gist-id').value = gistId;
            this.updateGistStatusBadge();
            window.app.showToast('✨ ¡Gist privado creado con éxito en tu GitHub!', 'success');
        } catch (err) {
            window.app.showToast(`❌ Error: ${err.message}`, 'danger');
        }
    }

    saveSettingsHub() {
        const webhookUrl = document.getElementById('settings-webhook-url').value.trim();
        const globalLiveUrl = document.getElementById('settings-global-live-url').value.trim();
        const globalMention = document.getElementById('settings-global-mention').value;
        const globalFooterText = document.getElementById('settings-global-footer-text').value.trim();
        const globalFooterIcon = document.getElementById('settings-global-footer-icon').value.trim();
        
        const safetyMode = document.getElementById('settings-safety-toggle').checked;
        const sakuraEnabled = document.getElementById('settings-sakura-toggle').checked;
        const audioEnabled = document.getElementById('settings-audio-toggle').checked;

        // Read Gist fields
        const gistToken = document.getElementById('settings-gist-token').value.trim();
        const gistId = document.getElementById('settings-gist-id').value.trim();
        const gistAutoSync = document.getElementById('settings-gist-autosync').checked;

        if (webhookUrl && !window.discordService.isValidUrl(webhookUrl)) {
            window.app.showToast('La URL del Webhook no parece válida.', 'warning');
        }

        window.discordService.setWebhookUrl(webhookUrl);
        window.discordService.setGlobalLiveUrl(globalLiveUrl || 'https://www.tiktok.com/@live');
        window.discordService.setGlobalMention(globalMention);
        window.discordService.setGlobalFooterText(globalFooterText || 'TikTok Live Stream');
        window.discordService.setGlobalFooterIcon(globalFooterIcon || 'https://cdn-icons-png.flaticon.com/512/3046/3046124.png');

        window.gistSync.setToken(gistToken);
        window.gistSync.setGistId(gistId);
        window.gistSync.setAutoSync(gistAutoSync);

        window.app.safetyMode = safetyMode;
        window.app.toggleSakura(sakuraEnabled);
        window.app.toggleAudio(audioEnabled);

        window.app.checkWebhookStatus();
        this.closeSettingsHub();
        
        window.app.renderActiveDeck();
        if (window.app.selectedGameForPreview) {
            window.app.selectGameForPreview(window.app.selectedGameForPreview);
        }

        // Trigger background push to cloud if configured
        if (window.gistSync.isConfigured() && window.gistSync.isAutoSyncEnabled()) {
            window.app.pushCloudConfigSilently();
        }

        window.app.showToast('✨ Configuración guardada.', 'success');
    }

    // 🌸 GAME BUTTON EDITOR MODAL
    openGameEditor(gameId = null) {
        const modal = document.getElementById('game-editor-modal');
        const modalTitle = document.getElementById('editor-modal-title');
        
        let game = null;
        if (gameId) {
            game = window.gameVault.getGameById(gameId);
        }

        if (!game) {
            game = {
                id: 'game_' + Date.now(),
                gameName: 'Nuevo Juego',
                category: 'Gaming',
                emoji: '🎮',
                title: '🎮 ¡Estamos EN VIVO jugando Nuevo Juego!',
                description: '¡Únete al live en TikTok para convivir y chatear en directo!',
                imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
                thumbnailUrl: '',
                accentColor: '#FFB7C5',
                isArchived: false,
                customFields: [
                    { name: '🎮 Juego', value: 'Nuevo Juego', inline: true }
                ]
            };
            modalTitle.innerText = '🌸 Crear Nuevo Juego';
        } else {
            modalTitle.innerText = `🌸 Editar: ${game.gameName}`;
        }

        this.currentGameEditing = JSON.parse(JSON.stringify(game));
        this.populateEditorForm(this.currentGameEditing);
        
        if (window.discordPreview) {
            window.discordPreview.render(this.currentGameEditing);
        }

        if (modal) modal.classList.add('active');

        // Bind category input events after modal is visible
        this.bindCategoryCombobox();
    }

    closeGameEditor() {
        const modal = document.getElementById('game-editor-modal');
        if (modal) modal.classList.remove('active');
        this.currentGameEditing = null;
        this.hideCategoryDropdown();
    }

    populateEditorForm(game) {
        document.getElementById('edit-game-id').value = game.id;
        document.getElementById('edit-game-name').value = game.gameName || '';
        document.getElementById('edit-category').value = game.category || '';
        document.getElementById('edit-emoji').value = this.sanitizeEmoji(game.emoji) || '🎮';
        document.getElementById('edit-title').value = game.title || '';
        document.getElementById('edit-description').value = game.description || '';
        document.getElementById('edit-image-url').value = game.imageUrl || '';
        document.getElementById('edit-thumbnail-url').value = game.thumbnailUrl || '';
        document.getElementById('edit-accent-color').value = game.accentColor || '#FFB7C5';

        this.renderCustomFieldsEditor(game.customFields || []);
    }

    // ==============================
    // CATEGORY COMBOBOX DROPDOWN
    // ==============================
    bindCategoryCombobox() {
        const input = document.getElementById('edit-category');
        if (!input) return;

        // Remove old listeners by cloning
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);

        newInput.addEventListener('focus', () => {
            this.showCategoryDropdown(newInput.value);
        });

        newInput.addEventListener('input', () => {
            this.showCategoryDropdown(newInput.value);
            this.onFormInputChange();
        });

        newInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCategoryDropdown();
            }
        });
    }

    getExistingCategories() {
        const allGames = window.gameVault.getAllGames();
        return [...new Set(allGames.map(g => g.category || 'Gaming'))].filter(Boolean);
    }

    showCategoryDropdown(filterText = '') {
        const dropdown = document.getElementById('category-dropdown');
        if (!dropdown) return;

        const categories = this.getExistingCategories();
        const query = (filterText || '').toLowerCase().trim();

        // Filter categories matching the query
        let filtered = categories;
        if (query) {
            filtered = categories.filter(cat => cat.toLowerCase().includes(query));
        }

        // Build dropdown items
        let html = filtered.map(cat => `
            <div class="category-dropdown-item" onmousedown="window.modals.selectCategoryFromDropdown('${this.escapeHtml(cat)}')">
                ${this.escapeHtml(cat)}
            </div>
        `).join('');

        // If the typed text doesn't exactly match any category, offer "Create new"
        const exactMatch = categories.some(c => c.toLowerCase() === query);
        if (query && !exactMatch) {
            html += `
                <div class="category-dropdown-item new-item" onmousedown="window.modals.selectCategoryFromDropdown('${this.escapeHtml(filterText.trim())}')">
                    ➕ Crear "${this.escapeHtml(filterText.trim())}"
                </div>
            `;
        }

        if (html) {
            dropdown.innerHTML = html;
            dropdown.classList.add('visible');
        } else {
            dropdown.classList.remove('visible');
        }

        this.categoryDropdownVisible = true;
    }

    hideCategoryDropdown() {
        const dropdown = document.getElementById('category-dropdown');
        if (dropdown) {
            dropdown.classList.remove('visible');
        }
        this.categoryDropdownVisible = false;
    }

    selectCategoryFromDropdown(category) {
        const input = document.getElementById('edit-category');
        if (input) {
            input.value = category;
            this.onFormInputChange();
        }
        this.hideCategoryDropdown();
    }

    readFormValues() {
        if (!this.currentGameEditing) return null;

        this.currentGameEditing.gameName = document.getElementById('edit-game-name').value.trim();
        this.currentGameEditing.category = document.getElementById('edit-category').value.trim() || 'Gaming';
        
        const rawEmoji = document.getElementById('edit-emoji').value.trim();
        this.currentGameEditing.emoji = this.sanitizeEmoji(rawEmoji) || '🎮';
        
        this.currentGameEditing.title = document.getElementById('edit-title').value.trim();
        this.currentGameEditing.description = document.getElementById('edit-description').value.trim();
        this.currentGameEditing.imageUrl = document.getElementById('edit-image-url').value.trim();
        this.currentGameEditing.thumbnailUrl = document.getElementById('edit-thumbnail-url').value.trim();
        this.currentGameEditing.accentColor = document.getElementById('edit-accent-color').value;

        // Custom fields
        const fieldRows = document.querySelectorAll('.custom-field-row');
        const fields = [];
        fieldRows.forEach(row => {
            const nameInput = row.querySelector('.field-name-input');
            const valInput = row.querySelector('.field-val-input');
            if (nameInput && valInput && nameInput.value.trim()) {
                fields.push({
                    name: nameInput.value.trim(),
                    value: valInput.value.trim(),
                    inline: true
                });
            }
        });
        this.currentGameEditing.customFields = fields;

        return this.currentGameEditing;
    }

    sanitizeEmoji(str) {
        if (!str) return '🎮';
        if (str.startsWith('http://') || str.startsWith('https://')) {
            return '🎮';
        }
        return str.length > 8 ? str.substring(0, 8) : str;
    }

    selectEmojiChip(emojiChar) {
        const input = document.getElementById('edit-emoji');
        if (input) {
            input.value = emojiChar;
            this.onFormInputChange();
        }
    }

    selectColorSwatch(hexColor) {
        const input = document.getElementById('edit-accent-color');
        if (input) {
            input.value = hexColor;
            this.onFormInputChange();
        }
    }

    renderCustomFieldsEditor(fields) {
        const container = document.getElementById('custom-fields-container');
        if (!container) return;

        if (fields.length === 0) {
            container.innerHTML = `<p class="custom-fields-empty-hint">No hay campos adicionales.</p>`;
            return;
        }

        container.innerHTML = fields.map((f, i) => `
            <div class="custom-field-row" data-index="${i}">
                <div class="field-input-group">
                    <input type="text" class="form-input field-name-input" placeholder="Nombre" value="${this.escapeHtml(f.name)}"/>
                    <input type="text" class="form-input field-val-input" placeholder="Valor" value="${this.escapeHtml(f.value)}"/>
                </div>
                <button type="button" class="btn-remove-field" onclick="window.modals.removeCustomField(${i})" title="Eliminar">✕</button>
            </div>
        `).join('');
    }

    addCustomField() {
        const game = this.readFormValues();
        if (!game.customFields) game.customFields = [];
        game.customFields.push({ name: '', value: '', inline: true });
        this.renderCustomFieldsEditor(game.customFields);
        this.onFormInputChange();
    }

    removeCustomField(index) {
        const game = this.readFormValues();
        if (game.customFields && game.customFields[index]) {
            game.customFields.splice(index, 1);
            this.renderCustomFieldsEditor(game.customFields);
            this.onFormInputChange();
        }
    }

    onFormInputChange() {
        const game = this.readFormValues();
        if (game && window.discordPreview) {
            window.discordPreview.render(game);
        }
    }

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
}

window.modals = new ModalController();
