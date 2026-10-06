import { reactive } from 'vue';
import { load, save } from '../utils/storage';

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

const KEY = 'appsp_todos';
const state = reactive({ list: load<Todo[]>(KEY, [] as Todo[]) });

function persist() { save(KEY, state.list); }

export const todoStore = {
  state,
  add(text: string) {
    const t = text.trim();
    if (!t) return;
    state.list.unshift({ id: String(Date.now()), text: t, done: false, createdAt: Date.now() });
    persist();
  },
  toggle(id: string) {
    const it = state.list.find((x) => x.id === id);
    if (it) { it.done = !it.done; persist(); }
  },
  remove(id: string) {
    state.list = state.list.filter((x) => x.id !== id);
    persist();
  },
  clearDone() {
    state.list = state.list.filter((x) => !x.done);
    persist();
  },
};
