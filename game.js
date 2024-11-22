// game.js
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const scoreboardContainer = document.getElementById('scoreboard');

let jugadores = {};
let comida = {};
let miTipo = '';
let miNombre = '';

document.getElementById('registro-form').onsubmit = (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const tipo = document.getElementById('tipo').value;
    
    miNombre = nombre;
    miTipo = tipo;
    
    socket.emit('register', { nombre, tipo });
    document.getElementById('registro-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
};

chatInput.onkeypress = (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        socket.emit('chat-message', chatInput.value.trim());
        chatInput.value = '';
    }
};

socket.on('chat-message', (mensaje) => {
    const div = document.createElement('div');
    div.className = 'mensaje';
    div.innerHTML = `<strong>${mensaje.usuario}:</strong> ${mensaje.mensaje}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('chat-history', (mensajes) => {
    chatMessages.innerHTML = '';
    mensajes.forEach(mensaje => {
        const div = document.createElement('div');
        div.className = 'mensaje';
        div.innerHTML = `<strong>${mensaje.usuario}:</strong> ${mensaje.mensaje}`;
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('user-joined', (data) => {
    const div = document.createElement('div');
    div.className = 'sistema-mensaje';
    div.textContent = `${data.nombre} se ha unido como ${data.tipo}`;
    chatMessages.appendChild(div);
});

socket.on('user-left', (userId) => {
    const usuario = jugadores[userId];
    if (usuario) {
        const div = document.createElement('div');
        div.className = 'sistema-mensaje';
        div.textContent = `${usuario.nombre} ha abandonado el juego`;
        chatMessages.appendChild(div);
    }
});

socket.on('game-over', (data) => {
    const modal = document.getElementById('game-over-modal');
    const mensaje = document.getElementById('game-over-mensaje');
    const puntaje = document.getElementById('game-over-puntaje');
    
    mensaje.textContent = data.mensaje;
    puntaje.textContent = `Puntaje final: ${data.puntajeFinal}`;
    modal.style.display = 'flex';
    
    socket.emit('convert-to-spectator');
    miTipo = 'espectador';
});

socket.on('convert-to-spectator', () => {
    miTipo = 'espectador';
});

socket.on('update-scores', (puntajes) => {
    const puntajesOrdenados = Object.entries(puntajes)
        .sort(([,a], [,b]) => b.puntaje - a.puntaje);
    
    scoreboardContainer.innerHTML = '<h3>Tabla de Puntajes</h3>';
    puntajesOrdenados.forEach(([id, data]) => {
        const div = document.createElement('div');
        div.className = 'score-entry';
        div.innerHTML = `
            <span class="player-name">${data.nombre}</span>
            <span class="player-score">${data.puntaje}</span>
        `;
        scoreboardContainer.appendChild(div);
    });
});

socket.on('init', (data) => {
    jugadores = data.jugadores;
    comida = data.comida;
    render();
});

socket.on('update', (data) => {
    jugadores = data.jugadores;
    comida = data.comida;
    render();
});

document.getElementById('up').addEventListener('click', () => {
    socket.emit('move', 'UP');
});
document.getElementById('down').addEventListener('click', () => {
    socket.emit('move', 'DOWN');
});
document.getElementById('left').addEventListener('click', () => {
    socket.emit('move', 'LEFT');
});
document.getElementById('right').addEventListener('click', () => {
    socket.emit('move', 'RIGHT');
});



document.addEventListener('keydown', (e) => {
    if (miTipo === 'jugador') {
        const direccion = {
            ArrowUp: 'UP',
            ArrowDown: 'DOWN',
            ArrowLeft: 'LEFT',
            ArrowRight: 'RIGHT'
        }[e.key];

        if (direccion) {
            socket.emit('move', direccion);
        }
    }
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar grid
    ctx.strokeStyle = '#2a2a2a';
    for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Dibujar comida
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(
        comida.x * gridSize + gridSize/2,
        comida.y * gridSize + gridSize/2,
        gridSize/2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Dibujar jugadores
    Object.entries(jugadores).forEach(([id, jugador]) => {
        // Dibujar cuerpo
        jugador.cuerpo.forEach((parte, index) => {
            ctx.fillStyle = jugador.color;
            if (index === 0) {
                // Cabeza
                ctx.beginPath();
                ctx.arc(
                    parte.x * gridSize + gridSize/2,
                    parte.y * gridSize + gridSize/2,
                    gridSize/2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else {
                // Cuerpo
                ctx.fillRect(
                    parte.x * gridSize + 2,
                    parte.y * gridSize + 2,
                    gridSize - 4,
                    gridSize - 4
                );
            }
        });
        
        // Dibujar nombre
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            jugador.nombre,
            jugador.cuerpo[0].x * gridSize + gridSize/2,
            jugador.cuerpo[0].y * gridSize - 5
        );
    });
}
