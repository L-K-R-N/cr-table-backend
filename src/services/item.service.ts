import { itemStore } from '../store/item.store';
import { IItem } from '../types/item.types';

interface GetItemsParams {
  search?: string;
  limit: number;
  offset: number;
  sortBy?: 'order' | 'value';
  sortDir?: 'asc' | 'desc';
}

export class ItemService {
  getItems({ search, limit, offset, sortBy = 'order', sortDir = 'asc' }: GetItemsParams): {
    items: IItem[];
    total: number;
  } {
    let items = itemStore.getItems();

    if (search) {
      const query = search.toLowerCase();
      items = items.filter((item) => item.value.toLowerCase().includes(query));
    }

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

    const paginated = items.slice(offset, offset + limit);

    return {
      items: paginated,
      total,
    };
  }

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

  updateOrder(ids: number[]): number {
    const items = itemStore.getItems();
    const idSet = new Set(ids);
    let updatedCount = 0;

    const itemsById = new Map(items.map((item) => [item.id, item]));
    const reordered: IItem[] = [];

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

    items.filter((item) => !idSet.has(item.id)).forEach((item) => reordered.push(item));

    itemStore.setItems(reordered);
    return updatedCount;
  }

  getState(): { selected: number[]; order: number[] } {
    const items = itemStore.getItems();

    const order = items.map((item) => item.id);
    const selected = items.filter((item) => item.selected).map((item) => item.id);
    return { selected, order };
  }

  resetState(): void {
    const items = itemStore.getItems();
    const resetItems: IItem[] = items.map((item) => ({
      id: item.id,
      value: item.value,
      selected: false,
      order: item.id,
    }));
    itemStore.setItems(resetItems);
  }

  getPageWithState(params: {
    search?: string;
    limit: number;
    offset: number;
    sortBy?: 'order' | 'value';
    sortDir?: 'asc' | 'desc';
  }) {
    const { items, total } = this.getItems(params);
    const { selected, order } = this.getState();
    return { items, total, selected, order };
  }
}

export const itemService = new ItemService();
