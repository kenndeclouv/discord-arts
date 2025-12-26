const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('node:path');

const {
	genWelcomeBase,
	genWelcomeAvatar,
	genWelcomeText,
} = require('../utils/welcome-banner.utils');

// Register fonts (reuse from profile-image)
GlobalFonts.registerFromPath(
	`${path.join(__dirname, '..', '..', 'public', 'fonts')}/HelveticaBold.ttf`,
	`Helvetica Bold`,
);
GlobalFonts.registerFromPath(
	`${path.join(__dirname, '..', '..', 'public', 'fonts')}/Helvetica.ttf`,
	`Helvetica`,
);

async function genWelcomeBanner(data, options) {
	const { basicInfo, assets } = data;

	// Get dimensions
	const width = options?.customWidth || 1024;
	const height = options?.customHeight || 500;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Get user avatar (high quality)
	const userAvatar = `${assets.avatarURL ?? assets.defaultAvatarURL}?size=512`;

	// Get background image (custom or banner or avatar)
	const backgroundImage =
		options?.customBackground || assets.bannerURL || userAvatar;

	// Layer 1: Background
	const cardBase = await genWelcomeBase(options, backgroundImage);
	ctx.drawImage(cardBase, 0, 0);

	// Layer 2: Avatar
	const cardAvatar = await genWelcomeAvatar(userAvatar, options);
	ctx.drawImage(cardAvatar, 0, 0);

	// Layer 3: Text (WELCOME + username)
	const username =
		options?.customUsername || basicInfo.globalName || basicInfo.username;
	const cardText = genWelcomeText(username, options);
	ctx.drawImage(cardText, 0, 0);

	return canvas.toBuffer('image/png');
}

module.exports = { genWelcomeBanner };
