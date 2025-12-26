type presenceStatus =
	| 'online'
	| 'idle'
	| 'offline'
	| 'dnd'
	| 'invisible'
	| 'streaming'
	| 'phone';
type borderAllign = 'horizontal' | 'vertical';
type badgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type xpBarStyle = 'rounded' | 'sharp' | 'capsule';
type barGradientDirection = 'horizontal' | 'vertical' | 'radial';

interface borderStyle {
	width: number;
	color: string;
}

interface rankOptions {
	currentXp: number;
	requiredXp: number;
	level: number;
	rank?: number;
	barColor?: string | string[];
	levelColor?: string;
	autoColorRank?: boolean;
	// New rank/level options
	rankColor?: string;
	rankPrefix?: string;
	hideRank?: boolean;
	hideLevel?: boolean;
	showPercentage?: boolean;
	xpBarHeight?: number;
	xpBarStyle?: xpBarStyle;
	barGradientDirection?: barGradientDirection;
	barBorder?: borderStyle;
}

interface profileOptions {
	customUsername?: string;
	customTag?: string;
	customSubtitle?: string;
	customBadges?: string[];
	customBackground?: string;
	overwriteBadges?: boolean;
	usernameColor?: string;
	tagColor?: string;
	borderColor?: string | string[];
	borderAllign?: borderAllign;
	disableProfileTheme?: boolean;
	disableBackgroundBlur?: boolean;
	badgesFrame?: boolean;
	removeBadges?: boolean;
	removeBorder?: boolean;
	presenceStatus?: presenceStatus;
	squareAvatar?: boolean;
	moreBackgroundBlur?: boolean;
	backgroundBrightness?: number;
	customDate?: Date | string;
	localDateType?: string;
	removeAvatarFrame?: boolean;
	rankData?: rankOptions;
	// New typography options
	customFont?: string;
	usernameSize?: number;
	tagSize?: number;
	textShadow?: boolean;
	textStroke?: borderStyle;
	// New badge options
	badgePosition?: badgePosition;
	badgeSpacing?: number;
	badgeOpacity?: number;
	badgeScale?: number;
	// New visual effects
	avatarBorder?: borderStyle;
	overlayColor?: string;
	// New layout options
	hideDate?: boolean;
	multilineSubtitle?: string[];
	// Custom canvas dimensions
	customWidth?: number;
	customHeight?: number;
}

interface welcomeOptions {
	// Dimensions
	customWidth?: number;
	customHeight?: number;
	// Background
	customBackground?: string;
	backgroundBlur?: number;
	backgroundBrightness?: number;
	overlayColor?: string;
	// Avatar
	avatarSize?: number;
	avatarBorder?: borderStyle;
	avatarY?: number;
	// Text
	welcomeText?: string;
	customUsername?: string;
	customFont?: string;
	welcomeColor?: string;
	usernameColor?: string;
	textShadow?: boolean;
	textStroke?: borderStyle;

	customFontSize?: number;
	customUsernameSize?: number;
	// Layout
	type?: 'welcome' | 'goodbye';
}

declare module 'discord-arts' {
	export function profileImage(
		user: string,
		options?: profileOptions,
	): Promise<Buffer>;

	export function welcomeBanner(
		user: string,
		options?: welcomeOptions,
	): Promise<Buffer>;
}
