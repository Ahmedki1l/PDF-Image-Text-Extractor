# PDF Extractor

A simple library to extract text and images from PDF files.

## Installation

```bash
npm install sinsintro-pdf-extractor
```

## Usage

Below are examples of how to use the `sinsintro-pdf-extractor` library to extract text and images from a PDF file.

### Extract Text from PDF

To extract text from a PDF file, you can use the `extractTextFromPdf` function:

```javascript
import { extractTextFromPdf } from 'sinsintro-pdf-extractor';

const handleFile = async (file) => {
  const text = await extractTextFromPdf(file);
  console.log('Extracted text:', text);
};

// Example usage with a file input element
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  handleFile(file);
});
```

### Extract Images from PDF

To extract images from a PDF file and optionally resize them, use the `extractImagesFromPdf` function:

```javascript
import { extractImagesFromPdf } from 'sinsintro-pdf-extractor';

const handleFile = async (file) => {
  const images = await extractImagesFromPdf(file, 800, 800);  // Resizing images to max 800x800
  console.log('Extracted images:', images);

  // Display the images in the DOM
  const imageContainer = document.getElementById('imageContainer');
  images.forEach((base64Image, index) => {
    const imgElement = document.createElement('img');
    imgElement.src = `data:image/png;base64,${base64Image}`;
    imgElement.alt = `Extracted Image ${index + 1}`;
    imgElement.style.maxWidth = '100%';
    imageContainer.appendChild(imgElement);
  });
};

// Example usage with a file input element
document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  handleFile(file);
});
```

### Example HTML Setup

If you want to try the code examples above in an HTML file, here’s how you could set it up:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PDF Extractor Demo</title>
</head>
<body>
  <h1>PDF Extractor Demo</h1>
  <input type="file" id="fileInput" accept="application/pdf">
  <div id="imageContainer"></div>

  <script type="module">
    // Your JavaScript code goes here
  </script>
</body>
</html>
```

## License

MIT License
