# Fix Splash Screen Blue Background

## Problem
The splash screen background is not showing the RoyalWay blue (#023e8a) color.

## Solution Options

### Option 1: Clear Cache and Rebuild (Quickest)

Run these commands:

```bash
cd /Users/admin/RoyalWay/MobileApp

# Clear all caches
rm -rf .expo
rm -rf node_modules/.cache

# Clear Metro bundler cache
npx expo start -c

# Or use this command
npx expo start --clear
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR code with Expo Go app

### Option 2: Create Custom Splash Screen with Blue Background

If Option 1 doesn't work, create a custom splash screen image:

#### Using Online Tool (Easiest):
1. Go to https://www.appicon.co/
2. Upload your logo.png
3. Set background color to `#023e8a`
4. Download the splash screen
5. Save it as `/MobileApp/assets/splash.png`
6. Update app.json to use `./assets/splash.png` instead of `./assets/logo.png`

#### Using Image Editor (Photoshop/GIMP/Figma):
1. Create new image: 1284 x 2778 pixels
2. Fill background with #023e8a (RGB: 2, 62, 138)
3. Place your logo in the center (recommended size: 400x400 pixels)
4. Export as PNG
5. Save as `/MobileApp/assets/splash.png`

### Option 3: Use Expo's Built-in Splash Screen Generator

```bash
cd /Users/admin/RoyalWay/MobileApp

# Install dependencies if needed
npm install

# Generate splash screen
npx expo prebuild --clean
```

## Verify Configuration

Your current app.json should have:

```json
"splash": {
  "image": "./assets/logo.png",
  "resizeMode": "contain",
  "backgroundColor": "#023e8a"
}
```

This is correct! ✅

## Why It Might Not Be Working

1. **Cache Issue**: Expo caches the splash screen. Clear it with `-c` flag
2. **Development Mode**: In development, splash screen shows briefly. Build the app to see it properly
3. **Image Format**: If logo.png has a white background, it will cover the blue
4. **Platform Specific**: iOS and Android handle splash screens differently

## Recommended Solution

### Step 1: Ensure logo.png has transparent background
Check if your logo.png has transparency. If it has a white background, the blue won't show.

### Step 2: Clear cache and restart
```bash
cd /Users/admin/RoyalWay/MobileApp
npx expo start -c
```

### Step 3: If still not working, create dedicated splash image
Create a new file `splash.png` with blue background and logo centered.

Then update app.json:
```json
"splash": {
  "image": "./assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#023e8a"
}
```

## Quick Test

To quickly test if the color is working:

1. Change backgroundColor to a very different color like "#FF0000" (red)
2. Clear cache: `npx expo start -c`
3. Restart app
4. If you see red, the config works! Change back to "#023e8a"
5. If you still don't see red, there's a deeper issue

## Alternative: Use expo-splash-screen package

If nothing works, you can programmatically control the splash screen:

```javascript
// In App.js, modify the splash screen configuration
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

// Set background color programmatically (if supported)
// This is already in your App.js
```

## Final Solution: Create Proper Splash Image

I recommend creating a proper splash screen image with the blue background baked in:

**Dimensions**: 1284 x 2778 pixels (iPhone 14 Pro Max)
**Background**: Solid #023e8a blue
**Logo**: Centered, white or light colored, ~400x400 pixels

This ensures the blue background always shows, regardless of platform or cache issues.

---

**Try Option 1 first** (clear cache), then Option 2 if needed (create custom splash image).
