import { useCallback, useState } from 'react';
import { Award, Loader2 } from 'lucide-react';

const CERTIFICATE_TEMPLATE_URL = 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773697396/Black_and_Gold_Modern_Certificate_of_Appreciation_A4_hcjxvo.png';
const CERTIFICATE_WIDTH = 2000;
const CERTIFICATE_HEIGHT = 1414;
const ALEX_BRUSH_FONT_URL = 'https://fonts.gstatic.com/s/alexbrush/v23/SZc83FzrJKuqFbwMKk6EhUXz7Q.woff2';
const GLACIAL_REGULAR_FONT_URL = 'https://fonts.cdnfonts.com/s/19355/GlacialIndifference-Regular.woff';
const GLACIAL_BOLD_FONT_URL = 'https://fonts.cdnfonts.com/s/19355/GlacialIndifference-Bold.woff';

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function ensureCertificateFontsLoaded() {
  if (typeof document === 'undefined' || !document.fonts) return;

  const fontDefs = [
    ['Alex Brush', ALEX_BRUSH_FONT_URL],
    ['Glacial Indifference', GLACIAL_REGULAR_FONT_URL],
    ['Glacial Indifference Bold', GLACIAL_BOLD_FONT_URL],
  ];

  await Promise.allSettled(fontDefs.map(async ([family, url]) => {
    const alreadyLoaded = Array.from(document.fonts).some((font) => font.family.replace(/['"]/g, '') === family);
    if (alreadyLoaded) return;
    const face = new FontFace(family, `url(${url})`);
    await face.load();
    document.fonts.add(face);
  }));

  await document.fonts.ready;
}

function sanitizeFileName(value) {
  return (value || 'certificate')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function formatCertificateDate(dateValue) {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function wrapLines(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (!words.length) return [''];

  const lines = [];
  let current = words[0];
  for (let index = 1; index < words.length; index += 1) {
    const next = `${current} ${words[index]}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[index];
    }
  }
  lines.push(current);
  return lines;
}

function fitWrappedText(ctx, text, options) {
  const {
    maxWidth,
    maxLines = 1,
    startSize,
    minSize,
    family,
    weight = '400',
  } = options;

  let fontSize = startSize;
  let lines = [];

  while (fontSize >= minSize) {
    ctx.font = `${weight} ${fontSize}px "${family}"`;
    lines = wrapLines(ctx, text, maxWidth);
    if (lines.length <= maxLines && lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
      return { fontSize, lines };
    }
    fontSize -= 4;
  }

  ctx.font = `${weight} ${minSize}px "${family}"`;
  lines = wrapLines(ctx, text, maxWidth).slice(0, maxLines);
  return { fontSize: minSize, lines };
}

function drawCenteredTextBlock(ctx, text, options) {
  const {
    centerX,
    centerY,
    maxWidth,
    maxLines,
    startSize,
    minSize,
    family,
    weight = '400',
    color = '#17110d',
    lineHeight = 1.2,
  } = options;

  const { fontSize, lines } = fitWrappedText(ctx, text, { maxWidth, maxLines, startSize, minSize, family, weight });
  const lineStep = fontSize * lineHeight;
  const firstLineY = centerY - ((lines.length - 1) * lineStep) / 2;

  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${fontSize}px "${family}"`;

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, firstLineY + (index * lineStep));
  });
}

export default function CourseCertificatePanel({ isVisible, userName, courseName, completedAt }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCertificate = useCallback(async () => {
    if (!userName || !courseName || isGenerating) return;

    setIsGenerating(true);
    try {
      await ensureCertificateFontsLoaded();
      const template = await loadImage(CERTIFICATE_TEMPLATE_URL);
      const canvas = document.createElement('canvas');
      canvas.width = CERTIFICATE_WIDTH;
      canvas.height = CERTIFICATE_HEIGHT;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas is not supported in this browser.');
      }

      context.drawImage(template, 0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

      context.save();
      context.shadowColor = 'rgba(0, 0, 0, 0.08)';
      context.shadowBlur = 18;
      context.shadowOffsetY = 4;
      drawCenteredTextBlock(context, userName, {
        centerX: 1000,
        centerY: 742,
        maxWidth: 1180,
        maxLines: 1,
        startSize: 156,
        minSize: 88,
        family: 'Alex Brush',
        weight: '400',
        color: '#17110d',
        lineHeight: 1.05,
      });
      context.restore();

      drawCenteredTextBlock(context, courseName, {
        centerX: 1000,
        centerY: 938,
        maxWidth: 1120,
        maxLines: 2,
        startSize: 66,
        minSize: 38,
        family: 'Glacial Indifference Bold',
        weight: '700',
        color: '#24201a',
        lineHeight: 1.15,
      });

      drawCenteredTextBlock(context, formatCertificateDate(completedAt), {
        centerX: 1000,
        centerY: 1118,
        maxWidth: 560,
        maxLines: 1,
        startSize: 42,
        minSize: 30,
        family: 'Glacial Indifference',
        weight: '400',
        color: '#3b342c',
        lineHeight: 1,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${sanitizeFileName(userName)}-${sanitizeFileName(courseName)}-certificate.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Certificate generation failed:', err);
      window.alert('Unable to generate certificate right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [completedAt, courseName, isGenerating, userName]);

  if (!isVisible || !userName || !courseName) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-white">Course completed</span>
          </div>
          <p className="text-xs text-gray-400">
            Your certificate will include {userName}, {courseName}, and the completion date {formatCertificateDate(completedAt)}.
          </p>
        </div>

        <button
          onClick={downloadCertificate}
          disabled={isGenerating}
          className={`shrink-0 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${isGenerating ? 'bg-gray-600 text-white cursor-wait' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-[#17110d] hover:shadow-xl hover:shadow-amber-500/20'}`}
        >
          {isGenerating ? (
            <><Loader2 size={16} className="animate-spin" /> Generating...</>
          ) : (
            <><Award size={16} /> Download Certificate</>
          )}
        </button>
      </div>
    </div>
  );
}
