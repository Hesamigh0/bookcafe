// ============================================================
// تنظیمات Supabase — این دو مقدار رو از Supabase Dashboard بردار:
// Project Settings > API > Project URL  و  anon public key
// ============================================================
const SUPABASE_URL = "sb_publishable_U7DeZAPUt2h1Nfn-0gXeFQ_6yIy2yAy";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdWx4ZmpqbmJ5cmxsdXJ1amN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMjM5ODksImV4cCI6MjEwMDc5OTk4OX0.uB3frb8Myhl9di8UDEatU8BL-QxiOX3kNr-C5n8te04";

let supabaseClient;
try {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.error('اتصال به Supabase برقرار نشد (احتمالا CDN لود نشده):', e);
  // یک نسخه جایگزین که همیشه خطای قابل کنترل برمی‌گردونه، تا بقیه سایت (خانه/پروفایل) کار کنه
  supabaseClient = {
    from() {
      const chain = {
        select: () => chain, eq: () => chain, order: () => chain, limit: () => chain,
        insert: () => chain, single: () => chain,
        then: (resolve) => resolve({ data: null, error: { message: 'no-connection' } })
      };
      return chain;
    },
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signInWithPassword: async () => ({ error: { message: 'no-connection' } }),
      signOut: async () => {}
    }
  };
}

// شناسه ناشناس این مرورگر/گوشی — برای اینکه مشتری بدون لاگین بتونه سفارش‌های خودش رو ببینه
function getDeviceId() {
  let id = localStorage.getItem('deer_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('deer_device_id', id);
  }
  return id;
}

// پروفایل مشتری (اسم و شماره) در localStorage
function getCustomerProfile() {
  try { return JSON.parse(localStorage.getItem('ketab_customer')); }
  catch (e) { return null; }
}
function setCustomerProfile(profile) {
  localStorage.setItem('ketab_customer', JSON.stringify(profile));
}
function clearCustomerProfile() {
  localStorage.removeItem('ketab_customer');
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
