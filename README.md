
<div align='center'>
  <img src='https://i.imgur.com/VBVAWrM.png' alt='Discord-Arts Banner' />
  <p align='center'>
  <a href='https://www.npmjs.com/package/discord-arts'>
    <img src='https://img.shields.io/npm/v/discord-arts?label=version&style=for-the-badge' alt='version' />
    <img src='https://img.shields.io/bundlephobia/min/discord-arts?label=size&style=for-the-badge' alt='size' />
    <img src='https://img.shields.io/npm/dt/discord-arts?style=for-the-badge' alt='downloads' />
  </a>
</p>
</div>

## 📦 Installation

```bash
npm i discord-arts@latest
```

## ✨ Features

- 🚀 Fast generation!
- 🎨 Simple and beautiful design
- 🎖️ Easy to use
- 💎 Beginner friendly
- ❌ Discord.js not required

## 📌 What's New

- 🎊 **NEW: Welcome Banner Generator** - Beautiful welcome/goodbye banners!
- ✨ **25+ New Customization Options** - Comprehensive control over every aspect
- 🎨 Typography Controls - Custom fonts, sizes, shadows, and strokes
- 🏅 Enhanced Rank System - Hide/show elements, custom prefixes, percentage display
- 🎯 Badge Positioning - Place badges anywhere (top/bottom, left/right)
- 📊 Advanced XP Bars - Custom heights, styles (rounded/sharp/capsule), borders
- 🌈 Gradient Control - Vertical, horizontal, or radial XP bar gradients
- 🖼️ Avatar decorations/frames
- 🎴 Automatic profile theme colors
- 🔮 Booster badges are back
- 🛡️ Automod and LegacyUsername badges

## 🖼️ Cards

### 🪄 profileImage(userId, imgOptions?)

Generate a profile image card for a user or bot, including badges and custom options.

![Default Profile Image](https://i.imgur.com/TWf8v1G.png)

**Returns:** Promise<Buffer>

### 🎊 welcomeBanner(userId, welcomeOptions?)

Generate a beautiful welcome or goodbye banner with centered avatar and custom text.

**Returns:** Promise<Buffer>

#### welcomeOptions

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| customWidth | number | Canvas width in pixels | 1024 |
| customHeight | number | Canvas height in pixels | 500 |
| customBackground | string | Background image (path or URL) | User banner/avatar |
| backgroundBlur | number | Blur amount for background | 3 |
| backgroundBrightness | number | Brightness adjustment (-100 to 100) | 0 |
| overlayColor | string | Color overlay on background (rgba/hex) | rgba(0,0,0,0.4) |
| avatarSize | number | Avatar diameter in pixels | 200 |
| avatarBorder | object | Avatar border `{ width: number, color: string }` | { width: 8, color: '#FFFFFF' } |
| avatarY | number | Avatar Y position offset | 80 |
| welcomeText | string | Main text (e.g., "WELCOME", "GOODBYE") | WELCOME |
| customUsername | string | Override username display | User's display name |
| customFont | string | Font family | Helvetica |
| customFontSize | number | Manual font size override | 80 |
| customUsernameSize | number | Manual username font size override | 40 |
| welcomeColor | string | Welcome text color (HEX) | #FFFFFF |
| usernameColor | string | Username text color (HEX) | #FFFFFF |
| textShadow | boolean | Enable text shadow | true |
| textStroke | object | Text outline `{ width: number, color: string }` | - |
| type | string | Banner type ('welcome' \| 'goodbye') | welcome |

#### imgOptions

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| customUsername | string | Customize the username | - |
| customTag | string | Text below the user | - |
| customSubtitle | string | Text below the custom tag | - |
| multilineSubtitle | string[] | Multiple lines of subtitle text | - |
| customBadges | string[] | Your own png badges (path and URL) (46x46) | - |
| customBackground | string | Change the background to any image (path and URL) (885x303) | - |
| overwriteBadges | boolean | Merge your badges with the discord defaults | false |
| badgesFrame | boolean | Creates a small frame behind the badges | false |
| removeBadges | boolean | Removes badges, whether custom or from discord | false |
| removeBorder | boolean | Removes the image border, custom and normal | false |
| usernameColor | string | Username HEX color | #FFFFFF |
| tagColor | string | Tag HEX color | #dadada |
| borderColor | string \| string[] | Border HEX color, can be gradient if 2 colors are used | - |
| borderAllign | string | Gradient alignment if 2 colors are used ('horizontal'\|'vertical') | horizontal |
| disableProfileTheme | boolean | Disable the discord profile theme colors | false |
| presenceStatus | string | User status to be displayed ('online'\|'idle'\|'dnd'\|'offline'\|'invisible'\|'streaming'\|'phone') | - |
| squareAvatar | boolean | Change avatar shape to a square | false |
| removeAvatarFrame | boolean | Remove the discord avatar frame/decoration (if any) | false |
| rankData | object | Rank data options (see below) | - |
| moreBackgroundBlur | boolean | Triples blur of background image | false |
| backgroundBrightness | number | Set brightness of background from 1-100% | - |
| overlayColor | string | Custom overlay color on background (rgba/hex) | rgba(42,45,51,0.2) |
| customDate | Date \| string | Custom date or text to use instead of when user joined Discord | - |
| localDateType | string | Local format for the date, e.g. 'en' \| 'es' etc. | - |
| hideDate | boolean | Hide the creation date display | false |
| customWidth | number | Custom canvas width in pixels | 885 |
| customHeight | number | Custom canvas height in pixels | 303 |

#### Typography Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| customFont | string | Font family override | Helvetica |
| usernameSize | number | Manual username font size override | auto-calculated |
| tagSize | number | Tag font size override | 60 |
| textShadow | boolean | Enable text shadow for readability | false |
| textStroke | object | Text outline `{ width: number, color: string }` | - |

#### Badge Customization

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| badgePosition | string | Badge placement ('top-right'\|'top-left'\|'bottom-right'\|'bottom-left') | top-right |
| badgeSpacing | number | Gap between badges in pixels | 59 |
| badgeOpacity | number | Badge transparency (0.0-1.0) | 1.0 |
| badgeScale | number | Badge size multiplier (0.5-2.0) | 1.0 |

#### Visual Effects

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| avatarBorder | object | Border around avatar `{ width: number, color: string }` | - |

#### rankData Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| currentXp | number | Current user XP (required) | - |
| requiredXp | number | XP required to level up (required) | - |
| level | number | Current user level (required) | - |
| rank | number | Position on the leaderboard | - |
| barColor | string \| string[] | HEX XP bar color, can be gradient | - |
| levelColor | string | HEX color of LVL text | #dadada |
| autoColorRank | boolean | Color ranks as medals for 1st, 2nd, 3rd | false |
| rankColor | string | Custom rank color (overrides autoColorRank) | #dadada |
| rankPrefix | string | Custom rank prefix instead of "RANK" | RANK |
| hideRank | boolean | Hide rank display | false |
| hideLevel | boolean | Hide level display | false |
| showPercentage | boolean | Display XP percentage on bar | false |
| xpBarHeight | number | Custom bar thickness in pixels | 36 |
| xpBarStyle | string | Bar corner style ('rounded'\|'sharp'\|'capsule') | rounded |
| barGradientDirection | string | Gradient flow ('horizontal'\|'vertical'\|'radial') | horizontal |
| barBorder | object | Border around XP bar `{ width: number, color: string }` | - |

## 📃 Code Example (Discord.js v14)

### Profile Image

```javascript
const { AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

await interaction.deferReply();
const user = interaction.options.getUser('user-option');

const buffer = await profileImage(user.id, {
  customTag: 'Admin',
  squareAvatar: true,
  // ... other imgOptions
});

interaction.followUp({ files: [buffer] });
```

### Welcome Banner

```javascript
const { AttachmentBuilder } = require('discord.js');
const { welcomeBanner } = require('discord-arts');

// Basic welcome banner
client.on('guildMemberAdd', async (member) => {
  const buffer = await welcomeBanner(member.id);
  
  const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });
  const welcomeChannel = member.guild.channels.cache.get('CHANNEL_ID');
  
  welcomeChannel.send({ 
    content: `Welcome to the server, ${member}!`,
    files: [attachment] 
  });
});

// Custom styled welcome banner
const buffer = await welcomeBanner(user.id, {
  customBackground: 'https://i.imgur.com/yourimage.png',
  welcomeText: 'BIENVENUE', // French welcome
  welcomeColor: '#FFD700',
  usernameColor: '#FFFFFF',
  avatarBorder: { width: 10, color: '#FFD700' },
  backgroundBlur: 5,
});

// Goodbye banner
const buffer = await welcomeBanner(user.id, {
  type: 'goodbye',
  welcomeColor: '#FF6B6B',
  overlayColor: 'rgba(0, 0, 0, 0.6)',
});
```

## 🎨 Advanced Examples

### Enhanced Rank Card with New Features

```javascript
profileImage('UserID', {
  customBadges: ['./skull.png', './rocket.png', './crown.png'],
  presenceStatus: 'phone',
  badgesFrame: true,
  customDate: 'AWESOME!',
  moreBackgroundBlur: true,
  backgroundBrightness: 100,
  // New typography options
  customFont: 'Arial',
  textShadow: true,
  avatarBorder: { width: 5, color: '#ff6b6b' },
  // Enhanced badge control
  badgePosition: 'bottom-right',
  badgeOpacity: 0.9,
  // Advanced rank customization
  rankData: {
    currentXp: 2100,
    requiredXp: 3000,
    rank: 1,
    level: 20,
    barColor: ['#fcdce1', '#ada8c6'], // Gradient
    barGradientDirection: 'vertical',
    levelColor: '#ada8c6',
    autoColorRank: true,
    showPercentage: true,
    xpBarHeight: 40,
    xpBarStyle: 'capsule',
    rankPrefix: 'Position'
  }
});
```

### Typography & Text Styling

```javascript
profileImage('UserID', {
  customFont: 'Comic Sans MS',
  usernameSize: 90,
  tagSize: 50,
  textShadow: true,
  textStroke: { width: 3, color: '#000000' },
  multilineSubtitle: ['Premium Member', 'Since 2020', '⭐ VIP Status']
});
```

### Badge Customization

```javascript
profileImage('UserID', {
  customBadges: ['./badge1.png', './badge2.png'],
  badgePosition: 'bottom-left', // or 'top-left', 'bottom-right'
  badgeSpacing: 70,
  badgeScale: 1.5,
  badgeOpacity: 0.8
});
```

### Advanced XP Bar Styling

```javascript
profileImage('UserID', {
  rankData: {
    currentXp: 1500,
    requiredXp: 2000,
    level: 15,
    rank: 3,
    hideRank: false,
    hideLevel: false,
    showPercentage: true,
    rankColor: '#00ff00',
    rankPrefix: 'Rank',
    barColor: ['#ff0000', '#00ff00', '#0000ff'],
    barGradientDirection: 'horizontal',
    xpBarHeight: 50,
    xpBarStyle: 'sharp',
    barBorder: { width: 2, color: '#ffffff' }
  }
});
```

### Custom Canvas Dimensions

```javascript
profileImage('UserID', {
  customWidth: 1770,  // Double width (2x scale)
  customHeight: 606,  // Double height (2x scale)
  // All elements scale proportionally
  rankData: {
    currentXp: 1000,
    requiredXp: 2000,
    level: 10,
    rank: 5
  }
});
```

## Example Results

### Rank Card

![Rank Card Example](https://i.imgur.com/Rd6ScN1.png)

```javascript
profileImage('UserID', {
  customBadges: ['./skull.png', './rocket.png', './crown.png'],
  presenceStatus: 'phone',
  badgesFrame: true,
  customDate: 'AWESOME!',
  moreBackgroundBlur: true,
  backgroundBrightness: 100,
  rankData: {
    currentXp: 2100,
    requiredXp: 3000,
    rank: 1,
    level: 20,
    barColor: '#fcdce1',
    levelColor: '#ada8c6',
    autoColorRank: true
  }
});
```

### Custom User Card

![Custom User Card Example](https://i.imgur.com/8wB4v2L.png)

```javascript
profileImage('UserID', {
  borderColor: ['#0000ff', '#00fe5a'],
  presenceStatus: 'idle',
  removeAvatarFrame: false
});
```

### Custom Bot Card

![Custom Bot Card Example](https://i.imgur.com/ldKbKvv.png)

```javascript
profileImage('UserID', {
  customBackground: 'https://i.imgur.com/LWcWzlc.png',
  borderColor: '#ec8686',
  presenceStatus: 'online',
  badgesFrame: true
});
```

## ⭐ Support

Join our [Discord Server](https://discord.gg/csedxqGQKP) for support and community discussions.