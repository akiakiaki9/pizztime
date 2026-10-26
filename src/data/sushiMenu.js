// src/data/sushiMenu.js

// ====== Исходные данные ======
export const sushiMenu = [
  // ====================== РОЛЛЫ ХОЛОДНЫЕ ======================
  { id: 1, category: 'Роллы холодные', name: 'Сливочный кунсей', composition: 'Сыр сливочный, копчёный лосось, огурец, масага', variants: [{ pieces: 4, grams: 118, price: 22500 }, { pieces: 8, grams: 236, price: 45000 }] },
  { id: 2, category: 'Роллы холодные', name: 'Сливочный сальмон', composition: 'Лосось, сыр сливочный, салат айсберг', variants: [{ pieces: 4, grams: 113, price: 22500 }, { pieces: 8, grams: 226, price: 45000 }] },
  { id: 3, category: 'Роллы холодные', name: 'Филадельфия классик', composition: 'Лосось, сыр сливочный, огурец', variants: [{ pieces: 4, grams: 135, price: 32500 }, { pieces: 8, grams: 270, price: 65000 }] },
  { id: 4, category: 'Роллы холодные', name: 'Филадельфия лайт', composition: 'Сыр сливочный, лосось', variants: [{ pieces: 4, grams: 135, price: 32500 }, { pieces: 8, grams: 270, price: 65000 }] },
  { id: 5, category: 'Роллы холодные', name: 'Филадельфия с угрем', composition: 'Лосось, сыр сливочный, угорь, огурец', variants: [{ pieces: 4, grams: 140, price: 37500 }, { pieces: 8, grams: 280, price: 75000 }] },
  { id: 6, category: 'Роллы холодные', name: 'Грин с копчёным лососем', composition: 'Лосось копчёный, сыр сливочный, огурец, укроп', variants: [{ pieces: 4, grams: 110, price: 32500 }, { pieces: 8, grams: 220, price: 65000 }] },
  { id: 7, category: 'Роллы холодные', name: 'Калифорния с лососем', composition: 'Лосось, масага, сыр, огурец, майонез', variants: [{ pieces: 4, grams: 130, price: 32500 }, { pieces: 8, grams: 260, price: 65000 }] },
  { id: 8, category: 'Роллы холодные', name: 'Сливочный угорь', composition: 'Сыр сливочный, угорь, огурец, масага, унаги соус, кунжут', variants: [{ pieces: 4, grams: 121, price: 37500 }, { pieces: 8, grams: 242, price: 75000 }] },
  { id: 9, category: 'Роллы холодные', name: 'Дракон де люкс', composition: 'Угорь, сыр сливочный, снежный краб, унаги соус, кунжут', variants: [{ pieces: 4, grams: 131, price: 35000 }, { pieces: 8, grams: 262, price: 70000 }] },
  { id: 10, category: 'Роллы холодные', name: 'Дракон', composition: 'Сыр сливочный, угорь, огурец, унаги соус, кунжут', variants: [{ pieces: 4, grams: 133, price: 32500 }, { pieces: 8, grams: 266, price: 65000 }] },
  { id: 11, category: 'Роллы холодные', name: 'Канада', composition: 'Угорь, сыр сливочный, лосось, огурец, унаги соус, масага, кунжут', variants: [{ pieces: 4, grams: 140, price: 37500 }, { pieces: 8, grams: 280, price: 75000 }] },
  { id: 12, category: 'Роллы холодные', name: 'Аляска', composition: 'Лосось, угорь, сыр сливочный, огурец, кунжут', variants: [{ pieces: 4, grams: 117, price: 25000 }, { pieces: 8, grams: 234, price: 50000 }] },
  { id: 13, category: 'Роллы холодные', name: 'Окинава', composition: 'Снежный краб, сыр сливочный, лосось, огурец', variants: [{ pieces: 4, grams: 117.5, price: 20000 }, { pieces: 8, grams: 235, price: 40000 }] },
  { id: 14, category: 'Роллы холодные', name: 'Калифорния с оранж', composition: 'Снежный краб, масага, сыр, огурец', variants: [{ pieces: 4, grams: 130, price: 30000 }, { pieces: 8, grams: 260, price: 60000 }] },
  { id: 15, category: 'Роллы холодные', name: 'Сливочный тунец', composition: 'Сыр сливочный, тунец, салат айсберг, масага', variants: [{ pieces: 4, grams: 118, price: 27500 }, { pieces: 8, grams: 236, price: 55000 }] },
  { id: 16, category: 'Роллы холодные', name: 'Филадельфия с тунцом', composition: 'Тунец, сыр сливочный, огурец', variants: [{ pieces: 4, grams: 125, price: 37500 }, { pieces: 8, grams: 250, price: 75000 }] },
  { id: 17, category: 'Роллы холодные', name: 'Осака', composition: 'Сыр сливочный, лосось, тунец, масага, огурец, кунжут', variants: [{ pieces: 4, grams: 133, price: 35000 }, { pieces: 8, grams: 266, price: 70000 }] },
  { id: 18, category: 'Роллы холодные', name: 'Грин с курицей', composition: 'Курица копчёная, сыр сливочный, огурец, укроп', variants: [{ pieces: 4, grams: 110, price: 22500 }, { pieces: 8, grams: 220, price: 45000 }] },
  { id: 19, category: 'Роллы холодные', name: 'Белые ночи', composition: 'Сыр сливочный, курица, огурец, унаги соус, кунжут', variants: [{ pieces: 4, grams: 117.5, price: 30000 }, { pieces: 8, grams: 235, price: 60000 }] },
  { id: 20, category: 'Роллы холодные', name: 'Тори чиз', composition: 'Курица, сыр сливочный, унаги соус, огурец, кунжут', variants: [{ pieces: 4, grams: 117.5, price: 20000 }, { pieces: 8, grams: 235, price: 40000 }] },
  { id: 21, category: 'Роллы холодные', name: 'Южный', composition: 'Масага, сыр сливочный, огурец, курица', variants: [{ pieces: 4, grams: 130, price: 27500 }, { pieces: 8, grams: 260, price: 55000 }] },
  { id: 22, category: 'Роллы холодные', name: 'Ролл Цезарь', composition: 'Курица, помидор, соус цезарь, сыр моцарелла, салат айсберг', variants: [{ pieces: 4, grams: 120, price: 22500 }, { pieces: 8, grams: 240, price: 45000 }] },
  { id: 23, category: 'Роллы холодные', name: 'Сливочная креветка', composition: 'Сыр сливочный, креветка, огурец, масага', variants: [{ pieces: 4, grams: 118, price: 27500 }, { pieces: 8, grams: 236, price: 55000 }] },
  { id: 24, category: 'Роллы холодные', name: 'Калифорния с креветкой', composition: 'Креветка, масага, сыр сливочный, огурец, майонез', variants: [{ pieces: 4, grams: 130, price: 37500 }, { pieces: 8, grams: 260, price: 75000 }] },

  // ====================== ЗАПЕЧЁННЫЕ РОЛЛЫ ======================
  { id: 25, category: 'Запечённые роллы', name: 'Динамит с лососем', composition: 'Лосось, омлет, соус сырный, сыр сливочный, огурец', variants: [{ pieces: 4, grams: 138, price: 27500 }, { pieces: 8, grams: 276, price: 55000 }] },
  { id: 26, category: 'Запечённые роллы', name: 'Динамит спайси с лососем', composition: 'Лосось, омлет, спайси сырный соус, огурец, лук зелёный', variants: [{ pieces: 4, grams: 129, price: 27500 }, { pieces: 8, grams: 258, price: 55000 }] },
  { id: 27, category: 'Запечённые роллы', name: 'Динамит с угрем', composition: 'Угорь, омлет, сырный соус, огурец, сыр сливочный, кунжут', variants: [{ pieces: 4, grams: 145, price: 32500 }, { pieces: 8, grams: 290, price: 65000 }] },
  { id: 28, category: 'Запечённые роллы', name: 'Динамит с омлетом', composition: 'Омлет, сырный соус, огурец, лук зелёный, кунжут', variants: [{ pieces: 4, grams: 145, price: 25000 }, { pieces: 8, grams: 290, price: 50000 }] },
  { id: 29, category: 'Запечённые роллы', name: 'Динамит со спайси-крабом', composition: 'Снежный краб, масага, омлет, огурец, спайси сырный соус, лук зелёный', variants: [{ pieces: 4, grams: 144, price: 30000 }, { pieces: 8, grams: 288, price: 60000 }] },
  { id: 30, category: 'Запечённые роллы', name: 'Динамит с крабом', composition: 'Снежный краб, омлет, соус сырный, сыр сливочный, огурец, масага', variants: [{ pieces: 4, grams: 135, price: 30000 }, { pieces: 8, grams: 270, price: 60000 }] },
  { id: 31, category: 'Запечённые роллы', name: 'Калифорния хот', composition: 'Снежный краб, масага, соус сырный, сыр, огурец', variants: [{ pieces: 4, grams: 142, price: 30000 }, { pieces: 8, grams: 284, price: 60000 }] },
  { id: 32, category: 'Запечённые роллы', name: 'Динамит спайси с курицей', composition: 'Курица, омлет, спайси сырный соус, огурец, кунжут, лук зелёный', variants: [{ pieces: 4, grams: 137, price: 22500 }, { pieces: 8, grams: 274, price: 45000 }] },
  { id: 33, category: 'Запечённые роллы', name: 'Динамит с курицей', composition: 'Курица, омлет, огурец, сыр сливочный, сырный соус, кунжут', variants: [{ pieces: 4, grams: 145, price: 22500 }, { pieces: 8, grams: 290, price: 45000 }] },
  { id: 34, category: 'Запечённые роллы', name: 'Южный запечённый', composition: 'Курица, масаго, сыр сливочный, огурец', variants: [{ pieces: 4, grams: 147, price: 30000 }, { pieces: 8, grams: 294, price: 60000 }] },
  { id: 35, category: 'Запечённые роллы', name: 'Миланский запечённый', composition: 'Курица, сыр моцарелла, сыр сливочный, сыр чеддер, унаги соус', variants: [{ pieces: 4, grams: 115, price: 25000 }, { pieces: 8, grams: 230, price: 50000 }] },
  { id: 36, category: 'Запечённые роллы', name: 'Эби темпура', composition: 'Креветка темпура, масага, огурец, спайси соус, кунжут', variants: [{ pieces: 4, grams: 118, price: 32500 }, { pieces: 8, grams: 236, price: 65000 }] },
  { id: 37, category: 'Запечённые роллы', name: 'Динамит с креветкой', composition: 'Креветка, омлет, соус сырный, сыр сливочный, огурец, масаго', variants: [{ pieces: 4, grams: 148, price: 32500 }, { pieces: 8, grams: 296, price: 65000 }] },

  // ====================== ГОРЯЧИЕ РОЛЛЫ ======================
  { id: 38, category: 'Горячие роллы', name: 'Темпура лосось', composition: 'Лосось, сыр сливочный, огурец, кляр, сухари панировочные', variants: [{ pieces: 4, grams: 130, price: 25000 }, { pieces: 8, grams: 260, price: 50000 }] },
  { id: 39, category: 'Горячие роллы', name: 'Темпура с угрем', composition: 'Угорь, сыр сливочный, огурец, кляр, сухари панировочные', variants: [{ pieces: 4, grams: 130, price: 27500 }, { pieces: 8, grams: 260, price: 55000 }] },
  { id: 40, category: 'Горячие роллы', name: 'Темпура с крабом', composition: 'Снежный краб, сыр сливочный, огурец, кляр, сухари панировочные, масага', variants: [{ pieces: 4, grams: 133, price: 20000 }, { pieces: 8, grams: 266, price: 40000 }] },
  { id: 41, category: 'Горячие роллы', name: 'Темпура с креветкой', composition: 'Креветка, сыр сливочный, огурец, кляр, сухари панировочные', variants: [{ pieces: 4, grams: 133, price: 27500 }, { pieces: 8, grams: 266, price: 55000 }] },
  { id: 42, category: 'Горячие роллы', name: 'Темпура с курицей', composition: 'Курица, сыр сливочный, огурец, кляр, сухари панировочные', variants: [{ pieces: 4, grams: 130, price: 20000 }, { pieces: 8, grams: 260, price: 40000 }] },

  // ====================== СУШИ ======================
  { id: 43, category: 'Суши', name: 'Суши с лососем', composition: null, variants: [{ pieces: 1, price: 15000 }] },
  { id: 44, category: 'Суши', name: 'Суши с креветкой', composition: null, variants: [{ pieces: 1, price: 15000 }] },
  { id: 45, category: 'Суши', name: 'Суши с угрем', composition: null, variants: [{ pieces: 1, price: 15000 }] },

  // ====================== СЭНДВИЧ-РОЛЛЫ ======================
  { id: 46, category: 'Сэндвич-роллы', name: 'Сэндвич с лососем', composition: null, variants: [{ pieces: 1, price: 60000 }] },
  { id: 47, category: 'Сэндвич-роллы', name: 'Сэндвич с омлетом и чуккой', composition: null, variants: [{ pieces: 1, price: 55000 }] },
  { id: 48, category: 'Сэндвич-роллы', name: 'Сэндвич с курицей', composition: null, variants: [{ pieces: 1, price: 50000 }] },
  { id: 49, category: 'Сэндвич-роллы', name: 'Сэндвич с угрем', composition: null, variants: [{ pieces: 1, price: 65000 }] },

  // ====================== УДОН ======================
  { id: 50, category: 'Удон', name: 'Удон с овощами', composition: 'С рисом цена одинаковая', variants: [{ price: 40000 }] },
  { id: 51, category: 'Удон', name: 'Удон с креветками', composition: 'С рисом цена одинаковая', variants: [{ price: 45000 }] },
  { id: 52, category: 'Удон', name: 'Удон с курицей', composition: 'С рисом цена одинаковая', variants: [{ price: 45000 }] },
  { id: 53, category: 'Удон', name: 'Удон с говядиной', composition: 'С рисом цена одинаковая', variants: [{ price: 45000 }] },

  // ====================== ЖАРЕНЫЙ РИС ======================
  { id: 54, category: 'Жареный рис', name: 'Рис обжаренный с овощами', composition: null, variants: [{ price: 40000 }] },
  { id: 55, category: 'Жареный рис', name: 'Рис обжаренный с курицей', composition: null, variants: [{ price: 45000 }] },
  { id: 56, category: 'Жареный рис', name: 'Рис обжаренный с креветками', composition: null, variants: [{ price: 45000 }] },
  { id: 57, category: 'Жареный рис', name: 'Рис обжаренный с говядиной', composition: null, variants: [{ price: 45000 }] },

  // ====================== ОНИГИРИ ======================
  { id: 58, category: 'Онигири', name: 'Онигири с крабом', composition: null, variants: [{ price: 20000 }] },
  { id: 59, category: 'Онигири', name: 'Онигири с лососем', composition: null, variants: [{ price: 20000 }] },
  { id: 60, category: 'Онигири', name: 'Онигири с креветкой', composition: null, variants: [{ price: 20000 }] },
  { id: 61, category: 'Онигири', name: 'Онигири с курицей', composition: null, variants: [{ price: 20000 }] },

  // ====================== ЗАКУСКИ ======================
  { id: 62, category: 'Закуски', name: 'Картофель по-деревенски', composition: null, variants: [{ price: 18000 }] },
  { id: 63, category: 'Закуски', name: 'Картофель фри', composition: null, variants: [{ price: 18000 }] },
  { id: 64, category: 'Закуски', name: 'Креветки темпура', composition: null, variants: [{ pieces: 3, price: 35000 }, { pieces: 5, price: 55000 }] },

  // ====================== СЕТЫ ======================
  { id: 65, category: 'Сеты', name: 'Сет Квартет Хот', composition: 'Динамит лосось, динамит краб, динамит креветка, динамит с курицей', variants: [{ pieces: 32, price: 180000 }] },
  { id: 66, category: 'Сеты', name: 'Темпура четыре звезды', composition: 'Темпура с крабом, темпура лосось, темпура креветки, темпура с курицей', variants: [{ pieces: 32, price: 140000 }] },
  { id: 67, category: 'Сеты', name: 'Сет темпура квартет', composition: 'Темпура курица, темпура лосось, темпура с угрем, темпура креветки', variants: [{ pieces: 32, price: 165000 }] },
  { id: 68, category: 'Сеты', name: 'Сет Ням-Ням', composition: 'Калифорния оранж, филадельфия классик, динамит с лососем, динамит с крабом', variants: [{ pieces: 32, price: 185000 }] },
  { id: 69, category: 'Сеты', name: 'Сет Студенческий', composition: 'Калифорния оранж, филадельфия классик, Дракон, тори чиз', variants: [{ pieces: 16, price: 125000 }] },
  { id: 70, category: 'Сеты', name: 'Пять звёзд запечённый', composition: 'Динамит лосось, динамит краб, динамит креветка, динамит с курицей, динамит с омлетом', variants: [{ pieces: 40, price: 230000 }] },
  { id: 71, category: 'Сеты', name: 'Сет Хот мини', composition: 'Динамит лосось, динамит краб, динамит курица', variants: [{ pieces: 24, price: 135000 }] },
  { id: 72, category: 'Сеты', name: 'Сет ТРИО Темпура', composition: 'Темпура курица, темпура лосось, темпура с креветкой', variants: [{ pieces: 24, price: 145000 }] },
  { id: 73, category: 'Сеты', name: 'Сет Мега', composition: 'Калифорния оранж, калифорния с лососем, южный, сливочный сальмон, динамит с лососем, динамит с курицей, динамит с омлетом, динамит с крабом', variants: [{ pieces: 64, price: 380000 }] },
  { id: 74, category: 'Сеты', name: 'Сет Спринг', composition: 'Калифорния оранж, филадельфия классик, южные', variants: [{ pieces: 24, price: 135000 }] },
  { id: 75, category: 'Сеты', name: 'Сет Флеш', composition: 'Филадельфия лайт, тори чиз, южный, динамит с лососем, динамит с крабом', variants: [{ pieces: 40, price: 215000 }] },
  { id: 76, category: 'Сеты', name: 'Сет Кансин', composition: 'Сливочный кунсей, окинава, белые ночи', variants: [{ pieces: 24, price: 105000 }] },

  // ====================== НОВЫЕ БЛЮДА (ЗАКУСКИ И САЛАТЫ) ======================
  { id: 83, category: 'Закуски и салаты', name: 'Цезарь с курицей', composition: null, variants: [{ price: 45000 }] },
  { id: 84, category: 'Закуски и салаты', name: 'Цезарь с лососем/креветкой', composition: null, variants: [{ price: 50000 }] },
  { id: 85, category: 'Закуски и салаты', name: 'Тар-тар хлеб', composition: null, variants: [{ price: 15000 }] },
  { id: 86, category: 'Закуски и салаты', name: 'Салат Чукка', composition: null, variants: [{ grams: 140, price: 25000 }] },

  // ====================== ПЕРЕНЕСЕНО ИЗ menuData.js (бывшая категория «Роллы») ======================
  { id: 90, category: 'Запечённые роллы', name: 'Запечённый Киото', composition: 'Запечённый ролл, 8 шт', variants: [{ pieces: 8, price: 60000 }] },
  { id: 91, category: 'Запечённые роллы', name: 'Запечённый Фудзи', composition: 'Запечённый ролл, 8 шт', variants: [{ pieces: 8, price: 60000 }] },
  { id: 92, category: 'Роллы холодные', name: 'Дух Японии', composition: 'Ролл, 8 шт', variants: [{ pieces: 8, price: 55000 }] },
  { id: 93, category: 'Горячие роллы', name: 'Хрустящий ролл', composition: 'Хрустящий ролл, 8 шт', variants: [{ pieces: 8, price: 55000 }] },

  // ====================== СОУСЫ ======================
  { id: 77, category: 'Соусы', name: 'Соевый соус', composition: null, variants: [{ grams: 40, price: 5000 }] },
  { id: 78, category: 'Соусы', name: 'Васаби', composition: null, variants: [{ grams: 10, price: 5000 }] },
  { id: 79, category: 'Соусы', name: 'Имбирь', composition: null, variants: [{ grams: 40, price: 5000 }] },
  { id: 80, category: 'Соусы', name: 'Спайси соус', composition: null, variants: [{ grams: 40, price: 5000 }] },
  { id: 81, category: 'Соусы', name: 'Сырный соус', composition: null, variants: [{ grams: 40, price: 5000 }] },
  { id: 95, category: 'Соусы', name: 'Чесночный соус (фирменный)', composition: null, variants: [{ grams: 40, price: 5000 }] },
  { id: 96, category: 'Соусы', name: 'Томатный соус', composition: null, variants: [{ grams: 40, price: 5000 }] },
];

// ====== Плоский список для UI ======
// Добавляем: image, categoryId, minPrice (null если цены нет), hasPrice
export const flatSushiMenu = sushiMenu.map((item) => ({
  ...item,
  source: 'sushi',
  categoryId: item.category.toLowerCase().replace(/\s+/g, '-'),
  image: `/images/menu/sushi/${item.id}.png`,
  minPrice: item.variants && item.variants[0]?.price != null
    ? Math.min(...item.variants.filter((v) => v.price != null).map((v) => v.price))
    : null,
}));

// ====== Категории суши ======
export const sushiCategories = [
  'Все',
  ...new Set(sushiMenu.map((i) => i.category)),
];