# Play Store Deployment Guide for The Dice

## Prerequisites

### 1. Google Play Console Account
- Go to: https://play.google.com/console
- Pay one-time $25 registration fee
- Complete developer profile

### 2. Required App Information
Before building, update `app.json` with production-ready values:

```json
{
  "expo": {
    "name": "The Dice",
    "slug": "thedice",
    "version": "1.0.0",
    "android": {
      "package": "com.thedice.app",  // Must be unique
      "versionCode": 1,                // Increment for each update
      "permissions": []                 // Add any required permissions
    }
  }
}
```

---

## Build Process

### Option 1: EAS Build (Recommended)

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```

#### Step 3: Configure Build
```bash
eas build:configure
```

This creates `eas.json`. Update it if needed:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"  // or "aab" for Play Store
      }
    }
  }
}
```

#### Step 4: Build for Production
```bash
# For APK (testing)
eas build --platform android --profile production

# For AAB (Play Store submission)
eas build --platform android --profile production
```

**Note:** AAB (Android App Bundle) is required for Play Store. APK is for testing only.

#### Step 5: Download Build
- EAS will provide a download link
- Or download from: https://expo.dev/accounts/[your-account]/projects/thedice/builds

---

### Option 2: Local Build (Alternative)

```bash
# Install Expo CLI
npm install -g expo-cli

# Generate Android build
expo build:android -t app-bundle

# Follow prompts for keystore (auto-generate or upload existing)
```

---

## Play Store Submission

### 1. Prepare Store Assets

#### Required Images:
- **Icon**: 512x512 PNG (no transparency)
- **Feature Graphic**: 1024x500 PNG
- **Screenshots**: At least 2 (phone screenshots)
  - Recommended: 1080x1920 or 1440x2560
  - Take from physical device or simulator

#### Required Text:
- **App Title**: "The Dice" (max 50 chars)
- **Short Description**: max 80 chars
  - Example: "Interactive 3D dice with custom faces and realistic rolling animation"
- **Full Description**: max 4000 chars
  - Describe features, how to use, etc.
- **Privacy Policy URL**: Required if app collects data
  - Can use https://www.termsfeed.com/privacy-policy-generator/ if needed

### 2. Create Release on Play Console

1. **Go to Play Console** → Your App → Production
2. **Create Release**
3. **Upload AAB** file
4. **Fill Release Notes**:
   ```
   Initial release:
   - Interactive 3D dice roller
   - Custom face values
   - Smooth animations
   - Dice roll sound effects
   ```

### 3. Content Rating
- Complete questionnaire
- Select appropriate age rating
- For "The Dice": likely Everyone

### 4. Pricing & Distribution
- Select Free or Paid
- Choose countries/regions
- Accept developer agreement

### 5. App Categories
- Primary: **Casual** or **Entertainment**
- Tags: dice, games, 3D, roller

### 6. Submit for Review
- First review takes 3-7 days
- Future updates: 1-3 days

---

## Important Configurations

### 1. Update `app.json` Before Building

```json
{
  "expo": {
    "name": "The Dice",
    "slug": "thedice",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "android": {
      "package": "com.yourdomain.thedice",  // Change to your domain
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#1a1a2e"
      },
      "permissions": [
        // Add only if needed
      ]
    }
  }
}
```

### 2. Package Name Guidelines
- Format: `com.yourcompany.appname`
- Must be unique across Play Store
- Cannot change after first upload
- Examples:
  - `com.thedice.app`
  - `com.yourname.thedice`
  - `com.diceapp.roller`

### 3. Version Management
- **version**: User-facing (1.0.0, 1.0.1, etc.)
- **versionCode**: Integer, increment with each upload (1, 2, 3, etc.)

---

## Testing Before Submission

### Internal Testing Track
1. Create Internal Testing release first
2. Add test users (up to 100)
3. Test thoroughly
4. Then promote to Production

### APK for Manual Testing
```bash
eas build --platform android --profile preview
```
Install APK on device to test before submission.

---

## Common Issues & Solutions

### 1. Keystore Management
- EAS handles this automatically
- Or generate manually: `keytool -genkey -v -keystore my-release-key.keystore`
- **BACKUP YOUR KEYSTORE** - cannot recover if lost!

### 2. Build Fails
- Check `app.json` for errors
- Ensure all assets exist (icon.png, splash.png)
- Verify package name is unique

### 3. Review Rejection
- Common reasons:
  - Missing privacy policy (if you collect data)
  - Incomplete store listing
  - Misleading screenshots
  - Copyright issues with assets

### 4. Permissions
- Only request permissions you actually need
- For The Dice, no special permissions needed

---

## After Approval

### Updating Your App
1. Increment version numbers in `app.json`:
   ```json
   "version": "1.0.1",  // User-facing
   "versionCode": 2     // Integer
   ```
2. Build new AAB
3. Upload to Play Console → Production → New Release
4. Add release notes
5. Submit

### Monitoring
- Check crashes in Play Console
- Read user reviews
- Monitor download stats

---

## Quick Checklist

Before submission, ensure you have:
- [ ] Google Play Developer account ($25)
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] 2+ screenshots
- [ ] Short description (80 chars)
- [ ] Full description
- [ ] Privacy policy URL (if collecting data)
- [ ] Unique package name in `app.json`
- [ ] AAB file built with `eas build`
- [ ] Tested on real device

---

## Useful Links

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Play Console**: https://play.google.com/console
- **App Icon Generator**: https://www.appicon.co/
- **Privacy Policy Generator**: https://www.termsfeed.com/privacy-policy-generator/

---

## Cost Summary

- **Google Play Registration**: $25 (one-time)
- **EAS Build**: 
  - Free tier: Limited builds
  - Paid: $29/month (unlimited builds)
  - Alternative: Build locally for free
- **Total Minimum**: $25 (if using free EAS tier or local builds)

---

**Good luck with your Play Store launch! 🚀**

