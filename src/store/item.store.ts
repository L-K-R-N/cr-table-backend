import { IItem } from '../types/item.types';

class ItemStore {
  private items: IItem[] = [];

  constructor() {
    this.generateItems(1_000_000);
  }

  private generateItems(count: number) {
    this.items = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      value: `Item ${index + 1}`,
      selected: false,
      order: index + 1,
    }));
  }

  getItems() {
    return this.items;
  }

  setItems(newItems: IItem[]) {
    this.items = newItems;
  }
}

export const itemStore = new ItemStore();
