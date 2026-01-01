# The Dice 🎲

An interactive 3D dice rolling app built with React Native, TypeScript, Expo, and Three.js.

## ✨ Features

- **🎲 3D Interactive Dice** - Realistic white dice with red dots
- **👆 Touch Controls** - Drag and rotate the dice with your finger
- **🎬 Roll Animation** - Tap the button to watch the dice spin and land on a random number
- **✏️ Custom Faces** - Set custom text/values on each dice face
- **🎨 Dark Theme** - Beautiful dark UI with smooth animations
- **🔊 Sound Effects** - Dice roll sound (works on web and native)
- **📱 Cross-Platform** - Works on iOS, Android, and Web

## 🚀 Getting Started

### Prerequisites

Before running this app, make sure you have:
- Node.js (v18 or newer)
- npm or yarn
- Expo Go app installed on your phone (for physical device testing)

### Installation

First, fix npm permissions (if needed):
```bash
sudo chown -R $(whoami) ~/.npm
```

Then install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm start
```

This will open Expo Dev Tools in your browser.

## 📱 Running on Different Platforms

### 1. Physical Android Device

**Steps:**
1. Install **Expo Go** from Google Play Store on your Android device
2. Make sure your phone and computer are on the **same WiFi network**
3. Run `npm start` in your project directory
4. Scan the QR code displayed in the terminal or browser with the Expo Go app
5. The app will load on your device

**Troubleshooting:**
- If QR code doesn't work, try using tunnel mode: `npm start -- --tunnel`
- Ensure your firewall allows local network connections

### 2. iOS Simulator (macOS only)

**Prerequisites:**
- Xcode installed from the Mac App Store
- Xcode Command Line Tools: `xcode-select --install`

**Steps:**
1. Run `npm start`
2. Press `i` in the terminal (or click "Run on iOS simulator" in Expo Dev Tools)
3. The iOS Simulator will open and load your app

**Note:** First launch may take a few minutes as it builds the app.

### 3. Android Simulator

**Prerequisites:**
- Android Studio installed
- Android SDK and Android Virtual Device (AVD) set up

**Setup Android Studio:**
1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → More Actions → Virtual Device Manager
3. Create a new virtual device (recommended: Pixel 5 with API 33+)
4. Set environment variable:
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
5. Reload your shell: `source ~/.zshrc`

**Steps to Run:**
1. Start your Android emulator from Android Studio (or run `emulator -avd YOUR_AVD_NAME`)
2. Run `npm start`
3. Press `a` in the terminal (or click "Run on Android device/emulator")
4. The app will install and open on the emulator

### 4. Web Browser

**Prerequisites:**
- Any modern web browser (Chrome, Firefox, Safari, Edge)

**Steps:**
1. Run `npm start`
2. Press `w` in the terminal (or click "Run in web browser" in Expo Dev Tools)
3. Your default browser will open and load your app

**Note:** Perfect for quick testing and debugging! Some native features may not work on web.

## 📁 Project Structure

```
theDice/
├── App.tsx                       # Main application router
├── screens/
│   └── Dice/
│       ├── DicePage.tsx         # Main dice screen with UI logic
│       ├── CustomFacesModal.tsx # Modal for custom dice faces
│       └── index.ts             # Barrel export
├── components/
│   └── Dice3D.tsx               # 3D dice component with Three.js
├── assets/
│   ├── icon.png                 # App icon (replace with yours)
│   ├── splash.png               # Splash screen (replace with yours)
│   ├── dice-roll.mp3            # Dice roll sound effect
│   ├── SOUND_INFO.md            # Sound setup guide
│   └── HOW_TO_REPLACE_ASSETS.md # Asset replacement guide
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── babel.config.js              # Babel configuration
├── SETUP_GUIDE.md               # Detailed setup instructions
├── SPLASH_SCREEN_GUIDE.md       # 📸 How to add splash screen
└── PLAY_STORE_GUIDE.md          # 🚀 How to deploy to Play Store
```

## 🎮 How to Use

1. **View the Dice** - The app starts with a 3D white dice with red dots
2. **Rotate Manually** - Touch and drag to rotate the dice in any direction
3. **Roll the Dice** - Tap the "🎲 Roll Dice" button at the bottom
4. **Watch Animation** - The dice spins rapidly, then slows down to show a random number
5. **See Result** - The number is displayed below the dice in large red text
6. **Custom Faces** - Tap "Custom Faces" to set your own text on each dice face
   - Enter values for all 6 faces (1-6 characters each)
   - Tap "Save" to apply, or "reset" to restore default dots
   - Roll to see your custom values!

## 🎨 Customization

Want to customize the dice? Edit `components/Dice3D.tsx`:

- **Dice Color**: Change the base color in the material properties
- **Dot Color**: Modify the red color value (#DC2626)
- **Roll Speed**: Adjust speed values in the rolling animation
- **Dice Size**: Modify the BoxGeometry dimensions

## 📸 Adding Splash Screen & Icon

See **[SPLASH_SCREEN_GUIDE.md](./SPLASH_SCREEN_GUIDE.md)** for detailed instructions on:
- Creating custom splash screen images
- Adding app icon
- Updating `app.json` configuration
- Testing your changes

## 🚀 Deploying to Play Store

See **[PLAY_STORE_GUIDE.md](./PLAY_STORE_GUIDE.md)** for complete guide on:
- Building production APK/AAB
- Google Play Console setup
- Store listing requirements
- Screenshots and assets needed
- Submission process
- Cost breakdown ($25 one-time fee)

## 🛠️ Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

