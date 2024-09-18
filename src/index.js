// index.js

import * as pdfjsLib from 'pdfjs-dist/webpack';

const getBase64Image = (canvas) => {
  return canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
};

const resizeImage = (base64Image, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64Image}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const resizedBase64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
      resolve(resizedBase64);
    };
  });
};

const extractImagesFromPdf = async (file, maxWidth = 800, maxHeight = 800) => {
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

      let base64Image = getBase64Image(canvas);
      base64Image = await resizeImage(base64Image, maxWidth, maxHeight);
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

