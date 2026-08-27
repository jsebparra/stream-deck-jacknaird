# 🌸 StreamDeck Pro - Discord Live Announcer

[![Deploy with GitHub Pages](https://img.shields.io/badge/Deploy%20with-GitHub%20Pages-FFB7C5?style=for-the-badge&logo=github)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-5C8A99.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-4CAF50.svg?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**StreamDeck Pro** es un panel de control táctil (Web Stream Deck) ligero, elegante y personalizable diseñado para streamers y creadores de contenido (TikTok Live, Twitch, YouTube). Te permite enviar anuncios enriquecidos (`Embeds`) a tu servidor de Discord con un solo toque desde cualquier dispositivo (PC, Tablet o Celular).

---

## ✨ Características Principales

- 📱 **One-Touch Stream Deck**: Toca cualquier tarjeta de juego/actividad para enviar instantáneamente el aviso a Discord.
- 🎨 **Estética Cozy Nordic Sakura**: Tema visual de cristal esmerilado (*Glassmorphism*), partículas de sakura flotantes y efectos de sonido acogedores.
- 🌈 **Brillo de Acento Único por Juego**: Cada botón tiene su propio color de borde y resplandor al presionar (ej. Rojo Valorant, Verde Minecraft, Azul Skyrim).
- 🏷️ **Filtro & Combobox de Categorías**: Organiza tus botones por categoría (`RPG`, `Competitivo`, `Just Chatting`, `Eventos`) y reutiliza categorías existentes al crear nuevos botones.
- 📦 **Archivo de Juegos (Vault)**: Guarda los juegos que dejas de transmitir temporalmente sin borrar sus configuraciones ni enlaces.
- 👣 **Herencia Global de URL & Footer**: Configura la URL de tu directo y el pie de página del embed una sola vez en Ajustes (`⚙️`).
- 👁️ **Simulador de Embed en Tiempo Real**: Revisa cómo se verá tu mensaje en el modo oscuro de Discord antes de enviarlo.
- 🛡️ **Modo de Seguridad Opcional**: Activa o desactiva la ventana emergente de confirmación previa al envío.
- ☁️ **Sincronización Automática en la Nube (GitHub Gist)**: Sincroniza tus botones y ajustes en tiempo real entre la PC de transmisión y tu Celular utilizando la API gratuita de Gists de GitHub.
- 📲 **PWA Instalable en Móviles**: Agrégala a la pantalla de inicio de tu iPhone o Android para usarla como app táctil a pantalla completa sin barra de navegador.
- 💾 **Copia de Seguridad JSON**: Exporta e importa tus botones y configuraciones fácilmente entre dispositivos.

---

## 🚀 Instalación y Despliegue Rápido

### Opción 1: GitHub Pages (Recomendada)
1. Haz un **Fork** o sube este repositorio a tu cuenta de GitHub.
2. Ve a **Settings** ➔ **Pages**.
3. En **Branch**, selecciona `main` y guarda (`Save`).
4. ¡Listo! Abre el enlace proporcionado desde tu celular o tablet.

### Opción 2: Uso Local en Red Wi-Fi
Para usarlo en tu celular conectado a la misma red Wi-Fi de tu PC de live:
```bash
# Iniciar un servidor rápido con Node.js
npx serve .

# O con Python
python -m http.server 8080
```
Entra desde el navegador de tu celular usando la IP local de tu computadora (`http://192.168.X.X:3000`).

---

## 📱 Instalación como App en Celular (PWA)

1. Abre el enlace de tu Stream Deck en el celular (Safari en iOS / Chrome en Android).
2. **iPhone**: Toca **Compartir** ➔ **"Agregar a la pantalla de inicio"**.
3. **Android**: Toca los **3 puntos** ➔ **"Agregar a la pantalla de inicio"**.
4. Disfruta de un Stream Deck a pantalla completa con cero impacto en el rendimiento de tu PC de transmisión.

---

## 🗺️ Hoja de Ruta (Roadmap de Futuro)

Sumate a colaborar en las siguientes mejoras planeadas:

- [ ] 🔄 **Múltiples Perfiles / Páginas**: Soporte para cambiar entre varias páginas de botones (ej. Perfil Gaming, Perfil Charlas, Perfil Eventos).
- [ ] 🤖 **Integración con OBS WebSocket**: Cambiar escenas en OBS Studio simultáneamente al enviar el anuncio de Discord.
- [ ] 🎨 **Temas Personalizados**: Toggle para alternar entre tema *Sakura Rose*, *Nordic Slate*, *Cyberpunk Glass* y *Neon Sunset*.
- [ ] 🌐 **Soporte Multilingüe**: Internacionalización (Español, Inglés, Portugués, Japonés).

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Siéntete libre de modificarlo, compartirlo y adaptarlo a tus directos. ¡Hecho con 🌸 para la comunidad de creadores!
