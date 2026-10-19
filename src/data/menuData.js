// src/data/menuData.js
export const pizzaMenu = [
  // ====================== ПИЦЦЫ ======================
  {
    id: 101,
    category: 'Пиццы',
    name: 'Сырная (NEW)',
    composition: '3 вида сыра, dor blue cheese',
    image: '/images/fast-food/101.PNG',
    variants: [
      { size: 25, price: 55000 },
      { size: 30, price: 85000 },
      { size: 35, price: 105000 },
    ],
  },
  {
    id: 102,
    category: 'Пиццы',
    name: 'Маргарита',
    composition: 'Сыр, соус томатный, помидоры, маслины',
    image: '/images/fast-food/102.PNG',
    variants: [
      { size: 25, price: 50000 },
      { size: 30, price: 80000 },
      { size: 35, price: 95000 },
    ],
  },
  {
    id: 103,
    category: 'Пиццы',
    name: 'Мясная с помидорами',
    composition: 'Сыр, соус томатный, мясо говяжий, помидоры',
    image: '/images/fast-food/103.PNG',
    variants: [
      { size: 25, price: 60000 },
      { size: 30, price: 90000 },
      { size: 35, price: 120000 },
    ],
  },
  {
    id: 104,
    category: 'Пиццы',
    name: 'Chicken с помидорами',
    composition: 'Сыр, соус, помидоры, куриная грудка',
    image: '/images/fast-food/104.PNG',
    variants: [
      { size: 25, price: 50000 },
      { size: 30, price: 85000 },
      { size: 35, price: 100000 },
    ],
  },
  {
    id: 105,
    category: 'Пиццы',
    name: 'Пеперони',
    composition: 'Сыр, томатный соус, колбаса пеперони',
    image: '/images/fast-food/105.PNG',
    variants: [
      { size: 25, price: 70000 },
      { size: 30, price: 90000 },
      { size: 35, price: 110000 },
    ],
  },
  {
    id: 106,
    category: 'Пиццы',
    name: 'Мясная с грибами',
    composition: 'Сыр, соус, мясо говяжий, грибы',
    image: '/images/fast-food/106.PNG',
    variants: [
      { size: 25, price: 60000 },
      { size: 30, price: 90000 },
      { size: 35, price: 120000 },
    ],
  },
  {
    id: 107,
    category: 'Пиццы',
    name: 'Chicken с грибами',
    composition: 'Сыр, соус, грибы, куриная грудка',
    image: '/images/fast-food/107.PNG',
    variants: [
      { size: 25, price: 50000 },
      { size: 30, price: 85000 },
      { size: 35, price: 100000 },
    ],
  },
  {
    id: 108,
    category: 'Пиццы',
    name: 'Грибная',
    composition: 'Сыр, грибы, томатный соус',
    image: '/images/fast-food/108.PNG',
    variants: [
      { size: 25, price: 55000 },
      { size: 30, price: 85000 },
      { size: 35, price: 100000 },
    ],
  },
  {
    id: 109,
    category: 'Пиццы',
    name: 'Pizza Президент',
    composition:
      '3 вида сыра, Президент, сырный соус, мясо гов, ветчина, соль, огурцы, помидоры, зелень',
    image: '/images/fast-food/109.PNG',
    variants: [
      { size: 30, price: 115000 },
      { size: 35, price: 140000 },
    ],
  },
  {
    id: 110,
    category: 'Пиццы',
    name: 'Американо',
    composition: 'Сыр, соус томатный, ветчина, салями, грибы, корнишоны',
    image: '/images/fast-food/110.PNG',
    variants: [
      { size: 25, price: 90000 },
      { size: 30, price: 115000 },
    ],
  },
  {
    id: 111,
    category: 'Пиццы',
    name: 'Мясной Комби',
    composition:
      'Сыр, соус, мясо говяжий и барбекю, мясо говяжий, помидор, маслины, шампиньоны',
    image: '/images/fast-food/111.PNG',
    variants: [
      { size: 30, price: 110000 },
      { size: 35, price: 135000 },
    ],
  },
  {
    id: 112,
    category: 'Пиццы',
    name: 'Pizza Time (новинка)',
    composition:
      'Сыр, соус, колбаса чедр, болгарский перец, помидоры, шампиньоны, маслины, зелень',
    image: '/images/fast-food/112.PNG',
    variants: [
      { size: 30, price: 130000 },
      { size: 35, price: 160000 },
    ],
  },
  {
    id: 113,
    category: 'Пиццы',
    name: 'Итальяно',
    composition: 'Сыр, соус, курица, грибы, помидор',
    image: '/images/fast-food/113.PNG',
    variants: [
      { size: 25, price: 90000 },
      { size: 30, price: 110000 },
    ],
  },
  {
    id: 114,
    category: 'Пиццы',
    name: '4 Сезона',
    composition:
      'Сыр, соус, мясо говяжий, пепперони колбаса, шампиньоны, помидоры',
    image: '/images/fast-food/114.PNG',
    variants: [
      { size: 30, price: 120000 },
      { size: 35, price: 145000 },
    ],
  },

  // ====================== КФС ======================
  {
    id: 201,
    category: 'КФС',
    name: 'Крылышки',
    composition: 'Куриные крылышки в хрустящей панировке',
    image: '/images/fast-food/201.PNG',
    variants: [{ price: 85000 }],
  },

  // ====================== РОЛЛЫ ======================
  {
    id: 301,
    category: 'Роллы',
    name: 'Запечённый Киото',
    composition: 'Запечённый ролл, 8 шт',
    image: '/images/fast-food/301.PNG',
    variants: [{ pieces: 8, price: 60000 }],
  },
  {
    id: 302,
    category: 'Роллы',
    name: 'Запечённый Фудзи',
    composition: 'Запечённый ролл, 8 шт',
    image: '/images/fast-food/302.PNG',
    variants: [{ pieces: 8, price: 60000 }],
  },
  {
    id: 303,
    category: 'Роллы',
    name: 'Дух Японии',
    composition: 'Ролл, 8 шт',
    image: '/images/fast-food/303.PNG',
    variants: [{ pieces: 8, price: 55000 }],
  },
  {
    id: 304,
    category: 'Роллы',
    name: 'Хрустящий ролл',
    composition: 'Хрустящий ролл, 8 шт',
    image: '/images/fast-food/304.PNG',
    variants: [{ pieces: 8, price: 55000 }],
  },

  // ====================== ХОТ-ДОГИ ======================
  {
    id: 401,
    category: 'Хот-доги',
    name: 'Хот-дог',
    composition: 'Классический хот-дог',
    image: '/images/fast-food/401.PNG',
    variants: [{ price: 16000 }, { price: 20000 }, { price: 24000 }],
  },

  // ====================== ЛАВАШИ ======================
  {
    id: 501,
    category: 'Лаваши',
    name: 'Лаваш',
    composition: 'Лаваш с начинкой',
    image: '/images/fast-food/501.PNG',
    variants: [{ price: 32000 }, { price: 38000 }, { price: 43000 }],
  },

  // ====================== АРАБ-КАБОБ ======================
  {
    id: 601,
    category: 'Араб кабоб',
    name: 'Араб кабоб',
    composition: 'Арабский кабоб',
    image: '/images/fast-food/601.PNG',
    variants: [{ price: 32000 }, { price: 38000 }],
  },
];