#!/usr/bin/env node
import sharp from 'sharp';

const input = process.argv[2];
const output = process.argv[3] || input.replace('.png', '-clean.png');

const image = sharp(input);
const { width, height } = await image.metadata();
const { data } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });

// Sample background color from corners (average of 20x20 corner patches)
function sampleCorner(x0, y0, size) {
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      const idx = ((y0 + dy) * width + (x0 + dx)) * 4;
      rSum += data[idx]; gSum += data[idx + 1]; bSum += data[idx + 2];
      count++;
    }
  }
  return [rSum / count, gSum / count, bSum / count];
}

const corners = [
  sampleCorner(0, 0, 20),
  sampleCorner(width - 20, 0, 20),
  sampleCorner(0, height - 20, 20),
  sampleCorner(width - 20, height - 20, 20),
];

const bgR = corners.reduce((s, c) => s + c[0], 0) / 4;
const bgG = corners.reduce((s, c) => s + c[1], 0) / 4;
const bgB = corners.reduce((s, c) => s + c[2], 0) / 4;

console.log(`Background color: rgb(${Math.round(bgR)}, ${Math.round(bgG)}, ${Math.round(bgB)})`);

// Pass 0: Clear edge margins (remove border artifacts)
const margin = 40;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (x < margin || x >= width - margin || y < margin || y >= height - margin) {
      data[(y * width + x) * 4 + 3] = 0;
    }
  }
}

// Pass 1: Remove pixels similar to background color (within distance threshold)
const threshold = 80;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
  if (dist < threshold) {
    data[i + 3] = 0;
  }
}

// Pass 2: Remove isolated opaque pixels (noise)
const alpha = new Uint8Array(width * height);
for (let i = 0; i < alpha.length; i++) {
  alpha[i] = data[i * 4 + 3];
}

const radius = 4;
for (let y = radius; y < height - radius; y++) {
  for (let x = radius; x < width - radius; x++) {
    const idx = y * width + x;
    if (alpha[idx] === 0) continue;

    let opaqueCount = 0, totalCount = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        totalCount++;
        if (alpha[(y + dy) * width + (x + dx)] > 0) opaqueCount++;
      }
    }

    if (opaqueCount / totalCount < 0.55) {
      data[idx * 4 + 3] = 0;
    }
  }
}

// Pass 3: Erode 1px border
const alpha2 = new Uint8Array(width * height);
for (let i = 0; i < alpha2.length; i++) {
  alpha2[i] = data[i * 4 + 3];
}

for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const idx = y * width + x;
    if (alpha2[idx] === 0) continue;
    if (alpha2[idx - 1] === 0 || alpha2[idx + 1] === 0 ||
        alpha2[idx - width] === 0 || alpha2[idx + width] === 0) {
      data[idx * 4 + 3] = 0;
    }
  }
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .toFile(output);

console.log(`Done: ${output} (${width}x${height})`);
