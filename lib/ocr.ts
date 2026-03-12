import Tesseract from 'tesseract.js';

/**
 * OCR text extraction using Tesseract.js (FREE, local in-browser)
 */
export async function performOCR(imageSource: string, onProgress?: (progress: number) => void) {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageSource,
      'eng',
      {
        logger: (m: any) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(Math.floor(m.progress * 100));
          }
        }
      }
    );
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
}
