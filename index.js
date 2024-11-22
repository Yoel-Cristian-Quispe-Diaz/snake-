// index.js
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname)));
app.use(express.json());

const jugadores = {};
const espectadores = {};
let comida = generarComida();
const mensajesChat = [];
const puntajes = {};

function generarComida() {
    return {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
    };
}

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('register', (data) => {
        if (data.tipo === 'jugador') {
            jugadores[socket.id] = {
                nombre: data.nombre,
                cuerpo: [{ x: 10, y: 10 }],
                direccion: 'RIGHT',
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                puntaje: 0
            };
            puntajes[socket.id] = {
                nombre: data.nombre,
                puntaje: 0
            };
        } else {
            espectadores[socket.id] = {
                nombre: data.nombre
            };
        }
        
        socket.emit('chat-history', mensajesChat);
        socket.emit('init', { jugadores, comida, puntajes });
        io.emit('user-joined', { 
            id: socket.id, 
            nombre: data.nombre, 
            tipo: data.tipo 
        });
        io.emit('update-scores', puntajes);
    });

    socket.on('chat-message', (mensaje) => {
        const usuario = jugadores[socket.id] || espectadores[socket.id];
        if (usuario) {
            const mensajeCompleto = {
                usuario: usuario.nombre,
                mensaje: mensaje,
                timestamp: new Date().toISOString()
            };
            mensajesChat.push(mensajeCompleto);
            if (mensajesChat.length > 100) mensajesChat.shift();
            io.emit('chat-message', mensajeCompleto);
        }
    });

    socket.on('move', (direccion) => {
        if (jugadores[socket.id] && direccion) {
            jugadores[socket.id].direccion = direccion;
        }
    });

    socket.on('disconnect', () => {
        if (jugadores[socket.id]) {
            delete jugadores[socket.id];
            delete puntajes[socket.id];
        } else if (espectadores[socket.id]) {
            delete espectadores[socket.id];
        }
        io.emit('user-left', socket.id);
        io.emit('update', { jugadores, comida });
        io.emit('update-scores', puntajes);
    });

    socket.on('convert-to-spectator', () => {
        if (jugadores[socket.id]) {
            const nombre = jugadores[socket.id].nombre;
            delete jugadores[socket.id];
            delete puntajes[socket.id];
            espectadores[socket.id] = { nombre };
            io.emit('update', { jugadores, comida });
            io.emit('update-scores', puntajes);
        }
    });
});

setInterval(() => {
    Object.entries(jugadores).forEach(([id, jugador]) => {
        moverJugador(jugador);

        Object.values(jugadores).forEach((otroJugador) => {
            if (jugador !== otroJugador) {
                otroJugador.cuerpo.forEach(parte => {
                    if (jugador.cuerpo[0].x === parte.x && jugador.cuerpo[0].y === parte.y) {
                        io.to(id).emit('game-over', {
                            mensaje: 'Colisionaste con otro jugador',
                            puntajeFinal: jugador.puntaje
                        });
                        jugador.perdio = true;
                    }
                });
            }
        });

        if (jugador.cuerpo[0].x === comida.x && jugador.cuerpo[0].y === comida.y) {
            jugador.cuerpo.push({});
            jugador.puntaje += 10;
            puntajes[id].puntaje = jugador.puntaje;
            comida = generarComida();
            io.emit('update-scores', puntajes);
        }
    });

    Object.entries(jugadores).forEach(([id, jugador]) => {
        if (jugador.perdio) {
            delete jugadores[id];
            io.to(id).emit('convert-to-spectator');
        }
    });

    io.emit('update', { jugadores, comida });
}, 200);

function moverJugador(jugador) {
    const cabeza = { ...jugador.cuerpo[0] };

    switch (jugador.direccion) {
        case 'UP': cabeza.y -= 1; break;
        case 'DOWN': cabeza.y += 1; break;
        case 'LEFT': cabeza.x -= 1; break;
        case 'RIGHT': cabeza.x += 1; break;
    }

    if (cabeza.x < 0) cabeza.x = 0, jugador.direccion = 'RIGHT';
    if (cabeza.x >= 20) cabeza.x = 19, jugador.direccion = 'LEFT';
    if (cabeza.y < 0) cabeza.y = 0, jugador.direccion = 'DOWN';
    if (cabeza.y >= 20) cabeza.y = 19, jugador.direccion = 'UP';

    jugador.cuerpo.unshift(cabeza);
    jugador.cuerpo.pop();
}

server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});