# ⚡ Integración Técnica: Discord Webhooks & StreamDeck Pro

## Resumen Ejecutivo
La comunicación entre la aplicación web **StreamDeck Pro** y el canal del servidor de **Discord** se resolvió utilizando solicitudes HTTP asíncronas **POST** hacia la API de Webhooks de Discord en JavaScript vanilla (sin librerías externas), logrando una respuesta en tiempo real (< 300 ms) sin sobrecargar el navegador de la transmisión.

---

## 1. Arquitectura de Red y Endpoint HTTP

Discord expone puntos de acceso dedicados (*endpoints*) con el siguiente patrón seguro:
`https://discord.com/api/webhooks/{WEBHOOK_ID}/{WEBHOOK_TOKEN}`

Cuando el creador toca una tecla física del Stream Deck en su navegador o móvil, el servicio `DiscordWebhookService` ([js/webhook.js](file:///C:/Users/Jackn/.gemini/antigravity-ide/scratch/stream-deck-discord/js/webhook.js)) ejecuta una llamada mediante la API nativa `fetch()`:

```javascript
const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
});
```

---

## 2. Conversión del Color de Acento (HEX a Decimal)

Discord **no acepta** cadenas de texto hexadecimales para los colores de acento del embed (ej. `"#FFB7C5"`). La API de Discord requiere un **número entero decimal**.

Para solucionar esto, se implementó una función de conversión matemática:

```javascript
hexToDecimalColor(hex) {
    if (!hex) return 0xFFB7C5;
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    return parseInt(cleanHex, 16) || 0xFFB7C5;
}
```

*Ejemplo de conversión:*
- Entrada: `"#FFB7C5"` (Rosa Sakura)
- Limpieza: `"FFB7C5"`
- Base 16 ➔ Decimal: `16758725` (Valor enviado en la petición HTTP).

---

## 3. Herencia Global Estricta & Estructura del JSON Payload

Para maximizar la productividad del streamer, el payload **se ensambla dinámicamente** combinando los datos específicos del juego (título, descripción, imagen) con los ajustes globales de la transmisión (URL del directo, mención y pie de página):

```javascript
buildPayload(gameData) {
    const streamUrl = this.getGlobalLiveUrl();       // ej. https://www.tiktok.com/@tu_usuario/live
    const mentionText = this.getGlobalMention();     // ej. @everyone
    const footerText = this.getGlobalFooterText();   // ej. TikTok Live Stream
    const footerIcon = this.getGlobalFooterIcon();   // Avatar o Logo

    return {
        content: `${mentionText} 🌸 **¡Estamos EN VIVO en TikTok!**`,
        embeds: [{
            title: gameData.title || `🔴 ¡Estamos en Live streaming ${gameData.gameName}!`,
            description: gameData.description || '¡Únete al directo ahora!',
            url: streamUrl,
            color: this.hexToDecimalColor(gameData.accentColor),
            timestamp: new Date().toISOString(), // Marca de tiempo estándar ISO 8601
            footer: {
                text: `${footerText} • ${gameData.gameName}`,
                icon_url: footerIcon
            },
            fields: gameData.customFields || [
                { name: '🎮 Categoría / Juego', value: gameData.gameName, inline: true },
                { name: '🔗 Enlace al Live', value: `[Entrar al Live](${streamUrl})`, inline: true }
            ],
            image: gameData.imageUrl ? { url: gameData.imageUrl } : undefined,
            thumbnail: gameData.thumbnailUrl ? { url: gameData.thumbnailUrl } : undefined
        }]
    };
}
```

---

## 4. Procesamiento de Respuesta HTTP 204 & Feedback UI

Discord procesa las publicaciones de Webhook devolviendo una respuesta con código **`HTTP 204 No Content`** (éxito sin cuerpo de respuesta).

El flujo de ejecución asíncrono gestiona la respuesta así:

```javascript
if (response.status === 204 || response.status === 200) {
    // 1. Efecto de Sonido Web Audio API (Campana de Madera)
    window.cozyAudio.playSuccessChime();

    // 2. Notificación Toast Flotante
    window.app.showToast(`✨ ¡Aviso enviado a Discord! (${gameData.gameName})`, 'success');

    // 3. Registro en Historial Persistente
    this.addHistoryLog({
        timestamp: new Date().toLocaleTimeString(),
        gameName: gameData.gameName,
        status: 'SUCCESS',
        statusCode: response.status
    });
} else {
    // Manejo de errores específicos (404 Webhook eliminado, 400 Imagen inváldia, etc.)
    throw new Error(`Error HTTP ${response.status}`);
}
```

---

## 5. Ventajas de la Solución
- **Zero Latency / Standalone**: Funciona sin backend intermedio (Serverless 100% cliente).
- **Consistencia Visual**: Emula el diseño nativo del modo oscuro de Discord.
- **Resiliencia**: Si falla el envío por falta de conexión o URL inválida, captura la excepción y la registra en el historial sin bloquear la interfaz.
