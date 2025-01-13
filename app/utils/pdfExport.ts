import { RefObject } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (targetRef: RefObject<HTMLElement>, filename: string) => {
  if (!targetRef.current) {
    console.error('Target element not found');
    throw new Error('Unable to get the target element.');
  }

  const element = targetRef.current;

  const canvas = await html2canvas(element, {
    scale: 4,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

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