import { reactive, computed } from 'vue';
import { load, save } from '../utils/storage';

export interface CartItem {
  id: string;        // 购物车行 id = productId + spec
  productId: string;
  title: string;
  price: number;
  color: string;
  spec: string;
  count: number;
  checked: boolean;
}

const KEY = 'appsp_cart';

interface CartState {
  items: CartItem[];
}

const state = reactive<CartState>({
  items: load<CartItem[]>(KEY, []),
});

function persist() {
  save(KEY, state.items);
}

export const cartStore = {
  state,
  totalCount: computed(() => state.items.reduce((s, i) => s + i.count, 0)),
  checkedCount: computed(() => state.items.filter((i) => i.checked).reduce((s, i) => s + i.count, 0)),
  checkedPrice: computed(() =>
    state.items.filter((i) => i.checked).reduce((s, i) => s + i.price * i.count, 0),
  ),

  add(item: Omit<CartItem, 'id' | 'count' | 'checked'>, count = 1) {
    const lineId = `${item.productId}_${item.spec}`;
    const exist = state.items.find((i) => i.id === lineId);
    if (exist) {
      exist.count += count;
    } else {
      state.items.push({ ...item, id: lineId, count, checked: true });
    }
    persist();
  },

  changeCount(id: string, delta: number) {
    const it = state.items.find((i) => i.id === id);
    if (!it) return;
    it.count += delta;
    if (it.count <= 0) {
      state.items = state.items.filter((i) => i.id !== id);
    }
    persist();
  },

  setChecked(id: string, checked: boolean) {
    const it = state.items.find((i) => i.id === id);
    if (it) it.checked = checked;
    persist();
  },

  toggleAll(checked: boolean) {
    state.items.forEach((i) => (i.checked = checked));
    persist();
  },

  remove(id: string) {
    state.items = state.items.filter((i) => i.id !== id);
    persist();
  },

  clearChecked() {
    state.items = state.items.filter((i) => !i.checked);
    persist();
  },

  clear() {
    state.items = [];
    persist();
  },
};
