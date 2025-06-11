import { itemService } from '../services/item.service';

describe('ItemService', () => {
  // Reset the state before each test
  beforeEach(() => {
    itemService.resetState();
  });

  test('getItems returns paginated items and total count', () => {
    const { items, total } = itemService.getItems({ limit: 20, offset: 0 });
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(20);
    expect(total).toBeGreaterThanOrEqual(1000000);
  });

  test('updateSelection toggles selected correctly', () => {
    const idsToSelect = [1, 2, 3];
    const updatedCount = itemService.updateSelection(idsToSelect, true);
    expect(updatedCount).toBe(idsToSelect.length);

    const state = itemService.getState();
    expect(state.selected).toEqual(expect.arrayContaining(idsToSelect));
  });

  test('updateOrder reorders items correctly', () => {
    const newOrder = [5, 4, 3, 2, 1];
    const updatedCount = itemService.updateOrder(newOrder);
    // Only items whose order changed are counted
    expect(updatedCount).toBe(4);

    const state = itemService.getState();
    expect(state.order.slice(0, 5)).toEqual(newOrder);
  });

  test('resetState clears selections and resets order', () => {
    // Modify state first
    itemService.updateSelection([1, 2], true);
    itemService.updateOrder([2, 1]);

    itemService.resetState();

    const state = itemService.getState();
    expect(state.selected).toEqual([]);
    expect(state.order[0]).toBe(1);
    expect(state.order[1]).toBe(2);
  });

  test('getPageWithState returns page with state combined', () => {
    const page = itemService.getPageWithState({ limit: 10, offset: 0 });
    expect(page).toHaveProperty('items');
    expect(page).toHaveProperty('total');
    expect(page).toHaveProperty('selected');
    expect(page).toHaveProperty('order');
    expect(page.items.length).toBe(10);
  });
});
