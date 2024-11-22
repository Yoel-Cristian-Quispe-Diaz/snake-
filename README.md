# 🐍 Snake Battle Royale

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

<p align="center">Un juego multijugador en tiempo real basado en el clásico Snake, con características modernas como chat en vivo y modo espectador.</p>

## 📝 Tabla de Contenidos

- [Sobre el Proyecto](#about)
- [Comenzando](#getting_started)
- [Despliegue](#deployment)
- [Uso](#usage)
- [Construido Con](#built_with)
- [Características](#features)
- [Capturas de Pantalla](#screenshots)


## 🧐 Sobre el Proyecto <a name = "about"></a>

Snake Battle Royale es una versión multijugador moderna del clásico juego Snake. Los jugadores compiten en tiempo real en un tablero compartido, intentando crecer mientras evitan colisionar con otros jugadores. El juego incluye características modernas como un sistema de chat en tiempo real, modo espectador y una tabla de puntuaciones en vivo.

### 🎮 Características Principales

- 🌐 Multijugador en tiempo real
- 💬 Chat en vivo
- 👥 Modo espectador
- 🏆 Tabla de puntuaciones
- 🎨 Serpientes con colores únicos para cada jugador

## 🏁 Comenzando <a name = "getting_started"></a>

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### 📋 Prerrequisitos

```
node >= 14.x
npm >= 6.x
```

### 🔧 Instalación

1. Clona el repositorio

```bash
git clone [https://github.com/tu-usuario/snake-battle-royale.git](https://github.com/Yoel-Cristian-Quispe-Diaz/snake-.git)
```

2. Instala las dependencias

```bash
cd snake-battle-royale
npm install
```

3. Inicia el servidor de desarrollo

```bash
npm start
```

4. Visita `http://localhost:3000` en tu navegador

## 🚀 Despliegue <a name = "deployment"></a>

El proyecto está configurado para ser desplegado en Render. Sigue estos pasos para desplegar:

1. Crea una nueva cuenta en [Render](https://render.com) si aún no tienes una

2. Conecta tu repositorio de GitHub

3. Crea un nuevo Web Service con la siguiente configuración:
   - Build Command: `npm install`
   - Start Command: `node index.js`

4. Configura las variables de entorno necesarias:
   ```
   PORT=3000
   ```

## 🎈 Uso <a name="usage"></a>

1. Accede al juego a través de la URL de despliegue o localhost
2. Ingresa tu nombre de usuario
3. Selecciona el modo (Jugador o Espectador)
4. Como jugador:
   - Usa las flechas del teclado para moverte
   - Recoge comida para crecer
   - Evita colisionar con otros jugadores
   - Utiliza el chat para comunicarte
5. Como espectador:
   - Observa la partida en curso
   - Participa en el chat
   - Revisa la tabla de puntuaciones

## ⛏️ Construido Con <a name = "built_with"></a>

- [Node.js](https://nodejs.org/) - Entorno de ejecución
- [Express](https://expressjs.com/) - Framework web
- [Socket.IO](https://socket.io/) - Comunicación en tiempo real
- [HTML5 Canvas](https://www.w3.org/TR/2dcontext/) - Renderizado del juego

## 🎯 Características <a name = "features"></a>

### Implementadas
- ✅ Movimiento fluido de serpientes
- ✅ Colisiones precisas
- ✅ Sistema de chat en tiempo real
- ✅ Tabla de puntuaciones en vivo
- ✅ Modo espectador

### Próximas Características
- ⭐ Power-ups
- ⭐ Diferentes modos de juego
- ⭐ Personalización de serpientes
- ⭐ Sistema de logros
- ⭐ Ranking global

## 🎮 Controles

- ⬆️ Flecha arriba: Mover hacia arriba
- ⬇️ Flecha abajo: Mover hacia abajo
- ⬅️ Flecha izquierda: Mover a la izquierda
- ➡️ Flecha derecha: Mover a la derecha
- Enter: Enviar mensaje en el chat

## 🎯 Capturas de pantalla <a name = "screenshots"></a>


![image](https://github.com/user-attachments/assets/4f7651f8-b507-4ba4-a2eb-b07fb439567e)

![image](https://github.com/user-attachments/assets/30ac0ff0-5c36-4a40-9348-7f20ec6a7f71)

