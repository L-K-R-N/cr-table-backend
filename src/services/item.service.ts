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

  /**
   * Обновляет флаг selected для списка элементов
   * @param ids — массив ID элементов
   * @param selected — новое значение флага
   * @returns количество обновлённых элементов
   */
  updateSelection(ids: number[], selected: boolean): number {
    const items = itemStore.getItems();
    let updatedCount = 0;

    const updated = items.map((item) => {
      if (ids.includes(item.id)) {
        updatedCount++;
        return { ...item, selected };
      }
      return item;
    });

    itemStore.setItems(updated);
    return updatedCount;
  }

  /**
   * Обновляет порядок элементов по переданному массиву ID
   * @param ids — новый упорядоченный список ID
   * @returns количество элементов, у которых изменился order
   */
  updateOrder(ids: number[]): number {
    const items = itemStore.getItems();
    const idSet = new Set(ids);
    let updatedCount = 0;

    const itemsById = new Map(items.map((item) => [item.id, item]));

    const reordered: typeof items = [];

    ids.forEach((id, index) => {
      const existing = itemsById.get(id);
      if (existing) {
        const newOrder = index + 1;
        if (existing.order !== newOrder) {
          updatedCount++;
          reordered.push({ ...existing, order: newOrder });
        } else {
          reordered.push(existing);
        }
      }
    });

    items
      .filter((item) => !idSet.has(item.id))
      .sort((a, b) => a.order - b.order)
      .forEach((item) => reordered.push(item));

    itemStore.setItems(reordered);
    return updatedCount;
  }
}

export const itemService = new ItemService();
