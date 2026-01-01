# 🚀 Setup Guide for The Dice

## Step 1: Fix npm Permissions (Important!)

Before installing dependencies, you need to fix npm permissions on your system:

```bash
sudo chown -R $(whoami) ~/.npm
```

This will give your user account ownership of the npm cache folder.

## Step 2: Install Dependencies

```bash
cd /Users/anas/Desktop/Learning/Projects/theDice
npm install
```

This will install all the packages listed in `package.json`:
- **expo**: The framework that makes React Native development easier
- **react** & **react-native**: The core libraries for mobile
- **react-dom** & **react-native-web**: For web browser support
- **expo-status-bar**: Component to control the status bar
- **TypeScript**: For type-safe code
- **@types/react**: TypeScript definitions for React

## Step 3: Start the Development Server

```bash
npm start
```

This will:
1. Start the Metro bundler (JavaScript bundler for React Native)
2. Open Expo Dev Tools in your browser
3. Show a QR code you can scan

---

## 📱 Running on Physical Android Device

### What You Need:
- Android phone with USB debugging enabled (optional) or on same WiFi
- Expo Go app from Google Play Store

### Steps:
1. Install **Expo Go** from Google Play Store
2. Make sure your phone and computer are on the **same WiFi network**
3. Run `npm start` in your terminal
4. Open Expo Go app on your phone
5. Tap "Scan QR code" and scan the code from your terminal/browser

### Alternative (USB Connection):
If WiFi doesn't work, use tunnel mode:
```bash
npm start -- --tunnel
```

---

## 🍎 Running on iOS Simulator (Mac Only)

### What You Need:
- macOS computer
- Xcode (free from Mac App Store)
- Xcode Command Line Tools

### One-Time Setup:
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Open Xcode at least once to accept the license
# (search for Xcode in Spotlight)
```

### Steps to Run:
1. Run `npm start`
2. Press `i` in the terminal
3. Wait for iOS Simulator to open (may take 1-2 minutes first time)
4. Your app will load automatically

---

## 🤖 Running on Android Simulator

### What You Need:
- Android Studio (free download)
- Android SDK
- Android Virtual Device (AVD)

### One-Time Setup:

#### 1. Install Android Studio
- Download from [developer.android.com/studio](https://developer.android.com/studio)
- Run the installer and follow the setup wizard
- Install the Android SDK when prompted

#### 2. Create a Virtual Device
1. Open Android Studio
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Choose "Pixel 5" or similar → Next
5. Select a system image (API 33 or higher) → Download if needed → Next
6. Click "Finish"

#### 3. Set Up Environment Variables
Add these to your `~/.zshrc` file:

```bash
# Open the file
nano ~/.zshrc

# Add these lines at the end:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Save (Ctrl+O, Enter) and exit (Ctrl+X)

# Reload your shell
source ~/.zshrc
```

#### 4. Verify Installation
```bash
# Check if adb is accessible
adb version

# List available emulators
emulator -list-avds
```

### Steps to Run:
1. Open Android Studio → Virtual Device Manager → Click ▶️ on your device
2. Wait for emulator to fully boot (shows home screen)
3. In your project terminal: `npm start`
4. Press `a` in the terminal
5. App will install and launch on the emulator

---

## 🌐 Running on Web Browser

### What You Need:
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional setup required!

### Steps to Run:
1. Run `npm start` in your terminal
2. Press `w` in the terminal (or click "Run in web browser" in Expo Dev Tools)
3. Your default browser will open and load the app

### Features:
- **Instant Updates**: Changes appear immediately without page refresh
- **Developer Tools**: Use browser DevTools (F12) for debugging
- **Cross-Platform Testing**: Test your app's web version easily

### Note:
- Some React Native features may not work on web (camera, certain native modules)
- Great for testing UI and logic that doesn't require native APIs
- Perfect for building Progressive Web Apps (PWAs)

---

## 🐛 Troubleshooting

### "Metro bundler can't listen on port 8081"
Port is already in use. Kill the process:
```bash
lsof -ti:8081 | xargs kill -9
```

### "Unable to resolve module"
Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### Android emulator not detected
Make sure:
- Emulator is fully booted (can see home screen)
- `adb devices` shows your emulator
- If not, restart adb: `adb kill-server && adb start-server`

### QR code not working on physical device
Try tunnel mode:
```bash
npm start -- --tunnel
```

---

## 📚 Next Steps

Once you have the app running, you can:

1. **Edit `App.tsx`** - Make changes and see them live reload!
2. **Learn React Native basics** - https://reactnative.dev/docs/getting-started
3. **Explore Expo docs** - https://docs.expo.dev/
4. **Add more screens** - Learn React Navigation
5. **Build your dice app!** 🎲

---

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS |
| `npm run web` | Open on Web Browser |
| Press `a` | Run on Android |
| Press `i` | Run on iOS |
| Press `w` | Run on Web |
| Press `r` | Reload app |
| Press `m` | Toggle menu |
| Press `j` | Open debugger |

Happy coding! 🚀

