#!/bin/bash

# Make sure the directories exist
mkdir -p public/icons

echo "Creating app icons for your PWA..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first."
    exit 1
fi

# Determine which command to use (magick for IMv7, convert for older versions)
CONVERT_CMD="convert"
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
    echo "Using ImageMagick v7 with 'magick' command"
else
    echo "Using ImageMagick with 'convert' command"
fi

# Check if the source icon exists
SOURCE_ICON="./src/assets/icon.png"
if [ ! -f "$SOURCE_ICON" ]; then
    echo "Error: Source icon not found at $SOURCE_ICON"
    echo "Please create a source icon at this location before running this script."
    exit 1
fi

echo "Generating icons from $SOURCE_ICON..."

# Generate PWA icons
$CONVERT_CMD "$SOURCE_ICON" -resize 72x72 public/icons/icon-72x72.png
$CONVERT_CMD "$SOURCE_ICON" -resize 96x96 public/icons/icon-96x96.png
$CONVERT_CMD "$SOURCE_ICON" -resize 128x128 public/icons/icon-128x128.png
$CONVERT_CMD "$SOURCE_ICON" -resize 144x144 public/icons/icon-144x144.png
$CONVERT_CMD "$SOURCE_ICON" -resize 152x152 public/icons/icon-152x152.png
$CONVERT_CMD "$SOURCE_ICON"pwd -resize 192x192 public/icons/icon-192x192.png
$CONVERT_CMD "$SOURCE_ICON" -resize 384x384 public/icons/icon-384x384.png
$CONVERT_CMD "$SOURCE_ICON" -resize 512x512 public/icons/icon-512x512.png

# Generate Apple Touch icons
$CONVERT_CMD "$SOURCE_ICON" -resize 180x180 public/icons/apple-icon-180.png

# Generate Apple splash screens
$CONVERT_CMD "$SOURCE_ICON" -resize 2048x2732 -gravity center -extent 2048x2732 public/icons/apple-splash-2048-2732.png
$CONVERT_CMD "$SOURCE_ICON" -resize 1668x2388 -gravity center -extent 1668x2388 public/icons/apple-splash-1668-2388.png
$CONVERT_CMD "$SOURCE_ICON" -resize 1536x2048 -gravity center -extent 1536x2048 public/icons/apple-splash-1536-2048.png
$CONVERT_CMD "$SOURCE_ICON" -resize 1125x2436 -gravity center -extent 1125x2436 public/icons/apple-splash-1125-2436.png
$CONVERT_CMD "$SOURCE_ICON" -resize 1242x2688 -gravity center -extent 1242x2688 public/icons/apple-splash-1242-2688.png
$CONVERT_CMD "$SOURCE_ICON" -resize 750x1334 -gravity center -extent 750x1334 public/icons/apple-splash-750-1334.png
$CONVERT_CMD "$SOURCE_ICON" -resize 640x1136 -gravity center -extent 640x1136 public/icons/apple-splash-640-1136.png

echo "Icons generated successfully!"
