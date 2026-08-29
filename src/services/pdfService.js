/**
 * VirasatRakshak Client-Side PDF Generation Service
 * Powered by jsPDF & jspdf-autotable.
 * 
 * Generates official, multi-page, formatted PDF files for:
 * 1. Customized Tour Itineraries
 * 2. Cultural Heritage Guides (works 100% offline with IndexedDB packs)
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Currency formatting helper (Rs. / INR)
function formatCurrency(amount) {
  if (typeof amount !== 'number') return 'Rs. 0';
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

export const pdfService = {
  /**
   * 1. Generate & Download Official Tour Itinerary PDF
   */
  generateTourPDF: async (tourData = {}) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 15;

      // Primary Branding Colors
      const saffronColor = [234, 88, 12];   // #ea580c
      const peacockColor = [2, 132, 199];   // #0284c7
      const darkTextColor = [30, 41, 59];   // #1e293b
      const lightBgColor = [254, 243, 199]; // #fef3c7

      // Header Banner
      doc.setFillColor(...saffronColor);
      doc.rect(0, 0, pageWidth, 25, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('VirasatRakshak', 14, 12);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Digital Bharat HeritageVerse — Official Tour Itinerary', 14, 18);

      y = 35;

      // Document Title
      const title = tourData.title || 'Customized Heritage Tour Itinerary';
      doc.setTextColor(...darkTextColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, 14, y);
      y += 8;

      // Summary Card
      doc.setFillColor(...lightBgColor);
      doc.roundedRect(14, y, pageWidth - 28, 26, 3, 3, 'F');

      doc.setFontSize(9);
      doc.setTextColor(120, 53, 15);
      
      const destination = tourData.destination || 'India Heritage';
      const duration = tourData.duration || '2N / 3D';
      const dates = tourData.dates || 'Upcoming Travel';
      const stay = tourData.stay || 'Standard Hotel Stay';
      const cab = tourData.cab || 'AC Vehicle Transport';

      doc.text(`Destination: ${destination}`, 18, y + 7);
      doc.text(`Duration: ${duration}`, 18, y + 14);
      doc.text(`Travel Dates: ${dates}`, 18, y + 21);

      doc.text(`Accommodation: ${stay}`, 105, y + 7);
      doc.text(`Transport: ${cab}`, 105, y + 14);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 105, y + 21);

      y += 34;

      // Itinerary Section
      doc.setFontSize(13);
      doc.setTextColor(...peacockColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Day-by-Day Itinerary', 14, y);
      y += 6;

      const itinerary = tourData.itinerary || [
        { day: 'Day 1', items: ['Pickup & Arrival at Destination', 'Evening Heritage Visit & Aarti'] },
        { day: 'Day 2', title: 'Guided Temple & Monument Exploration', items: ['Guided Darshan', 'Local Cultural Market Visit'] },
        { day: 'Day 3', items: ['Morning Darshan & Drop-off'] }
      ];

      itinerary.forEach((dayPlan) => {
        // Page break check
        if (y > pageHeight - 35) {
          doc.addPage();
          y = 20;
        }

        const dayHeader = `${dayPlan.day}${dayPlan.title ? `: ${dayPlan.title}` : ''}`;
        doc.setFillColor(241, 245, 249);
        doc.rect(14, y, pageWidth - 28, 7, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(...saffronColor);
        doc.setFont('helvetica', 'bold');
        doc.text(dayHeader, 16, y + 5);
        y += 10;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...darkTextColor);

        const items = dayPlan.items || [];
        items.forEach((itemText) => {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 20;
          }
          const splitLines = doc.splitTextToSize(`•  ${itemText}`, pageWidth - 36);
          doc.text(splitLines, 18, y);
          y += (splitLines.length * 4.5);
        });

        y += 4;
      });

      y += 4;

      // Cost Summary Section using autoTable
      if (y > pageHeight - 65) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(13);
      doc.setTextColor(...peacockColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Cost Breakdown & Add-ons Summary', 14, y);
      y += 4;

      const basePrice = tourData.basePrice || 8999;
      const hotelPrice = tourData.hotelPrice || 0;
      const cabPrice = tourData.cabPrice || 0;
      const addonsPrice = tourData.addonsPrice || 0;
      const culturalPrice = tourData.culturalPrice || 0;
      const totalAmount = tourData.totalAmount || (basePrice + hotelPrice + cabPrice + addonsPrice + culturalPrice);

      const tableData = [
        ['Base Package', tourData.destination ? `${tourData.destination} Heritage Package` : 'Standard Package', formatCurrency(basePrice)],
        ['Hotel Upgrade', tourData.stay || 'Standard Hotel', hotelPrice > 0 ? formatCurrency(hotelPrice) : 'Included'],
        ['Transport Upgrade', tourData.cab || 'Standard Vehicle', cabPrice > 0 ? formatCurrency(cabPrice) : 'Included'],
        ['Add-ons & Meal Packages', tourData.addonDetails || 'Selected Services', addonsPrice > 0 ? formatCurrency(addonsPrice) : 'Included / None'],
        ['Cultural Experiences', tourData.culturalDetails || 'Guided Walking & Local Trails', culturalPrice > 0 ? formatCurrency(culturalPrice) : 'Included / None'],
        ['TOTAL ESTIMATED COST', 'All Inclusive (Taxes & Fees)', formatCurrency(totalAmount)]
      ];

      autoTable(doc, {
        startY: y,
        head: [['Component', 'Details', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: saffronColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: darkTextColor
        },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: 'bold' },
          1: { cellWidth: 95 },
          2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 14, right: 14 }
      });

      // Page Numbers and Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `VirasatRakshak Digital Bharat HeritageVerse • Page ${i} of ${totalPages}`,
          14,
          pageHeight - 10
        );
        doc.text(
          'https://virasatrakshak.in',
          pageWidth - 14,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      // Save PDF file
      const safeName = (destination || 'Tour').replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`VirasatRakshak_Tour_Itinerary_${safeName}.pdf`);
      return true;
    } catch (err) {
      console.error('Error generating Tour PDF:', err);
      throw err;
    }
  },

  /**
   * 2. Generate & Download Official Heritage Guide PDF (Works 100% Offline)
   */
  generateHeritagePDF: async (heritageData = {}) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 15;

      const saffronColor = [234, 88, 12];
      const peacockColor = [2, 132, 199];
      const darkTextColor = [30, 41, 59];
      const lightBgColor = [254, 243, 199];

      // Header Banner
      doc.setFillColor(...peacockColor);
      doc.rect(0, 0, pageWidth, 25, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('VirasatRakshak', 14, 12);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Cultural Heritage Guide Series', 14, 18);

      y = 35;

      // Heritage Name & Title
      const name = heritageData.name || 'Indian Heritage Monument';
      const state = heritageData.state || 'India';
      
      doc.setTextColor(...darkTextColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(name, 14, y);
      y += 7;

      doc.setFontSize(10);
      doc.setTextColor(...saffronColor);
      doc.text(`Location: ${state} • Region: ${heritageData.region || 'India'} • Category: ${heritageData.category || 'Monument'}`, 14, y);
      y += 8;

      // Overview Card
      doc.setFillColor(...lightBgColor);
      doc.roundedRect(14, y, pageWidth - 28, 22, 3, 3, 'F');

      doc.setFontSize(9);
      doc.setTextColor(120, 53, 15);
      doc.setFont('helvetica', 'bold');
      doc.text('Historical Era & Period:', 18, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.text(heritageData.historicalPeriod || 'Ancient Indian Architectural Era', 18, y + 11);

      doc.setFont('helvetica', 'bold');
      doc.text('Status:', 110, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.text('Protected National Cultural Heritage', 110, y + 11);

      y += 28;

      // Historical Overview
      doc.setFontSize(12);
      doc.setTextColor(...peacockColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Historical Overview', 14, y);
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor(...darkTextColor);
      doc.setFont('helvetica', 'normal');

      const overviewText = heritageData.historicalOverview || heritageData.description || 'A monumental cultural landmark preserving ancient Indian heritage.';
      const overviewLines = doc.splitTextToSize(overviewText, pageWidth - 28);
      doc.text(overviewLines, 14, y);
      y += (overviewLines.length * 4.5) + 6;

      // Cultural Significance
      if (heritageData.culturalSignificance) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(...peacockColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Cultural Significance', 14, y);
        y += 6;

        doc.setFontSize(9);
        doc.setTextColor(...darkTextColor);
        doc.setFont('helvetica', 'normal');

        const sigLines = doc.splitTextToSize(heritageData.culturalSignificance, pageWidth - 28);
        doc.text(sigLines, 14, y);
        y += (sigLines.length * 4.5) + 6;
      }

      // Architecture Information
      if (heritageData.architectureInfo) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(...peacockColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Architectural Highlights', 14, y);
        y += 6;

        doc.setFontSize(9);
        doc.setTextColor(...darkTextColor);
        doc.setFont('helvetica', 'normal');

        const archLines = doc.splitTextToSize(heritageData.architectureInfo, pageWidth - 28);
        doc.text(archLines, 14, y);
        y += (archLines.length * 4.5) + 6;
      }

      // Important Facts
      if (Array.isArray(heritageData.importantFacts) && heritageData.importantFacts.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(...peacockColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Historical Facts', 14, y);
        y += 6;

        doc.setFontSize(9);
        doc.setTextColor(...darkTextColor);
        doc.setFont('helvetica', 'normal');

        heritageData.importantFacts.forEach((fact) => {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 20;
          }
          const factLines = doc.splitTextToSize(`•  ${fact}`, pageWidth - 32);
          doc.text(factLines, 16, y);
          y += (factLines.length * 4.5);
        });

        y += 6;
      }

      // Travel Guide Table
      if (heritageData.travelGuide) {
        if (y > pageHeight - 50) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(...peacockColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Travel & Visitor Guide', 14, y);
        y += 4;

        const tg = heritageData.travelGuide;
        const travelTableData = [
          ['Best Time to Visit', tg.bestTime || 'October to March'],
          ['Opening Hours', tg.openingHours || 'Sunrise to Sunset'],
          ['Entry Fee Details', tg.entryFee || 'Standard entry rates apply'],
          ['Nearby Heritage Sites', Array.isArray(tg.nearbyAttractions) ? tg.nearbyAttractions.join(', ') : 'Local historical circuit']
        ];

        autoTable(doc, {
          startY: y,
          head: [['Category', 'Details']],
          body: travelTableData,
          theme: 'grid',
          headStyles: {
            fillColor: peacockColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8.5,
            textColor: darkTextColor
          },
          columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 130 }
          },
          margin: { left: 14, right: 14 }
        });
      }

      // Page Numbers and Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `VirasatRakshak Digital Bharat HeritageVerse • Page ${i} of ${totalPages}`,
          14,
          pageHeight - 10
        );
        doc.text(
          'https://virasatrakshak.in',
          pageWidth - 14,
          pageHeight - 10,
          { align: 'right' }
        );
      }

      // Save PDF file
      const safeName = (name || 'Heritage').replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`VirasatRakshak_${safeName}_Heritage_Guide.pdf`);
      return true;
    } catch (err) {
      console.error('Error generating Heritage Guide PDF:', err);
      throw err;
    }
  }
};
