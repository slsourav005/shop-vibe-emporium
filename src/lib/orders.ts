// Local store of placed orders so the logistics dashboard has visibility.
// Backend currently has no GET /orders endpoint, so we mirror submissions here.

export interface LocalOrder {
  _id: string;
  productId: string;
  productName: string;
  quantity: string;
  buyerName: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
}

const KEY = "vv_orders";

export const loadOrders = (): LocalOrder[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveOrders = (orders: LocalOrder[]) => {
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("vv:orders-changed"));
};

export const addOrder = (order: LocalOrder) => {
  const all = loadOrders();
  all.unshift(order);
  saveOrders(all);
};

export const updateOrderStatus = (id: string, status: string) => {
  const all = loadOrders().map((o) => (o._id === id ? { ...o, status } : o));
  saveOrders(all);
};
