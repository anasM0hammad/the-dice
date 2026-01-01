# How to Add Splash Screen Image

## Current Setup
Your app currently has a solid dark background (`#1a1a2e`) as the splash screen. To add a custom image:

---

## Step 1: Create Your Splash Screen Image

### Recommended Specifications:
- **Size**: 1284x2778 pixels (iPhone 14 Pro Max size)
- **Format**: PNG with transparency support
- **Safe Area**: Keep important content in center 1284x1284 area
- **Background**: Design should work with dark theme

### Design Tips:
- Place your logo/dice graphic in the center
- Use dark background to match app theme
- Keep it simple - users see it briefly
- Consider adding app name/tagline

### Tools to Create:
1. **Figma** (Free): https://www.figma.com
   - Create 1284x2778 artboard
   - Design your splash
   - Export as PNG

2. **Canva** (Free): https://www.canva.com
   - Custom size: 1284x2778
   - Design splash screen
   - Download as PNG

3. **Photoshop/GIMP** (If you have them)
   - New file: 1284x2778
   - Design and export

4. **Quick Option**: Use your app icon as splash
   - Take your 1024x1024 icon
   - Place on dark 1284x2778 background
   - Export

---

## Step 2: Save the Image

1. Save your splash screen as `splash.png`
2. Place it in: `/Users/anas/Desktop/Learning/Projects/theDice/assets/`
3. Replace the existing placeholder `splash.png`

---

## Step 3: Update `app.json`

Open `/Users/anas/Desktop/Learning/Projects/theDice/app.json` and update the splash configuration:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    }
  }
}
```

### Resize Mode Options:
- **`contain`**: Fits entire image (recommended) - keeps aspect ratio
- **`cover`**: Fills screen, may crop edges
- **`native`**: No scaling

---

## Step 4: Also Add App Icon

While you're at it, create an app icon too:

### Icon Specifications:
- **Size**: 1024x1024 pixels
- **Format**: PNG (no transparency for Android)
- **Content**: Should be recognizable at small sizes
- **Design**: Simple, clear, on-brand

### Save as:
- File: `icon.png`
- Location: `/Users/anas/Desktop/Learning/Projects/theDice/assets/`

### Update `app.json`:
```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#1a1a2e"
      }
    },
    "ios": {
      "icon": "./assets/icon.png"
    }
  }
}
```

---

## Step 5: Test Your Changes

### For Development (Expo Go):
```bash
cd /Users/anas/Desktop/Learning/Projects/theDice
npx expo start --clear
```

**Note**: Expo Go might not show splash properly. It's mainly visible in production builds.

### For Production Testing:
```bash
# Build preview APK to test on device
eas build --platform android --profile preview
```

---

## Complete `app.json` Example

Here's what your full `app.json` should look like:

```json
{
  "expo": {
    "name": "The Dice",
    "slug": "thedice",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.thedice.app",
      "icon": "./assets/icon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.thedice.app",
      "icon": "./assets/icon.png"
    },
    "web": {
      "favicon": "./assets/icon.png"
    }
  }
}
```

---

## Splash Screen Behavior

### When Is It Shown?
- **App Launch**: First thing users see
- **Duration**: Shows while app loads (usually 1-3 seconds)
- **Native Builds Only**: Full splash experience in production builds
- **Expo Go**: May show generic Expo splash

### Controlling Splash Duration (Optional)

If you want to manually control when the splash disappears, add this to `App.tsx`:

```typescript
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep splash visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Hide splash after app is ready
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000); // 2 second delay
  }, []);
  
  // ... rest of your app
}
```

---

## Design Ideas for Dice App

### Simple Options:
1. **Dice Icon Only**
   - White dice with red dots on dark background
   - Centered with padding

2. **Dice + App Name**
   - Dice icon on top
   - "The Dice" text below
   - Dark background

3. **3D Preview**
   - Render of your 3D dice
   - Dramatic lighting
   - Dark background

4. **Minimal**
   - Just app name in elegant font
   - Small dice icon above
   - Lots of negative space

### Color Scheme:
- Background: `#1a1a2e` (matches app)
- Dice: White (`#ffffff`)
- Dots: Red (`#dc2626`)
- Text: White or light gray

---

## Online Tools to Generate Assets

### 1. Appicon.co
- URL: https://www.appicon.co/
- Upload 1024x1024 image
- Generates all sizes for iOS/Android

### 2. MakeAppIcon
- URL: https://makeappicon.com/
- Similar to Appicon.co
- Free to use

### 3. Asset Studio (Official Google)
- URL: https://romannurik.github.io/AndroidAssetStudio/
- Android adaptive icons
- More control over output

---

## File Structure

After adding your assets, your `/assets/` folder should have:

```
/assets/
  ├── icon.png          (1024x1024 - app icon)
  ├── splash.png        (1284x2778 - splash screen)
  ├── dice-roll.mp3     (your sound file)
  └── README.md         (info about assets)
```

---

## Testing Checklist

Before finalizing:
- [ ] Splash image looks good on different screen sizes
- [ ] Background color matches app theme
- [ ] Icon is clear and recognizable
- [ ] No important content near edges (safe area)
- [ ] Text is readable (if any)
- [ ] File sizes are reasonable (<2MB each)
- [ ] Tested on physical device

---

## Quick Start (TL;DR)

1. Create `splash.png` (1284x2778) and `icon.png` (1024x1024)
2. Place both in `/assets/` folder
3. Update `app.json` to add `"image": "./assets/splash.png"` in splash section
4. Update `app.json` to add `"icon": "./assets/icon.png"` at root level
5. Run `npx expo start --clear`
6. Build production APK/AAB to see full splash experience

---

## Need Help?

- **Expo Splash Screen Docs**: https://docs.expo.dev/guides/splash-screens/
- **App Icon Guide**: https://docs.expo.dev/guides/app-icons/
- **Asset Requirements**: https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/

**You can design something simple for now and update it later before Play Store submission!**

