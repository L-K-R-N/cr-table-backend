import { itemStore } from '../store/item.store';
import { IItem } from '../types/item.types';

interface GetItemsParams {
  search?: string;
  limit: number;
  offset: number;
  sortBy?: 'order' | 'value';
  sortDir?: 'asc' | 'desc';
}

class ItemService {
  getItems({ search, limit, offset, sortBy = 'order', sortDir = 'asc' }: GetItemsParams): {
    items: IItem[];
    total: number;
  } {
    let items = itemStore.getItems();

    // Поиск
    if (search) {
      const query = search.toLowerCase();
      items = items.filter((item) => item.value.toLowerCase().includes(query));
    }

    // Сортировка
    items = items.sort((a, b) => {
      const aField = a[sortBy];
      const bField = b[sortBy];

      if (typeof aField === 'string' && typeof bField === 'string') {
        return sortDir === 'asc' ? aField.localeCompare(bField) : bField.localeCompare(aField);
      }

      return sortDir === 'asc'
        ? (aField as number) - (bField as number)
        : (bField as number) - (aField as number);
    });

    const total = items.length;

    // Пагинация
    const paginated = items.slice(offset, offset + limit);

    return {
      items: paginated,
      total,
    };
  }
}

export const itemService = new ItemService();
