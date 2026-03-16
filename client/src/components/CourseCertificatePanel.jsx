import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Award, Loader2 } from 'lucide-react';

const CERTIFICATE_TEMPLATE_URL = 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773697396/Black_and_Gold_Modern_Certificate_of_Appreciation_A4_hcjxvo.png';
const CERTIFICATE_WIDTH = 2000;
const CERTIFICATE_HEIGHT = 1414;
const ALEX_BRUSH_FONT_URL = 'https://fonts.gstatic.com/s/alexbrush/v23/SZc83FzrJKuqFbwMKk6EhUXz7Q.woff2';
const GLACIAL_REGULAR_FONT_URL = 'https://fonts.cdnfonts.com/s/19355/GlacialIndifference-Regular.woff';
const GLACIAL_BOLD_FONT_URL = 'https://fonts.cdnfonts.com/s/19355/GlacialIndifference-Bold.woff';

const DEFAULT_TEXT_POSITIONS = {
  name: { x: 1000, y: 742 },
  course: { x: 1000, y: 938 },
  date: { x: 1000, y: 1118 },
};

const DEFAULT_FONT_SIZES = {
  name: 156,
  course: 66,
  date: 42,
};

const DRAGGABLE_FIELDS = ['name', 'course', 'date'];

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [textPositions, setTextPositions] = useState(DEFAULT_TEXT_POSITIONS);
  const [fontSizes, setFontSizes] = useState(DEFAULT_FONT_SIZES);
  const [draggingField, setDraggingField] = useState(null);
  const [previewScale, setPreviewScale] = useState(1);

  const previewStageRef = useRef(null);

  const certificateDate = useMemo(() => formatCertificateDate(completedAt), [completedAt]);
  const certificateDateLabel = useMemo(() => `at ${certificateDate}`, [certificateDate]);

  const renderCertificateDataUrl = useCallback(async (positions, sizes) => {
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
      centerX: positions.name.x,
      centerY: positions.name.y,
      maxWidth: 1180,
      maxLines: 1,
      startSize: sizes.name,
      minSize: Math.max(48, Math.floor(sizes.name * 0.55)),
      family: 'Alex Brush',
      weight: '400',
      color: '#17110d',
      lineHeight: 1.05,
    });
    context.restore();

    drawCenteredTextBlock(context, courseName, {
      centerX: positions.course.x,
      centerY: positions.course.y,
      maxWidth: 1120,
      maxLines: 2,
      startSize: sizes.course,
      minSize: Math.max(24, Math.floor(sizes.course * 0.58)),
      family: 'Glacial Indifference Bold',
      weight: '700',
      color: '#24201a',
      lineHeight: 1.15,
    });

    drawCenteredTextBlock(context, certificateDateLabel, {
      centerX: positions.date.x,
      centerY: positions.date.y,
      maxWidth: 560,
      maxLines: 1,
      startSize: sizes.date,
      minSize: Math.max(18, Math.floor(sizes.date * 0.6)),
      family: 'Glacial Indifference',
      weight: '400',
      color: '#3b342c',
      lineHeight: 1,
    });

    return canvas.toDataURL('image/png');
  }, [certificateDateLabel, courseName, userName]);

  const updateDraggedPosition = useCallback((clientX, clientY) => {
    if (!draggingField || !previewStageRef.current) return;
    const rect = previewStageRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const xPx = ((clientX - rect.left) / rect.width) * CERTIFICATE_WIDTH;
    const yPx = ((clientY - rect.top) / rect.height) * CERTIFICATE_HEIGHT;

    const clampedX = Math.max(0, Math.min(CERTIFICATE_WIDTH, xPx));
    const clampedY = Math.max(0, Math.min(CERTIFICATE_HEIGHT, yPx));

    setTextPositions((prev) => ({
      ...prev,
      [draggingField]: { x: clampedX, y: clampedY },
    }));
  }, [draggingField]);

  useEffect(() => {
    if (!draggingField) return undefined;

    const onPointerMove = (event) => {
      updateDraggedPosition(event.clientX, event.clientY);
    };

    const onPointerUp = () => {
      setDraggingField(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [draggingField, updateDraggedPosition]);

  useEffect(() => {
    if (!isPreviewOpen || !previewStageRef.current) return undefined;

    const updateScale = () => {
      const stageWidth = previewStageRef.current?.clientWidth || CERTIFICATE_WIDTH;
      setPreviewScale(stageWidth / CERTIFICATE_WIDTH);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    observer.observe(previewStageRef.current);

    return () => observer.disconnect();
  }, [isPreviewOpen]);

  const onDragStart = useCallback((field, event) => {
    event.preventDefault();
    setDraggingField(field);
  }, []);

  const resetPlacement = useCallback(() => {
    setTextPositions(DEFAULT_TEXT_POSITIONS);
    setFontSizes(DEFAULT_FONT_SIZES);
  }, []);

  const setFontSize = useCallback((field, value) => {
    const nextValue = Number(value);
    setFontSizes((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  }, []);

  const openPreview = useCallback(async () => {
    await ensureCertificateFontsLoaded();
    setIsPreviewOpen(true);
  }, []);

  const downloadCertificate = useCallback(async () => {
    if (!userName || !courseName || isGenerating) return;

    setIsGenerating(true);
    try {
      const dataUrl = await renderCertificateDataUrl(textPositions, fontSizes);

      const link = document.createElement('a');
      link.href = dataUrl;
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
  }, [courseName, fontSizes, isGenerating, renderCertificateDataUrl, textPositions, userName]);

  if (!isVisible || !userName || !courseName) {
    return null;
  }

  const normalizedPosition = (field) => ({
    left: `${(textPositions[field].x / CERTIFICATE_WIDTH) * 100}%`,
    top: `${(textPositions[field].y / CERTIFICATE_HEIGHT) * 100}%`,
  });

  return (
    <>
    <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-white">Course completed</span>
          </div>
          <p className="text-xs text-gray-400">
            Open preview, drag name/course/date to where you want, then download the final certificate.
          </p>
        </div>

        <button
          onClick={openPreview}
          className="shrink-0 px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-[#17110d] hover:shadow-xl hover:shadow-amber-500/20"
        >
          <><Award size={16} /> Preview Certificate</>
        </button>
      </div>
    </div>

    {isPreviewOpen && (
      <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-[#1e3a42]/60 bg-[#071015]/95 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-white text-lg font-bold">Certificate Preview</h3>
                <p className="text-xs text-gray-400">Drag text labels and adjust each font size, then download.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetPlacement}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                >
                  Reset Positions
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white hover:bg-white/15 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <label className="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span>Name Size</span>
                  <span className="font-semibold text-cyan-300">{fontSizes.name}px</span>
                </label>
                <input
                  type="range"
                  min="88"
                  max="220"
                  step="1"
                  value={fontSizes.name}
                  onChange={(event) => setFontSize('name', event.target.value)}
                  className="w-full"
                />
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <label className="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span>Course Size</span>
                  <span className="font-semibold text-indigo-300">{fontSizes.course}px</span>
                </label>
                <input
                  type="range"
                  min="32"
                  max="110"
                  step="1"
                  value={fontSizes.course}
                  onChange={(event) => setFontSize('course', event.target.value)}
                  className="w-full"
                />
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <label className="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span>Date Size</span>
                  <span className="font-semibold text-emerald-300">{fontSizes.date}px</span>
                </label>
                <input
                  type="range"
                  min="22"
                  max="72"
                  step="1"
                  value={fontSizes.date}
                  onChange={(event) => setFontSize('date', event.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#1e3a42]/40 overflow-hidden bg-black/40">
              <div ref={previewStageRef} className="relative w-full select-none touch-none">
                <img
                  src={CERTIFICATE_TEMPLATE_URL}
                  alt="Certificate template preview"
                  className="w-full h-auto block"
                  draggable={false}
                />

                <div
                  style={normalizedPosition('name')}
                  onPointerDown={(event) => onDragStart('name', event)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                >
                  <p className="text-[#17110d] text-center whitespace-nowrap" style={{ fontFamily: 'Alex Brush, cursive', fontSize: `${fontSizes.name * previewScale}px`, lineHeight: 1.05 }}>
                    {userName}
                  </p>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cyan-500/90 text-[10px] font-bold text-white uppercase tracking-wide">Name</span>
                </div>

                <div
                  style={normalizedPosition('course')}
                  onPointerDown={(event) => onDragStart('course', event)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing max-w-[70%]"
                >
                  <p className="text-[#24201a] text-center leading-tight" style={{ fontFamily: 'Glacial Indifference Bold, Glacial Indifference, sans-serif', fontWeight: 700, fontSize: `${fontSizes.course * previewScale}px` }}>
                    {courseName}
                  </p>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-indigo-500/90 text-[10px] font-bold text-white uppercase tracking-wide">Course</span>
                </div>

                <div
                  style={normalizedPosition('date')}
                  onPointerDown={(event) => onDragStart('date', event)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                >
                  <p className="text-[#3b342c] text-center whitespace-nowrap" style={{ fontFamily: 'Glacial Indifference, sans-serif', fontSize: `${fontSizes.date * previewScale}px` }}>
                    {certificateDateLabel}
                  </p>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-500/90 text-[10px] font-bold text-white uppercase tracking-wide">Date</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                Drag handles are enabled for: {DRAGGABLE_FIELDS.join(', ')}.
              </p>
              <button
                onClick={downloadCertificate}
                disabled={isGenerating}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${isGenerating ? 'bg-gray-600 text-white cursor-wait' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-[#17110d] hover:shadow-xl hover:shadow-amber-500/20'}`}
              >
                {isGenerating ? (
                  <><Loader2 size={16} className="animate-spin" /> Generating...</>
                ) : (
                  <><Award size={16} /> Download With Current Placement</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
