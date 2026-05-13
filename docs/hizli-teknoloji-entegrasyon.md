# Hızlı Teknoloji eConnect Entegrasyon Notları

Bu entegrasyonda `SecretKey`, `ApiKey`, kullanıcı adı ve şifre frontend koduna yazılmamalıdır.

Güvenli akış:

1. Backend, firma kullanıcı adı ve şifresini `SecretKey` ile `UtilEncrypt` metodundan geçirir.
2. Backend, dönen şifreli kullanıcı adı/şifreyi güvenli saklar.
3. Backend, `Login` metoduna `ApiKey`, şifreli kullanıcı adı ve şifreyi gönderir.
4. Dönen JWT token 3 gün geçerlidir.
5. Diğer e-Fatura/e-Arşiv istekleri `Authorization: Bearer <token>` ile backend üzerinden yapılır.

Frontend sadece şu proxy endpointini çağırır:

```txt
POST /api/hizli-teknoloji/login
```

Gerekli backend ortam değişkenleri:

```txt
HIZLI_TEKNOLOJI_BASE_URL=https://econnecttest.hizliteknoloji.com.tr
HIZLI_TEKNOLOJI_API_KEY=...
HIZLI_TEKNOLOJI_ENCRYPTED_USERNAME=...
HIZLI_TEKNOLOJI_ENCRYPTED_PASSWORD=...
```

`SecretKey` sadece ilk şifreleme/kurulum akışında backend veya güvenli operasyon ortamında kullanılmalıdır.

## e-Fatura / e-Arşiv ekranına işlenen alanlar

13.05.2026 tarihinde Hızlı Teknoloji test doküman akışı ve GİB e-Belge duyuruları kontrol edilerek frontend hazırlık ekranı genişletildi.

Eklenen iş alanları:

- Belge türü: `e-Fatura`, `e-Arşiv`
- Senaryo: `TEMELFATURA`, `TICARIFATURA`, `EARSIVFATURA`, `KAMU`, `IHRACAT`, `YOLCUBERABER`, `YATIRIMTESVIK`
- Fatura tipi: `SATIS`, `IADE`, `ISTISNA`, `TEVKIFAT`, `OZELMATRAH`, `IHRACKAYITLI`, `YTBISTISNA`, `SARJ`, `TEKNOLOJIDESTEK`, `IDIS`, `DIGER`
- Cari unvan, VKN/TCKN, alıcı tipi
- KDV oranı, KDV tutarı, genel toplam
- Özel matrah aktif/pasif, özel matrah tutarı, özel matrah kodu ve notu
- KDV oran kontrol istisnası için `555` kod alanı
- GİB/entegratör durum kodu
- e-Arşiv gönderim kanalı

GİB tarafında izlenecek güncel başlıklar:

- UserList / UserTempList kılavuzu ile kapanan/açılan mükellef takibi.
- Sicil ve faaliyet kodu karşılığı KDV oran kontrolü. 27.03.2026 duyurusu ile ikinci duyuruya kadar ertelenmiştir; alan hazırlığı korunmalıdır.
- YTB, IDIS, teknoloji destek, şarj ve ilaç/tıbbi cihaz gibi özel teknik kılavuz gerektiren fatura tipleri.
- e-Arşiv rapor ve paket güncellemeleri.

Backend yapılacakları:

1. Firma/mükellef bazlı Hızlı Teknoloji hesap kaydı oluştur.
2. Şifreli kullanıcı adı/şifre ve ApiKey bilgisini backend secret store içinde sakla.
3. Login tokenını firma bazlı cachele; süre bitmeden yenile veya tekrar login ol.
4. Giden belge için UBL/JSON payload üretim katmanı kur.
5. Özel matrah durumunda fatura tipini `OZELMATRAH` olarak gönder ve KDV matrahını özel matrah tutarından hesapla.
6. GİB/entegratör durum sorgulama sonuçlarını `gibStatusCode` alanına yaz.
