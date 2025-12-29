import { HypothesisResult, LLMProviderType } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  results: HypothesisResult[];
  signalStability: number;
  isLogprobBased: boolean;
  provider: LLMProviderType;
  timestamp: string;
  chatContent?: string;
}

const calculateCategoryScores = (results: HypothesisResult[]) => {
  const categories: Record<string, { score: number; count: number; total: number }> = {};
  
  results.forEach(r => {
    if (!categories[r.category]) {
      categories[r.category] = { score: 0, count: 0, total: 0 };
    }
    categories[r.category].total += 1;
    
    const points = r.result 
      ? r.confidence / 100 
      : (100 - r.confidence) / 100;
    
    categories[r.category].count += points;
  });

  Object.keys(categories).forEach(cat => {
    categories[cat].score = Math.round((categories[cat].count / categories[cat].total) * 100);
  });

  return categories;
};

const calculateOverallIndex = (results: HypothesisResult[]) => {
  let trueCount = 0;
  results.forEach(r => {
    const points = r.result 
      ? r.confidence / 100 
      : (100 - r.confidence) / 100;
    trueCount += points;
  });
  return results.length > 0 ? Math.round((trueCount / results.length) * 100) : 0;
};

export const exportToPDF = async (data: ExportData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Header
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('KI-Analyse Report', margin, 20);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.text(`Forensic Linguist Analyst v3.1`, margin, 28);
  pdf.text(`Erstellt: ${data.timestamp}`, margin, 34);

  yPos = 50;

  // Summary Box
  pdf.setFillColor(30, 41, 59); // slate-800
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
  
  const overallIndex = calculateOverallIndex(data.results);
  const categories = calculateCategoryScores(data.results);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Zusammenfassung', margin + 5, yPos + 8);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(203, 213, 225); // slate-300
  pdf.text(`Provider: ${data.provider}`, margin + 5, yPos + 16);
  pdf.text(`Muster-Konzentration: ${overallIndex}%`, margin + 5, yPos + 23);
  pdf.text(`Signal-Stabilität: ${data.signalStability}%`, margin + 5, yPos + 30);
  
  const methodText = data.isLogprobBased ? 'Logprobs-basiert' : 'Semantisch';
  pdf.text(`Methode: ${methodText}`, pageWidth - margin - 50, yPos + 16);

  yPos += 45;

  // Capture Radar Chart
  const radarElement = document.querySelector('.recharts-wrapper');
  if (radarElement) {
    try {
      const canvas = await html2canvas(radarElement as HTMLElement, {
        backgroundColor: '#0f172a',
        scale: 2
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 120;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      checkPageBreak(imgHeight + 10);
      
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, imgHeight + 10, 3, 3, 'F');
      
      pdf.addImage(imgData, 'PNG', margin + (pageWidth - 2 * margin - imgWidth) / 2, yPos + 5, imgWidth, imgHeight);
      yPos += imgHeight + 20;
    } catch (error) {
      console.error('Fehler beim Erfassen der Grafik:', error);
    }
  }

  // Category Scores
  checkPageBreak(60);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Kategorie-Scores', margin, yPos);
  yPos += 8;

  Object.entries(categories).forEach(([name, data]) => {
    checkPageBreak(12);
    
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 10, 2, 2, 'F');
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(148, 163, 184);
    pdf.text(name, margin + 3, yPos + 6);
    
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${data.score}%`, pageWidth - margin - 15, yPos + 6);
    
    // Progress bar
    const barWidth = 40;
    const barX = pageWidth - margin - 60;
    pdf.setFillColor(51, 65, 85); // slate-700
    pdf.rect(barX, yPos + 3, barWidth, 4, 'F');
    pdf.setFillColor(59, 130, 246); // blue-500
    pdf.rect(barX, yPos + 3, (barWidth * data.score) / 100, 4, 'F');
    
    yPos += 12;
  });

  yPos += 5;

  // Detailed Results
  checkPageBreak(20);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Detaillierte Ergebnisse', margin, yPos);
  yPos += 10;

  const trueResults = data.results.filter(r => r.result);
  const falseResults = data.results.filter(r => !r.result);

  // TRUE Results
  if (trueResults.length > 0) {
    checkPageBreak(15);
    pdf.setFontSize(11);
    pdf.setTextColor(16, 185, 129); // emerald-500
    pdf.text(`✓ Erfüllte Hypothesen (${trueResults.length})`, margin, yPos);
    yPos += 7;

    trueResults.forEach(result => {
      checkPageBreak(20);
      
      pdf.setFillColor(6, 78, 59, 30); // emerald-900/30
      pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 2, 2, 'F');
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(167, 243, 208); // emerald-200
      pdf.text(`#${result.id} - ${result.category}`, margin + 3, yPos + 5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(209, 213, 219); // gray-300
      const statementLines = pdf.splitTextToSize(result.statement, pageWidth - 2 * margin - 10);
      pdf.text(statementLines, margin + 3, yPos + 10);
      
      pdf.setFontSize(7);
      pdf.setTextColor(110, 231, 183); // emerald-400
      pdf.text(`Confidence: ${result.confidence}%`, pageWidth - margin - 30, yPos + 15);
      
      yPos += 20;
    });
  }

  // FALSE Results
  if (falseResults.length > 0) {
    checkPageBreak(15);
    pdf.setFontSize(11);
    pdf.setTextColor(148, 163, 184); // slate-400
    pdf.text(`✗ Nicht erfüllte Hypothesen (${falseResults.length})`, margin, yPos);
    yPos += 7;

    falseResults.forEach(result => {
      checkPageBreak(20);
      
      pdf.setFillColor(51, 65, 85, 50); // slate-700/50
      pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 2, 2, 'F');
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text(`#${result.id} - ${result.category}`, margin + 3, yPos + 5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(203, 213, 225); // slate-300
      const statementLines = pdf.splitTextToSize(result.statement, pageWidth - 2 * margin - 10);
      pdf.text(statementLines, margin + 3, yPos + 10);
      
      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184);
      pdf.text(`Confidence: ${result.confidence}%`, pageWidth - margin - 30, yPos + 15);
      
      yPos += 20;
    });
  }

  // Footer on last page
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Erstellt mit KI-Analyse - Forensic Linguist Analyst', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save PDF
  const filename = `KI-Analyse_${new Date().toISOString().split('T')[0]}_${Date.now()}.pdf`;
  pdf.save(filename);
};
