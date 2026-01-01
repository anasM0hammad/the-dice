#!/bin/bash

# Create a simple 1024x1024 icon with ImageMagick or Python
# For now, create placeholder files

# Icon (1024x1024) - Simple dice icon
echo "Creating placeholder icon.png..."
cat > icon.svg << 'ICONSVG'
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#1a1a2e"/>
  <rect x="312" y="312" width="400" height="400" rx="50" fill="white"/>
  <circle cx="412" cy="412" r="30" fill="#DC2626"/>
  <circle cx="512" cy="512" r="30" fill="#DC2626"/>
  <circle cx="612" cy="612" r="30" fill="#DC2626"/>
</svg>
ICONSVG

# Splash (1284x2778) - Simple centered logo
echo "Creating placeholder splash.png..."
cat > splash.svg << 'SPLASHSVG'
<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
  <rect width="1284" height="2778" fill="#1a1a2e"/>
  <rect x="442" y="1089" width="400" height="400" rx="50" fill="white"/>
  <circle cx="542" cy="1189" r="30" fill="#DC2626"/>
  <circle cx="642" cy="1289" r="30" fill="#DC2626"/>
  <circle cx="742" cy="1389" r="30" fill="#DC2626"/>
  <text x="642" y="1600" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">The Dice</text>
</svg>
SPLASHSVG

# Convert SVG to PNG if tools available
if command -v convert &> /dev/null; then
    echo "Converting to PNG with ImageMagick..."
    convert icon.svg icon.png
    convert splash.svg splash.png
    rm icon.svg splash.svg
elif command -v python3 &> /dev/null; then
    echo "Converting with Python..."
    python3 << 'PYTHONEOF'
try:
    from PIL import Image, ImageDraw
    
    # Create icon
    icon = Image.new('RGB', (1024, 1024), '#1a1a2e')
    draw = ImageDraw.Draw(icon)
    draw.rounded_rectangle([312, 312, 712, 712], radius=50, fill='white')
    draw.ellipse([382, 382, 442, 442], fill='#DC2626')
    draw.ellipse([482, 482, 542, 542], fill='#DC2626')
    draw.ellipse([582, 582, 642, 642], fill='#DC2626')
    icon.save('icon.png')
    
    # Create splash
    splash = Image.new('RGB', (1284, 2778), '#1a1a2e')
    draw = ImageDraw.Draw(splash)
    draw.rounded_rectangle([442, 1089, 842, 1489], radius=50, fill='white')
    draw.ellipse([512, 1159, 572, 1219], fill='#DC2626')
    draw.ellipse([612, 1259, 672, 1319], fill='#DC2626')
    draw.ellipse([712, 1359, 772, 1419], fill='#DC2626')
    splash.save('splash.png')
    
    print("Images created successfully!")
except ImportError:
    print("PIL not available, creating minimal PNGs...")
    # Create minimal valid PNG files
    import struct
    
    def create_minimal_png(width, height, filename):
        # Minimal 1x1 PNG
        data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x00\x00\x00\x00IEND\xaeB`\x82'
        with open(filename, 'wb') as f:
            f.write(data)
    
    create_minimal_png(1024, 1024, 'icon.png')
    create_minimal_png(1284, 2778, 'splash.png')
PYTHONEOF
    rm icon.svg splash.svg 2>/dev/null || true
else
    echo "No image tools available. Please manually create:"
    echo "  - icon.png (1024x1024)"
    echo "  - splash.png (1284x2778)"
fi

echo "Done!"
