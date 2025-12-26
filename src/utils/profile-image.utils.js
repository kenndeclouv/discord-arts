const { createCanvas, loadImage } = require('@napi-rs/canvas');

const {
	otherImgs,
	statusImgs,
} = require('../../public/profile-image.files.json');

const {
	parseUsername,
	abbreviateNumber,
	getDateOrString,
	truncateText,
} = require('../utils/strings.utils');
const {
	parseImg,
	parseHex,
	parsePng,
	isString,
	isNumber,
} = require('../utils/validations.utils');
const DiscordArtsError = require('./error.utils');

const alphaValue = 0.4;
const clydeID = '1081004946872352958';

// Helper to get canvas dimensions with scaling
function getCanvasDimensions(options) {
	const width = options?._canvasWidth || 885;
	const height = options?._canvasHeight || 303;
	const scaleX = options?._scaleX || 1;
	const scaleY = options?._scaleY || 1;
	return { width, height, scaleX, scaleY };
}

async function getBadges(data, options) {
	const { assets } = data;

	const badges = assets?.badges || [];
	const canvasBadges = [];

	for (const badge of badges.reverse()) {
		const { name, icon } = badge;
		const canvas = await loadImage(icon).catch(() => {});
		if (!canvas) {
			throw new DiscordArtsError(
				`Could not load badge: (${name})\nIf you think it is not a network problem, please report it in our discord: https://discord.gg/csedxqGQKP`,
			);
		}

		canvasBadges.push({ canvas, x: 0, y: 15, w: 60 });
	}

	if (options?.customBadges?.length) {
		if (options?.overwriteBadges) {
			canvasBadges.splice(0, badges.length);
		}

		for (let i = 0; i < options.customBadges.length; i++) {
			const canvas = await loadImage(parsePng(options.customBadges[i])).catch(
				() => {},
			);
			if (!canvas) {
				const truncatedBadge = truncateText(options.customBadges[i], 30);
				throw new DiscordArtsError(
					`Could not load custom badge: (${truncatedBadge}), make sure that the image exists.`,
				);
			}

			canvasBadges.push({ canvas, x: 10, y: 22, w: 46 });
		}
	}

	return canvasBadges;
}

async function genBase(options, avatarData, bannerData) {
	const { width, height, scaleX, scaleY } = getCanvasDimensions(options);
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	let isBannerLoaded = true;
	let cardBackground = await loadImage(
		options?.customBackground
			? parseImg(options.customBackground)
			: (bannerData ?? avatarData),
	).catch(() => {});

	if (!cardBackground) {
		cardBackground = await loadImage(avatarData).catch(() => {});
		isBannerLoaded = false;
	}

	const condAvatar = options?.customBackground
		? true
		: !isBannerLoaded
			? false
			: bannerData !== null;
	const wX = condAvatar ? width : 900 * scaleX;
	const wY = condAvatar ? height : wX;
	const cY = condAvatar ? 0 : -345 * scaleY;

	ctx.fillStyle = '#18191c';
	ctx.beginPath();
	ctx.fillRect(0, 0, width, height);
	ctx.fill();

	ctx.filter =
		(options?.moreBackgroundBlur
			? 'blur(9px)'
			: options?.disableBackgroundBlur
				? 'blur(0px)'
				: 'blur(3px)') +
		(options?.backgroundBrightness
			? ` brightness(${options.backgroundBrightness + 100}%)`
			: '');
	ctx.drawImage(cardBackground, 0, cY, wX, wY);

	// Apply customizable overlay color (default maintains current behavior)
	const overlayColor = options?.overlayColor || 'rgba(42, 45, 51, 0.2)';
	ctx.globalAlpha = 1;
	ctx.fillStyle = overlayColor;
	ctx.beginPath();
	ctx.fillRect(0, 0, width, height);
	ctx.fill();

	return canvas;
}

async function genFrame(badges, options) {
	const { width, height, scaleX, scaleY } = getCanvasDimensions(options);
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	const cardFrame = await loadImage(Buffer.from(otherImgs.frame, 'base64'));

	ctx.globalCompositeOperation = 'source-out';
	ctx.globalAlpha = 0.5;
	ctx.drawImage(cardFrame, 0, 0, width, height);
	ctx.globalCompositeOperation = 'source-over';

	// Only draw date background if date is not hidden
	if (!options?.hideDate) {
		ctx.globalAlpha = alphaValue;
		ctx.fillStyle = '#000';
		ctx.beginPath();
		ctx.roundRect(696 * scaleX, 248 * scaleY, 165 * scaleX, 33 * scaleY, [
			12 * Math.min(scaleX, scaleY),
		]);
		ctx.fill();
		ctx.globalAlpha = 1;
	}

	const badgesLength = badges.length;

	if (options?.badgesFrame && badgesLength > 0 && !options?.removeBadges) {
		ctx.fillStyle = '#000';
		ctx.globalAlpha = alphaValue;
		ctx.beginPath();
		ctx.roundRect(
			857 * scaleX - badgesLength * 59 * scaleX,
			15 * scaleY,
			(59 * badgesLength + 8) * scaleX,
			61 * scaleY,
			[17 * Math.min(scaleX, scaleY)],
		);
		ctx.fill();
	}

	return canvas;
}

function genBorder(options) {
	const canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	const borderColors = [];
	if (typeof options.borderColor === 'string')
		borderColors.push(options.borderColor);
	else borderColors.push(...options.borderColor);

	if (borderColors.length > 20)
		throw new DiscordArtsError(
			`Invalid borderColor length (${borderColors.length}) must be a maximum of 20 colors`,
		);

	const gradX = options.borderAllign === 'vertical' ? 0 : 885;
	const gradY = options.borderAllign === 'vertical' ? 303 : 0;

	const grd = ctx.createLinearGradient(0, 0, gradX, gradY);

	for (let i = 0; i < borderColors.length; i++) {
		const stop = i / (borderColors.length - 1);
		grd.addColorStop(stop, parseHex(borderColors[i]));
	}

	ctx.fillStyle = grd;
	ctx.beginPath();
	ctx.fillRect(0, 0, 885, 303);

	ctx.globalCompositeOperation = 'destination-out';

	ctx.beginPath();
	ctx.roundRect(9, 9, 867, 285, [25]);
	ctx.fill();

	return canvas;
}

async function genTextAndAvatar(data, options, avatarData) {
	const { basicInfo } = data;
	const {
		globalName,
		username: rawUsername,
		discriminator,
		bot,
		createdTimestamp,
		id,
	} = basicInfo;

	// Extract new options with defaults
	const customFont = options?.customFont || 'Helvetica';
	const usernameSize = options?.usernameSize;
	const tagSize = options?.tagSize || 60;
	const textShadow = options?.textShadow || false;
	const textStroke = options?.textStroke;
	const avatarBorder = options?.avatarBorder;
	const hideDate = options?.hideDate || false;
	const multilineSubtitle = options?.multilineSubtitle;

	const isClyde = id === clydeID;
	const pixelLength = bot ? 470 : 555;

	let canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	const fixedUsername = options?.customUsername || globalName || rawUsername;

	const { username, newSize } = parseUsername(
		fixedUsername,
		ctx,
		`${customFont} Bold`,
		usernameSize ? String(usernameSize) : '80',
		pixelLength,
	);

	// Handle multiline subtitle or single subtitle
	if ((multilineSubtitle || options?.customSubtitle) && !options.rankData) {
		const subtitles = multilineSubtitle || [options?.customSubtitle];
		const lineHeight = 25;
		const totalHeight = subtitles.length * lineHeight + 8;

		ctx.globalAlpha = alphaValue;
		ctx.fillStyle = '#2a2d33';
		ctx.beginPath();
		ctx.roundRect(304, 248, 380, Math.max(33, totalHeight), [12]);
		ctx.fill();
		ctx.globalAlpha = 1;

		ctx.font = `23px ${customFont}`;
		ctx.textAlign = 'left';
		ctx.fillStyle = options?.color ? options.color : '#dadada';

		subtitles.forEach((line, index) => {
			ctx.fillText(line, 314, 258 + index * lineHeight);
		});
	}

	const createdDateString = getDateOrString(
		options?.customDate,
		createdTimestamp,
		options?.localDateType,
	);

	if (isClyde && !options?.customTag) {
		options.customTag = '@clyde';
	}

	const tag = options?.customTag
		? isString(options.customTag, 'customTag')
		: !discriminator
			? `@${rawUsername}`
			: `#${discriminator}`;

	// Apply text shadow if enabled
	if (textShadow) {
		ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
		ctx.shadowBlur = 4;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
	}

	// Apply text stroke if specified
	if (textStroke?.width && textStroke?.color) {
		ctx.strokeStyle = parseHex(textStroke.color);
		ctx.lineWidth = textStroke.width;
		ctx.lineJoin = 'round';
	}

	// Draw username
	const finalUsernameSize = usernameSize || newSize;
	ctx.font = `${finalUsernameSize}px ${customFont} Bold`;
	ctx.textAlign = 'left';
	ctx.fillStyle = options?.usernameColor
		? parseHex(options.usernameColor)
		: '#FFFFFF';

	if (textStroke?.width && textStroke?.color) {
		ctx.strokeText(username, 300, 155);
	}
	ctx.fillText(username, 300, 155);

	// Draw tag if no rank data
	if (!options?.rankData) {
		ctx.font = `${tagSize}px ${customFont}`;
		ctx.fillStyle = options?.tagColor ? parseHex(options.tagColor) : '#dadada';
		if (textStroke?.width && textStroke?.color) {
			ctx.strokeText(tag, 300, 215);
		}
		ctx.fillText(tag, 300, 215);
	}

	// Reset shadow and stroke
	ctx.shadowColor = 'transparent';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.lineWidth = 1;

	// Draw date if not hidden
	if (!hideDate) {
		ctx.font = `23px ${customFont}`;
		ctx.textAlign = 'center';
		ctx.fillStyle = '#dadada';
		ctx.fillText(createdDateString, 775, 273);
	}

	const cardAvatar = await loadImage(avatarData);

	const roundValue = options?.squareAvatar ? 30 : 225;

	ctx.beginPath();
	ctx.roundRect(47, 39, 225, 225, [roundValue]);
	ctx.clip();

	ctx.fillStyle = '#292b2f';
	ctx.beginPath();
	ctx.roundRect(47, 39, 225, 225, [roundValue]);
	ctx.fill();

	ctx.drawImage(cardAvatar, 47, 39, 225, 225);

	ctx.closePath();

	// Apply avatar border if specified
	if (avatarBorder?.width && avatarBorder?.color) {
		ctx.globalCompositeOperation = 'source-over';
		ctx.strokeStyle = parseHex(avatarBorder.color);
		ctx.lineWidth = avatarBorder.width;
		ctx.beginPath();
		ctx.roundRect(47, 39, 225, 225, [roundValue]);
		ctx.stroke();
	}

	if (options?.presenceStatus) {
		canvas = await genStatus(canvas, options);
	}

	return canvas;
}

async function genAvatarFrame(data, options) {
	let canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	const frameUrl = data?.decoration?.avatarFrame;

	const avatarFrame = await loadImage(frameUrl);
	ctx.drawImage(avatarFrame, 25, 18, 269, 269);

	if (options?.presenceStatus) {
		canvas = await cutAvatarStatus(canvas, options);
	}

	return canvas;
}

function cutAvatarStatus(canvasToEdit, options) {
	const canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	const cX = options.presenceStatus === 'phone' ? 224.5 : 212;
	const cY = options.presenceStatus === 'phone' ? 202 : 204;

	ctx.drawImage(canvasToEdit, 0, 0);

	ctx.globalCompositeOperation = 'destination-out';

	if (options.presenceStatus === 'phone')
		ctx.roundRect(cX - 8, cY - 8, 57, 78, [10]);
	else ctx.roundRect(212, 204, 62, 62, [62]);
	ctx.fill();

	ctx.globalCompositeOperation = 'source-over';

	return canvas;
}

async function genStatus(canvasToEdit, options) {
	const canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	const validStatus = [
		'idle',
		'dnd',
		'online',
		'invisible',
		'offline',
		'streaming',
		'phone',
	];

	if (!validStatus.includes(options.presenceStatus))
		throw new DiscordArtsError(
			`Invalid presenceStatus ('${options.presenceStatus}') must be 'online' | 'idle' | 'offline' | 'dnd' | 'invisible' | 'streaming' | 'phone'`,
		);

	const statusString =
		options.presenceStatus === 'offline' ? 'invisible' : options.presenceStatus;

	const status = await loadImage(
		Buffer.from(statusImgs[statusString], 'base64'),
	);

	const cX = options.presenceStatus === 'phone' ? 224.5 : 212;
	const cY = options.presenceStatus === 'phone' ? 202 : 204;

	ctx.drawImage(canvasToEdit, 0, 0);

	ctx.globalCompositeOperation = 'destination-out';

	if (options.presenceStatus === 'phone')
		ctx.roundRect(cX - 8, cY - 8, 57, 78, [10]);
	else ctx.roundRect(212, 204, 62, 62, [62]);
	ctx.fill();

	ctx.globalCompositeOperation = 'source-over';

	ctx.drawImage(status, cX, cY);

	return canvas;
}

function genBadges(badges, options = {}) {
	const canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	// Extract badge customization options with defaults
	const badgePosition = options?.badgePosition || 'top-right';
	const badgeSpacing = options?.badgeSpacing ?? 59;
	const badgeOpacity = options?.badgeOpacity ?? 1.0;
	const badgeScale = options?.badgeScale ?? 1.0;

	// Calculate position based on badgePosition
	const positions = {
		'top-right': { startX: 800, startY: 15 },
		'top-left': { startX: 85, startY: 15 },
		'bottom-right': { startX: 800, startY: 227 },
		'bottom-left': { startX: 85, startY: 227 },
	};

	const { startX, startY } = positions[badgePosition] || positions['top-right'];
	const isLeftAlign = badgePosition.includes('left');

	let x = startX;
	badges.forEach((badge) => {
		const { canvas: badgeCanvas, x: bX, y: bY, w } = badge;

		// Apply scale to badge size
		const scaledW = w * badgeScale;
		const scaledBX = bX * badgeScale;
		const scaledBY = bY * badgeScale;

		// Apply opacity
		ctx.globalAlpha = badgeOpacity;

		// Calculate x position based on alignment
		const xPos = isLeftAlign ? x : x + scaledBX;
		const yPos = startY + (bY !== 15 ? scaledBY : 0);

		ctx.drawImage(badgeCanvas, xPos, yPos, scaledW, scaledW);

		// Move to next badge position
		x += isLeftAlign ? badgeSpacing : -badgeSpacing;
	});

	// Reset alpha
	ctx.globalAlpha = 1;

	return canvas;
}

async function genBotVerifBadge(data) {
	const { basicInfo } = data;
	const { username, globalName, id } = basicInfo;

	const canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	const isClyde = id === clydeID;

	const usernameToParse = isClyde ? globalName : username;

	const { textLength } = parseUsername(
		usernameToParse,
		ctx,
		'Helvetica Bold',
		'80',
		470,
	);

	const badgeName = isClyde
		? 'botAI'
		: basicInfo?.verified
			? 'botVerif'
			: 'botNoVerif';

	const botBadgeBase64 = otherImgs[badgeName];
	const botBagde = await loadImage(Buffer.from(botBadgeBase64, 'base64'));

	ctx.drawImage(botBagde, textLength + 310, 110);

	return canvas;
}

function genXpBar(options) {
	const {
		currentXp,
		requiredXp,
		level,
		rank,
		barColor,
		levelColor,
		autoColorRank,
		// New options with defaults
		rankColor,
		rankPrefix = 'RANK',
		hideRank = false,
		hideLevel = false,
		showPercentage = false,
		xpBarHeight = 36,
		xpBarStyle = 'rounded',
		barGradientDirection = 'horizontal',
		barBorder,
	} = options.rankData;

	if (
		Number.isNaN(currentXp) ||
		Number.isNaN(requiredXp) ||
		Number.isNaN(level)
	) {
		throw new DiscordArtsError(
			'rankData options requires: currentXp, requiredXp and level properties',
		);
	}

	const canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');

	const mY = 8;

	// Bottom text background
	ctx.fillStyle = '#000';
	ctx.globalAlpha = alphaValue;
	ctx.beginPath();
	ctx.roundRect(304, 248, 380, 33, [12]);
	ctx.fill();
	ctx.globalAlpha = 1;

	// Build rank string with custom prefix
	const rankString =
		!hideRank && rank !== undefined && !Number.isNaN(rank)
			? `${rankPrefix} #${abbreviateNumber(isNumber(rank, 'rankData:rank'))}`
			: '';
	const lvlString =
		!hideLevel && !Number.isNaN(level)
			? `Lvl ${abbreviateNumber(isNumber(level, 'rankData:level'))}`
			: '';

	// XP display with optional percentage
	const percentage = Math.round((currentXp / requiredXp) * 100);
	const xpText = showPercentage
		? `${abbreviateNumber(currentXp)} / ${abbreviateNumber(requiredXp)} XP (${percentage}%)`
		: `${abbreviateNumber(currentXp)} / ${abbreviateNumber(requiredXp)} XP`;

	ctx.font = '21px Helvetica';
	ctx.textAlign = 'left';
	ctx.fillStyle = '#dadada';
	ctx.fillText(xpText, 314, 273);

	// Rank color logic
	const rankColors = {
		gold: '#F1C40F',
		silver: '#a1a4c9',
		bronze: '#AD8A56',
		current: rankColor || '#dadada', // Use custom rankColor if provided
	};

	const rankMapping = {
		[`${rankPrefix} #1`]: rankColors.gold,
		[`${rankPrefix} #2`]: rankColors.silver,
		[`${rankPrefix} #3`]: rankColors.bronze,
	};

	// Auto-color rank only if no custom rankColor is set
	if (!rankColor && autoColorRank && Object.hasOwn(rankMapping, rankString)) {
		rankColors.current = rankMapping[rankString];
	}

	// Display rank (if not hidden)
	if (rankString) {
		ctx.font = 'bold 21px Helvetica';
		ctx.textAlign = 'right';
		ctx.fillStyle = rankColors.current;
		ctx.fillText(
			rankString,
			674 - ctx.measureText(lvlString).width - (lvlString ? 10 : 0),
			273,
		);
	}

	// Display level (if not hidden)
	if (lvlString) {
		ctx.font = 'bold 21px Helvetica';
		ctx.textAlign = 'right';
		ctx.fillStyle = levelColor ? parseHex(levelColor) : '#dadada';
		ctx.fillText(lvlString, 674, 273);
	}

	// XP Bar background
	ctx.globalAlpha = alphaValue;
	ctx.fillStyle = '#000';
	ctx.beginPath();
	ctx.roundRect(304, 187 - mY, 557, xpBarHeight, [14]);
	ctx.fill();
	ctx.globalAlpha = 1;

	// Apply bar border if specified
	if (barBorder?.width && barBorder?.color) {
		ctx.strokeStyle = parseHex(barBorder.color);
		ctx.lineWidth = barBorder.width;
		ctx.beginPath();
		ctx.roundRect(304, 187 - mY, 557, xpBarHeight, [14]);
		ctx.stroke();
	}

	// Clip for XP bar
	ctx.beginPath();
	ctx.roundRect(304, 187 - mY, 557, xpBarHeight, [14]);
	ctx.clip();

	// Build gradient colors
	const barColors = [];
	if (typeof barColor === 'string') barColors.push(barColor);
	else if (Array.isArray(barColor)) barColors.push(...barColor);

	if (barColors.length > 20)
		throw new DiscordArtsError(
			`Invalid barColor length (${barColors.length}) must be a maximum of 20 colors`,
		);

	const barWidth = Math.round((currentXp * 556) / requiredXp);

	// Gradient direction logic
	let gradientCoords = { x0: 304, y0: 197, x1: 860, y1: 197 }; // horizontal (default)
	if (barGradientDirection === 'vertical') {
		gradientCoords = {
			x0: 304,
			y0: 187 - mY,
			x1: 304,
			y1: 187 - mY + xpBarHeight,
		};
	} else if (barGradientDirection === 'radial') {
		// For radial, we'll use a simple diagonal for linear gradient
		gradientCoords = {
			x0: 304,
			y0: 187 - mY,
			x1: 860,
			y1: 187 - mY + xpBarHeight,
		};
	}

	const grd = ctx.createLinearGradient(
		gradientCoords.x0,
		gradientCoords.y0,
		gradientCoords.x1,
		gradientCoords.y1,
	);

	for (let i = 0; i < barColors.length; i++) {
		const stop = i / (barColors.length - 1);
		grd.addColorStop(stop, parseHex(barColors[i]));
	}

	// Draw XP bar with style
	ctx.fillStyle = barColors.length > 0 ? grd : '#fff';
	ctx.beginPath();

	// Apply bar style
	const barRadius =
		xpBarStyle === 'sharp'
			? 0
			: xpBarStyle === 'capsule'
				? xpBarHeight / 2
				: 14;
	ctx.roundRect(304, 187 - mY, barWidth, xpBarHeight, [barRadius]);
	ctx.fill();

	return canvas;
}

function addShadow(canvasToEdit) {
	const canvas = createCanvas(885, 303);
	const ctx = canvas.getContext('2d');
	ctx.filter = 'drop-shadow(0px 4px 4px #000)';
	ctx.globalAlpha = alphaValue;
	ctx.drawImage(canvasToEdit, 0, 0);

	return canvas;
}

module.exports = {
	getBadges,
	genBase,
	genFrame,
	genBorder,
	genTextAndAvatar,
	genAvatarFrame,
	genXpBar,
	genBadges,
	genBotVerifBadge,
	addShadow,
};
