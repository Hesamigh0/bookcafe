// ============================================================
// تنظیمات Supabase — این دو مقدار رو از Supabase Dashboard بردار:
// Project Settings > API > Project URL  و  anon public key
// ============================================================
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// شناسه ناشناس این مرورگر/گوشی — برای اینکه مشتری بدون لاگین بتونه سفارش‌های خودش رو ببینه
function getDeviceId() {
  let id = localStorage.getItem('deer_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('deer_device_id', id);
  }
  return id;
}

// سبد خرید ساده در localStorage
const CartStore = {
  key: 'ketab_cart',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch (e) { return []; }
  },
  save(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
  },
  add(item) {
    const items = this.get();
    const existing = items.find(i => i.name === item.name);
    if (existing) existing.qty += 1;
    else items.push({ name: item.name, price: item.price, qty: 1 });
    this.save(items);
  },
  changeQty(name, delta) {
    let items = this.get();
    items = items.map(i => i.name === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
    this.save(items);
  },
  remove(name) {
    this.save(this.get().filter(i => i.name !== name));
  },
  clear() {
    localStorage.removeItem(this.key);
  },
  total() {
    return this.get().reduce((s, i) => s + i.price * i.qty, 0);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  }
};

function toFa(n) {
  const map = {'0':'۰','1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹'};
  return String(n).split('').map(c => map[c] || c).join('');
}
