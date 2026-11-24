const canvas = document.getElementById('universo3D');
const ctx = canvas.getContext('2d', { alpha: false });
const nombreFormacionEl = document.getElementById('nombreFormacion');

let ancho, alto, fov;
function ajustarPantalla() {
    ancho = canvas.width = window.innerWidth;
    alto = canvas.height = window.innerHeight;
    fov = Math.min(ancho, alto) * 0.88;
}
window.addEventListener('resize', ajustarPantalla);
ajustarPantalla();

// ==========================================
// 1. TUS FOTOS DE IMGBB Y TU VIDEO DE STREAMABLE
// ==========================================
const recuerdos = [
    {
        x: -260, y: -125, z: 220,
        colorHalo: 'rgba(170, 210, 255, ',
        tipo: 'imagen',
        archivo: 'https://i.ibb.co/hFLG3cYY/IMAGEN-1.jpg',
        titulo: 'Mi lugar favorito',
        texto: 'Como Snoopy mirando las estrellas desde el techo de su casita, entendí que mi lugar favorito en todo el universo siempre va a ser donde estés tú.',
        firma: 'ATT: Tu niño <3'
    },
    {
        x: 270, y: -105, z: 190,
        colorHalo: 'rgba(255, 210, 140, ',
        tipo: 'imagen',
        archivo: 'https://i.ibb.co/XBmJ0F2/IMAGEN-2.jpg',
        titulo: 'Pura magia',
        texto: 'No hace falta ningún hechizo ni varita mágica para saber que coincidir contigo en esta vida es lo más increíble que me ha pasado.',
        firma: 'ATT: Tu niño <3'
    },
    {
        x: 0, y: -230, z: 245,
        colorHalo: 'rgba(255, 160, 185, ',
        tipo: 'imagen',
        archivo: 'https://i.ibb.co/PZb5qtdn/IMAGEN-3.jpg',
        titulo: 'El centro de mi gravedad',
        texto: 'Como un agujero negro curva la luz a su alrededor, tú atraes todo lo bueno de mis días. Siempre volvería a elegirte a ti.',
        firma: 'ATT: Tu niño <3'
    },
    {
        x: -220, y: 170, z: -200,
        colorHalo: 'rgba(155, 190, 255, ',
        tipo: 'imagen',
        archivo: 'https://i.ibb.co/8gK9H8cB/IMAGEN-4.jpg',
        titulo: 'Mi sentido arácnido',
        texto: 'Incluso en medio de la inmensidad del espacio sabría encontrarte. Contigo cada momento se siente como la mejor aventura.',
        firma: 'ATT: Tu niño <3'
    },
    {
        x: 240, y: 160, z: -190,
        colorHalo: 'rgba(220, 180, 255, ',
        tipo: 'video',
        archivo: 'https://streamable.com/e/zsq5h4',
        titulo: 'Por muchos años más',
        texto: 'Cada recuerdo contigo se queda grabado aquí, brillando más fuerte que cualquier constelación.',
        firma: 'ATT: Tu niño <3'
    }
];

// --- 2. UNIVERSO DE ESTRELLAS ---
const esMovil = window.innerWidth < 600;
const CANTIDAD_FONDO = esMovil ? 10000 : 16250;
const CANTIDAD_ESPIRAL = esMovil ? 5000 : 8750;
const CANTIDAD_CORAZON = esMovil ? 3000 : 5000;

const coloresTermicos = [
    '#ffffff', '#cad8ff', '#fff4e8', '#ffe2b8', '#ffc794', '#ff9d80'
];

const estrellasProfundas = [];
for (let i = 0; i < CANTIDAD_FONDO; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    let phi = (i < CANTIDAD_FONDO * 0.50) ? (Math.PI / 2 + (Math.random() - 0.5) * 0.46) : Math.acos(2.0 * v - 1.0);

    const radioEsfera = 850 + Math.random() * 1900;
    const x0 = radioEsfera * Math.sin(phi) * Math.cos(theta);
    const y0 = radioEsfera * Math.cos(phi);
    const z0 = radioEsfera * Math.sin(phi) * Math.sin(theta);

    const tilt = 0.58;
    const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
    const z = z0 * Math.cos(tilt) + y0 * Math.sin(tilt);

    estrellasProfundas.push({
        x: x0, y: y, z: z,
        size: Math.pow(Math.random(), 2.8) * 1.8 + 0.3,
        color: coloresTermicos[Math.floor(Math.random() * coloresTermicos.length)],
        alpha: Math.random() * 0.8 + 0.15,
        fase: Math.random() * Math.PI * 2
    });
}

const nebulosas3D = [
    { x: -500, y: -250, z: 700, r: 620, color: 'rgba(22, 48, 110, 0.15)' },
    { x: 580, y: 200, z: 650, r: 660, color: 'rgba(85, 34, 96, 0.13)' },
    { x: -420, y: 350, z: -700, r: 680, color: 'rgba(16, 74, 102, 0.14)' },
    { x: 480, y: -330, z: -650, r: 620, color: 'rgba(120, 62, 32, 0.10)' },
    { x: 0, y: 460, z: 550, r: 580, color: 'rgba(38, 28, 92, 0.13)' }
];

const particulasEspiral = [];
for (let i = 0; i < CANTIDAD_ESPIRAL; i++) {
    const brazo = i % 4;
    const radio = 130 + Math.pow(Math.random(), 1.3) * 580;
    const giroEspiral = radio * 0.009;
    const angulo = (brazo * (Math.PI * 2 / 4)) + giroEspiral + (Math.random() - 0.5) * 0.65;
    const dispersionY = (Math.random() - 0.5) * (3200 / radio);

    particulasEspiral.push({
        x: Math.cos(angulo) * radio,
        y: dispersionY,
        z: Math.sin(angulo) * radio,
        size: Math.random() * 1.5 + 0.35,
        color: coloresTermicos[Math.floor(Math.random() * coloresTermicos.length)],
        alpha: Math.random() * 0.8 + 0.2,
        fase: Math.random() * Math.PI * 2,
        velOrbita: (Math.random() * 0.0035 + 0.0015)
    });
}

const particulasCorazon = [];
for (let i = 0; i < CANTIDAD_CORAZON; i++) {
    particulasCorazon.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 800,
        txCorazon: 0, tyCorazon: 0, tzCorazon: 0,
        txMensaje: 0, tyMensaje: 0, tzMensaje: 0,
        bx: 0, by: 0, bz: 0,
        size: Math.random() * 1.6 + 0.45,
        color: coloresTermicos[Math.floor(Math.random() * coloresTermicos.length)],
        alpha: Math.random() * 0.85 + 0.2,
        fase: Math.random() * Math.PI * 2
    });
}

function calcularFormaciones() {
    // 1. Coordenadas del Corazón
    particulasCorazon.forEach((p, i) => {
        const t = Math.random() * Math.PI * 2;
        const escala = 17.5;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        const esContorno = i < CANTIDAD_CORAZON * 0.65;
        let relleno, profZ;

        if (esContorno) {
            relleno = 0.96 + Math.random() * 0.05;
            profZ = (Math.random() - 0.5) * 28;
        } else {
            relleno = Math.pow(Math.random(), 0.42) * 0.94;
            profZ = (Math.random() - 0.5) * 100 * (1 - relleno * 0.45);
        }

        p.txCorazon = hx * escala * relleno;
        p.tyCorazon = hy * escala * relleno - 20;
        p.tzCorazon = profZ;

        p.bx = (Math.random() - 0.5) * 900;
        p.by = (Math.random() - 0.5) * 900;
        p.bz = (Math.random() - 0.5) * 900;
    });

    // 2. Coordenadas del Mensaje (Grandes y posicionadas arriba para no tocar el agujero negro)
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    offCanvas.width = 1100;
    offCanvas.height = 260;

    offCtx.fillStyle = '#000000';
    offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
    offCtx.fillStyle = '#ffffff';
    offCtx.font = 'bold 38px "Montserrat", sans-serif';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    
    offCtx.fillText("TE AMO HASTA EL FIN", offCanvas.width / 2, 75);
    offCtx.fillText("DEL UNIVERSO TOTAL MI PRINCESA 🩵", offCanvas.width / 2, 165);

    const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const pixeles = [];
    
    for (let y = 0; y < offCanvas.height; y += 2) {
        for (let x = 0; x < offCanvas.width; x += 2) {
            const index = (y * offCanvas.width + x) * 4;
            if (imgData.data[index] > 128) {
                pixeles.push({
                    x: (x - offCanvas.width / 2) * 0.72,
                    y: (y - offCanvas.height / 2) * 0.72 - 180 // <--- SUBIDO ARRIBA PARA EVITAR EL AGUJERO NEGRO
                });
            }
        }
    }

    particulasCorazon.forEach((p, i) => {
        if (pixeles.length > 0) {
            const targetPixel = pixeles[i % pixeles.length];
            p.txMensaje = targetPixel.x;
            p.tyMensaje = targetPixel.y;
            p.tzMensaje = (Math.random() - 0.5) * 15;
        } else {
            p.txMensaje = 0;
            p.tyMensaje = -180;
            p.tzMensaje = 0;
        }
    });
}

calcularFormaciones();

let faseAnimacion = 0;
const nombresFases = [
    'Espiral Galáctica Viva',
    'Constelación del Corazón',
    'Te amo hasta el fin del universo total mi princesa 🩵'
];

if (nombreFormacionEl) nombreFormacionEl.textContent = nombresFases[0];

setInterval(() => {
    faseAnimacion = (faseAnimacion + 1) % 3;
    if (nombreFormacionEl) {
        nombreFormacionEl.textContent = nombresFases[faseAnimacion];
    }
}, 9000);

let rotX = 0.24;
let rotY = 0;
let velRotX = 0;
let velRotY = 0.0018;
let arrastrando = false;
let prevMouseX = 0;
let prevMouseY = 0;
let distanciaArrastre = 0;

function iniciarArrastre(x, y) {
    arrastrando = true;
    prevMouseX = x;
    prevMouseY = y;
    distanciaArrastre = 0;
}

function moverArrastre(x, y) {
    if (!arrastrando) return;
    const dx = x - prevMouseX;
    const dy = y - prevMouseY;
    distanciaArrastre += Math.hypot(dx, dy);

    velRotY = dx * 0.0052;
    velRotX = dy * 0.0052;

    rotY += velRotY;
    rotX += velRotX;

    prevMouseX = x;
    prevMouseY = y;
}

function terminarArrastre() {
    arrastrando = false;
}

canvas.addEventListener('mousedown', (e) => iniciarArrastre(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => moverArrastre(e.clientX, e.clientY));
window.addEventListener('mouseup', terminarArrastre);

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) iniciarArrastre(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) moverArrastre(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

canvas.addEventListener('touchend', terminarArrastre);

function proyectar3D(x, y, z, cosY, sinY, cosX, sinX) {
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    const distanciaCamara = 720;
    const zFinal = z2 + distanciaCamara;

    if (zFinal <= 15) return null;

    const escala = fov / zFinal;
    return {
        x: ancho / 2 + x1 * escala,
        y: alto / 2 + y2 * escala,
        escala: escala,
        z: zFinal
    };
}

function dibujarAgujeroNegroDifuminado(cosY, sinY, cosX, sinX, tiempo) {
    const centro = proyectar3D(0, 0, 0, cosY, sinY, cosX, sinX);
    if (!centro) return;

    const rBase = 54 * centro.escala;
    const inclinacion = Math.max(0.42, Math.abs(Math.sin(rotX)) * 0.62 + 0.35);

    ctx.save();
    ctx.translate(centro.x, centro.y);
    ctx.globalCompositeOperation = 'lighter';

    const auraExt = ctx.createRadialGradient(0, 0, rBase * 0.6, 0, 0, rBase * 5.4);
    auraExt.addColorStop(0, 'rgba(255, 210, 150, 0.35)');
    auraExt.addColorStop(0.22, 'rgba(255, 155, 75, 0.16)');
    auraExt.addColorStop(0.5, 'rgba(90, 140, 235, 0.07)');
    auraExt.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraExt;
    ctx.beginPath();
    ctx.arc(0, 0, rBase * 5.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.scale(1.04, 0.92);
    const lenteDifusa = ctx.createRadialGradient(0, 0, rBase * 0.85, 0, 0, rBase * 2.15);
    lenteDifusa.addColorStop(0, 'rgba(255, 240, 210, 0.0)');
    lenteDifusa.addColorStop(0.22, 'rgba(255, 235, 195, 0.65)');
    lenteDifusa.addColorStop(0.45, 'rgba(255, 175, 95, 0.28)');
    lenteDifusa.addColorStop(0.75, 'rgba(130, 165, 240, 0.08)');
    lenteDifusa.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = lenteDifusa;
    ctx.beginPath();
    ctx.arc(0, 0, rBase * 2.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(Math.sin(rotY) * 0.16);
    ctx.scale(1, inclinacion);

    for (let capa = 0; capa < 4; capa++) {
        const pulso = 1 + Math.sin(tiempo * 2 + capa * 1.5) * 0.025;
        const radioDisco = rBase * (3.9 - capa * 0.45) * pulso;
        const offsetDoppler = -rBase * 0.35;

        const gasGrad = ctx.createRadialGradient(
            offsetDoppler, 0, rBase * 0.75,
            0, 0, radioDisco
        );
        gasGrad.addColorStop(0, 'rgba(255, 250, 235, 0.0)');
        gasGrad.addColorStop(0.18, 'rgba(255, 242, 215, 0.55)');
        gasGrad.addColorStop(0.42, 'rgba(255, 180, 95, 0.32)');
        gasGrad.addColorStop(0.72, 'rgba(185, 95, 45, 0.12)');
        gasGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gasGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radioDisco, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    ctx.globalCompositeOperation = 'source-over';
    const sombraGrad = ctx.createRadialGradient(0, 0, rBase * 0.72, 0, 0, rBase * 1.16);
    sombraGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    sombraGrad.addColorStop(0.78, 'rgba(0, 0, 0, 0.98)');
    sombraGrad.addColorStop(0.92, 'rgba(5, 3, 2, 0.65)');
    sombraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = sombraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, rBase * 1.16, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'lighter';
    ctx.save();
    ctx.rotate(Math.sin(rotY) * 0.16);
    ctx.scale(1, inclinacion * 0.52);

    const puenteFrontal = ctx.createRadialGradient(
        -rBase * 0.3, 0, rBase * 0.1,
        0, 0, rBase * 2.8
    );
    puenteFrontal.addColorStop(0, 'rgba(255, 245, 220, 0.65)');
    puenteFrontal.addColorStop(0.35, 'rgba(255, 190, 110, 0.35)');
    puenteFrontal.addColorStop(0.75, 'rgba(160, 110, 70, 0.10)');
    puenteFrontal.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = puenteFrontal;
    ctx.beginPath();
    ctx.arc(0, 0, rBase * 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
}

function dibujarEstrellaEspecial(x, y, escala, pulso, colorHalo) {
    const r = Math.max(2.3, 3.3 * escala);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 13);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, colorHalo + (0.68 * pulso) + ')');
    grad.addColorStop(0.55, colorHalo + (0.20 * pulso) + ')');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * pulso})`;
    ctx.lineWidth = 1;
    const largo = r * (8.5 + pulso * 4);
    ctx.beginPath();
    ctx.moveTo(-largo, 0);
    ctx.lineTo(largo, 0);
    ctx.moveTo(0, -largo);
    ctx.lineTo(0, largo);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
}

let estrellasProyectadas = [];
let tiempo = 0;

function animar() {
    tiempo += 0.025;

    if (!arrastrando) {
        rotY += velRotY;
        rotX += velRotX;
        velRotY *= 0.95;
        velRotX *= 0.95;

        if (Math.abs(velRotY) < 0.0012) {
            velRotY = velRotY >= 0 ? 0.0012 : -0.0012;
        }
    }

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    ctx.fillStyle = '#010204';
    ctx.fillRect(0, 0, ancho, alto);

    for (let i = 0; i < nebulosas3D.length; i++) {
        const neb = nebulosas3D[i];
        const proj = proyectar3D(neb.x, neb.y, neb.z, cosY, sinY, cosX, sinX);
        if (!proj) continue;

        const radioNeb = neb.r * proj.escala;
        const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, radioNeb);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, 'rgba(1, 2, 4, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radioNeb, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 0; i < CANTIDAD_FONDO; i++) {
        const est = estrellasProfundas[i];
        const proj = proyectar3D(est.x, est.y, est.z, cosY, sinY, cosX, sinX);
        if (!proj) continue;

        const distCentro = Math.hypot(proj.x - ancho / 2, proj.y - alto / 2);
        if (proj.z > 720 && distCentro < 50 * (fov / 720)) continue;

        const r = Math.max(0.45, est.size * proj.escala);
        const titileo = est.alpha * (0.78 + Math.sin(tiempo * 1.8 + est.fase) * 0.22);

        ctx.globalAlpha = titileo;
        ctx.fillStyle = est.color;
        ctx.fillRect(proj.x, proj.y, r, r);
    }

    for (let i = 0; i < CANTIDAD_ESPIRAL; i++) {
        const p = particulasEspiral[i];
        const cosO = Math.cos(p.velOrbita);
        const sinO = Math.sin(p.velOrbita);
        const nx = p.x * cosO - p.z * sinO;
        const nz = p.z * cosO + p.x * sinO;
        p.x = nx;
        p.z = nz;

        const proj = proyectar3D(p.x, p.y, p.z, cosY, sinY, cosX, sinX);
        if (!proj) continue;

        const distCentro = Math.hypot(proj.x - ancho / 2, proj.y - alto / 2);
        if (proj.z > 720 && distCentro < 50 * (fov / 720)) continue;

        const radioFinal = Math.max(0.5, p.size * proj.escala);
        const brillo = p.alpha * (0.75 + Math.sin(tiempo * 2.2 + p.fase) * 0.25);

        ctx.globalAlpha = Math.min(1, brillo);
        ctx.fillStyle = p.color;
        ctx.fillRect(proj.x, proj.y, radioFinal * 1.35, radioFinal * 1.35);
    }

    for (let i = 0; i < CANTIDAD_CORAZON; i++) {
        const p = particulasCorazon[i];
        let objetivoX, objetivoY, objetivoZ;

        if (faseAnimacion === 1) {
            objetivoX = p.txCorazon;
            objetivoY = p.tyCorazon;
            objetivoZ = p.tzCorazon;
        } else if (faseAnimacion === 2) {
            objetivoX = p.txMensaje;
            objetivoY = p.tyMensaje;
            objetivoZ = p.tzMensaje;
        } else {
            objetivoX = p.bx;
            objetivoY = p.by;
            objetivoZ = p.bz;
        }

        p.x += (objetivoX - p.x) * 0.035;
        p.y += (objetivoY - p.y) * 0.035;
        p.z += (objetivoZ - p.z) * 0.035;

        const proj = proyectar3D(p.x, p.y, p.z, cosY, sinY, cosX, sinX);
        if (!proj) continue;

        const distCentro = Math.hypot(proj.x - ancho / 2, proj.y - alto / 2);
        if (proj.z > 720 && distCentro < 50 * (fov / 720)) continue;

        const radioFinal = Math.max(0.55, p.size * proj.escala);
        const brillo = p.alpha * (0.8 + Math.sin(tiempo * 2 + p.fase) * 0.2);

        ctx.globalAlpha = Math.min(1, brillo);
        ctx.fillStyle = p.color;
        ctx.fillRect(proj.x, proj.y, radioFinal * 1.4, radioFinal * 1.4);
    }
    ctx.globalAlpha = 1;

    dibujarAgujeroNegroDifuminado(cosY, sinY, cosX, sinX, tiempo);

    estrellasProyectadas = [];
    recuerdos.forEach((rec, idx) => {
        const anguloOrbita = tiempo * 0.07;
        const rx = rec.x * Math.cos(anguloOrbita) - rec.z * Math.sin(anguloOrbita);
        const rz = rec.z * Math.cos(anguloOrbita) + rec.x * Math.sin(anguloOrbita);

        const proj = proyectar3D(rx, rec.y, rz, cosY, sinY, cosX, sinX);
        if (proj) {
            const pulso = 0.8 + Math.sin(tiempo * 2.1 + idx) * 0.2;
            dibujarEstrellaEspecial(proj.x, proj.y, proj.escala, pulso, rec.colorHalo);
            estrellasProyectadas.push({
                x: proj.x,
                y: proj.y,
                recuerdo: rec
            });
        }
    });

    requestAnimationFrame(animar);
}

animar();

const modal = document.getElementById('modalRecuerdo');
const cerrarModal = document.getElementById('cerrarModal');
const imagenTarjeta = document.getElementById('imagenTarjeta');
const videoTarjeta = document.getElementById('videoTarjeta');
const tituloTarjeta = document.getElementById('tituloTarjeta');
const textoTarjeta = document.getElementById('textoTarjeta');
const firmaTarjeta = document.getElementById('firmaTarjeta');

function detectarToqueEstrella(clientX, clientY) {
    if (distanciaArrastre > 10 || !modal.classList.contains('oculto')) return;

    for (let item of estrellasProyectadas) {
        if (Math.hypot(clientX - item.x, clientY - item.y) <= 38) {
            tituloTarjeta.textContent = item.recuerdo.titulo;
            textoTarjeta.textContent = item.recuerdo.texto;
            firmaTarjeta.textContent = item.recuerdo.firma;

            if (item.recuerdo.tipo === 'video') {
                imagenTarjeta.style.display = 'none';
                videoTarjeta.style.display = 'block';
                videoTarjeta.src = item.recuerdo.archivo;
            } else {
                videoTarjeta.style.display = 'none';
                videoTarjeta.src = '';
                imagenTarjeta.style.display = 'block';
                imagenTarjeta.src = item.recuerdo.archivo;
            }

            modal.classList.remove('oculto');
            break;
        }
    }
}

canvas.addEventListener('click', (e) => detectarToqueEstrella(e.clientX, e.clientY));

canvas.addEventListener('mousemove', (e) => {
    if (arrastrando) return;
    let sobreEstrella = false;
    for (let item of estrellasProyectadas) {
        if (Math.hypot(e.clientX - item.x, e.clientY - item.y) <= 32) {
            sobreEstrella = true;
            break;
        }
    }
    canvas.style.cursor = sobreEstrella ? 'pointer' : 'grab';
});

function cerrarModalAccion() {
    modal.classList.add('oculto');
    videoTarjeta.src = '';
}

cerrarModal.addEventListener('click', cerrarModalAccion);
modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModalAccion();
});