// src/data/index.js
import { sushiMenu } from './sushiMenu';
import { pizzaMenu } from './menuData';

// Суши
export const flatSushiMenu = sushiMenu.map((item) => ({
  ...item,
  source: 'sushi',
  categoryId: item.category.toLowerCase().replace(/\s+/g, '-'),
  image: item.image || `/images/menu/sushi/${item.id}.png`, // если есть в объекте — берем его
  minPrice: item.variants?.length
    ? Math.min(...item.variants.filter(v => v.price != null).map(v => v.price))
    : null,
}));

// Пицца / КФС / Фаст-фуд
export const flatPizzaMenu = pizzaMenu.map((item) => ({
  ...item,
  source: 'pizza',
  categoryId: item.category.toLowerCase().replace(/\s+/g, '-'),
  image: item.image, // БЕРЕМ ПУТЬ ПРЯМО ИЗ menuData.js
  minPrice: item.variants?.length
    ? Math.min(...item.variants.filter(v => v.price != null).map(v => v.price))
    : null,
}));

export const allMenu = [...flatSushiMenu, ...flatPizzaMenu];
const menuCategories = [...new Set(allMenu.map((item) => item.category))];
const fastFoodCategories = [
  ...new Set(
    pizzaMenu
      .map((item) => item.category)
      .filter((category) => !['Акции', 'Добавки', 'Напитки'].includes(category))
  ),
];
const sushiCategories = [...new Set(sushiMenu.map((item) => item.category))];
const orderedCategories = [
  'Акции',
  ...fastFoodCategories,
  'Добавки',
  ...sushiCategories,
  'Напитки',
];

export const allCategories = [
  'Акции',
  'Все',
  ...new Set([...orderedCategories, ...menuCategories]),
].filter((category) => category === 'Все' || menuCategories.includes(category));
export const findMenuItem = (source, id) =>
  allMenu.find((i) => i.source === source && i.id === id);