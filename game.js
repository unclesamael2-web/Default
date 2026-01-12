// Style Me Up! - Dress Up Game

const canvas = document.getElementById('character-canvas');
const ctx = canvas.getContext('2d');

// Game state
let currentCategory = 'hair';
let selectedItems = {
    hair: null,
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: null
};

// Color palettes for items
const colors = {
    skin: '#f5d0c5',
    skinShadow: '#e8b8a8',
    hair: ['#2c1810', '#4a3728', '#8b6914', '#c4a35a', '#d4a574', '#1a1a2e', '#722f37', '#e91e63', '#9c27b0', '#00bcd4'],
    tops: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8', '#00b894', '#e17055', '#0984e3', '#ffffff'],
    bottoms: ['#2d3436', '#636e72', '#0984e3', '#6c5ce7', '#00b894', '#e17055', '#fdcb6e', '#e84393', '#74b9ff', '#dfe6e9'],
    shoes: ['#2c1810', '#5d4e37', '#000000', '#ff6b6b', '#ffffff', '#e17055', '#6c5ce7', '#00b894', '#fd79a8', '#74b9ff'],
    accessories: ['#ffd700', '#c0c0c0', '#ff6b6b', '#4ecdc4', '#e91e63', '#9c27b0', '#00bcd4', '#ff9800', '#8bc34a', '#607d8b']
};

// Item definitions with draw functions
const items = {
    hair: [
        { id: 'h1', name: 'Short', emoji: '💇', draw: drawShortHair },
        { id: 'h2', name: 'Long', emoji: '💁', draw: drawLongHair },
        { id: 'h3', name: 'Curly', emoji: '👩‍🦱', draw: drawCurlyHair },
        { id: 'h4', name: 'Ponytail', emoji: '🏃', draw: drawPonytail },
        { id: 'h5', name: 'Bun', emoji: '🧘', draw: drawBunHair },
        { id: 'h6', name: 'Pigtails', emoji: '🎀', draw: drawPigtails },
        { id: 'h7', name: 'Mohawk', emoji: '🤘', draw: drawMohawk },
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
        { id: 't8', name: 'Off-Shoulder', emoji: '✨', draw: drawOffShoulder }
    ],
    bottoms: [
        { id: 'b1', name: 'Jeans', emoji: '👖', draw: drawJeans },
        { id: 'b2', name: 'Shorts', emoji: '🩳', draw: drawShorts },
        { id: 'b3', name: 'Skirt', emoji: '🩰', draw: drawSkirt },
        { id: 'b4', name: 'Long Skirt', emoji: '💃', draw: drawLongSkirt },
        { id: 'b5', name: 'Leggings', emoji: '🦵', draw: drawLeggings },
        { id: 'b6', name: 'Wide Pants', emoji: '🎭', draw: drawWidePants },
        { id: 'b7', name: 'Overalls', emoji: '👷', draw: drawOveralls },
        { id: 'b8', name: 'Mini Skirt', emoji: '⭐', draw: drawMiniSkirt }
    ],
    shoes: [
        { id: 's1', name: 'Sneakers', emoji: '👟', draw: drawSneakers },
        { id: 's2', name: 'Heels', emoji: '👠', draw: drawHeels },
        { id: 's3', name: 'Boots', emoji: '👢', draw: drawBoots },
        { id: 's4', name: 'Sandals', emoji: '🩴', draw: drawSandals },
        { id: 's5', name: 'Flats', emoji: '🥿', draw: drawFlats },
        { id: 's6', name: 'Platform', emoji: '🎪', draw: drawPlatforms },
        { id: 's7', name: 'Loafers', emoji: '👞', draw: drawLoafers },
        { id: 's8', name: 'Slippers', emoji: '🧦', draw: drawSlippers }
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

// Randomly assign colors to items
Object.keys(items).forEach(category => {
    items[category].forEach((item, i) => {
        item.color = colors[category][i % colors[category].length];
    });
});

// Canvas dimensions and character scaling
let charScale = 1;
let charX = 0;
let charY = 0;

function resizeCanvas() {
    const container = document.getElementById('character-area');
    const rect = container.getBoundingClientRect();

    // Base character size
    const baseWidth = 200;
    const baseHeight = 350;

    // Calculate scale to fit container
    const scaleX = (rect.width - 40) / baseWidth;
    const scaleY = (rect.height - 40) / baseHeight;
    charScale = Math.min(scaleX, scaleY, 1.5);

    canvas.width = rect.width;
    canvas.height = rect.height;

    // Center character
    charX = (canvas.width - baseWidth * charScale) / 2;
    charY = (canvas.height - baseHeight * charScale) / 2 + 10;

    drawCharacter();
}

// Base character drawing
function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(charX, charY);
    ctx.scale(charScale, charScale);

    // Draw layers in order
    drawBaseBody();

    // Draw selected items in proper layer order
    if (selectedItems.hair && selectedItems.hair.id !== 'h4' && selectedItems.hair.id !== 'h6') {
        // Back hair for some styles
        drawBackHair();
    }

    if (selectedItems.bottoms) {
        selectedItems.bottoms.draw(ctx, selectedItems.bottoms.color);
    }

    if (selectedItems.shoes) {
        selectedItems.shoes.draw(ctx, selectedItems.shoes.color);
    }

    if (selectedItems.tops) {
        selectedItems.tops.draw(ctx, selectedItems.tops.color);
    }

    // Draw face (always on top of body/clothes)
    drawFace();

    if (selectedItems.hair) {
        selectedItems.hair.draw(ctx, selectedItems.hair.color);
    }

    if (selectedItems.accessories) {
        selectedItems.accessories.draw(ctx, selectedItems.accessories.color);
    }

    ctx.restore();
}

function drawBaseBody() {
    const skinColor = colors.skin;
    const shadowColor = colors.skinShadow;

    // Neck
    ctx.fillStyle = shadowColor;
    ctx.fillRect(88, 72, 24, 25);
    ctx.fillStyle = skinColor;
    ctx.fillRect(90, 72, 20, 23);

    // Body/torso
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.moveTo(65, 95);
    ctx.lineTo(135, 95);
    ctx.lineTo(140, 180);
    ctx.lineTo(60, 180);
    ctx.closePath();
    ctx.fill();

    // Arms
    ctx.fillStyle = skinColor;
    // Left arm
    ctx.beginPath();
    ctx.moveTo(65, 100);
    ctx.lineTo(45, 100);
    ctx.lineTo(40, 175);
    ctx.lineTo(55, 175);
    ctx.lineTo(60, 110);
    ctx.closePath();
    ctx.fill();

    // Right arm
    ctx.beginPath();
    ctx.moveTo(135, 100);
    ctx.lineTo(155, 100);
    ctx.lineTo(160, 175);
    ctx.lineTo(145, 175);
    ctx.lineTo(140, 110);
    ctx.closePath();
    ctx.fill();

    // Hands
    ctx.beginPath();
    ctx.arc(47, 178, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(153, 178, 10, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = skinColor;
    // Left leg
    ctx.beginPath();
    ctx.moveTo(70, 180);
    ctx.lineTo(95, 180);
    ctx.lineTo(90, 320);
    ctx.lineTo(65, 320);
    ctx.closePath();
    ctx.fill();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(105, 180);
    ctx.lineTo(130, 180);
    ctx.lineTo(135, 320);
    ctx.lineTo(110, 320);
    ctx.closePath();
    ctx.fill();

    // Feet
    ctx.beginPath();
    ctx.ellipse(78, 325, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(122, 325, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawFace() {
    // Head
    ctx.fillStyle = colors.skin;
    ctx.beginPath();
    ctx.ellipse(100, 42, 38, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(85, 40, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(115, 40, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#4a3728';
    ctx.beginPath();
    ctx.arc(87, 41, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(117, 41, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(89, 39, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(119, 39, 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#4a3728';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(77, 30);
    ctx.quadraticCurveTo(85, 27, 93, 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(107, 30);
    ctx.quadraticCurveTo(115, 27, 123, 30);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = colors.skinShadow;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 42);
    ctx.lineTo(98, 52);
    ctx.lineTo(102, 54);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = '#d47f7f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(100, 58, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(255, 150, 150, 0.3)';
    ctx.beginPath();
    ctx.ellipse(72, 52, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(128, 52, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawBackHair() {
    if (!selectedItems.hair) return;
    ctx.fillStyle = selectedItems.hair.color;
    // Back hair shadow
    ctx.beginPath();
    ctx.ellipse(100, 45, 45, 50, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Hair styles
function drawShortHair(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(100, 30, 42, 35, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(65, 35, 15, 20, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(135, 35, 15, 20, 0.3, 0, Math.PI * 2);
    ctx.fill();
}

function drawLongHair(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(55, 30);
    ctx.quadraticCurveTo(100, -10, 145, 30);
    ctx.lineTo(150, 140);
    ctx.quadraticCurveTo(145, 180, 130, 180);
    ctx.lineTo(120, 90);
    ctx.lineTo(100, 95);
    ctx.lineTo(80, 90);
    ctx.lineTo(70, 180);
    ctx.quadraticCurveTo(55, 180, 50, 140);
    ctx.closePath();
    ctx.fill();
}

function drawCurlyHair(ctx, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = 100 + Math.cos(angle) * 45;
        const y = 40 + Math.sin(angle) * 40;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(100, 25, 35, 30, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawPonytail(ctx, color) {
    ctx.fillStyle = color;
    // Top of head
    ctx.beginPath();
    ctx.ellipse(100, 25, 40, 30, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Ponytail
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.quadraticCurveTo(150, 10, 155, 80);
    ctx.quadraticCurveTo(150, 130, 140, 140);
    ctx.lineTo(130, 130);
    ctx.quadraticCurveTo(140, 80, 100, 10);
    ctx.closePath();
    ctx.fill();
    // Hair tie
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.ellipse(140, 25, 8, 6, 0.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawBunHair(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(100, 25, 40, 30, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Bun
    ctx.beginPath();
    ctx.arc(100, -10, 22, 0, Math.PI * 2);
    ctx.fill();
    // Hair wrap
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(100, -10, 15, 0, Math.PI * 2);
    ctx.stroke();
}

function drawPigtails(ctx, color) {
    ctx.fillStyle = color;
    // Main hair
    ctx.beginPath();
    ctx.ellipse(100, 25, 40, 30, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Left pigtail
    ctx.beginPath();
    ctx.moveTo(60, 30);
    ctx.quadraticCurveTo(30, 40, 25, 100);
    ctx.quadraticCurveTo(30, 140, 45, 140);
    ctx.quadraticCurveTo(50, 100, 55, 50);
    ctx.closePath();
    ctx.fill();
    // Right pigtail
    ctx.beginPath();
    ctx.moveTo(140, 30);
    ctx.quadraticCurveTo(170, 40, 175, 100);
    ctx.quadraticCurveTo(170, 140, 155, 140);
    ctx.quadraticCurveTo(150, 100, 145, 50);
    ctx.closePath();
    ctx.fill();
    // Bows
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    ctx.arc(50, 35, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(150, 35, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawMohawk(ctx, color) {
    ctx.fillStyle = color;
    // Shaved sides
    ctx.fillStyle = colors.skin;
    ctx.beginPath();
    ctx.ellipse(100, 30, 40, 35, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Mohawk
    ctx.fillStyle = color;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(85 + i * 4, 20 - i * 3);
        ctx.lineTo(100, -25 - i * 2);
        ctx.lineTo(115 - i * 4, 20 - i * 3);
        ctx.closePath();
        ctx.fill();
    }
}

function drawBobHair(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(55, 25);
    ctx.quadraticCurveTo(100, -15, 145, 25);
    ctx.lineTo(145, 70);
    ctx.quadraticCurveTo(140, 85, 125, 85);
    ctx.lineTo(75, 85);
    ctx.quadraticCurveTo(60, 85, 55, 70);
    ctx.closePath();
    ctx.fill();
    // Bangs
    ctx.beginPath();
    ctx.moveTo(65, 25);
    ctx.lineTo(75, 35);
    ctx.lineTo(90, 30);
    ctx.lineTo(100, 38);
    ctx.lineTo(110, 30);
    ctx.lineTo(125, 35);
    ctx.lineTo(135, 25);
    ctx.quadraticCurveTo(100, 0, 65, 25);
    ctx.closePath();
    ctx.fill();
}

// Tops
function drawTShirt(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(60, 95);
    ctx.lineTo(45, 100);
    ctx.lineTo(42, 135);
    ctx.lineTo(58, 135);
    ctx.lineTo(60, 110);
    ctx.lineTo(65, 180);
    ctx.lineTo(135, 180);
    ctx.lineTo(140, 110);
    ctx.lineTo(142, 135);
    ctx.lineTo(158, 135);
    ctx.lineTo(155, 100);
    ctx.lineTo(140, 95);
    ctx.closePath();
    ctx.fill();
    // Collar
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 95);
    ctx.quadraticCurveTo(100, 105, 120, 95);
    ctx.stroke();
}

function drawTankTop(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(72, 95);
    ctx.lineTo(128, 95);
    ctx.lineTo(135, 180);
    ctx.lineTo(65, 180);
    ctx.closePath();
    ctx.fill();
    // Straps
    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(78, 95);
    ctx.lineTo(85, 75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(122, 95);
    ctx.lineTo(115, 75);
    ctx.stroke();
}

function drawHoodie(ctx, color) {
    ctx.fillStyle = color;
    // Main body
    ctx.beginPath();
    ctx.moveTo(55, 95);
    ctx.lineTo(40, 100);
    ctx.lineTo(35, 180);
    ctx.lineTo(55, 180);
    ctx.lineTo(60, 120);
    ctx.lineTo(65, 185);
    ctx.lineTo(135, 185);
    ctx.lineTo(140, 120);
    ctx.lineTo(145, 180);
    ctx.lineTo(165, 180);
    ctx.lineTo(160, 100);
    ctx.lineTo(145, 95);
    ctx.closePath();
    ctx.fill();
    // Hood
    ctx.beginPath();
    ctx.moveTo(65, 95);
    ctx.quadraticCurveTo(100, 75, 135, 95);
    ctx.quadraticCurveTo(150, 50, 100, 40);
    ctx.quadraticCurveTo(50, 50, 65, 95);
    ctx.fill();
    // Front pocket
    ctx.fillStyle = darkenColor(color, 15);
    ctx.fillRect(75, 140, 50, 30);
    // Drawstrings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(85, 95);
    ctx.lineTo(85, 130);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(115, 95);
    ctx.lineTo(115, 130);
    ctx.stroke();
}

function drawDress(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(75, 95);
    ctx.lineTo(125, 95);
    ctx.lineTo(140, 240);
    ctx.quadraticCurveTo(100, 250, 60, 240);
    ctx.closePath();
    ctx.fill();
    // Straps
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(80, 95);
    ctx.lineTo(88, 75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(120, 95);
    ctx.lineTo(112, 75);
    ctx.stroke();
    // Waist
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(65, 145);
    ctx.quadraticCurveTo(100, 150, 135, 145);
    ctx.stroke();
}

function drawCropTop(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(70, 95);
    ctx.lineTo(130, 95);
    ctx.lineTo(132, 140);
    ctx.lineTo(68, 140);
    ctx.closePath();
    ctx.fill();
    // Details
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(68, 140);
    ctx.lineTo(132, 140);
    ctx.stroke();
}

function drawSweater(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(55, 95);
    ctx.lineTo(38, 100);
    ctx.lineTo(32, 175);
    ctx.lineTo(52, 175);
    ctx.lineTo(58, 115);
    ctx.lineTo(65, 185);
    ctx.lineTo(135, 185);
    ctx.lineTo(142, 115);
    ctx.lineTo(148, 175);
    ctx.lineTo(168, 175);
    ctx.lineTo(162, 100);
    ctx.lineTo(145, 95);
    ctx.closePath();
    ctx.fill();
    // Collar
    ctx.fillStyle = darkenColor(color, 15);
    ctx.beginPath();
    ctx.moveTo(75, 95);
    ctx.quadraticCurveTo(100, 110, 125, 95);
    ctx.quadraticCurveTo(100, 100, 75, 95);
    ctx.fill();
    // Cuffs
    ctx.fillRect(32, 165, 22, 12);
    ctx.fillRect(146, 165, 22, 12);
    ctx.fillRect(65, 175, 70, 12);
}

function drawBlazer(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(55, 95);
    ctx.lineTo(40, 100);
    ctx.lineTo(38, 185);
    ctx.lineTo(58, 185);
    ctx.lineTo(60, 115);
    ctx.lineTo(65, 185);
    ctx.lineTo(135, 185);
    ctx.lineTo(140, 115);
    ctx.lineTo(142, 185);
    ctx.lineTo(162, 185);
    ctx.lineTo(160, 100);
    ctx.lineTo(145, 95);
    ctx.closePath();
    ctx.fill();
    // Lapels
    ctx.fillStyle = darkenColor(color, 20);
    ctx.beginPath();
    ctx.moveTo(80, 95);
    ctx.lineTo(100, 140);
    ctx.lineTo(85, 145);
    ctx.lineTo(75, 100);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(120, 95);
    ctx.lineTo(100, 140);
    ctx.lineTo(115, 145);
    ctx.lineTo(125, 100);
    ctx.closePath();
    ctx.fill();
    // Button
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(100, 155, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawOffShoulder(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(55, 110);
    ctx.quadraticCurveTo(100, 95, 145, 110);
    ctx.lineTo(140, 180);
    ctx.lineTo(60, 180);
    ctx.closePath();
    ctx.fill();
    // Ruffle
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(60 + i * 17, 108, 8, 0, Math.PI);
        ctx.stroke();
    }
}

// Bottoms
function drawJeans(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(62, 175);
    ctx.lineTo(138, 175);
    ctx.lineTo(140, 320);
    ctx.lineTo(108, 320);
    ctx.lineTo(100, 250);
    ctx.lineTo(92, 320);
    ctx.lineTo(60, 320);
    ctx.closePath();
    ctx.fill();
    // Pockets
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(68, 180);
    ctx.lineTo(72, 200);
    ctx.lineTo(82, 195);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(132, 180);
    ctx.lineTo(128, 200);
    ctx.lineTo(118, 195);
    ctx.stroke();
}

function drawShorts(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(62, 175);
    ctx.lineTo(138, 175);
    ctx.lineTo(135, 230);
    ctx.lineTo(105, 230);
    ctx.lineTo(100, 210);
    ctx.lineTo(95, 230);
    ctx.lineTo(65, 230);
    ctx.closePath();
    ctx.fill();
    // Hem
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(65, 225);
    ctx.lineTo(95, 225);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(105, 225);
    ctx.lineTo(135, 225);
    ctx.stroke();
}

function drawSkirt(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(60, 175);
    ctx.lineTo(140, 175);
    ctx.quadraticCurveTo(150, 260, 130, 260);
    ctx.lineTo(70, 260);
    ctx.quadraticCurveTo(50, 260, 60, 175);
    ctx.closePath();
    ctx.fill();
    // Pleats
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(75 + i * 12, 180);
        ctx.lineTo(73 + i * 13, 255);
        ctx.stroke();
    }
}

function drawLongSkirt(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(58, 175);
    ctx.lineTo(142, 175);
    ctx.quadraticCurveTo(155, 280, 140, 315);
    ctx.lineTo(60, 315);
    ctx.quadraticCurveTo(45, 280, 58, 175);
    ctx.closePath();
    ctx.fill();
    // Decorative line
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 270);
    ctx.quadraticCurveTo(100, 280, 130, 270);
    ctx.stroke();
}

function drawLeggings(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(65, 175);
    ctx.lineTo(135, 175);
    ctx.lineTo(132, 320);
    ctx.lineTo(112, 320);
    ctx.lineTo(100, 240);
    ctx.lineTo(88, 320);
    ctx.lineTo(68, 320);
    ctx.closePath();
    ctx.fill();
}

function drawWidePants(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(55, 175);
    ctx.lineTo(145, 175);
    ctx.lineTo(155, 320);
    ctx.lineTo(105, 320);
    ctx.lineTo(100, 230);
    ctx.lineTo(95, 320);
    ctx.lineTo(45, 320);
    ctx.closePath();
    ctx.fill();
    // Pleats
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(75, 180);
    ctx.lineTo(65, 315);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(125, 180);
    ctx.lineTo(135, 315);
    ctx.stroke();
}

function drawOveralls(ctx, color) {
    ctx.fillStyle = color;
    // Pants part
    ctx.beginPath();
    ctx.moveTo(62, 140);
    ctx.lineTo(138, 140);
    ctx.lineTo(140, 320);
    ctx.lineTo(108, 320);
    ctx.lineTo(100, 250);
    ctx.lineTo(92, 320);
    ctx.lineTo(60, 320);
    ctx.closePath();
    ctx.fill();
    // Bib
    ctx.beginPath();
    ctx.moveTo(75, 140);
    ctx.lineTo(75, 100);
    ctx.lineTo(125, 100);
    ctx.lineTo(125, 140);
    ctx.closePath();
    ctx.fill();
    // Straps
    ctx.lineWidth = 6;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(78, 100);
    ctx.lineTo(80, 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(122, 100);
    ctx.lineTo(120, 80);
    ctx.stroke();
    // Pocket
    ctx.strokeStyle = darkenColor(color, 25);
    ctx.lineWidth = 2;
    ctx.strokeRect(85, 110, 30, 25);
    // Buttons
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(82, 103, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(118, 103, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawMiniSkirt(ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(62, 175);
    ctx.lineTo(138, 175);
    ctx.quadraticCurveTo(145, 210, 135, 215);
    ctx.lineTo(65, 215);
    ctx.quadraticCurveTo(55, 210, 62, 175);
    ctx.closePath();
    ctx.fill();
    // Ruffle
    ctx.strokeStyle = darkenColor(color, 15);
    ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(65 + i * 12, 212, 6, 0, Math.PI);
        ctx.stroke();
    }
}

// Shoes
function drawSneakers(ctx, color) {
    ctx.fillStyle = color;
    // Left shoe
    ctx.beginPath();
    ctx.moveTo(55, 318);
    ctx.lineTo(95, 318);
    ctx.quadraticCurveTo(100, 320, 100, 330);
    ctx.lineTo(100, 338);
    ctx.lineTo(50, 338);
    ctx.lineTo(50, 328);
    ctx.quadraticCurveTo(50, 320, 55, 318);
    ctx.closePath();
    ctx.fill();
    // Right shoe
    ctx.beginPath();
    ctx.moveTo(105, 318);
    ctx.lineTo(145, 318);
    ctx.quadraticCurveTo(150, 320, 150, 328);
    ctx.lineTo(150, 338);
    ctx.lineTo(100, 338);
    ctx.lineTo(100, 330);
    ctx.quadraticCurveTo(100, 320, 105, 318);
    ctx.closePath();
    ctx.fill();
    // Soles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(50, 335, 50, 5);
    ctx.fillRect(100, 335, 50, 5);
    // Laces
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(65, 322);
    ctx.lineTo(75, 322);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(67, 328);
    ctx.lineTo(73, 328);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(115, 322);
    ctx.lineTo(125, 322);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(117, 328);
    ctx.lineTo(123, 328);
    ctx.stroke();
}

function drawHeels(ctx, color) {
    ctx.fillStyle = color;
    // Left heel
    ctx.beginPath();
    ctx.moveTo(58, 318);
    ctx.lineTo(95, 318);
    ctx.lineTo(98, 328);
    ctx.lineTo(60, 328);
    ctx.lineTo(55, 345);
    ctx.lineTo(48, 345);
    ctx.lineTo(52, 328);
    ctx.closePath();
    ctx.fill();
    // Right heel
    ctx.beginPath();
    ctx.moveTo(105, 318);
    ctx.lineTo(142, 318);
    ctx.lineTo(148, 328);
    ctx.lineTo(152, 345);
    ctx.lineTo(145, 345);
    ctx.lineTo(140, 328);
    ctx.lineTo(102, 328);
    ctx.closePath();
    ctx.fill();
}

function drawBoots(ctx, color) {
    ctx.fillStyle = color;
    // Left boot
    ctx.beginPath();
    ctx.moveTo(58, 270);
    ctx.lineTo(92, 270);
    ctx.lineTo(95, 340);
    ctx.lineTo(50, 340);
    ctx.lineTo(50, 320);
    ctx.quadraticCurveTo(52, 280, 58, 270);
    ctx.closePath();
    ctx.fill();
    // Right boot
    ctx.beginPath();
    ctx.moveTo(108, 270);
    ctx.lineTo(142, 270);
    ctx.quadraticCurveTo(148, 280, 150, 320);
    ctx.lineTo(150, 340);
    ctx.lineTo(105, 340);
    ctx.closePath();
    ctx.fill();
    // Boot tops
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(58, 272);
    ctx.lineTo(92, 272);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(108, 272);
    ctx.lineTo(142, 272);
    ctx.stroke();
}

function drawSandals(ctx, color) {
    ctx.fillStyle = color;
    // Soles
    ctx.beginPath();
    ctx.ellipse(75, 335, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(125, 335, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Straps
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(60, 332);
    ctx.quadraticCurveTo(75, 318, 90, 332);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(70, 338);
    ctx.lineTo(80, 338);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(110, 332);
    ctx.quadraticCurveTo(125, 318, 140, 332);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(120, 338);
    ctx.lineTo(130, 338);
    ctx.stroke();
}

function drawFlats(ctx, color) {
    ctx.fillStyle = color;
    // Left flat
    ctx.beginPath();
    ctx.ellipse(75, 330, 25, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Right flat
    ctx.beginPath();
    ctx.ellipse(125, 330, 25, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Bows
    ctx.fillStyle = darkenColor(color, 30);
    ctx.beginPath();
    ctx.arc(70, 325, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(120, 325, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlatforms(ctx, color) {
    ctx.fillStyle = color;
    // Left platform
    ctx.fillRect(52, 318, 45, 8);
    ctx.fillRect(50, 326, 48, 18);
    // Right platform
    ctx.fillRect(103, 318, 45, 8);
    ctx.fillRect(102, 326, 48, 18);
    // Platform soles (chunky)
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(50, 340, 48, 8);
    ctx.fillRect(102, 340, 48, 8);
}

function drawLoafers(ctx, color) {
    ctx.fillStyle = color;
    // Left loafer
    ctx.beginPath();
    ctx.moveTo(55, 320);
    ctx.quadraticCurveTo(75, 310, 95, 320);
    ctx.lineTo(97, 338);
    ctx.lineTo(50, 338);
    ctx.closePath();
    ctx.fill();
    // Right loafer
    ctx.beginPath();
    ctx.moveTo(105, 320);
    ctx.quadraticCurveTo(125, 310, 145, 320);
    ctx.lineTo(150, 338);
    ctx.lineTo(103, 338);
    ctx.closePath();
    ctx.fill();
    // Decorative strap
    ctx.strokeStyle = darkenColor(color, 25);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(65, 325);
    ctx.lineTo(85, 325);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(115, 325);
    ctx.lineTo(135, 325);
    ctx.stroke();
}

function drawSlippers(ctx, color) {
    ctx.fillStyle = color;
    // Left slipper
    ctx.beginPath();
    ctx.ellipse(75, 332, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Right slipper
    ctx.beginPath();
    ctx.ellipse(125, 332, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Fluffy top
    ctx.fillStyle = lightenColor(color, 30);
    ctx.beginPath();
    ctx.ellipse(75, 325, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(125, 325, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Accessories
function drawNecklace(ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(78, 90);
    ctx.quadraticCurveTo(100, 110, 122, 90);
    ctx.stroke();
    // Pendant
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(100, 105);
    ctx.lineTo(94, 118);
    ctx.lineTo(106, 118);
    ctx.closePath();
    ctx.fill();
}

function drawEarrings(ctx, color) {
    ctx.fillStyle = color;
    // Left earring
    ctx.beginPath();
    ctx.arc(58, 50, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(58, 56);
    ctx.lineTo(54, 70);
    ctx.lineTo(62, 70);
    ctx.closePath();
    ctx.fill();
    // Right earring
    ctx.beginPath();
    ctx.arc(142, 50, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(142, 56);
    ctx.lineTo(138, 70);
    ctx.lineTo(146, 70);
    ctx.closePath();
    ctx.fill();
}

function drawGlasses(ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    // Left lens
    ctx.beginPath();
    ctx.ellipse(82, 40, 14, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Right lens
    ctx.beginPath();
    ctx.ellipse(118, 40, 14, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Bridge
    ctx.beginPath();
    ctx.moveTo(96, 40);
    ctx.lineTo(104, 40);
    ctx.stroke();
    // Arms
    ctx.beginPath();
    ctx.moveTo(68, 38);
    ctx.lineTo(58, 42);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(132, 38);
    ctx.lineTo(142, 42);
    ctx.stroke();
}

function drawHat(ctx, color) {
    ctx.fillStyle = color;
    // Brim
    ctx.beginPath();
    ctx.ellipse(100, 5, 55, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Top
    ctx.beginPath();
    ctx.moveTo(60, 5);
    ctx.quadraticCurveTo(60, -35, 100, -35);
    ctx.quadraticCurveTo(140, -35, 140, 5);
    ctx.closePath();
    ctx.fill();
    // Band
    ctx.fillStyle = darkenColor(color, 30);
    ctx.fillRect(62, -5, 76, 10);
}

function drawHeadband(ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(100, 20, 42, Math.PI + 0.3, -0.3);
    ctx.stroke();
}

function drawBow(ctx, color) {
    ctx.fillStyle = color;
    // Left loop
    ctx.beginPath();
    ctx.ellipse(82, 5, 18, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Right loop
    ctx.beginPath();
    ctx.ellipse(118, 5, 18, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Center
    ctx.fillStyle = darkenColor(color, 20);
    ctx.beginPath();
    ctx.ellipse(100, 5, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tails
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(95, 12);
    ctx.lineTo(85, 35);
    ctx.lineTo(95, 30);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(105, 12);
    ctx.lineTo(115, 35);
    ctx.lineTo(105, 30);
    ctx.closePath();
    ctx.fill();
}

function drawScarf(ctx, color) {
    ctx.fillStyle = color;
    // Wrapped around neck
    ctx.beginPath();
    ctx.moveTo(70, 88);
    ctx.quadraticCurveTo(100, 100, 130, 88);
    ctx.quadraticCurveTo(135, 95, 130, 102);
    ctx.quadraticCurveTo(100, 115, 70, 102);
    ctx.quadraticCurveTo(65, 95, 70, 88);
    ctx.fill();
    // Hanging end
    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.lineTo(135, 160);
    ctx.lineTo(120, 165);
    ctx.lineTo(108, 110);
    ctx.closePath();
    ctx.fill();
    // Stripes
    ctx.strokeStyle = lightenColor(color, 40);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(118, 120);
    ctx.lineTo(130, 125);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(116, 140);
    ctx.lineTo(128, 145);
    ctx.stroke();
}

function drawWatch(ctx, color) {
    // Strap
    ctx.fillStyle = color;
    ctx.fillRect(38, 158, 18, 35);
    // Watch face
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(47, 172, 10, 0, Math.PI * 2);
    ctx.fill();
    // Watch face border
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(47, 172, 10, 0, Math.PI * 2);
    ctx.stroke();
    // Clock hands
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(47, 172);
    ctx.lineTo(47, 165);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(47, 172);
    ctx.lineTo(52, 174);
    ctx.stroke();
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

        card.addEventListener('click', () => toggleItem(category, item));
        card.addEventListener('touchend', (e) => {
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
    drawCharacter();
}

function switchCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    renderItems(category);
}

function clearAll() {
    Object.keys(selectedItems).forEach(key => {
        selectedItems[key] = null;
    });
    renderItems(currentCategory);
    drawCharacter();
    showToast('Outfit cleared!');
}

function randomOutfit() {
    Object.keys(items).forEach(category => {
        const categoryItems = items[category];
        if (Math.random() > 0.3) { // 70% chance to have item
            const randomIndex = Math.floor(Math.random() * categoryItems.length);
            selectedItems[category] = categoryItems[randomIndex];
        } else {
            selectedItems[category] = null;
        }
    });
    renderItems(currentCategory);
    drawCharacter();
    showToast('Random outfit generated!');
}

function saveLook() {
    // Create a temporary canvas for high-quality export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 400;
    exportCanvas.height = 500;
    const exportCtx = exportCanvas.getContext('2d');

    // Draw background
    const gradient = exportCtx.createLinearGradient(0, 0, 0, 500);
    gradient.addColorStop(0, '#e8f4ff');
    gradient.addColorStop(0.5, '#d4e9ff');
    gradient.addColorStop(1, '#b8d4f0');
    exportCtx.fillStyle = gradient;
    exportCtx.fillRect(0, 0, 400, 500);

    // Draw character centered
    exportCtx.save();
    exportCtx.translate(100, 60);
    exportCtx.scale(1.1, 1.1);

    // Redraw everything on export canvas
    const originalCtx = ctx;
    ctx = exportCtx;

    drawBaseBody();
    if (selectedItems.hair && selectedItems.hair.id !== 'h4' && selectedItems.hair.id !== 'h6') {
        drawBackHair();
    }
    if (selectedItems.bottoms) selectedItems.bottoms.draw(ctx, selectedItems.bottoms.color);
    if (selectedItems.shoes) selectedItems.shoes.draw(ctx, selectedItems.shoes.color);
    if (selectedItems.tops) selectedItems.tops.draw(ctx, selectedItems.tops.color);
    drawFace();
    if (selectedItems.hair) selectedItems.hair.draw(ctx, selectedItems.hair.color);
    if (selectedItems.accessories) selectedItems.accessories.draw(ctx, selectedItems.accessories.color);

    ctx = originalCtx;
    exportCtx.restore();

    // Add watermark
    exportCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    exportCtx.font = '14px sans-serif';
    exportCtx.textAlign = 'center';
    exportCtx.fillText('Style Me Up!', 200, 485);

    // Download
    const link = document.createElement('a');
    link.download = 'my-outfit-' + Date.now() + '.png';
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
    btn.addEventListener('click', () => switchCategory(btn.dataset.category));
});

document.getElementById('clear-btn').addEventListener('click', clearAll);
document.getElementById('random-btn').addEventListener('click', randomOutfit);
document.getElementById('save-btn').addEventListener('click', saveLook);

// Prevent double-tap zoom
document.addEventListener('touchend', (e) => {
    if (e.target.classList.contains('tab-btn') ||
        e.target.classList.contains('action-btn') ||
        e.target.classList.contains('item-card')) {
        e.preventDefault();
    }
}, { passive: false });

// Initialize
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});

// Start the game
resizeCanvas();
renderItems('hair');
drawCharacter();
