import { DemoFilterProfile } from '../types/app';

const MAX_DIMENSION = 1280;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('სურათის ჩატვირთვა ვერ მოხერხდა'));
    img.src = src;
  });
}

export async function normalizeUploadedImage(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('ბრაუზერის გრაფიკული კონტექსტი მიუწვდომელია');
    }

    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.9);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function loadImageAsDataUrl(src: string): Promise<string> {
  const img = await loadImage(src);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('ბრაუზერის გრაფიკული კონტექსტი მიუწვდომელია');
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Applies a transparent, client-side Demo Mode visual preview on HTML5 Canvas.
 * Note: This does not simulate or fake external AI generation; it provides an
 * immediate interactive Before/After preview labeled as Demo Mode until a real
 * AI backend service is connected.
 */
export async function applyDemoVisualPreview(
  beforeDataUrl: string,
  profile: DemoFilterProfile,
  intensityPercent: number
): Promise<string> {
  const img = await loadImage(beforeDataUrl);
  const width = img.width;
  const height = img.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('გრაფიკული კონტექსტი მიუწვდომელია');
  }

  const strength = Math.max(0.2, Math.min(1, intensityPercent / 100));

  // Base image
  ctx.drawImage(img, 0, 0, width, height);

  // Create processed layer
  const fxCanvas = document.createElement('canvas');
  fxCanvas.width = width;
  fxCanvas.height = height;
  const fxCtx = fxCanvas.getContext('2d');
  if (!fxCtx) {
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  switch (profile) {
    case 'enhance_hd':
      fxCtx.filter = 'contrast(1.16) saturate(1.12) brightness(1.04)';
      fxCtx.drawImage(img, 0, 0, width, height);
      break;

    case 'portrait_studio_violet':
      fxCtx.filter = 'contrast(1.14) saturate(1.05) brightness(1.02)';
      fxCtx.drawImage(img, 0, 0, width, height);
      fxCtx.filter = 'none';
      // Subtle violet/blue studio rim atmosphere
      {
        const grad = fxCtx.createRadialGradient(
          width * 0.2,
          height * 0.25,
          width * 0.05,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.85
        );
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.24)');
        grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
        grad.addColorStop(1, 'rgba(6, 7, 11, 0.42)');
        fxCtx.globalCompositeOperation = 'screen';
        fxCtx.fillStyle = grad;
        fxCtx.fillRect(0, 0, width, height);
        fxCtx.globalCompositeOperation = 'source-over';
      }
      break;

    case 'style_cinematic_35mm':
      fxCtx.filter = 'contrast(1.18) saturate(0.92) sepia(0.16) brightness(0.97)';
      fxCtx.drawImage(img, 0, 0, width, height);
      fxCtx.filter = 'none';
      {
        const grad = fxCtx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(37, 99, 235, 0.16)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0.14)');
        fxCtx.globalCompositeOperation = 'soft-light';
        fxCtx.fillStyle = grad;
        fxCtx.fillRect(0, 0, width, height);
        fxCtx.globalCompositeOperation = 'source-over';
      }
      break;

    case 'style_monochrome_art':
      fxCtx.filter = 'grayscale(1) contrast(1.32) brightness(1.02)';
      fxCtx.drawImage(img, 0, 0, width, height);
      break;

    case 'portrait_executive':
      fxCtx.filter = 'contrast(1.1) saturate(0.95) brightness(1.06)';
      fxCtx.drawImage(img, 0, 0, width, height);
      break;

    case 'style_cobalt_noir':
      fxCtx.filter = 'contrast(1.24) saturate(1.12) brightness(0.92)';
      fxCtx.drawImage(img, 0, 0, width, height);
      fxCtx.filter = 'none';
      {
        const grad = fxCtx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(30, 64, 175, 0.28)');
        grad.addColorStop(1, 'rgba(109, 40, 217, 0.22)');
        fxCtx.globalCompositeOperation = 'overlay';
        fxCtx.fillStyle = grad;
        fxCtx.fillRect(0, 0, width, height);
        fxCtx.globalCompositeOperation = 'source-over';
      }
      break;

    case 'bg_obsidian_studio':
      fxCtx.filter = 'contrast(1.15) brightness(1.02)';
      fxCtx.drawImage(img, 0, 0, width, height);
      fxCtx.filter = 'none';
      {
        const vignette = fxCtx.createRadialGradient(
          width * 0.5,
          height * 0.44,
          Math.min(width, height) * 0.22,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.72
        );
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(6,7,11,0.78)');
        fxCtx.fillStyle = vignette;
        fxCtx.fillRect(0, 0, width, height);
      }
      break;

    case 'bg_violet_blue_rim':
      fxCtx.filter = 'contrast(1.12) saturate(1.08)';
      fxCtx.drawImage(img, 0, 0, width, height);
      fxCtx.filter = 'none';
      {
        const rim = fxCtx.createRadialGradient(
          width * 0.5,
          height * 0.45,
          Math.min(width, height) * 0.2,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.75
        );
        rim.addColorStop(0, 'rgba(0,0,0,0)');
        rim.addColorStop(0.65, 'rgba(124, 58, 237, 0.26)');
        rim.addColorStop(1, 'rgba(37, 99, 235, 0.52)');
        fxCtx.fillStyle = rim;
        fxCtx.fillRect(0, 0, width, height);
      }
      break;

    case 'bg_soft_bokeh':
      // Draw blurred background then sharp center subject mask
      fxCtx.filter = 'blur(8px) brightness(0.82)';
      fxCtx.drawImage(img, 0, 0, width, height);
      fxCtx.filter = 'none';
      {
        const sharpMaskCanvas = document.createElement('canvas');
        sharpMaskCanvas.width = width;
        sharpMaskCanvas.height = height;
        const mCtx = sharpMaskCanvas.getContext('2d');
        if (mCtx) {
          mCtx.drawImage(img, 0, 0, width, height);
          mCtx.globalCompositeOperation = 'destination-in';
          const radial = mCtx.createRadialGradient(
            width * 0.5,
            height * 0.44,
            Math.min(width, height) * 0.18,
            width * 0.5,
            height * 0.48,
            Math.min(width, height) * 0.46
          );
          radial.addColorStop(0, 'rgba(0,0,0,1)');
          radial.addColorStop(0.7, 'rgba(0,0,0,0.85)');
          radial.addColorStop(1, 'rgba(0,0,0,0)');
          mCtx.fillStyle = radial;
          mCtx.fillRect(0, 0, width, height);
          fxCtx.drawImage(sharpMaskCanvas, 0, 0);
        }
      }
      break;
  }

  // Blend processed layer according to strength
  ctx.globalAlpha = strength;
  ctx.drawImage(fxCanvas, 0, 0);
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/jpeg', 0.92);
}
