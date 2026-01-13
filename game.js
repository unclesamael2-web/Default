// Style Me Up! v2.0.0 - Enhanced Dress Up Game

const canvas = document.getElementById('character-canvas');
const ctx = canvas.getContext('2d');

// Animation state
let animTime = 0;
let lastTime = 0;
const breathSpeed = 0.002;
const hairSwaySpeed = 0.003;

// Game state
let currentCategory = 'hair';
let currentPose = 'standing';
let currentSkinTone = 0;
let selectedItems = {
    hair: null,
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: null
};

// Skin tone palettes with base, shadow, and highlight
const skinTones = [
    { base: '#f5d0c5', shadow: '#e8b8a8', highlight: '#fff0eb', blush: 'rgba(255, 150, 150, 0.25)' },
    { base: '#e8b89a', shadow: '#d4a080', highlight: '#f5d4c0', blush: 'rgba(255, 130, 130, 0.2)' },
    { base: '#d4a574', shadow: '#c08850', highlight: '#e8c090', blush: 'rgba(200, 100, 100, 0.2)' },
    { base: '#c68642', shadow: '#a86830', highlight: '#d8a060', blush: 'rgba(180, 80, 80, 0.15)' },
    { base: '#8d5524', shadow: '#704018', highlight: '#a87040', blush: 'rgba(150, 60, 60, 0.15)' },
    { base: '#5c3a21', shadow: '#402810', highlight: '#785030', blush: 'rgba(120, 50, 50, 0.1)' }
];

// Pose definitions (arm and body positions)
const poses = {
    standing: {
        leftArm: { shoulder: 0.1, elbow: 0, hand: { x: 0, y: 0 } },
        rightArm: { shoulder: -0.1, elbow: 0, hand: { x: 0, y: 0 } },
        bodyTilt: 0,
        headTilt: 0
    },
    handOnHip: {
        leftArm: { shoulder: 0.5, elbow: -1.2, hand: { x: 15, y: -20 } },
        rightArm: { shoulder: -0.1, elbow: 0, hand: { x: 0, y: 0 } },
        bodyTilt: 0.03,
        headTilt: -0.05
    },
    waving: {
        leftArm: { shoulder: 0.1, elbow: 0, hand: { x: 0, y: 0 } },
        rightArm: { shoulder: -2.2, elbow: -0.8, hand: { x: 10, y: -50 } },
        bodyTilt: -0.02,
        headTilt: 0.05
    }
};

// Color palettes for items
const colors = {
    hair: ['#1a1a2e', '#2c1810', '#4a3728', '#8b6914', '#c4a35a', '#722f37', '#e91e63', '#9c27b0'],
    tops: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#ffffff'],
    bottoms: ['#2d3436', '#636e72', '#0984e3', '#6c5ce7', '#00b894', '#e17055', '#e84393', '#dfe6e9'],
    shoes: ['#2c1810', '#5d4e37', '#000000', '#ff6b6b', '#ffffff', '#e17055', '#6c5ce7', '#fd79a8'],
    accessories: ['#ffd700', '#c0c0c0', '#ff6b6b', '#4ecdc4', '#e91e63', '#9c27b0', '#00bcd4', '#ff9800']
};

// Item definitions
const items = {
    hair: [
        { id: 'h1', name: 'Short', emoji: '💇', draw: drawShortHair },
        { id: 'h2', name: 'Long', emoji: '💁', draw: drawLongHair },
        { id: 'h3', name: 'Curly', emoji: '👩‍🦱', draw: drawCurlyHair },
        { id: 'h4', name: 'Ponytail', emoji: '🏃', draw: drawPonytail },
        { id: 'h5', name: 'Bun', emoji: '🧘', draw: drawBunHair },
        { id: 'h6', name: 'Pigtails', emoji: '🎀', draw: drawPigtails },
        { id: 'h7', name: 'Wavy', emoji: '🌊', draw: drawWavyHair },
        { id: 'h8', name: 'Bob', emoji: '💃', draw: drawBobHair }
    ],
    tops: [
        { id: 't1', name: 'T-Shirt', emoji: '👕', draw: drawTShirt },
        { id: 't2', name: 'Tank Top', emoji: '🎽', draw: drawTankTop },
        { id: 't3', name: 'Hoodie', emoji: '🧥', draw: drawHoodie },
        { id: 't4', name: 'Dress', emoji: '👗', draw: drawDress },
        { id: 't5', name: 'Crop Top', emoji: '👚', draw: drawCropTop },
        { id: 't6', name: 'Sweater', emoji: '🧶', draw: drawSweater },
        { id: 't7', name: 'Blazer', emoji: '🤵', draw: drawBlazer },
        { id: 't8', name: 'Blouse', emoji: '✨', draw: drawBlouse }
    ],
    bottoms: [
        { id: 'b1', name: 'Jeans', emoji: '👖', draw: drawJeans },
        { id: 'b2', name: 'Shorts', emoji: '🩳', draw: drawShorts },
        { id: 'b3', name: 'Skirt', emoji: '🩰', draw: drawSkirt },
        { id: 'b4', name: 'Long Skirt', emoji: '💃', draw: drawLongSkirt },
        { id: 'b5', name: 'Leggings', emoji: '🦵', draw: drawLeggings },
        { id: 'b6', name: 'Wide Pants', emoji: '🎭', draw: drawWidePants },
        { id: 'b7', name: 'Pleated', emoji: '🎓', draw: drawPleatedSkirt },
        { id: 'b8', name: 'Mini', emoji: '⭐', draw: drawMiniSkirt }
    ],
    shoes: [
        { id: 's1', name: 'Sneakers', emoji: '👟', draw: drawSneakers },
        { id: 's2', name: 'Heels', emoji: '👠', draw: drawHeels },
        { id: 's3', name: 'Boots', emoji: '👢', draw: drawBoots },
        { id: 's4', name: 'Sandals', emoji: '🩴', draw: drawSandals },
        { id: 's5', name: 'Flats', emoji: '🥿', draw: drawFlats },
        { id: 's6', name: 'Platforms', emoji: '🎪', draw: drawPlatforms },
        { id: 's7', name: 'Loafers', emoji: '👞', draw: drawLoafers },
        { id: 's8', name: 'Ankle Boot', emoji: '🥾', draw: drawAnkleBoots }
    ],
    accessories: [
        { id: 'a1', name: 'Necklace', emoji: '📿', draw: drawNecklace },
        { id: 'a2', name: 'Earrings', emoji: '💎', draw: drawEarrings },
        { id: 'a3', name: 'Glasses', emoji: '👓', draw: drawGlasses },
        { id: 'a4', name: 'Hat', emoji: '🎩', draw: drawHat },
        { id: 'a5', name: 'Headband', emoji: '👑', draw: drawHeadband },
        { id: 'a6', name: 'Bow', emoji: '🎀', draw: drawBow },
        { id: 'a7', name: 'Scarf', emoji: '🧣', draw: drawScarf },
        { id: 'a8', name: 'Watch', emoji: '⌚', draw: drawWatch }
    ]
};

// Assign colors to items
Object.keys(items).forEach(category => {
    items[category].forEach((item, i) => {
        item.color = colors[category][i % colors[category].length];
    });
});

// Canvas dimensions and scaling
let charScale = 1;
let charX = 0;
let charY = 0;

function resizeCanvas() {
    const container = document.getElementById('character-area');
    const rect = container.getBoundingClientRect();
    const baseWidth = 220;
    const baseHeight = 380;
    const scaleX = (rect.width - 40) / baseWidth;
    const scaleY = (rect.height - 60) / baseHeight;
    charScale = Math.min(scaleX, scaleY, 1.5);
    canvas.width = rect.width;
    canvas.height = rect.height;
    charX = (canvas.width - baseWidth * charScale) / 2;
    charY = (canvas.height - baseHeight * charScale) / 2 + 20;
}

// Get current skin colors
function getSkin() {
    return skinTones[currentSkinTone];
}

// Animation loop
function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    animTime += deltaTime;

    drawCharacter();
    requestAnimationFrame(animate);
}

// Main draw function
function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const skin = getSkin();
    const pose = poses[currentPose];

    // Breathing animation
    const breathOffset = Math.sin(animTime * breathSpeed) * 2;
    const breathScale = 1 + Math.sin(animTime * breathSpeed) * 0.008;

    // Hair sway
    const hairSway = Math.sin(animTime * hairSwaySpeed) * 3;

    ctx.save();
    ctx.translate(charX, charY);
    ctx.scale(charScale, charScale);

    // Apply body tilt from pose
    ctx.translate(110, 190);
    ctx.rotate(pose.bodyTilt);
    ctx.translate(-110, -190);

    // Draw back hair first (for long styles)
    if (selectedItems.hair) {
        drawBackHairLayer(selectedItems.hair, hairSway);
    }

    // Draw body with breathing
    ctx.save();
    ctx.translate(110, 190);
    ctx.scale(1, breathScale);
    ctx.translate(-110, -190 + breathOffset * 0.5);

    drawBody(skin, pose);

    if (selectedItems.bottoms) {
        selectedItems.bottoms.draw(ctx, selectedItems.bottoms.color, pose);
    }

    if (selectedItems.shoes) {
        selectedItems.shoes.draw(ctx, selectedItems.shoes.color);
    }

    if (selectedItems.tops) {
        selectedItems.tops.draw(ctx, selectedItems.tops.color, pose);
    }

    drawArms(skin, pose);

    ctx.restore();

    // Draw head (slight movement with breathing)
    ctx.save();
    ctx.translate(110, 50);
    ctx.rotate(pose.headTilt);
    ctx.translate(-110, -50 + breathOffset * 0.3);

    drawHead(skin, pose);

    if (selectedItems.hair) {
        selectedItems.hair.draw(ctx, selectedItems.hair.color, hairSway);
    }

    if (selectedItems.accessories) {
        selectedItems.accessories.draw(ctx, selectedItems.accessories.color);
    }

    ctx.restore();

    ctx.restore();
}

// Draw the body with improved anatomy
function drawBody(skin, pose) {
    // Neck with shading
    const neckGrad = ctx.createLinearGradient(95, 75, 125, 75);
    neckGrad.addColorStop(0, skin.shadow);
    neckGrad.addColorStop(0.3, skin.base);
    neckGrad.addColorStop(0.7, skin.base);
    neckGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(95, 78);
    ctx.lineTo(125, 78);
    ctx.lineTo(128, 105);
    ctx.lineTo(92, 105);
    ctx.closePath();
    ctx.fill();

    // Shoulders and torso with curves
    const torsoGrad = ctx.createLinearGradient(60, 100, 160, 100);
    torsoGrad.addColorStop(0, skin.shadow);
    torsoGrad.addColorStop(0.2, skin.base);
    torsoGrad.addColorStop(0.5, skin.highlight);
    torsoGrad.addColorStop(0.8, skin.base);
    torsoGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = torsoGrad;
    ctx.beginPath();
    ctx.moveTo(70, 105);
    ctx.quadraticCurveTo(60, 108, 55, 115);
    ctx.lineTo(50, 180);
    ctx.quadraticCurveTo(55, 195, 75, 200);
    ctx.lineTo(145, 200);
    ctx.quadraticCurveTo(165, 195, 170, 180);
    ctx.lineTo(165, 115);
    ctx.quadraticCurveTo(160, 108, 150, 105);
    ctx.closePath();
    ctx.fill();

    // Waist curve
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.moveTo(55, 180);
    ctx.quadraticCurveTo(110, 175, 165, 180);
    ctx.lineTo(165, 200);
    ctx.quadraticCurveTo(110, 205, 55, 200);
    ctx.closePath();
    ctx.fill();

    // Hips
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.quadraticCurveTo(50, 220, 60, 230);
    ctx.lineTo(160, 230);
    ctx.quadraticCurveTo(170, 220, 165, 195);
    ctx.closePath();
    ctx.fill();

    // Legs with shading
    const legGradL = ctx.createLinearGradient(60, 230, 100, 230);
    legGradL.addColorStop(0, skin.shadow);
    legGradL.addColorStop(0.4, skin.base);
    legGradL.addColorStop(0.8, skin.highlight);
    legGradL.addColorStop(1, skin.base);

    // Left leg
    ctx.fillStyle = legGradL;
    ctx.beginPath();
    ctx.moveTo(60, 228);
    ctx.quadraticCurveTo(55, 280, 58, 350);
    ctx.lineTo(95, 350);
    ctx.quadraticCurveTo(100, 280, 105, 228);
    ctx.closePath();
    ctx.fill();

    const legGradR = ctx.createLinearGradient(115, 230, 160, 230);
    legGradR.addColorStop(0, skin.base);
    legGradR.addColorStop(0.2, skin.highlight);
    legGradR.addColorStop(0.6, skin.base);
    legGradR.addColorStop(1, skin.shadow);

    // Right leg
    ctx.fillStyle = legGradR;
    ctx.beginPath();
    ctx.moveTo(115, 228);
    ctx.quadraticCurveTo(120, 280, 125, 350);
    ctx.lineTo(162, 350);
    ctx.quadraticCurveTo(165, 280, 160, 228);
    ctx.closePath();
    ctx.fill();

    // Feet
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.ellipse(77, 355, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(143, 355, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Draw arms with pose support
function drawArms(skin, pose) {
    const armGrad = ctx.createLinearGradient(0, 0, 30, 0);
    armGrad.addColorStop(0, skin.shadow);
    armGrad.addColorStop(0.5, skin.base);
    armGrad.addColorStop(1, skin.highlight);

    // Left arm
    ctx.save();
    ctx.translate(55, 112);
    ctx.rotate(pose.leftArm.shoulder);

    ctx.fillStyle = armGrad;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.quadraticCurveTo(-15, 35, -12 + pose.leftArm.hand.x, 70 + pose.leftArm.hand.y);
    ctx.lineTo(5 + pose.leftArm.hand.x, 70 + pose.leftArm.hand.y);
    ctx.quadraticCurveTo(5, 35, 8, 0);
    ctx.closePath();
    ctx.fill();

    // Left hand
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.ellipse(-3 + pose.leftArm.hand.x, 75 + pose.leftArm.hand.y, 12, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Right arm
    ctx.save();
    ctx.translate(165, 112);
    ctx.rotate(pose.rightArm.shoulder);

    ctx.fillStyle = armGrad;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.quadraticCurveTo(-5, 35, -5 + pose.rightArm.hand.x, 70 + pose.rightArm.hand.y);
    ctx.lineTo(12 + pose.rightArm.hand.x, 70 + pose.rightArm.hand.y);
    ctx.quadraticCurveTo(15, 35, 5, 0);
    ctx.closePath();
    ctx.fill();

    // Right hand
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.ellipse(3 + pose.rightArm.hand.x, 75 + pose.rightArm.hand.y, 12, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Wave animation for waving pose
    if (currentPose === 'waving') {
        const waveAngle = Math.sin(animTime * 0.008) * 0.3;
        ctx.rotate(waveAngle);
    }

    ctx.restore();
}

// Draw head with detailed features
function drawHead(skin, pose) {
    // Head shape with gradient
    const headGrad = ctx.createRadialGradient(110, 45, 5, 110, 45, 50);
    headGrad.addColorStop(0, skin.highlight);
    headGrad.addColorStop(0.5, skin.base);
    headGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(110, 45, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = skin.base;
    ctx.beginPath();
    ctx.ellipse(65, 50, 8, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(155, 50, 8, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Inner ear shadow
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(66, 50, 4, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(154, 50, 4, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes - white with subtle shadow
    const eyeShadow = ctx.createLinearGradient(0, 35, 0, 55);
    eyeShadow.addColorStop(0, '#e8e8e8');
    eyeShadow.addColorStop(0.3, '#ffffff');
    eyeShadow.addColorStop(1, '#f5f5f5');

    ctx.fillStyle = eyeShadow;
    ctx.beginPath();
    ctx.ellipse(92, 45, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(128, 45, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris with gradient
    const irisGrad = ctx.createRadialGradient(94, 46, 2, 94, 46, 8);
    irisGrad.addColorStop(0, '#2d1b10');
    irisGrad.addColorStop(0.7, '#4a3020');
    irisGrad.addColorStop(1, '#3d2515');

    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(94, 46, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(126, 46, 7, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(95, 46, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(127, 46, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights (multiple for realism)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(97, 44, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(129, 44, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(93, 48, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(125, 48, 1, 0, Math.PI * 2);
    ctx.fill();

    // Eyelashes
    ctx.strokeStyle = '#2d1b10';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    // Left eye lashes
    for (let i = 0; i < 5; i++) {
        const angle = -0.5 + i * 0.25;
        ctx.beginPath();
        ctx.moveTo(92 + Math.cos(angle) * 12, 45 + Math.sin(angle) * 9);
        ctx.lineTo(92 + Math.cos(angle) * 16, 45 + Math.sin(angle) * 12 - 2);
        ctx.stroke();
    }

    // Right eye lashes
    for (let i = 0; i < 5; i++) {
        const angle = -0.5 + i * 0.25;
        ctx.beginPath();
        ctx.moveTo(128 + Math.cos(angle) * 12, 45 + Math.sin(angle) * 9);
        ctx.lineTo(128 + Math.cos(angle) * 16, 45 + Math.sin(angle) * 12 - 2);
        ctx.stroke();
    }

    // Eyebrows with gradient
    ctx.strokeStyle = '#3d2515';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(78, 30);
    ctx.quadraticCurveTo(92, 26, 104, 32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(116, 32);
    ctx.quadraticCurveTo(128, 26, 142, 30);
    ctx.stroke();

    // Nose with subtle shading
    ctx.strokeStyle = skin.shadow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(110, 48);
    ctx.quadraticCurveTo(108, 60, 106, 65);
    ctx.quadraticCurveTo(110, 68, 114, 65);
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = skin.shadow;
    ctx.beginPath();
    ctx.ellipse(106, 66, 2, 1.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(114, 66, 2, 1.5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Lips with gradient
    const lipGrad = ctx.createLinearGradient(95, 75, 125, 75);
    lipGrad.addColorStop(0, '#c47070');
    lipGrad.addColorStop(0.5, '#d88080');
    lipGrad.addColorStop(1, '#c47070');

    ctx.fillStyle = lipGrad;
    // Upper lip
    ctx.beginPath();
    ctx.moveTo(98, 78);
    ctx.quadraticCurveTo(104, 75, 110, 77);
    ctx.quadraticCurveTo(116, 75, 122, 78);
    ctx.quadraticCurveTo(116, 80, 110, 79);
    ctx.quadraticCurveTo(104, 80, 98, 78);
    ctx.fill();

    // Lower lip
    ctx.fillStyle = '#d08585';
    ctx.beginPath();
    ctx.moveTo(100, 79);
    ctx.quadraticCurveTo(110, 90, 120, 79);
    ctx.quadraticCurveTo(110, 85, 100, 79);
    ctx.fill();

    // Lip highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(110, 82, 6, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blush
    ctx.fillStyle = skin.blush;
    ctx.beginPath();
    ctx.ellipse(75, 58, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(145, 58, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Back hair layer for styles that need it
function drawBackHairLayer(item, sway) {
    if (['h2', 'h3', 'h7'].includes(item.id)) {
        ctx.fillStyle = darkenColor(item.color, 15);
        ctx.beginPath();
        ctx.moveTo(60 + sway * 0.5, 30);
        ctx.quadraticCurveTo(110, 0, 160 - sway * 0.5, 30);
        ctx.lineTo(165 + sway * 0.3, 120);
        ctx.quadraticCurveTo(110, 140, 55 - sway * 0.3, 120);
        ctx.closePath();
        ctx.fill();
    }
}

// === HAIR STYLES ===

function drawShortHair(ctx, color, sway) {
    const grad = ctx.createRadialGradient(110, 25, 10, 110, 35, 50);
    grad.addColorStop(0, lightenColor(color, 15));
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, darkenColor(color, 20));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(65, 50);
    ctx.quadraticCurveTo(60, 20, 80, 5);
    ctx.quadraticCurveTo(110, -10, 140, 5);
    ctx.quadraticCurveTo(160, 20, 155, 50);
    ctx.quadraticCurveTo(150, 60, 145, 55);
    ctx.quadraticCurveTo(130, 30, 110, 25);
    ctx.quadraticCurveTo(90, 30, 75, 55);
    ctx.quadraticCurveTo(70, 60, 65, 50);
    ctx.closePath();
    ctx.fill();

    // Side hair
    ctx.beginPath();
    ctx.ellipse(68 + sway * 0.3, 45, 12, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(152 - sway * 0.3, 45, 12, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
}

function drawLongHair(ctx, color, sway) {
    const grad = ctx.createLinearGradient(60, 0, 160, 0);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Top of head
    ctx.beginPath();
    ctx.moveTo(65, 45);
    ctx.quadraticCurveTo(60, 15, 85, 0);
    ctx.quadraticCurveTo(110, -10, 135, 0);
    ctx.quadraticCurveTo(160, 15, 155, 45);
    ctx.closePath();
    ctx.fill();

    // Long flowing hair with sway
    ctx.beginPath();
    ctx.moveTo(60, 40);
    ctx.quadraticCurveTo(55 + sway, 100, 50 + sway * 1.2, 180);
    ctx.quadraticCurveTo(55 + sway * 0.8, 200, 70 + sway * 0.5, 195);
    ctx.lineTo(75, 90);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(160, 40);
    ctx.quadraticCurveTo(165 - sway, 100, 170 - sway * 1.2, 180);
    ctx.quadraticCurveTo(165 - sway * 0.8, 200, 150 - sway * 0.5, 195);
    ctx.lineTo(145, 90);
    ctx.closePath();
    ctx.fill();

    // Bangs
    ctx.beginPath();
    ctx.moveTo(70, 30);
    ctx.quadraticCurveTo(80 + sway * 0.2, 50, 90, 45);
    ctx.quadraticCurveTo(100, 48, 110, 42);
    ctx.quadraticCurveTo(120, 48, 130, 45);
    ctx.quadraticCurveTo(140 - sway * 0.2, 50, 150, 30);
    ctx.quadraticCurveTo(110, 10, 70, 30);
    ctx.fill();
}

function drawCurlyHair(ctx, color, sway) {
    const grad = ctx.createRadialGradient(110, 30, 10, 110, 40, 60);
    grad.addColorStop(0, lightenColor(color, 10));
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Draw curls as overlapping circles
    const curls = [
        { x: 70, y: 25, r: 20 }, { x: 95, y: 15, r: 22 }, { x: 125, y: 15, r: 22 }, { x: 150, y: 25, r: 20 },
        { x: 58, y: 50, r: 18 }, { x: 162, y: 50, r: 18 },
        { x: 55, y: 80, r: 16 }, { x: 165, y: 80, r: 16 },
        { x: 60, y: 110, r: 15 }, { x: 160, y: 110, r: 15 }
    ];

    curls.forEach((curl, i) => {
        const swayOffset = (i % 2 === 0 ? 1 : -1) * sway * 0.3;
        ctx.beginPath();
        ctx.arc(curl.x + swayOffset, curl.y, curl.r, 0, Math.PI * 2);
        ctx.fill();
    });

    // Top curls
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI + 0.2;
        const x = 110 + Math.cos(angle) * 45;
        const y = 30 + Math.sin(angle) * 25;
        ctx.beginPath();
        ctx.arc(x + sway * 0.1, y, 15, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawPonytail(ctx, color, sway) {
    const grad = ctx.createRadialGradient(110, 25, 10, 110, 35, 50);
    grad.addColorStop(0, lightenColor(color, 10));
    grad.addColorStop(1, color);

    ctx.fillStyle = grad;

    // Top of head
    ctx.beginPath();
    ctx.moveTo(65, 50);
    ctx.quadraticCurveTo(60, 20, 85, 5);
    ctx.quadraticCurveTo(110, -5, 135, 5);
    ctx.quadraticCurveTo(160, 20, 155, 50);
    ctx.quadraticCurveTo(110, 40, 65, 50);
    ctx.closePath();
    ctx.fill();

    // Ponytail with sway
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(145, 20);
    ctx.quadraticCurveTo(175 + sway, 40, 180 + sway * 1.5, 100);
    ctx.quadraticCurveTo(175 + sway * 1.2, 160, 160 + sway * 0.8, 170);
    ctx.quadraticCurveTo(155 + sway * 0.5, 140, 155 + sway * 0.3, 80);
    ctx.quadraticCurveTo(150, 40, 145, 20);
    ctx.closePath();
    ctx.fill();

    // Hair tie
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.ellipse(160 + sway * 0.2, 30, 10, 8, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Bangs
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(75, 35);
    ctx.quadraticCurveTo(90, 50, 100, 40);
    ctx.quadraticCurveTo(95, 30, 75, 35);
    ctx.fill();
}

function drawBunHair(ctx, color, sway) {
    const grad = ctx.createRadialGradient(110, 25, 10, 110, 35, 50);
    grad.addColorStop(0, lightenColor(color, 10));
    grad.addColorStop(1, color);

    ctx.fillStyle = grad;

    // Base hair
    ctx.beginPath();
    ctx.moveTo(65, 50);
    ctx.quadraticCurveTo(60, 20, 85, 5);
    ctx.quadraticCurveTo(110, -5, 135, 5);
    ctx.quadraticCurveTo(160, 20, 155, 50);
    ctx.quadraticCurveTo(110, 40, 65, 50);
    ctx.closePath();
    ctx.fill();

    // Bun on top
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(110 + sway * 0.1, -15, 28, 0, Math.PI * 2);
    ctx.fill();

    // Bun wrap lines
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(110 + sway * 0.1, -15, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(110 + sway * 0.1, -15, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Wispy side pieces
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(68, 45);
    ctx.quadraticCurveTo(60 + sway * 0.3, 65, 65 + sway * 0.2, 85);
    ctx.quadraticCurveTo(72, 70, 75, 50);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(152, 45);
    ctx.quadraticCurveTo(160 - sway * 0.3, 65, 155 - sway * 0.2, 85);
    ctx.quadraticCurveTo(148, 70, 145, 50);
    ctx.closePath();
    ctx.fill();
}

function drawPigtails(ctx, color, sway) {
    const grad = ctx.createRadialGradient(110, 25, 10, 110, 35, 50);
    grad.addColorStop(0, lightenColor(color, 10));
    grad.addColorStop(1, color);

    ctx.fillStyle = grad;

    // Top of head
    ctx.beginPath();
    ctx.moveTo(65, 50);
    ctx.quadraticCurveTo(60, 20, 85, 5);
    ctx.quadraticCurveTo(110, -5, 135, 5);
    ctx.quadraticCurveTo(160, 20, 155, 50);
    ctx.quadraticCurveTo(110, 40, 65, 50);
    ctx.closePath();
    ctx.fill();

    // Left pigtail
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(60, 35);
    ctx.quadraticCurveTo(30 + sway, 50, 25 + sway * 1.5, 120);
    ctx.quadraticCurveTo(30 + sway * 1.2, 160, 45 + sway * 0.5, 155);
    ctx.quadraticCurveTo(50, 100, 55, 45);
    ctx.closePath();
    ctx.fill();

    // Right pigtail
    ctx.beginPath();
    ctx.moveTo(160, 35);
    ctx.quadraticCurveTo(190 - sway, 50, 195 - sway * 1.5, 120);
    ctx.quadraticCurveTo(190 - sway * 1.2, 160, 175 - sway * 0.5, 155);
    ctx.quadraticCurveTo(170, 100, 165, 45);
    ctx.closePath();
    ctx.fill();

    // Hair ties
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.ellipse(50 + sway * 0.3, 40, 8, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(170 - sway * 0.3, 40, 8, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
}

function drawWavyHair(ctx, color, sway) {
    const grad = ctx.createLinearGradient(60, 0, 160, 0);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Top
    ctx.beginPath();
    ctx.moveTo(65, 45);
    ctx.quadraticCurveTo(60, 15, 85, 0);
    ctx.quadraticCurveTo(110, -10, 135, 0);
    ctx.quadraticCurveTo(160, 15, 155, 45);
    ctx.closePath();
    ctx.fill();

    // Wavy sides
    ctx.fillStyle = color;

    // Left waves
    ctx.beginPath();
    ctx.moveTo(62, 40);
    for (let i = 0; i < 5; i++) {
        const y = 50 + i * 30;
        const wave = Math.sin(i * 0.8 + animTime * 0.002) * 8 + sway * 0.5;
        ctx.quadraticCurveTo(50 + wave, y, 55 + wave * 0.5, y + 15);
        ctx.quadraticCurveTo(60 - wave * 0.3, y + 25, 55 + wave * 0.3, y + 30);
    }
    ctx.lineTo(70, 180);
    ctx.lineTo(75, 50);
    ctx.closePath();
    ctx.fill();

    // Right waves
    ctx.beginPath();
    ctx.moveTo(158, 40);
    for (let i = 0; i < 5; i++) {
        const y = 50 + i * 30;
        const wave = Math.sin(i * 0.8 + animTime * 0.002 + Math.PI) * 8 - sway * 0.5;
        ctx.quadraticCurveTo(170 + wave, y, 165 + wave * 0.5, y + 15);
        ctx.quadraticCurveTo(160 - wave * 0.3, y + 25, 165 + wave * 0.3, y + 30);
    }
    ctx.lineTo(150, 180);
    ctx.lineTo(145, 50);
    ctx.closePath();
    ctx.fill();

    // Bangs
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(70, 30);
    ctx.quadraticCurveTo(85, 55, 100, 48);
    ctx.quadraticCurveTo(110, 52, 120, 48);
    ctx.quadraticCurveTo(135, 55, 150, 30);
    ctx.quadraticCurveTo(110, 5, 70, 30);
    ctx.fill();
}

function drawBobHair(ctx, color, sway) {
    const grad = ctx.createRadialGradient(110, 30, 10, 110, 50, 60);
    grad.addColorStop(0, lightenColor(color, 15));
    grad.addColorStop(0.6, color);
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Main bob shape
    ctx.beginPath();
    ctx.moveTo(55 + sway * 0.2, 80);
    ctx.quadraticCurveTo(50, 50, 60, 25);
    ctx.quadraticCurveTo(85, 0, 110, -5);
    ctx.quadraticCurveTo(135, 0, 160, 25);
    ctx.quadraticCurveTo(170, 50, 165 - sway * 0.2, 80);
    ctx.quadraticCurveTo(155 - sway * 0.3, 95, 140 - sway * 0.2, 95);
    ctx.lineTo(80 + sway * 0.2, 95);
    ctx.quadraticCurveTo(65 + sway * 0.3, 95, 55 + sway * 0.2, 80);
    ctx.closePath();
    ctx.fill();

    // Bangs with texture
    ctx.beginPath();
    ctx.moveTo(65, 30);
    ctx.quadraticCurveTo(75, 48, 85, 42);
    ctx.quadraticCurveTo(95, 50, 105, 45);
    ctx.quadraticCurveTo(115, 50, 125, 45);
    ctx.quadraticCurveTo(135, 50, 145, 42);
    ctx.quadraticCurveTo(155, 48, 155, 30);
    ctx.quadraticCurveTo(110, 0, 65, 30);
    ctx.fill();
}

// === TOPS ===

function drawTShirt(ctx, color, pose) {
    const grad = ctx.createLinearGradient(50, 100, 170, 100);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Main body
    ctx.beginPath();
    ctx.moveTo(70, 105);
    ctx.lineTo(150, 105);
    ctx.lineTo(155, 200);
    ctx.lineTo(65, 200);
    ctx.closePath();
    ctx.fill();

    // Sleeves
    ctx.beginPath();
    ctx.moveTo(55, 110);
    ctx.lineTo(40, 115);
    ctx.lineTo(38, 145);
    ctx.lineTo(55, 145);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(165, 110);
    ctx.lineTo(180, 115);
    ctx.lineTo(182, 145);
    ctx.lineTo(165, 145);
    ctx.closePath();
    ctx.fill();

    // Collar
    ctx.strokeStyle = darkenColor(color, 25);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(85, 105);
    ctx.quadraticCurveTo(110, 115, 135, 105);
    ctx.stroke();

    // Hem
    ctx.beginPath();
    ctx.moveTo(65, 198);
    ctx.lineTo(155, 198);
    ctx.stroke();
}

function drawTankTop(ctx, color, pose) {
    const grad = ctx.createLinearGradient(70, 100, 150, 100);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Main body
    ctx.beginPath();
    ctx.moveTo(75, 108);
    ctx.lineTo(145, 108);
    ctx.lineTo(150, 200);
    ctx.lineTo(70, 200);
    ctx.closePath();
    ctx.fill();

    // Straps
    ctx.lineWidth = 8;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(82, 108);
    ctx.lineTo(90, 85);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(138, 108);
    ctx.lineTo(130, 85);
    ctx.stroke();

    // Neckline
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(75, 108);
    ctx.quadraticCurveTo(110, 125, 145, 108);
    ctx.stroke();
}

function drawHoodie(ctx, color, pose) {
    const grad = ctx.createLinearGradient(40, 100, 180, 100);
    grad.addColorStop(0, darkenColor(color, 20));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 5));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 20));

    ctx.fillStyle = grad;

    // Main body
    ctx.beginPath();
    ctx.moveTo(55, 105);
    ctx.lineTo(165, 105);
    ctx.lineTo(170, 205);
    ctx.lineTo(50, 205);
    ctx.closePath();
    ctx.fill();

    // Sleeves
    ctx.beginPath();
    ctx.moveTo(50, 110);
    ctx.lineTo(30, 115);
    ctx.lineTo(25, 180);
    ctx.lineTo(45, 180);
    ctx.lineTo(50, 140);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(170, 110);
    ctx.lineTo(190, 115);
    ctx.lineTo(195, 180);
    ctx.lineTo(175, 180);
    ctx.lineTo(170, 140);
    ctx.closePath();
    ctx.fill();

    // Hood
    ctx.fillStyle = darkenColor(color, 10);
    ctx.beginPath();
    ctx.moveTo(70, 105);
    ctx.quadraticCurveTo(110, 85, 150, 105);
    ctx.quadraticCurveTo(160, 60, 110, 45);
    ctx.quadraticCurveTo(60, 60, 70, 105);
    ctx.fill();

    // Front pocket
    ctx.fillStyle = darkenColor(color, 15);
    ctx.beginPath();
    ctx.moveTo(75, 155);
    ctx.lineTo(145, 155);
    ctx.lineTo(145, 195);
    ctx.lineTo(75, 195);
    ctx.closePath();
    ctx.fill();

    // Pocket line
    ctx.strokeStyle = darkenColor(color, 25);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(110, 155);
    ctx.lineTo(110, 195);
    ctx.stroke();

    // Drawstrings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(95, 105);
    ctx.lineTo(95, 140);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(125, 105);
    ctx.lineTo(125, 140);
    ctx.stroke();
}

function drawDress(ctx, color, pose) {
    const grad = ctx.createLinearGradient(50, 100, 170, 100);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 15));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Bodice
    ctx.beginPath();
    ctx.moveTo(78, 105);
    ctx.lineTo(142, 105);
    ctx.lineTo(150, 180);
    ctx.lineTo(70, 180);
    ctx.closePath();
    ctx.fill();

    // Skirt
    ctx.beginPath();
    ctx.moveTo(65, 180);
    ctx.quadraticCurveTo(50, 260, 55, 280);
    ctx.lineTo(165, 280);
    ctx.quadraticCurveTo(170, 260, 155, 180);
    ctx.closePath();
    ctx.fill();

    // Straps
    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(85, 105);
    ctx.lineTo(92, 85);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(135, 105);
    ctx.lineTo(128, 85);
    ctx.stroke();

    // Waist detail
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(68, 175);
    ctx.quadraticCurveTo(110, 185, 152, 175);
    ctx.stroke();

    // Skirt folds
    ctx.strokeStyle = darkenColor(color, 10);
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(80 + i * 20, 185);
        ctx.quadraticCurveTo(78 + i * 21, 230, 75 + i * 22, 275);
        ctx.stroke();
    }
}

function drawCropTop(ctx, color, pose) {
    const grad = ctx.createLinearGradient(70, 100, 150, 100);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.5, lightenColor(color, 15));
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Main body
    ctx.beginPath();
    ctx.moveTo(72, 105);
    ctx.lineTo(148, 105);
    ctx.lineTo(145, 155);
    ctx.lineTo(75, 155);
    ctx.closePath();
    ctx.fill();

    // Hem with ruffle
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(78 + i * 14, 155, 7, 0, Math.PI);
        ctx.stroke();
    }
}

function drawSweater(ctx, color, pose) {
    const grad = ctx.createLinearGradient(35, 100, 185, 100);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Main body
    ctx.beginPath();
    ctx.moveTo(55, 105);
    ctx.lineTo(165, 105);
    ctx.lineTo(168, 205);
    ctx.lineTo(52, 205);
    ctx.closePath();
    ctx.fill();

    // Sleeves
    ctx.beginPath();
    ctx.moveTo(50, 110);
    ctx.lineTo(28, 115);
    ctx.lineTo(22, 185);
    ctx.lineTo(45, 185);
    ctx.lineTo(50, 140);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(170, 110);
    ctx.lineTo(192, 115);
    ctx.lineTo(198, 185);
    ctx.lineTo(175, 185);
    ctx.lineTo(170, 140);
    ctx.closePath();
    ctx.fill();

    // Collar ribbing
    ctx.fillStyle = darkenColor(color, 15);
    ctx.beginPath();
    ctx.moveTo(80, 105);
    ctx.quadraticCurveTo(110, 118, 140, 105);
    ctx.quadraticCurveTo(110, 108, 80, 105);
    ctx.fill();

    // Cuff ribbing
    ctx.fillStyle = darkenColor(color, 15);
    ctx.fillRect(22, 178, 25, 10);
    ctx.fillRect(173, 178, 25, 10);

    // Bottom ribbing
    ctx.fillRect(52, 198, 116, 10);

    // Cable knit pattern
    ctx.strokeStyle = darkenColor(color, 8);
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(75 + i * 20, 120);
        ctx.quadraticCurveTo(80 + i * 20, 150, 75 + i * 20, 180);
        ctx.stroke();
    }
}

function drawBlazer(ctx, color, pose) {
    const grad = ctx.createLinearGradient(40, 100, 180, 100);
    grad.addColorStop(0, darkenColor(color, 20));
    grad.addColorStop(0.2, color);
    grad.addColorStop(0.5, lightenColor(color, 5));
    grad.addColorStop(0.8, color);
    grad.addColorStop(1, darkenColor(color, 20));

    ctx.fillStyle = grad;

    // Main body
    ctx.beginPath();
    ctx.moveTo(55, 105);
    ctx.lineTo(165, 105);
    ctx.lineTo(168, 210);
    ctx.lineTo(52, 210);
    ctx.closePath();
    ctx.fill();

    // Sleeves
    ctx.beginPath();
    ctx.moveTo(50, 110);
    ctx.lineTo(30, 115);
    ctx.lineTo(28, 185);
    ctx.lineTo(48, 185);
    ctx.lineTo(50, 140);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(170, 110);
    ctx.lineTo(190, 115);
    ctx.lineTo(192, 185);
    ctx.lineTo(172, 185);
    ctx.lineTo(170, 140);
    ctx.closePath();
    ctx.fill();

    // Lapels
    ctx.fillStyle = darkenColor(color, 25);
    ctx.beginPath();
    ctx.moveTo(85, 105);
    ctx.lineTo(110, 160);
    ctx.lineTo(95, 165);
    ctx.lineTo(78, 115);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(135, 105);
    ctx.lineTo(110, 160);
    ctx.lineTo(125, 165);
    ctx.lineTo(142, 115);
    ctx.closePath();
    ctx.fill();

    // Buttons
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(110, 175, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 195, 5, 0, Math.PI * 2);
    ctx.fill();

    // Button holes
    ctx.strokeStyle = darkenColor(color, 30);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(110, 175, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(110, 195, 3, 0, Math.PI * 2);
    ctx.stroke();
}

function drawBlouse(ctx, color, pose) {
    const grad = ctx.createLinearGradient(55, 100, 165, 100);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 20));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Main body with feminine shape
    ctx.beginPath();
    ctx.moveTo(70, 105);
    ctx.quadraticCurveTo(60, 110, 55, 120);
    ctx.lineTo(52, 200);
    ctx.lineTo(168, 200);
    ctx.lineTo(165, 120);
    ctx.quadraticCurveTo(160, 110, 150, 105);
    ctx.closePath();
    ctx.fill();

    // Puff sleeves
    ctx.beginPath();
    ctx.moveTo(55, 115);
    ctx.quadraticCurveTo(25, 120, 30, 145);
    ctx.quadraticCurveTo(35, 160, 52, 155);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(165, 115);
    ctx.quadraticCurveTo(195, 120, 190, 145);
    ctx.quadraticCurveTo(185, 160, 168, 155);
    ctx.closePath();
    ctx.fill();

    // V-neck
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(78, 105);
    ctx.lineTo(110, 135);
    ctx.lineTo(142, 105);
    ctx.stroke();

    // Button placket
    ctx.beginPath();
    ctx.moveTo(110, 135);
    ctx.lineTo(110, 200);
    ctx.stroke();

    // Buttons
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = lightenColor(color, 30);
        ctx.beginPath();
        ctx.arc(110, 145 + i * 15, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// === BOTTOMS ===

function drawJeans(ctx, color, pose) {
    const grad = ctx.createLinearGradient(55, 195, 165, 195);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Waistband
    ctx.fillStyle = darkenColor(color, 10);
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.lineTo(165, 210);
    ctx.lineTo(55, 210);
    ctx.closePath();
    ctx.fill();

    // Left leg
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(55, 208);
    ctx.lineTo(108, 208);
    ctx.quadraticCurveTo(105, 280, 100, 350);
    ctx.lineTo(55, 350);
    ctx.quadraticCurveTo(50, 280, 55, 208);
    ctx.closePath();
    ctx.fill();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(112, 208);
    ctx.lineTo(165, 208);
    ctx.quadraticCurveTo(170, 280, 165, 350);
    ctx.lineTo(120, 350);
    ctx.quadraticCurveTo(115, 280, 112, 208);
    ctx.closePath();
    ctx.fill();

    // Pockets
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(62, 210);
    ctx.lineTo(68, 235);
    ctx.lineTo(85, 230);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(158, 210);
    ctx.lineTo(152, 235);
    ctx.lineTo(135, 230);
    ctx.stroke();

    // Seams
    ctx.strokeStyle = darkenColor(color, 10);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(78, 345);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(140, 210);
    ctx.lineTo(142, 345);
    ctx.stroke();
}

function drawShorts(ctx, color, pose) {
    const grad = ctx.createLinearGradient(55, 195, 165, 195);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Main shorts
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.lineTo(165, 260);
    ctx.quadraticCurveTo(140, 265, 115, 255);
    ctx.lineTo(105, 255);
    ctx.quadraticCurveTo(80, 265, 55, 260);
    ctx.closePath();
    ctx.fill();

    // Cuffs
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(55, 255);
    ctx.quadraticCurveTo(80, 262, 105, 250);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(115, 250);
    ctx.quadraticCurveTo(140, 262, 165, 255);
    ctx.stroke();
}

function drawSkirt(ctx, color, pose) {
    const grad = ctx.createLinearGradient(50, 195, 170, 195);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 15));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // A-line skirt
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.quadraticCurveTo(180, 260, 170, 290);
    ctx.lineTo(50, 290);
    ctx.quadraticCurveTo(40, 260, 55, 195);
    ctx.closePath();
    ctx.fill();

    // Waistband
    ctx.fillStyle = darkenColor(color, 20);
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.lineTo(165, 205);
    ctx.lineTo(55, 205);
    ctx.closePath();
    ctx.fill();

    // Folds
    ctx.strokeStyle = darkenColor(color, 10);
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(70 + i * 18, 205);
        ctx.quadraticCurveTo(68 + i * 19, 245, 65 + i * 20, 285);
        ctx.stroke();
    }
}

function drawLongSkirt(ctx, color, pose) {
    const grad = ctx.createLinearGradient(45, 195, 175, 195);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Long flowing skirt
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.quadraticCurveTo(185, 280, 175, 355);
    ctx.lineTo(45, 355);
    ctx.quadraticCurveTo(35, 280, 55, 195);
    ctx.closePath();
    ctx.fill();

    // Waistband
    ctx.fillStyle = darkenColor(color, 20);
    ctx.fillRect(55, 195, 110, 12);

    // Decorative hem
    ctx.strokeStyle = darkenColor(color, 25);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 340);
    ctx.quadraticCurveTo(110, 355, 170, 340);
    ctx.stroke();
}

function drawLeggings(ctx, color, pose) {
    const grad = ctx.createLinearGradient(55, 195, 165, 195);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.5, lightenColor(color, 15));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Fitted leggings
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.lineTo(160, 350);
    ctx.lineTo(120, 350);
    ctx.quadraticCurveTo(110, 280, 100, 350);
    ctx.lineTo(60, 350);
    ctx.closePath();
    ctx.fill();

    // Waistband
    ctx.fillStyle = darkenColor(color, 15);
    ctx.fillRect(55, 195, 110, 10);
}

function drawWidePants(ctx, color, pose) {
    const grad = ctx.createLinearGradient(40, 195, 180, 195);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, darkenColor(color, 15));

    ctx.fillStyle = grad;

    // Wide leg pants
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.lineTo(185, 355);
    ctx.lineTo(120, 355);
    ctx.lineTo(110, 260);
    ctx.lineTo(100, 355);
    ctx.lineTo(35, 355);
    ctx.closePath();
    ctx.fill();

    // Waistband
    ctx.fillStyle = darkenColor(color, 20);
    ctx.fillRect(55, 195, 110, 12);

    // Center crease
    ctx.strokeStyle = darkenColor(color, 8);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(75, 210);
    ctx.lineTo(60, 350);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(145, 210);
    ctx.lineTo(160, 350);
    ctx.stroke();
}

function drawPleatedSkirt(ctx, color, pose) {
    const baseColor = color;

    // Waistband
    ctx.fillStyle = darkenColor(color, 15);
    ctx.fillRect(55, 195, 110, 12);

    // Draw pleats
    const pleats = 8;
    const pleatedWidth = 130;
    const pleatedStart = 45;

    for (let i = 0; i < pleats; i++) {
        const x = pleatedStart + (i * pleatedWidth / pleats);
        const isLight = i % 2 === 0;

        ctx.fillStyle = isLight ? lightenColor(baseColor, 10) : darkenColor(baseColor, 10);

        ctx.beginPath();
        ctx.moveTo(x, 207);
        ctx.lineTo(x + pleatedWidth / pleats, 207);
        ctx.lineTo(x + pleatedWidth / pleats + 5, 280);
        ctx.lineTo(x - 5, 280);
        ctx.closePath();
        ctx.fill();
    }

    // Hem
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 278);
    ctx.lineTo(180, 278);
    ctx.stroke();
}

function drawMiniSkirt(ctx, color, pose) {
    const grad = ctx.createLinearGradient(55, 195, 165, 195);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.5, lightenColor(color, 15));
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Mini skirt
    ctx.beginPath();
    ctx.moveTo(55, 195);
    ctx.lineTo(165, 195);
    ctx.quadraticCurveTo(172, 225, 165, 245);
    ctx.lineTo(55, 245);
    ctx.quadraticCurveTo(48, 225, 55, 195);
    ctx.closePath();
    ctx.fill();

    // Ruffle hem
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(58 + i * 14, 243, 7, 0, Math.PI);
        ctx.stroke();
    }
}

// === SHOES ===

function drawSneakers(ctx, color) {
    // Left sneaker
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(52, 348);
    ctx.lineTo(100, 348);
    ctx.quadraticCurveTo(105, 352, 105, 362);
    ctx.lineTo(105, 370);
    ctx.lineTo(48, 370);
    ctx.lineTo(48, 358);
    ctx.quadraticCurveTo(48, 350, 52, 348);
    ctx.closePath();
    ctx.fill();

    // Right sneaker
    ctx.beginPath();
    ctx.moveTo(120, 348);
    ctx.lineTo(168, 348);
    ctx.quadraticCurveTo(172, 350, 172, 358);
    ctx.lineTo(172, 370);
    ctx.lineTo(115, 370);
    ctx.lineTo(115, 362);
    ctx.quadraticCurveTo(115, 352, 120, 348);
    ctx.closePath();
    ctx.fill();

    // Soles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(48, 368, 57, 6);
    ctx.fillRect(115, 368, 57, 6);

    // Laces
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(65, 352);
    ctx.lineTo(80, 352);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(67, 360);
    ctx.lineTo(78, 360);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(132, 352);
    ctx.lineTo(147, 352);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(134, 360);
    ctx.lineTo(145, 360);
    ctx.stroke();

    // Toe cap
    ctx.fillStyle = lightenColor(color, 20);
    ctx.beginPath();
    ctx.arc(55, 365, 10, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(165, 365, 10, Math.PI, 0);
    ctx.fill();
}

function drawHeels(ctx, color) {
    ctx.fillStyle = color;

    // Left heel
    ctx.beginPath();
    ctx.moveTo(55, 348);
    ctx.lineTo(98, 348);
    ctx.lineTo(100, 360);
    ctx.lineTo(55, 360);
    ctx.lineTo(48, 378);
    ctx.lineTo(42, 378);
    ctx.lineTo(50, 355);
    ctx.closePath();
    ctx.fill();

    // Right heel
    ctx.beginPath();
    ctx.moveTo(122, 348);
    ctx.lineTo(165, 348);
    ctx.lineTo(170, 355);
    ctx.lineTo(178, 378);
    ctx.lineTo(172, 378);
    ctx.lineTo(165, 360);
    ctx.lineTo(120, 360);
    ctx.closePath();
    ctx.fill();

    // Heel tips
    ctx.fillStyle = darkenColor(color, 30);
    ctx.fillRect(42, 376, 8, 4);
    ctx.fillRect(170, 376, 8, 4);
}

function drawBoots(ctx, color) {
    const grad = ctx.createLinearGradient(50, 290, 90, 290);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Left boot
    ctx.beginPath();
    ctx.moveTo(55, 295);
    ctx.lineTo(100, 295);
    ctx.lineTo(102, 372);
    ctx.lineTo(48, 372);
    ctx.lineTo(50, 320);
    ctx.quadraticCurveTo(52, 300, 55, 295);
    ctx.closePath();
    ctx.fill();

    // Right boot
    ctx.beginPath();
    ctx.moveTo(120, 295);
    ctx.lineTo(165, 295);
    ctx.quadraticCurveTo(168, 300, 170, 320);
    ctx.lineTo(172, 372);
    ctx.lineTo(118, 372);
    ctx.closePath();
    ctx.fill();

    // Boot tops
    ctx.strokeStyle = darkenColor(color, 25);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(55, 297);
    ctx.lineTo(100, 297);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(120, 297);
    ctx.lineTo(165, 297);
    ctx.stroke();

    // Soles
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(48, 370, 54, 5);
    ctx.fillRect(118, 370, 54, 5);
}

function drawSandals(ctx, color) {
    // Soles
    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.ellipse(77, 365, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(143, 365, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Straps
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // Left sandal straps
    ctx.beginPath();
    ctx.moveTo(55, 362);
    ctx.quadraticCurveTo(77, 345, 99, 362);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(65, 370);
    ctx.lineTo(89, 370);
    ctx.stroke();

    // Right sandal straps
    ctx.beginPath();
    ctx.moveTo(121, 362);
    ctx.quadraticCurveTo(143, 345, 165, 362);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(131, 370);
    ctx.lineTo(155, 370);
    ctx.stroke();
}

function drawFlats(ctx, color) {
    const grad = ctx.createRadialGradient(77, 360, 5, 77, 365, 30);
    grad.addColorStop(0, lightenColor(color, 15));
    grad.addColorStop(1, color);

    ctx.fillStyle = grad;

    // Left flat
    ctx.beginPath();
    ctx.ellipse(77, 362, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right flat
    ctx.beginPath();
    ctx.ellipse(143, 362, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bows
    ctx.fillStyle = darkenColor(color, 25);
    ctx.beginPath();
    ctx.arc(68, 355, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(134, 355, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlatforms(ctx, color) {
    ctx.fillStyle = color;

    // Left platform shoe
    ctx.fillRect(50, 348, 52, 10);
    ctx.fillRect(48, 358, 56, 22);

    // Right platform shoe
    ctx.fillRect(118, 348, 52, 10);
    ctx.fillRect(116, 358, 56, 22);

    // Platform soles
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(48, 375, 56, 8);
    ctx.fillRect(116, 375, 56, 8);

    // Platform layers
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(48, 365);
    ctx.lineTo(104, 365);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(116, 365);
    ctx.lineTo(172, 365);
    ctx.stroke();
}

function drawLoafers(ctx, color) {
    const grad = ctx.createLinearGradient(50, 350, 100, 350);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Left loafer
    ctx.beginPath();
    ctx.moveTo(50, 355);
    ctx.quadraticCurveTo(75, 340, 100, 355);
    ctx.lineTo(102, 372);
    ctx.lineTo(48, 372);
    ctx.closePath();
    ctx.fill();

    // Right loafer
    ctx.beginPath();
    ctx.moveTo(118, 355);
    ctx.quadraticCurveTo(143, 340, 168, 355);
    ctx.lineTo(170, 372);
    ctx.lineTo(116, 372);
    ctx.closePath();
    ctx.fill();

    // Penny strap
    ctx.fillStyle = darkenColor(color, 25);
    ctx.fillRect(62, 352, 26, 8);
    ctx.fillRect(128, 352, 26, 8);

    // Penny slot
    ctx.strokeStyle = darkenColor(color, 35);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 356);
    ctx.lineTo(82, 356);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(136, 356);
    ctx.lineTo(148, 356);
    ctx.stroke();
}

function drawAnkleBoots(ctx, color) {
    const grad = ctx.createLinearGradient(50, 310, 100, 310);
    grad.addColorStop(0, darkenColor(color, 15));
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Left ankle boot
    ctx.beginPath();
    ctx.moveTo(55, 320);
    ctx.lineTo(98, 320);
    ctx.lineTo(100, 365);
    ctx.lineTo(50, 365);
    ctx.lineTo(45, 378);
    ctx.lineTo(40, 378);
    ctx.lineTo(48, 360);
    ctx.closePath();
    ctx.fill();

    // Right ankle boot
    ctx.beginPath();
    ctx.moveTo(122, 320);
    ctx.lineTo(165, 320);
    ctx.lineTo(172, 360);
    ctx.lineTo(180, 378);
    ctx.lineTo(175, 378);
    ctx.lineTo(170, 365);
    ctx.lineTo(120, 365);
    ctx.closePath();
    ctx.fill();

    // Boot cuffs
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(55, 322);
    ctx.lineTo(98, 322);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(122, 322);
    ctx.lineTo(165, 322);
    ctx.stroke();

    // Zipper details
    ctx.strokeStyle = '#silver';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(95, 325);
    ctx.lineTo(95, 360);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(125, 325);
    ctx.lineTo(125, 360);
    ctx.stroke();
}

// === ACCESSORIES ===

function drawNecklace(ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    // Chain
    ctx.beginPath();
    ctx.moveTo(80, 95);
    ctx.quadraticCurveTo(110, 120, 140, 95);
    ctx.stroke();

    // Pendant
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(110, 115);
    ctx.lineTo(100, 135);
    ctx.lineTo(110, 130);
    ctx.lineTo(120, 135);
    ctx.closePath();
    ctx.fill();

    // Gem highlight
    ctx.fillStyle = lightenColor(color, 40);
    ctx.beginPath();
    ctx.arc(110, 122, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawEarrings(ctx, color) {
    // Left earring
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(65, 55, 5, 0, Math.PI * 2);
    ctx.fill();

    // Dangle
    ctx.beginPath();
    ctx.moveTo(65, 60);
    ctx.lineTo(60, 78);
    ctx.lineTo(65, 75);
    ctx.lineTo(70, 78);
    ctx.closePath();
    ctx.fill();

    // Right earring
    ctx.beginPath();
    ctx.arc(155, 55, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(155, 60);
    ctx.lineTo(150, 78);
    ctx.lineTo(155, 75);
    ctx.lineTo(160, 78);
    ctx.closePath();
    ctx.fill();

    // Highlights
    ctx.fillStyle = lightenColor(color, 50);
    ctx.beginPath();
    ctx.arc(63, 53, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(153, 53, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawGlasses(ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    // Left lens
    ctx.beginPath();
    ctx.ellipse(92, 45, 16, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Right lens
    ctx.beginPath();
    ctx.ellipse(128, 45, 16, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Bridge
    ctx.beginPath();
    ctx.moveTo(108, 45);
    ctx.lineTo(112, 45);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(76, 43);
    ctx.lineTo(65, 48);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(144, 43);
    ctx.lineTo(155, 48);
    ctx.stroke();

    // Lens reflection
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(88, 42, 6, Math.PI * 1.2, Math.PI * 1.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(124, 42, 6, Math.PI * 1.2, Math.PI * 1.7);
    ctx.stroke();
}

function drawHat(ctx, color) {
    // Brim
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(110, 5, 60, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crown
    ctx.beginPath();
    ctx.moveTo(65, 5);
    ctx.quadraticCurveTo(65, -45, 110, -45);
    ctx.quadraticCurveTo(155, -45, 155, 5);
    ctx.closePath();
    ctx.fill();

    // Band
    ctx.fillStyle = darkenColor(color, 35);
    ctx.fillRect(68, -8, 84, 15);

    // Highlight
    ctx.fillStyle = lightenColor(color, 20);
    ctx.beginPath();
    ctx.ellipse(100, -30, 15, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
}

function drawHeadband(ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(110, 25, 48, Math.PI + 0.4, -0.4);
    ctx.stroke();

    // Decorative element
    ctx.fillStyle = lightenColor(color, 20);
    ctx.beginPath();
    ctx.arc(110, -20, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawBow(ctx, color) {
    ctx.fillStyle = color;

    // Left loop
    ctx.beginPath();
    ctx.ellipse(88, 5, 22, 15, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Right loop
    ctx.beginPath();
    ctx.ellipse(132, 5, 22, 15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Center knot
    ctx.fillStyle = darkenColor(color, 20);
    ctx.beginPath();
    ctx.ellipse(110, 5, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tails
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(105, 15);
    ctx.lineTo(92, 45);
    ctx.lineTo(100, 40);
    ctx.lineTo(108, 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(115, 15);
    ctx.lineTo(128, 45);
    ctx.lineTo(120, 40);
    ctx.lineTo(112, 20);
    ctx.closePath();
    ctx.fill();

    // Highlights
    ctx.fillStyle = lightenColor(color, 30);
    ctx.beginPath();
    ctx.ellipse(82, 0, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(138, 0, 8, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();
}

function drawScarf(ctx, color) {
    const grad = ctx.createLinearGradient(70, 90, 150, 90);
    grad.addColorStop(0, darkenColor(color, 10));
    grad.addColorStop(0.5, lightenColor(color, 10));
    grad.addColorStop(1, darkenColor(color, 10));

    ctx.fillStyle = grad;

    // Wrapped around neck
    ctx.beginPath();
    ctx.moveTo(75, 90);
    ctx.quadraticCurveTo(110, 105, 145, 90);
    ctx.quadraticCurveTo(152, 100, 145, 115);
    ctx.quadraticCurveTo(110, 130, 75, 115);
    ctx.quadraticCurveTo(68, 100, 75, 90);
    ctx.closePath();
    ctx.fill();

    // Hanging end
    ctx.beginPath();
    ctx.moveTo(130, 110);
    ctx.lineTo(150, 180);
    ctx.lineTo(135, 185);
    ctx.lineTo(118, 120);
    ctx.closePath();
    ctx.fill();

    // Stripes
    ctx.strokeStyle = lightenColor(color, 40);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(128, 130);
    ctx.lineTo(145, 140);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(126, 155);
    ctx.lineTo(143, 165);
    ctx.stroke();
}

function drawWatch(ctx, color) {
    // Strap
    ctx.fillStyle = color;
    ctx.fillRect(35, 165, 22, 40);

    // Watch face
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(46, 182, 12, 0, Math.PI * 2);
    ctx.fill();

    // Watch bezel
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(46, 182, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Clock hands
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(46, 182);
    ctx.lineTo(46, 173);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(46, 182);
    ctx.lineTo(53, 185);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(46, 182, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Utility functions
function darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min((num >> 16) + amt, 255);
    const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
    const B = Math.min((num & 0x0000FF) + amt, 255);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// UI Functions
function renderItems(category) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    items[category].forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        if (selectedItems[category] && selectedItems[category].id === item.id) {
            card.classList.add('selected');
        }

        card.innerHTML = `
            <div class="item-preview">${item.emoji}</div>
            <div class="item-name">${item.name}</div>
        `;

        let touchMoved = false;
        card.addEventListener('touchstart', () => { touchMoved = false; }, { passive: true });
        card.addEventListener('touchmove', () => { touchMoved = true; }, { passive: true });
        card.addEventListener('touchend', (e) => {
            if (!touchMoved) {
                e.preventDefault();
                e.stopPropagation();
                toggleItem(category, item);
            }
        }, { passive: false });
        card.addEventListener('click', (e) => {
            e.preventDefault();
            toggleItem(category, item);
        });

        container.appendChild(card);
    });
}

function toggleItem(category, item) {
    if (selectedItems[category] && selectedItems[category].id === item.id) {
        selectedItems[category] = null;
    } else {
        selectedItems[category] = item;
    }
    renderItems(category);
}

function switchCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    renderItems(category);
}

function switchSkinTone(toneIndex) {
    currentSkinTone = parseInt(toneIndex);
    document.querySelectorAll('.skin-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.skin === toneIndex.toString());
    });
}

function switchPose(poseName) {
    currentPose = poseName;
    document.querySelectorAll('.pose-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pose === poseName);
    });
}

function clearAll() {
    Object.keys(selectedItems).forEach(key => {
        selectedItems[key] = null;
    });
    renderItems(currentCategory);
    showToast('Outfit cleared!');
}

function randomOutfit() {
    Object.keys(items).forEach(category => {
        const categoryItems = items[category];
        if (Math.random() > 0.25) {
            const randomIndex = Math.floor(Math.random() * categoryItems.length);
            selectedItems[category] = categoryItems[randomIndex];
        } else {
            selectedItems[category] = null;
        }
    });

    // Random skin tone
    currentSkinTone = Math.floor(Math.random() * skinTones.length);
    document.querySelectorAll('.skin-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.skin === currentSkinTone.toString());
    });

    // Random pose
    const poseNames = Object.keys(poses);
    currentPose = poseNames[Math.floor(Math.random() * poseNames.length)];
    document.querySelectorAll('.pose-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pose === currentPose);
    });

    renderItems(currentCategory);
    showToast('Random look generated!');
}

function saveLook() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 440;
    exportCanvas.height = 520;
    const exportCtx = exportCanvas.getContext('2d');

    const gradient = exportCtx.createLinearGradient(0, 0, 0, 520);
    gradient.addColorStop(0, '#e8f4ff');
    gradient.addColorStop(0.5, '#d4e9ff');
    gradient.addColorStop(1, '#b8d4f0');
    exportCtx.fillStyle = gradient;
    exportCtx.fillRect(0, 0, 440, 520);

    // Temporarily pause animation and draw at current state
    const tempCtx = ctx;
    ctx = exportCtx;

    exportCtx.save();
    exportCtx.translate(110, 70);
    exportCtx.scale(1.0, 1.0);

    const skin = getSkin();
    const pose = poses[currentPose];

    if (selectedItems.hair) {
        drawBackHairLayer(selectedItems.hair, 0);
    }

    drawBody(skin, pose);

    if (selectedItems.bottoms) {
        selectedItems.bottoms.draw(ctx, selectedItems.bottoms.color, pose);
    }
    if (selectedItems.shoes) {
        selectedItems.shoes.draw(ctx, selectedItems.shoes.color);
    }
    if (selectedItems.tops) {
        selectedItems.tops.draw(ctx, selectedItems.tops.color, pose);
    }

    drawArms(skin, pose);
    drawHead(skin, pose);

    if (selectedItems.hair) {
        selectedItems.hair.draw(ctx, selectedItems.hair.color, 0);
    }
    if (selectedItems.accessories) {
        selectedItems.accessories.draw(ctx, selectedItems.accessories.color);
    }

    exportCtx.restore();

    ctx = tempCtx;

    exportCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    exportCtx.font = '14px sans-serif';
    exportCtx.textAlign = 'center';
    exportCtx.fillText('Style Me Up! v2.0', 220, 505);

    const link = document.createElement('a');
    link.download = 'my-look-' + Date.now() + '.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();

    showToast('Look saved!');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
}

// Event listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
    const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchCategory(btn.dataset.category);
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('touchend', handler, { passive: false });
});

document.querySelectorAll('.skin-btn').forEach(btn => {
    const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchSkinTone(btn.dataset.skin);
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('touchend', handler, { passive: false });
});

document.querySelectorAll('.pose-btn').forEach(btn => {
    const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchPose(btn.dataset.pose);
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('touchend', handler, { passive: false });
});

const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');
const saveBtn = document.getElementById('save-btn');

clearBtn.addEventListener('click', (e) => { e.preventDefault(); clearAll(); });
clearBtn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); clearAll(); }, { passive: false });

randomBtn.addEventListener('click', (e) => { e.preventDefault(); randomOutfit(); });
randomBtn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); randomOutfit(); }, { passive: false });

saveBtn.addEventListener('click', (e) => { e.preventDefault(); saveLook(); });
saveBtn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); saveLook(); }, { passive: false });

// Visual feedback for touch
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.tab-btn') ||
        e.target.closest('.action-btn') ||
        e.target.closest('.item-card') ||
        e.target.closest('.skin-btn') ||
        e.target.closest('.pose-btn')) {
        e.target.style.opacity = '0.7';
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (e.target.closest('.tab-btn') ||
        e.target.closest('.action-btn') ||
        e.target.closest('.item-card') ||
        e.target.closest('.skin-btn') ||
        e.target.closest('.pose-btn')) {
        e.target.style.opacity = '';
    }
}, { passive: true });

// Initialize
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});

// Start
resizeCanvas();
renderItems('hair');
requestAnimationFrame(animate);
