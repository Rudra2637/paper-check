/**
 * Document Processing Utility
 * Converts uploaded PDF documents and image files into high-resolution
 * page images (base64 data URLs) with width/height metadata.
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
 * Reads an image file and returns it as a base64 Data URL with dimensions
 * @param {File} file 
 * @returns {Promise<{ pageNumber: number, dataUrl: string, width: number, height: number }>}
 */
export async function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        resolve({
          pageNumber: 1,
          dataUrl,
          width: img.naturalWidth || 1200,
          height: img.naturalHeight || 1600,
        });
      };
      img.onerror = reject;
      img.src = dataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a multi-page PDF into an array of high-resolution canvas page images
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

    // Render at scale 2.0 for sharp OCR and crisp display
    const scale = 2.0;
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
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

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
