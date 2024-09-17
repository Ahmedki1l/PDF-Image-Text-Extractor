// index.js

import * as pdfjsLib from 'pdfjs-dist/webpack';

const getBase64Image = (canvas) => {
  return canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
};

const extractImagesFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const imageData = [];

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      const base64Image = getBase64Image(canvas);
      imageData.push(base64Image);
    }
    return imageData;
  } catch (error) {
    console.error('Error extracting images from PDF:', error);
    return [];
  }
};

const extractTextFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      const textItems = content.items.map(item => item.str).join(' ');
      fullText += textItems + '\n';
    }
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
};

export { extractTextFromPdf, extractImagesFromPdf };
