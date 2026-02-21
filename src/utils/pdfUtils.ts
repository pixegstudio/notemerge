import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { PDFDocument, rgb } from 'pdf-lib';
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
    console.log('📄 PDF Generation Started');
    console.log('Total pages to process:', note.pages.length);
    
    // Convert images to base64 with quality control
    const pagesWithBase64 = await Promise.all(
      note.pages.map(async (page, index) => {
        console.log(`Processing page ${index + 1}/${note.pages.length}`);
        
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
    
    console.log('✅ Valid pages after processing:', validPages.length);
    console.log('❌ Failed pages:', note.pages.length - validPages.length);

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
    console.log('🖨️ Generating PDF with', validPages.length, 'pages');
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    
    console.log('✅ PDF Generated:', uri);
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

/**
 * Add watermark to existing PDF
 */
export const addWatermarkToPDF = async (
  pdfUri: string,
  courseName: string,
  noteName: string,
  isPremium: boolean = false
): Promise<string> => {
  try {
    console.log('📄 Adding watermark to PDF:', pdfUri);

    // If premium, return original PDF
    if (isPremium) {
      console.log('✅ Premium user, returning original PDF');
      return pdfUri;
    }

    // Read the PDF file
    const pdfBytes = await FileSystem.readAsStringAsync(pdfUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    console.log('📄 PDF has', pages.length, 'pages');

    // Add watermark to each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // Add header text
      page.drawText(`${courseName} - ${noteName}`, {
        x: 50,
        y: height - 30,
        size: 10,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Add watermark text in center
      page.drawText('NoteMerge', {
        x: width / 2 - 60,
        y: height / 2,
        size: 40,
        color: rgb(0.9, 0.9, 0.9),
        opacity: 0.3,
      });

      // Add footer text
      page.drawText(`NoteMerge ile oluşturuldu • Sayfa ${i + 1} / ${pages.length}`, {
        x: 50,
        y: 20,
        size: 8,
        color: rgb(0.6, 0.6, 0.6),
      });
    }

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.saveAsBase64();
    const outputPath = `${FileSystem.cacheDirectory}watermarked_${Date.now()}.pdf`;
    
    await FileSystem.writeAsStringAsync(outputPath, modifiedPdfBytes, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('✅ Watermarked PDF saved:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error adding watermark to PDF:', error);
    // If watermarking fails, return original PDF
    return pdfUri;
  }
};
