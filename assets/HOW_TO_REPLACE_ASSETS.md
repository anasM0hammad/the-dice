# How to Create Your Custom Splash Screen & Icon

##Quick Way (Online Tools):

1. **Use Figma or Canva**:
   - Create a 1024x1024 design for icon
   - Create a 1284x2778 design for splash
   - Export as PNG

2. **Or use this online tool**:
   - Go to: https://www.appicon.co/
   - Upload your design
   - Download all sizes

3. **Replace the files**:
   - Save as `icon.png` (1024x1024)
   - Save as `splash.png` (1284x2778)
   - Place in `/assets/` folder

## Current Setup:
- Background color: `#1a1a2e` (dark theme)
- The splash will show while your app loads
- The icon appears on home screen

## After Replacing:
Run `npx expo start --clear` to see changes

## For Production Build:
Expo will automatically generate all required sizes from these master images!

