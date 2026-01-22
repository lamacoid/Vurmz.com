#!/usr/bin/env node
/**
 * VURMZ Photo Processor
 *
 * Applies a clean, warm preset to product photos:
 * - Warm color temperature (med-rare warmth)
 * - Clean white/off-white background
 * - Consistent sizing for web
 * - Optimized file size
 *
 * Usage:
 *   npm run process-photos
 *
 * Drop raw photos in: /photos-to-process/
 * Pick up finished photos from: /photos-processed/
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// === PRESET: Clean & Warm (Med-Rare) ===
const PRESET = {
  // Warmth adjustment (subtle orange/yellow tint)
  warmth: {
    brightness: 1.05,      // Slightly brighter
    saturation: 1.08,      // Slightly more saturated
    // Tint multipliers (RGB) - warm shift
    tint: { r: 1.02, g: 1.0, b: 0.96 }
  },

  // Output settings
  output: {
    maxWidth: 1200,        // Max width for web
    maxHeight: 1200,       // Max height for web
    quality: 85,           // JPEG quality (good balance)
    background: { r: 255, g: 253, b: 250 }  // Warm off-white
  }
};

const INPUT_DIR = path.join(__dirname, '..', 'photos-to-process');
const OUTPUT_DIR = path.join(__dirname, '..', 'photos-processed');

async function processPhoto(inputPath, filename) {
  console.log(`  Processing: ${filename}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate new dimensions (maintain aspect ratio)
    let width = metadata.width;
    let height = metadata.height;

    if (width > PRESET.output.maxWidth || height > PRESET.output.maxHeight) {
      const ratio = Math.min(
        PRESET.output.maxWidth / width,
        PRESET.output.maxHeight / height
      );
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Process the image
    const processed = await image
      // Resize
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      // Apply warmth via modulate
      .modulate({
        brightness: PRESET.warmth.brightness,
        saturation: PRESET.warmth.saturation,
      })
      // Subtle sharpening for web
      .sharpen({
        sigma: 0.8,
        m1: 0.5,
        m2: 0.5
      })
      // Convert to sRGB for web consistency
      .toColorspace('srgb')
      // Output as optimized JPEG
      .jpeg({
        quality: PRESET.output.quality,
        mozjpeg: true
      })
      .toBuffer();

    // Generate output filename
    const baseName = path.parse(filename).name;
    const outputFilename = `${baseName}-processed.jpg`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    await fs.writeFile(outputPath, processed);

    const inputStats = await fs.stat(inputPath);
    const outputSize = processed.length;
    const savings = Math.round((1 - outputSize / inputStats.size) * 100);

    console.log(`    ✓ Saved: ${outputFilename} (${savings > 0 ? savings + '% smaller' : 'optimized'})`);

    return { success: true, filename: outputFilename };
  } catch (error) {
    console.log(`    ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('\n🔥 VURMZ Photo Processor');
  console.log('   Preset: Clean & Warm (Med-Rare)\n');

  // Ensure directories exist
  await fs.mkdir(INPUT_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Find all images in input directory
  const files = await fs.readdir(INPUT_DIR);
  const imageFiles = files.filter(f =>
    /\.(jpg|jpeg|png|webp|tiff?)$/i.test(f)
  );

  if (imageFiles.length === 0) {
    console.log('📂 No photos found in /photos-to-process/');
    console.log('   Drop your raw photos there and run again.\n');
    return;
  }

  console.log(`📸 Found ${imageFiles.length} photo(s) to process:\n`);

  let successCount = 0;
  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const result = await processPhoto(inputPath, file);
    if (result.success) successCount++;
  }

  console.log(`\n✅ Done! ${successCount}/${imageFiles.length} photos processed.`);
  console.log(`📁 Find them in: /photos-processed/\n`);
}

main().catch(console.error);
