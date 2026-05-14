export function getWhatsAppLink(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function sendWhatsAppReminder(name: string, phone: string, balance: number) {
  const message = `Merhaba ${name}, Bey360 sistemimizde kayıtlı olan ${balance.toLocaleString('tr-TR')} ₺ bakiyenizi hatırlatmak isteriz. İyi çalışmalar dileriz.`;
  window.open(getWhatsAppLink(phone, message), '_blank');
}
