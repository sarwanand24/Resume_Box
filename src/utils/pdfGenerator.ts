import jsPDF from 'jspdf';

export const generatePDF = (content: string, filename: string) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Split content into lines
  const lines = content.split('\n');
  let yPosition = 20;
  
  lines.forEach((line) => {
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Handle different text styles
    if (line.includes('PROFESSIONAL SUMMARY') || line.includes('CORE COMPETENCIES') || line.includes('KEY ACHIEVEMENTS')) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
    } else if (line.trim() === '' || line.includes('@') || line.includes('+1')) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    } else {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
    }
    
    // Split long lines
    const splitLines = doc.splitTextToSize(line, 170);
    doc.text(splitLines, 20, yPosition);
    yPosition += splitLines.length * 6;
  });
  
  doc.save(filename);
};