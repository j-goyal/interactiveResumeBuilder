import { RefObject } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (targetRef: RefObject<HTMLElement>, filename: string) => {
  if (!targetRef.current) {
    console.error('Target element not found');
    throw new Error('Unable to get the target element.');
  }

  const element = targetRef.current;

  // Use html2canvas to render the element to a canvas
  const canvas = await html2canvas(element, {
    scale: 4, // Higher scale for better quality
    useCORS: true, // Enable cross-origin resource sharing if images are used
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95); // Reduce the image quality (0.5 is 50% quality)

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Add the image to the PDF
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  // Save the PDF
  pdf.save(filename);
};