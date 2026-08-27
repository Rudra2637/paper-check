/**
 * Document Processing Utility
 * Converts uploaded PDF documents and image files into optimized
 * page images (base64 data URLs) with width/height metadata.
 * Optimizes image dimensions to stay comfortably within Groq Vision TPM limits.
 */

let pdfjsLib = null;

async function getPdfJs() {
  if (typeof window === 'undefined') return null;
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist/build/pdf.min.mjs');
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
    }
  }
  return pdfjsLib;
}

/**
 * Resizes and compresses an image canvas to keep token counts small while preserving text clarity
 */
function compressAndResizeImage(img, maxDimension = 1024) {
  const canvas = document.createElement('canvas');
  let width = img.naturalWidth || img.width || 1000;
  let height = img.naturalHeight || img.height || 1400;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.80),
    width,
    height,
  };
}

/**
 * Reads an image file and returns it as an optimized base64 Data URL with dimensions
 * @param {File} file 
 * @returns {Promise<{ pageNumber: number, dataUrl: string, width: number, height: number }>}
 */
export async function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const originalDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const optimized = compressAndResizeImage(img, 1024);
        resolve({
          pageNumber: 1,
          dataUrl: optimized.dataUrl,
          width: optimized.width,
          height: optimized.height,
        });
      };
      img.onerror = reject;
      img.src = originalDataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a multi-page PDF into an array of optimized canvas page images
 * @param {File | ArrayBuffer} fileOrBuffer 
 * @param {function(number, number): void} [onProgress] - Callback (currentPage, totalPages)
 * @returns {Promise<Array<{ pageNumber: number, dataUrl: string, width: number, height: number }>>}
 */
export async function processPdfFile(fileOrBuffer, onProgress) {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error('PDF processing is only supported in browser environments');

  let arrayBuffer;
  if (fileOrBuffer instanceof File) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    arrayBuffer = fileOrBuffer;
  }

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) onProgress(pageNum, numPages);
    const page = await pdf.getPage(pageNum);

    // Render at scale 1.25 for crisp text while staying under TPM token limits
    const scale = 1.25;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.80);

    pages.push({
      pageNumber: pageNum,
      dataUrl,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return pages;
}

/**
 * Universal file processor: automatically handles PDF or Image files
 * @param {File} file 
 * @param {function(number, number): void} [onProgress]
 * @returns {Promise<Array<{ pageNumber: number, dataUrl: string, width: number, height: number }>>}
 */
export async function processUploadedFile(file, onProgress) {
  if (!file) return [];
  const fileType = file.type || '';
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await processPdfFile(file, onProgress);
  } else if (
    fileType.startsWith('image/') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.webp')
  ) {
    const singlePage = await processImageFile(file);
    return [singlePage];
  } else {
    throw new Error(`Unsupported file format: ${file.name}. Please upload PDF or image files.`);
  }
}
