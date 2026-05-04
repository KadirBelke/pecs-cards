# Gorsel Iletisim Kartlari

Turkce odakli, statik ve tablet dostu gorsel iletisim kartlari uygulamasi.

## Gelistirme

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run fetch:symbol-catalog`
- `npm run suggest:symbols`
- `npm run apply:symbols:first`
- `npm run download:symbols`
- `npm run review:symbols`

## Sembol Kaynagi

ARASAAC pictogramlari birincil sembol kaynagidir. Indirme scripti `scripts/arasaac-card-symbol-map.json` ve `scripts/arasaac-category-symbol-map.json` dosyalarindaki sabit `arasaacId` eslemelerini okuyup kart gorsellerini `public/symbols/arasaac/cards/{cardId}.png`, kategori gorsellerini ise `public/symbols/arasaac/categories/{categoryId}.png` altina indirir. Eslesmeyen veya indirilemeyen girdiler terminalde acik sekilde raporlanir.

ARASAAC onerileri otomatik uretilir. Yanlis gorseller beklenmelidir. Her onerinin yayina alinmadan once insan tarafindan gozden gecirilmesi gerekir.

ARASAAC pictogramlari icin atif zorunludur ve CC BY-NC-SA kosullarina uyulmalidir.

Pictograms from ARASAAC are property of the Government of Aragón and created by Sergio Palao for ARASAAC, distributed under CC BY-NC-SA.

Emoji yalnizca fallback olarak tutulur. MyPECS, PECS veya Pics for PECS gorselleri kullanilmaz.

## PWA Guncelleme

Yeni deploylardan sonra uygulama normalde bir yenilemeden sonra guncellenmelidir. Eger mobil cihazda eski surum gorunuyorsa site verisini temizleyin veya PWA uygulamasini kaldirip yeniden yukleyin.
