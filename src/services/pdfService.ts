import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateInvoicePDF(invoice: any, company: any) {
  const doc = new jsPDF() as any;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FATURA', 105, 20, { align: 'center' });

  // Company Info (Left)
  doc.setFontSize(12);
  doc.text(company.name || 'BEY360 ISLETME', 20, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text([
    company.address || '',
    `Tel: ${company.phone || ''}`,
    `E-posta: ${company.email || ''}`,
    `Vergi No: ${company.taxId || ''}`,
    `Vergi Dairesi: ${company.taxOffice || ''}`
  ], 20, 46);

  // Invoice Meta (Right)
  doc.setFont('helvetica', 'bold');
  doc.text('Fatura Bilgileri', 140, 40);
  doc.setFont('helvetica', 'normal');
  doc.text([
    `Fatura No: ${invoice.invoiceNumber || 'INV-001'}`,
    `Tarih: ${invoice.dueDate || ''}`,
    `Durum: ${invoice.status || ''}`,
    `Tur: ${invoice.invoiceType || ''}`
  ], 140, 46);

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
  const tableData = [
    [
      invoice.description || 'Hizmet Bedeli',
      '1 Adet',
      formatCurrency(invoice.subtotal),
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
    headStyles: { fillColor: [79, 70, 229] },
    styles: { font: 'helvetica', fontSize: 9 }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text(`Ara Toplam: ${formatCurrency(invoice.subtotal)}`, 140, finalY);
  doc.text(`KDV Tutarı: ${formatCurrency(invoice.vatAmount)}`, 140, finalY + 6);
  doc.setFontSize(14);
  doc.text(`GENEL TOPLAM: ${formatCurrency(invoice.grandTotal)}`, 140, finalY + 15);

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Bu fatura Bey360 Bulut Muhasebe Sistemi ile oluşturulmuştur.', 105, 285, { align: 'center' });

  doc.save(`fatura-${invoice.invoiceNumber || 'taslak'}.pdf`);
}

function formatCurrency(val: number) {
  return `₺${(val || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
}
