// Shared Pixel Art Character - используется везде
class PixelCharacter {
    constructor() {
        this.colors = {
            // Hair - gradient cyan
            hairLight: '#5FEDD8',
            hair: '#4ECDC4',
            hairDark: '#3DB5AC',
            hairShadow: '#2D9A8C',
            
            // Skin - realistic tones
            skinLight: '#FFEDDB',
            skin: '#FFE5D9',
            skinMid: '#F5D5C9',
            skinDark: '#E5C5B9',
            skinShadow: '#D5B5A9',
            
            // Eyes
            eyeWhite: '#FFFFFF',
            eyeIris: '#4A90E2',
            eyePupil: '#2C3E50',
            eyeShine: '#A0D8F1',
            
            // Clothes
            shirtWhite: '#FFFFFF',
            shirtLight: '#F5F5F5',
            shirtShadow: '#E0E0E0',
            
            // Headphones
            headphoneWhite: '#FFFFFF',
            headphoneGray: '#D0D0D0',
            headphoneDark: '#A0A0A0',
            
            // Pants
            pantsLight: '#5D6D7E',
            pants: '#34495E',
            pantsDark: '#2C3E50',
            pantsShadow: '#1C2E3E',
            
            // Shoes
            shoeGray: '#4A4A4A',
            shoeDark: '#2A2A2A',
            shoeBlack: '#1A1A1A',
            shoeSole: '#000000',
            
            // Outline
            outline: '#000000',
            
            // Details
            mouth: '#D08080',
            blush: '#FFB6C1'
        };
    }
    
    drawPixel(ctx, x, y, color, size = 3) {
        ctx.fillStyle = color;
        ctx.fillRect(x * size, y * size, size, size);
    }
    
    draw(ctx, x, y, animFrame, size = 3) {
        const c = this.colors;
        const drawP = (px, py, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x + px * size, y + py * size, size, size);
        };
        
        // Animation values
        const bob = Math.floor(Math.sin(animFrame * 0.08) * 2.5);
        const armSwing = Math.floor(Math.sin(animFrame * 0.12) * 3);
        const legKick = Math.floor(Math.sin(animFrame * 0.15) * 2);
        const blink = (Math.floor(animFrame / 60) % 4 === 0) && (animFrame % 60 > 55);
        
        const yPos = bob;
        
        // === HAIR ===
        // Top layer - light
        for (let px = 7; px <= 17; px++) drawP(px, yPos + 1, c.hairLight);
        // Middle layers
        for (let px = 6; px <= 18; px++) drawP(px, yPos + 2, c.hair);
        for (let px = 5; px <= 19; px++) drawP(px, yPos + 3, c.hair);
        for (let px = 4; px <= 20; px++) drawP(px, yPos + 4, c.hairDark);
        // Hair shadow
        for (let px = 3; px <= 21; px++) drawP(px, yPos + 5, c.hairShadow);
        
        // === HEADPHONES ===
        // Left headphone
        for (let py = 6; py <= 10; py++) {
            drawP(2, yPos + py, c.headphoneWhite);
            drawP(3, yPos + py, py === 7 || py === 8 ? c.headphoneDark : c.headphoneGray);
        }
        // Right headphone
        for (let py = 6; py <= 10; py++) {
            drawP(21, yPos + py, c.headphoneWhite);
            drawP(20, yPos + py, py === 7 || py === 8 ? c.headphoneDark : c.headphoneGray);
        }
        
        // === FACE ===
        // Face base
        for (let py = 6; py <= 12; py++) {
            for (let px = 5; px <= 18; px++) {
                if (py === 6 || py === 12) {
                    drawP(px, yPos + py, c.skinLight);
                } else if (px === 5 || px === 18) {
                    drawP(px, yPos + py, c.skinMid);
                } else {
                    drawP(px, yPos + py, c.skin);
                }
            }
        }
        
        // Face shadows
        drawP(6, yPos + 11, c.skinDark);
        drawP(17, yPos + 11, c.skinDark);
        
        // === EYES ===
        if (!blink) {
            // Left eye
            drawP(7, yPos + 8, c.eyeWhite);
            drawP(8, yPos + 8, c.eyeWhite);
            drawP(9, yPos + 8, c.eyeWhite);
            drawP(7, yPos + 9, c.eyeWhite);
            drawP(8, yPos + 9, c.eyeIris);
            drawP(9, yPos + 9, c.eyeWhite);
            drawP(8, yPos + 10, c.eyePupil);
            drawP(7, yPos + 8, c.eyeShine);
            
            // Right eye
            drawP(14, yPos + 8, c.eyeWhite);
            drawP(15, yPos + 8, c.eyeWhite);
            drawP(16, yPos + 8, c.eyeWhite);
            drawP(14, yPos + 9, c.eyeWhite);
            drawP(15, yPos + 9, c.eyeIris);
            drawP(16, yPos + 9, c.eyeWhite);
            drawP(15, yPos + 10, c.eyePupil);
            drawP(14, yPos + 8, c.eyeShine);
        } else {
            // Closed eyes
            for (let px = 7; px <= 9; px++) drawP(px, yPos + 9, c.outline);
            for (let px = 14; px <= 16; px++) drawP(px, yPos + 9, c.outline);
        }
        
        // Nose
        drawP(11, yPos + 10, c.skinDark);
        drawP(12, yPos + 10, c.skinDark);
        drawP(11, yPos + 11, c.skinShadow);
        
        // Mouth/smile
        drawP(9, yPos + 11, c.mouth);
        for (let px = 10; px <= 13; px++) drawP(px, yPos + 12, c.mouth);
        drawP(14, yPos + 11, c.mouth);
        
        // Blush
        drawP(6, yPos + 10, c.blush);
        drawP(17, yPos + 10, c.blush);
        
        // === NECK ===
        for (let px = 9; px <= 14; px++) drawP(px, yPos + 13, c.skin);
        for (let px = 10; px <= 13; px++) drawP(px, yPos + 14, c.skinMid);
        
        // === BODY (WHITE SHIRT) ===
        // Main shirt
        for (let py = 15; py <= 26; py++) {
            for (let px = 5; px <= 18; px++) {
                if (px === 5 || px === 18) {
                    drawP(px, yPos + py, c.shirtShadow);
                } else if (px < 9 || px > 14) {
                    drawP(px, yPos + py, c.shirtLight);
                } else {
                    drawP(px, yPos + py, c.shirtWhite);
                }
            }
        }
        
        // Collar
        for (let px = 10; px <= 13; px++) drawP(px, yPos + 15, c.outline);
        drawP(9, yPos + 16, c.outline);
        drawP(14, yPos + 16, c.outline);
        
        // Shirt shadows
        for (let py = 20; py <= 25; py++) {
            drawP(5, yPos + py, c.shirtShadow);
            drawP(18, yPos + py, c.shirtShadow);
        }
        
        // === ARMS - ACTIVE ANIMATION ===
        const leftArmY = 17 + armSwing;
        const rightArmY = 17 - armSwing;
        
        // Left arm with shading
        for (let py = 0; py <= 9; py++) {
            drawP(2, yPos + leftArmY + py, py < 3 ? c.skinLight : c.skin);
            drawP(3, yPos + leftArmY + py, c.skin);
            drawP(4, yPos + leftArmY + py, py > 5 ? c.skinDark : c.skinMid);
        }
        // Left hand
        drawP(2, yPos + leftArmY + 10, c.skinDark);
        drawP(3, yPos + leftArmY + 10, c.skinDark);
        drawP(4, yPos + leftArmY + 10, c.skinShadow);
        
        // Right arm with shading
        for (let py = 0; py <= 9; py++) {
            drawP(19, yPos + rightArmY + py, py < 3 ? c.skinLight : c.skin);
            drawP(20, yPos + rightArmY + py, c.skin);
            drawP(21, yPos + rightArmY + py, py > 5 ? c.skinDark : c.skinMid);
        }
        // Right hand
        drawP(19, yPos + rightArmY + 10, c.skinDark);
        drawP(20, yPos + rightArmY + 10, c.skinDark);
        drawP(21, yPos + rightArmY + 10, c.skinShadow);
        
        // === PANTS ===
        for (let py = 27; py <= 35; py++) {
            for (let px = 5; px <= 18; px++) {
                const shade = (py % 2 === 0) ? c.pants : c.pantsDark;
                if (px < 8 || px > 15) {
                    drawP(px, yPos + py, c.pantsShadow);
                } else {
                    drawP(px, yPos + py, shade);
                }
            }
        }
        
        // Belt
        for (let px = 5; px <= 18; px++) drawP(px, yPos + 27, c.outline);
        drawP(11, yPos + 27, c.headphoneGray);
        drawP(12, yPos + 27, c.headphoneGray);
        
        // === LEGS - ACTIVE KICKING ANIMATION ===
        // Left leg
        const leftLegX = 7 + legKick;
        for (let py = 36; py <= 42; py++) {
            drawP(leftLegX, yPos + py, c.pants);
            drawP(leftLegX + 1, yPos + py, c.pantsDark);
            drawP(leftLegX + 2, yPos + py, c.pantsShadow);
        }
        
        // Right leg
        const rightLegX = 13 - legKick;
        for (let py = 36; py <= 42; py++) {
            drawP(rightLegX, yPos + py, c.pants);
            drawP(rightLegX + 1, yPos + py, c.pantsDark);
            drawP(rightLegX + 2, yPos + py, c.pantsShadow);
        }
        
        // === SHOES - DETAILED ===
        // Left shoe
        for (let px = -1; px <= 4; px++) {
            drawP(leftLegX + px, yPos + 43, c.shoeGray);
            drawP(leftLegX + px, yPos + 44, c.shoeDark);
            drawP(leftLegX + px, yPos + 45, c.shoeSole);
        }
        // Shoe details
        drawP(leftLegX, yPos + 43, c.shoeBlack);
        drawP(leftLegX + 1, yPos + 43, c.shoeBlack);
        
        // Right shoe
        for (let px = -1; px <= 4; px++) {
            drawP(rightLegX + px, yPos + 43, c.shoeGray);
            drawP(rightLegX + px, yPos + 44, c.shoeDark);
            drawP(rightLegX + px, yPos + 45, c.shoeSole);
        }
        // Shoe details
        drawP(rightLegX, yPos + 43, c.shoeBlack);
        drawP(rightLegX + 1, yPos + 43, c.shoeBlack);
        
        // === OUTLINE ===
        // Head outline
        for (let px = 6; px <= 17; px++) drawP(px, yPos + 0, c.outline);
        for (let px = 4; px <= 19; px++) drawP(px, yPos + 1, c.outline);
        
        // Body outline - simplified
        drawP(4, yPos + 15, c.outline);
        drawP(19, yPos + 15, c.outline);
        drawP(4, yPos + 26, c.outline);
        drawP(19, yPos + 26, c.outline);
    }
}

// Create singleton instance
const pixelCharacterRenderer = new PixelCharacter();

