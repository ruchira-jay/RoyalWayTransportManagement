# RoyalWay Mobile App - Logo Setup Guide

## Current Configuration

I've updated the `app.json` file to use your `logo.png` for:
- **App Icon** (home screen icon)
- **Splash Screen** (loading screen)
- **Adaptive Icon** (Android)
- **Favicon** (web)

## Changes Made

### app.json Updates:
- ✅ App name changed from "MobileApp" to "RoyalWay"
- ✅ Slug changed to "royalway"
- ✅ Icon set to `./assets/logo.png`
- ✅ Splash screen image set to `./assets/logo.png`
- ✅ Splash screen background color set to `#023e8a` (RoyalWay blue)
- ✅ Android adaptive icon set to `./assets/logo.png`
- ✅ Android adaptive icon background set to `#023e8a`
- ✅ Added bundle identifiers for iOS and Android

## Image Requirements

For best results, your logo images should meet these specifications:

### 1. App Icon (`icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Content**: Logo should be centered with padding
- **Background**: Transparent (background color will be applied)

### 2. Splash Screen (`splash.png`)
- **Size**: 1284x2778 pixels (or any 9:19.5 ratio)
- **Format**: PNG
- **Content**: Logo centered
- **Background**: Can be transparent (will use #023e8a blue)

### 3. Adaptive Icon (Android) (`adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Content**: Logo in center 66% of the image (safe zone)
- **Note**: Outer 33% may be cropped on some devices

## Current Setup

Your current `logo.png` is already in `/MobileApp/assets/logo.png` and is now configured for:
- App icon
- Splash screen
- Adaptive icon

## How to Test

### 1. Clear Expo Cache
```bash
cd /Users/admin/RoyalWay/MobileApp
npx expo start -c
```

### 2. Rebuild the App
If you're using Expo Go:
```bash
npx expo start
```

If you're building standalone:
```bash
# For Android
eas build --platform android

# For iOS
eas build --platform ios
```

### 3. View Splash Screen
- The splash screen will appear when you first open the app
- Background color: RoyalWay blue (#023e8a)
- Logo will be centered

### 4. View App Icon
- Check your device's home screen
- The logo will appear as the app icon

## Optional: Create Optimized Images

If you want to create separate optimized images for different purposes:

### Option 1: Use Online Tools
1. **App Icon Generator**: https://www.appicon.co/
   - Upload your logo
   - Download all sizes
   - Replace `assets/icon.png` with the 1024x1024 version

2. **Splash Screen Generator**: https://www.appicon.co/
   - Upload your logo
   - Set background color to #023e8a
   - Download splash screen
   - Replace `assets/splash.png`

### Option 2: Use Expo's Asset Generator
```bash
# Install expo-asset
npm install -g sharp-cli

# Generate icons (if you have a high-res logo)
npx expo-optimize
```

### Option 3: Manual Creation with Image Editor
Using Photoshop, GIMP, or Figma:

**For App Icon:**
1. Create 1024x1024 canvas
2. Fill with transparent background
3. Place logo in center (leave 10% padding on all sides)
4. Export as PNG

**For Splash Screen:**
1. Create 1284x2778 canvas
2. Fill with #023e8a (RoyalWay blue)
3. Place logo in center (recommended size: 400x400)
4. Export as PNG

**For Adaptive Icon:**
1. Create 1024x1024 canvas
2. Draw a circle with 512px radius from center (safe zone)
3. Place logo within this circle
4. Export as PNG with transparency

## Troubleshooting

### Logo Not Showing
1. Clear Expo cache: `npx expo start -c`
2. Restart the app completely
3. Check that `logo.png` exists in `/MobileApp/assets/`
4. Verify file permissions

### Logo Appears Stretched
- Check that your logo.png has a 1:1 aspect ratio
- Use `resizeMode: "contain"` in app.json (already set)

### Splash Screen Background Wrong Color
- Verify `backgroundColor: "#023e8a"` in app.json
- Clear cache and restart

### Android Icon Looks Cropped
- Ensure logo is within the center 66% of the image
- Add more padding around the logo
- Use the adaptive icon safe zone guide

## Current File Structure

```
/MobileApp/assets/
├── logo.png              ← Your main logo (used for everything)
├── icon.png              ← (Optional) Separate app icon
├── splash-icon.png       ← (Optional) Separate splash screen
├── adaptive-icon.png     ← (Optional) Separate Android icon
└── favicon.png           ← (Optional) Separate web favicon
```

## Recommended Next Steps

1. **Test the current setup** - Run the app and see how it looks
2. **If logo looks good** - You're done! ✅
3. **If adjustments needed** - Create optimized versions using the guides above
4. **For production** - Consider creating separate optimized images for each purpose

## Production Checklist

Before publishing to app stores:

- [ ] App icon is 1024x1024 PNG
- [ ] Splash screen looks good on different screen sizes
- [ ] Logo is clearly visible on both light and dark backgrounds
- [ ] Android adaptive icon works with different shapes (circle, square, rounded)
- [ ] iOS icon has no transparency (if required by App Store)
- [ ] All images are optimized (compressed but high quality)
- [ ] Test on multiple devices (iOS and Android)

## Support

If you need help with image creation or optimization:
1. Use online tools like appicon.co or makeappicon.com
2. Hire a designer on Fiverr or Upwork
3. Use Canva templates for app icons and splash screens

---

**Current Status**: ✅ Logo configured and ready to use!

**Next Step**: Run `npx expo start -c` to see your changes!
