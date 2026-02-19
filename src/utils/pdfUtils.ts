import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Note } from '../types';

/**
 * Generate PDF from note pages
 */
export const generatePDFFromNote = async (
  note: Note, 
  courseName: string, 
  isPremium: boolean = false,
  watermarkIconBase64?: string
): Promise<string> => {
  try {
    // Convert images to base64 with quality control
    const pagesWithBase64 = await Promise.all(
      note.pages.map(async (page) => {
        try {
          // Check if image path exists
          if (!page.originalImagePath) {
            console.error('Image path is undefined for page:', page);
            return null;
          }

          // Check if file exists
          const fileInfo = await FileSystem.getInfoAsync(page.originalImagePath);
          if (!fileInfo.exists) {
            console.error('Image file does not exist:', page.originalImagePath);
            return null;
          }

          let imageUri = page.originalImagePath;

          // Freemium: Compress images to reduce file size
          if (!isPremium) {
            try {
              const manipResult = await ImageManipulator.manipulateAsync(
                page.originalImagePath,
                [{ resize: { width: 1200 } }], // Resize to max 1200px width
                { 
                  compress: 0.6, // 60% quality
                  format: ImageManipulator.SaveFormat.JPEG 
                }
              );
              imageUri = manipResult.uri;
            } catch (manipError) {
              console.log('Could not compress image, using original:', manipError);
            }
          }

          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          return {
            ...page,
            base64: `data:image/jpeg;base64,${base64}`,
          };
        } catch (error) {
          console.error('Error reading image:', error, page);
          return null;
        }
      })
    );

    const validPages = pagesWithBase64.filter(p => p !== null);

    if (validPages.length === 0) {
      throw new Error('No valid pages to export');
    }

    // Create HTML content with images
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            @page {
              size: A4;
              margin: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
            }
            .page {
              page-break-after: always;
              page-break-inside: avoid;
              width: 210mm;
              height: 297mm;
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: white;
            }
            .page:last-child {
              page-break-after: auto;
            }
            ${!isPremium ? `
            .header {
              position: absolute;
              top: 15px;
              left: 0;
              right: 0;
              text-align: center;
              padding: 0 20px;
              z-index: 1;
            }
            .course-name {
              font-size: 12px;
              color: #666;
              font-weight: 500;
              margin-bottom: 3px;
            }
            .note-name {
              font-size: 14px;
              color: #333;
              font-weight: 700;
            }
            ` : ''}
            .image-container {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            }
            .page-image {
              max-width: 100%;
              max-height: 100%;
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
            }
            ${!isPremium ? `
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center;
              opacity: 0.25;
              pointer-events: none;
              z-index: 2;
            }
            .watermark-icon {
              width: 280px;
              height: 280px;
              margin: 0 auto;
              opacity: 1;
            }
            .footer {
              position: absolute;
              bottom: 10px;
              left: 0;
              right: 0;
              text-align: center;
              font-size: 9px;
              color: #999;
            }
            ` : ''}
            @media print {
              .page {
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${validPages.map((page, index) => `
            <div class="page">
              ${!isPremium ? `
              <div class="header">
                <div class="course-name">${courseName}</div>
                <div class="note-name">${note.name}</div>
              </div>
              ` : ''}
              
              <div class="image-container">
                <img 
                  src="${page.base64}" 
                  class="page-image"
                  alt="Page ${index + 1}"
                />
                
                ${!isPremium && watermarkIconBase64 ? `
                <div class="watermark">
                  <img src="${watermarkIconBase64}" class="watermark-icon" alt="NoteMerge" />
                </div>
                ` : ''}
              </div>
              
              ${!isPremium ? `
              <div class="footer">
                NoteMerge ile oluşturuldu • Sayfa ${index + 1} / ${validPages.length}
              </div>
              ` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    // Generate PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Share PDF file
 */
export const sharePDF = async (pdfUri: string, noteName: string): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    // Share the PDF directly
    await Sharing.shareAsync(pdfUri, {
      mimeType: 'application/pdf',
      dialogTitle: `${noteName} - PDF`,
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};

/**
 * Save PDF to device
 */
export const savePDFToDevice = async (pdfUri: string, noteName: string): Promise<string> => {
  try {
    // PDF is already saved by expo-print, just return the URI
    return pdfUri;
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
};

/**
 * Get PDF file size
 */
export const getPDFSize = async (pdfUri: string): Promise<number> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(pdfUri);
    if (fileInfo.exists && 'size' in fileInfo) {
      return fileInfo.size;
    }
    return 0;
  } catch (error) {
    console.error('Error getting PDF size:', error);
    return 0;
  }
};

/**
 * Format file size to human readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};
