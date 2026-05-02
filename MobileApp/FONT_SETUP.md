# Adding Clash Grotesk Font to Mobile App

## Steps to Complete Font Setup:

### 1. Download Clash Grotesk Font Files
You need to download the following font files:
- ClashGrotesk-Regular.otf (or .ttf)
- ClashGrotesk-Medium.otf (or .ttf)
- ClashGrotesk-Semibold.otf (or .ttf)
- ClashGrotesk-Bold.otf (or .ttf)

You can get Clash Grotesk from:
- Official source: https://www.fontshare.com/fonts/clash-grotesk (Free)
- Or your preferred font provider

### 2. Add Font Files to Project
Place the downloaded font files in:
```
/Users/admin/RoyalWay/MobileApp/assets/fonts/
```

The folder structure should look like:
```
MobileApp/
  assets/
    fonts/
      ClashGrotesk-Regular.otf
      ClashGrotesk-Medium.otf
      ClashGrotesk-Semibold.otf
      ClashGrotesk-Bold.otf
```

### 3. Install Dependencies
Run this command in the MobileApp directory:
```bash
cd /Users/admin/RoyalWay/MobileApp
npm install
```

### 4. Clear Cache and Restart
```bash
npx expo start --clear
```

## What's Already Done:
✅ Created fonts folder
✅ Updated package.json with expo-font
✅ Added font loading logic to App.js
✅ Applied Clash Grotesk to key text styles
✅ Added error handling for font loading

## Font Usage in App:
- **ClashGrotesk-Bold**: Titles, buttons, headings
- **ClashGrotesk-Semibold**: Labels, links, subheadings
- **ClashGrotesk-Medium**: Body text (optional)
- **ClashGrotesk-Regular**: Input fields, regular text

## Troubleshooting:
If fonts don't load:
1. Check that font files are in the correct folder
2. Verify font file names match exactly (case-sensitive)
3. Clear Expo cache: `npx expo start --clear`
4. If using .ttf files, update the extensions in App.js

## Note:
The app will still work without the font files - it will fall back to system fonts. But for the best experience, add the Clash Grotesk font files as described above.
