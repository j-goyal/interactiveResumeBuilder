import { RefObject } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = async (targetRef: RefObject<HTMLElement>, filename: string) => {
  if (!targetRef.current) {
    console.error('Target element not found');
    throw new Error('Unable to get the target element.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  doc.html(targetRef.current, {
    callback: function (doc) {
      doc.save(filename);
    },
    x: 10,
    y: 10,
    width: doc.internal.pageSize.getWidth() - 20,
    windowWidth: 1000,
  });
};

