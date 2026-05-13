export interface HizliTechnologyConnectionResult {
  ok: boolean;
  message: string;
  tokenExpiresAt?: string;
}

const DEFAULT_PROXY_BASE = '/api/hizli-teknoloji';

export const HIZLI_TECHNOLOGY = {
  testPortalUrl: 'https://portaltest.hizliteknoloji.com.tr',
  testSwaggerUrl: 'https://econnecttest.hizliteknoloji.com.tr/swagger/ui/index',
  integrationDocsUrl: 'https://econnecttest.hizliteknoloji.com.tr/IntegrationDocuments',
  proxyBaseUrl: import.meta.env.VITE_HIZLI_TEKNOLOJI_PROXY_URL || DEFAULT_PROXY_BASE,
};

async function readJsonResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export async function testHizliTechnologyConnection(): Promise<HizliTechnologyConnectionResult> {
  try {
    const response = await fetch(`${HIZLI_TECHNOLOGY.proxyBaseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await readJsonResponse(response);

    if (!response.ok) {
      return {
        ok: false,
        message:
          data?.message ||
          'Hızlı Teknoloji backend proxy yanıt vermedi. SecretKey ve ApiKey frontend içinde kullanılmamalıdır.',
      };
    }

    return {
      ok: true,
      message: data?.message || 'Hızlı Teknoloji test bağlantısı başarılı.',
      tokenExpiresAt: data?.tokenExpiresAt,
    };
  } catch {
    return {
      ok: false,
      message:
        'Backend proxy bulunamadı. Hızlı Teknoloji login işlemi için sunucu tarafında /api/hizli-teknoloji/login endpoint’i gerekir.',
    };
  }
}
