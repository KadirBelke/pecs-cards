import type { VisualCategory } from '../types'

const ARASAAC_ATTRIBUTION =
  'ARASAAC pictogram by Sergio Palao, Government of Aragón, CC BY-NC-SA'

const arasaacCategoryIds: Record<string, number> = {
  tumu: 5596,
  istekler: 11251,
  yiyecek: 4610,
  icecek: 4575,
  duygular: 11476,
  'beden-saglik': 6473,
  'tuvalet-hijyen': 23406,
  eylemler: 7297,
  kisiler: 34560,
  yerler: 9819,
  ev: 6964,
  okul: 32446,
  'oyun-oyuncak': 9813,
  rutinler: 5898,
  'sosyal-ifadeler': 6610,
  'duyusal-ihtiyaclar': 31204,
  guvenlik: 12261,
}

function withArasaacSupport(category: VisualCategory): VisualCategory {
  const arasaacId = arasaacCategoryIds[category.id]

  if (!arasaacId) {
    return category
  }

  return {
    ...category,
    arasaacId,
    image: `/symbols/arasaac/categories/${category.id}.png`,
    imageAlt: `${category.label} kategorisi görseli`,
    attribution: ARASAAC_ATTRIBUTION,
  }
}

export const categories: VisualCategory[] = [
  { id: 'tumu', label: 'Tümü', emoji: '🧩' },
  { id: 'istekler', label: 'İstekler', emoji: '🙋' },
  { id: 'yiyecek', label: 'Yiyecek', emoji: '🍎' },
  { id: 'icecek', label: 'İçecek', emoji: '🥤' },
  { id: 'duygular', label: 'Duygular', emoji: '😊' },
  { id: 'beden-saglik', label: 'Beden / Sağlık', emoji: '🧠' },
  { id: 'tuvalet-hijyen', label: 'Tuvalet / Hijyen', emoji: '🧼' },
  { id: 'eylemler', label: 'Eylemler', emoji: '▶️' },
  { id: 'kisiler', label: 'Kişiler', emoji: '👤' },
  { id: 'yerler', label: 'Yerler', emoji: '🏠' },
  { id: 'ev', label: 'Ev', emoji: '🛋️' },
  { id: 'okul', label: 'Okul', emoji: '🏫' },
  { id: 'oyun-oyuncak', label: 'Oyun / Oyuncak', emoji: '⚽' },
  { id: 'rutinler', label: 'Rutinler', emoji: '🌞' },
  { id: 'sosyal-ifadeler', label: 'Sosyal İfadeler', emoji: '👋' },
  { id: 'duyusal-ihtiyaclar', label: 'Duyusal İhtiyaçlar', emoji: '🎧' },
  { id: 'guvenlik', label: 'Güvenlik', emoji: '🛑' },
].map(withArasaacSupport)
