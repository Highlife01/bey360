import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateInvoicePDF(invoice: any, profile: any) {
  const doc = new jsPDF() as any;
  const primaryColorRgb = hexToRgb(profile.pdfPrimaryColor || '#4f46e5');

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColorRgb[0], primaryColorRgb[1], primaryColorRgb[2]);
  doc.text('FATURA', 105, 20, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // Company Info (Left)
  if (profile.pdfShowLogo !== false) {
    // For now we use a placeholder or the default branding
    doc.setFontSize(14);
    doc.text('BEY360', 20, 35);
  }

  doc.setFontSize(12);
  doc.text(profile.companyName || 'BEY360 ISLETME', 20, 42);
  
  if (profile.pdfShowAddress !== false) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text([
      profile.address || '',
      `Tel: ${profile.phone || ''}`,
      `E-posta: ${profile.email || ''}`,
      `Vergi No: ${profile.taxId || ''}`,
    ], 20, 48);
  }

  // Invoice Meta (Right)
  doc.setFont('helvetica', 'bold');
  doc.text('Fatura Bilgileri', 140, 42);
  doc.setFont('helvetica', 'normal');
  doc.text([
    `Fatura No: ${invoice.invoiceNumber || 'INV-001'}`,
    `Tarih: ${invoice.issueDate || ''}`,
    `Durum: ${invoice.status || ''}`,
    `Tur: ${invoice.invoiceType || ''}`
  ], 140, 48);

  // Customer Info
  doc.setDrawColor(200);
  doc.line(20, 75, 190, 75);
  doc.setFont('helvetica', 'bold');
  doc.text('Müşteri / Cari', 20, 85);
  doc.setFont('helvetica', 'normal');
  doc.text([
    invoice.customerName || 'Bilinmiyor',
    'Türkiye'
  ], 20, 91);

  // Items Table
  const tableData = (invoice.items && invoice.items.length > 0) 
    ? invoice.items.map((item: any) => [
        item.description || 'Urun/Hizmet',
        `${item.quantity} Adet`,
        formatCurrency(item.unitPrice),
        `%${item.vatRate}`,
        formatCurrency(item.quantity * item.unitPrice * item.vatRate / 100),
        formatCurrency(item.total)
      ])
    : [
        [
          invoice.note || 'Hizmet Bedeli',
          '1 Adet',
          formatCurrency(invoice.amount),
          `%${invoice.vatRate}`,
          formatCurrency(invoice.vatAmount),
          formatCurrency(invoice.grandTotal)
        ]
      ];

  doc.autoTable({
    startY: 105,
    head: [['Açıklama', 'Miktar', 'Birim Fiyat', 'KDV', 'KDV Tutar', 'Toplam']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: primaryColorRgb },
    styles: { font: 'helvetica', fontSize: 9 }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text(`Ara Toplam: ${formatCurrency(invoice.amount)}`, 140, finalY);
  doc.text(`KDV Tutarı: ${formatCurrency(invoice.vatAmount)}`, 140, finalY + 6);
  doc.setFontSize(14);
  doc.setTextColor(primaryColorRgb[0], primaryColorRgb[1], primaryColorRgb[2]);
  doc.text(`GENEL TOPLAM: ${formatCurrency(invoice.grandTotal)}`, 140, finalY + 15);
  doc.setTextColor(0, 0, 0);

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const footerText = profile.pdfFooterText || 'Bu fatura Bey360 Bulut Muhasebe Sistemi ile oluşturulmuştur.';
  doc.text(footerText, 105, 285, { align: 'center' });

  doc.save(`fatura-${invoice.invoiceNumber || 'taslak'}.pdf`);
}

function formatCurrency(val: number) {
  return `₺${(val || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [79, 70, 229];
}
