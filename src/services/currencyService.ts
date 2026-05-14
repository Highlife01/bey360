export interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
  lastUpdate: string;
}

export async function getLiveExchangeRates(): Promise<ExchangeRates> {
  try {
    // Using a reliable free public API for exchange rates
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    // We want TRY rates
    const tryRate = data.rates.TRY;
    const eurRate = data.rates.EUR;
    const gbpRate = data.rates.GBP;

    return {
      USD: tryRate,
      EUR: tryRate / eurRate,
      GBP: tryRate / gbpRate,
      lastUpdate: new Date().toLocaleTimeString('tr-TR')
    };
  } catch (error) {
    console.error('Currency fetch error:', error);
    // Fallback static rates if API fails
    return {
      USD: 32.45,
      EUR: 35.12,
      GBP: 41.20,
      lastUpdate: 'Çevrimdışı'
    };
  }
}
