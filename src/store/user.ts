import { reactive, computed } from 'vue';
import { load, save } from '../utils/storage';

export interface UserProfile {
  isLoggedIn: boolean;
  phone: string;
  nick: string;
  avatarColor: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  region: string;   // 省市区
  detail: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  color: string;
  spec: string;
  count: number;
}

export type OrderStatus = 'pending_pay' | 'paid' | 'shipped' | 'done' | 'refund';

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  address: Address | null;
  status: OrderStatus;
  createdAt: number;
}

export interface Coupon {
  id: string;
  title: string;
  amount: number;      // 满减面额
  threshold: number;   // 使用门槛
  expire: string;
  received: boolean;
}

const USER_KEY = 'appsp_user';
const ADDR_KEY = 'appsp_addresses';
const ORDER_KEY = 'appsp_orders';
const COUPON_KEY = 'appsp_coupons';

const state = reactive({
  user: load<UserProfile>(USER_KEY, {
    isLoggedIn: false,
    phone: '',
    nick: '未登录',
    avatarColor: '#FF8A65',
  }),
  addresses: load<Address[]>(ADDR_KEY, [] as Address[]),
  orders: load<Order[]>(ORDER_KEY, [] as Order[]),
  coupons: load<Coupon[]>(COUPON_KEY, [
    { id: 'c1', title: '新人立减券', amount: 10, threshold: 59, expire: '2026-12-31', received: false },
    { id: 'c2', title: '满99减20', amount: 20, threshold: 99, expire: '2026-11-30', received: false },
    { id: 'c3', title: '包邮券', amount: 5, threshold: 39, expire: '2026-10-31', received: false },
  ] as Coupon[]),
});

function persistUser() { save(USER_KEY, state.user); }
function persistAddr() { save(ADDR_KEY, state.addresses); }
function persistOrder() { save(ORDER_KEY, state.orders); }
function persistCoupon() { save(COUPON_KEY, state.coupons); }

export const userStore = {
  state,

  defaultAddress: computed<Address | null>(() => {
    return state.addresses.find((a) => a.isDefault) || state.addresses[0] || null;
  }),

  orderCountByStatus(status: OrderStatus) {
    return state.orders.filter((o) => o.status === status).length;
  },

  /** 手机号一键登录（本地模拟） */
  login(phone: string) {
    state.user.isLoggedIn = true;
    state.user.phone = phone;
    state.user.nick = '用户' + phone.slice(-4);
    state.user.avatarColor = '#FF8A65';
    persistUser();
  },

  logout() {
    state.user.isLoggedIn = false;
    state.user.phone = '';
    state.user.nick = '未登录';
    persistUser();
  },

  // ---------- 地址 ----------
  saveAddress(addr: Address) {
    const idx = state.addresses.findIndex((a) => a.id === addr.id);
    if (addr.isDefault) state.addresses.forEach((a) => (a.isDefault = false));
    if (idx >= 0) state.addresses[idx] = addr;
    else state.addresses.push(addr);
    persistAddr();
  },
  removeAddress(id: string) {
    state.addresses = state.addresses.filter((a) => a.id !== id);
    persistAddr();
  },
  setDefaultAddress(id: string) {
    state.addresses.forEach((a) => (a.isDefault = a.id === id));
    persistAddr();
  },

  // ---------- 订单 ----------
  createOrder(items: OrderItem[], totalPrice: number, address: Address | null): Order {
    const order: Order = {
      id: 'OD' + Date.now(),
      items,
      totalPrice,
      address,
      status: 'pending_pay',
      createdAt: Date.now(),
    };
    state.orders.unshift(order);
    persistOrder();
    return order;
  },
  updateOrderStatus(id: string, status: OrderStatus) {
    const o = state.orders.find((x) => x.id === id);
    if (o) { o.status = status; persistOrder(); }
  },

  // ---------- 优惠券 ----------
  receiveCoupon(id: string) {
    const c = state.coupons.find((x) => x.id === id);
    if (c) { c.received = true; persistCoupon(); }
  },
};
