// src/data/index.js
import { flatSushiMenu, sushiCategories } from './sushiMenu';
import { flatPizzaMenu, pizzaCategories } from './menuData';

// Всё меню (суши + пицца)
export const allMenu = [...flatSushiMenu, ...flatPizzaMenu];

// Все категории (Все + объединённые)
export const allCategories = [
    'Все',
    ...new Set([...sushiCategories.slice(1), ...pizzaCategories.slice(1)]),
];

// Найти позицию по source+id (для корзины/модалки)
export const findMenuItem = (source, id) =>
    allMenu.find((i) => i.source === source && i.id === id);

// Минимальная цена (или null)
export const minPrice = (item) => item.minPrice;