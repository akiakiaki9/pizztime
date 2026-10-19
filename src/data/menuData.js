// src/data/menuData.js
// Здесь будут пицца, фаст-фуд, напитки.
// Структура — та же, что в sushiMenu.js. Пока пусто.

export const pizzaMenu = []; // сюда будут пицца, бургеры, напитки

export const flatPizzaMenu = pizzaMenu.map((item) => ({
  ...item,
  source: 'pizza',
  categoryId: item.category.toLowerCase().replace(/\s+/g, '-'),
  image: `/images/menu/pizza/${item.id}.png`,
  minPrice: item.variants && item.variants[0]?.price != null
    ? Math.min(...item.variants.filter((v) => v.price != null).map((v) => v.price))
    : null,
}));

export const pizzaCategories = [
  'Все',
  ...new Set(pizzaMenu.map((i) => i.category)),
];