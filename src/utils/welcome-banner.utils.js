const { createCanvas, loadImage } = require('@napi-rs/canvas');

const { parseImg, parseHex } = require('./validations.utils');

// Helper to get canvas dimensions with scaling
function getCanvasDimensions(options) {
	const width = options?.customWidth || 1024;
	const height = options?.customHeight || 500;
	return { width, height };
}

/**
 * Generate welcome banner background
 */
async function genWelcomeBase(options, backgroundImage) {
	const { width, height } = getCanvasDimensions(options);
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Load background image
	let bgImage;
	if (backgroundImage) {
		try {
			bgImage = await loadImage(parseImg(backgroundImage));
		} catch {
			// Fallback to solid color if image fails
			bgImage = null;
		}
	}

	if (bgImage) {
		// Apply blur filter
		const blurAmount = options?.backgroundBlur ?? 3;
		ctx.filter = `blur(${blurAmount}px)`;

		// Apply brightness
		if (options?.backgroundBrightness) {
			ctx.filter += ` brightness(${options.backgroundBrightness + 100}%)`;
		}

		// Draw background image (cover fit)
		const imgRatio = bgImage.width / bgImage.height;
		const canvasRatio = width / height;

		let drawWidth, drawHeight, offsetX, offsetY;

		if (imgRatio > canvasRatio) {
			// Image is wider
			drawHeight = height;
			drawWidth = height * imgRatio;
			offsetX = (width - drawWidth) / 2;
			offsetY = 0;
		} else {
			// Image is taller
			drawWidth = width;
			drawHeight = width / imgRatio;
			offsetX = 0;
			offsetY = (height - drawHeight) / 2;
		}

		ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);
		ctx.filter = 'none';
	} else {
		// Default gradient background
		const gradient = ctx.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, '#667eea');
		gradient.addColorStop(1, '#764ba2');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);
	}

	// Apply overlay for better text contrast
	const overlayColor = options?.overlayColor || 'rgba(0, 0, 0, 0.4)';
	ctx.fillStyle = overlayColor;
	ctx.fillRect(0, 0, width, height);

	return canvas;
}

/**
 * Generate circular avatar with border
 */
async function genWelcomeAvatar(avatarUrl, options) {
	const { width, height } = getCanvasDimensions(options);
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	const avatarSize = options?.avatarSize || 200;
	const avatarRadius = avatarSize / 2;

	// Avatar position (center horizontally, custom Y or default)
	const avatarX = width / 2;
	const avatarY = options?.avatarY || 80;

	// Load avatar
	const avatar = await loadImage(avatarUrl);

	// Draw avatar border
	const borderConfig = options?.avatarBorder || { width: 8, color: '#FFFFFF' };

	if (borderConfig.width > 0) {
		ctx.strokeStyle = parseHex(borderConfig.color);
		ctx.lineWidth = borderConfig.width;
		ctx.beginPath();
		ctx.arc(
			avatarX,
			avatarY + avatarRadius,
			avatarRadius + borderConfig.width / 2,
			0,
			Math.PI * 2,
		);
		ctx.stroke();
	}

	// Clip to circle
	ctx.save();
	ctx.beginPath();
	ctx.arc(avatarX, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();

	// Draw avatar
	ctx.drawImage(
		avatar,
		avatarX - avatarRadius,
		avatarY,
		avatarSize,
		avatarSize,
	);
	ctx.restore();

	return canvas;
}

/**
 * Generate welcome text and username
 */
function genWelcomeText(username, options) {
	const { width, height } = getCanvasDimensions(options);
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	const customFont = options?.customFont || 'Helvetica';
	const welcomeText =
		options?.welcomeText ||
		(options?.type === 'goodbye' ? 'GOODBYE' : 'WELCOME');
    const customFontSize = options?.customFontSize || 80;
    const customUsernameSize = options?.customUsernameSize || 40;
	const welcomeColor = options?.welcomeColor || '#FFFFFF';
	const usernameColor = options?.usernameColor || '#FFFFFF';
	const textShadow = options?.textShadow ?? true;
	const textStroke = options?.textStroke;

	// Calculate positions
	const avatarSize = options?.avatarSize || 220;
	const avatarY = options?.avatarY || 80;
	const welcomeY = avatarY + avatarSize + 90; // Below avatar (increased from 60 to 100)
	const usernameY = welcomeY + 60; // Below welcome text

	// Apply text shadow if enabled
	if (textShadow) {
		ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 3;
		ctx.shadowOffsetY = 3;
	}

	// Apply text stroke if specified
	if (textStroke?.width && textStroke?.color) {
		ctx.strokeStyle = parseHex(textStroke.color);
		ctx.lineWidth = textStroke.width;
		ctx.lineJoin = 'round';
	}

	// Draw welcome text
	ctx.font = `bold ${customFontSize}px ${customFont}`;
	ctx.fillStyle = parseHex(welcomeColor);
	ctx.textAlign = 'center';

	if (textStroke?.width && textStroke?.color) {
		ctx.strokeText(welcomeText, width / 2, welcomeY);
	}
	ctx.fillText(welcomeText, width / 2, welcomeY);

	// Draw username
	ctx.font = `bold ${customUsernameSize}px ${customFont}`;
	ctx.fillStyle = parseHex(usernameColor);

	if (textStroke?.width && textStroke?.color) {
		ctx.strokeText(username, width / 2, usernameY);
	}
	ctx.fillText(username, width / 2, usernameY);

	// Reset shadow
	ctx.shadowColor = 'transparent';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;

	return canvas;
}

module.exports = {
	genWelcomeBase,
	genWelcomeAvatar,
	genWelcomeText,
};
