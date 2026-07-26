-- ============================================================
-- Cafe Ketab — Supabase schema (نسخه ایمن برای اجرای چندباره)
-- اجرا: توی Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================

-- دسته‌ها و آیتم‌های منو
create table if not exists menu_items (
  id bigint generated always as identity primary key,
  category text not null,
  name text not null,
  price integer not null,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- سفارش‌ها
create table if not exists orders (
  id bigint generated always as identity primary key,
  device_id text not null,
  customer_name text,
  customer_phone text,
  status text not null default 'pending',
  total integer not null default 0,
  note text,
  created_at timestamptz not null default now()
);

-- ردیف‌های هر سفارش
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references orders(id) on delete cascade,
  item_name text not null,
  price integer not null,
  qty integer not null default 1
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- هر پالیسی رو اول پاک می‌کنیم بعد می‌سازیم، تا اجرای دوباره خطا نده
drop policy if exists "menu is public readable" on menu_items;
create policy "menu is public readable"
  on menu_items for select
  using (true);

drop policy if exists "anyone can create an order" on orders;
create policy "anyone can create an order"
  on orders for insert
  with check (true);

drop policy if exists "customer reads own orders by device_id" on orders;
create policy "customer reads own orders by device_id"
  on orders for select
  using (true);

drop policy if exists "anyone can insert order_items" on order_items;
create policy "anyone can insert order_items"
  on order_items for insert
  with check (true);

drop policy if exists "order_items are readable" on order_items;
create policy "order_items are readable"
  on order_items for select
  using (true);

drop policy if exists "authenticated users can update orders" on orders;
create policy "authenticated users can update orders"
  on orders for update
  using (auth.role() = 'authenticated');

drop policy if exists "authenticated users can manage menu" on menu_items;
create policy "authenticated users can manage menu"
  on menu_items for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated users can update menu" on menu_items;
create policy "authenticated users can update menu"
  on menu_items for update
  using (auth.role() = 'authenticated');

drop policy if exists "authenticated users can delete menu" on menu_items;
create policy "authenticated users can delete menu"
  on menu_items for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- داده اولیه منو — فقط اگه جدول خالیه اضافه کن (برای جلوگیری از تکراری‌شدن)
-- ============================================================
insert into menu_items (category, name, price, sort_order)
select * from (values
('اسپرسو بار','اسپرسو',110,1),
('اسپرسو بار','آمریکانو',110,2),
('اسپرسو بار','لاته',177,3),
('اسپرسو بار','کاپوچینو',157,4),
('اسپرسو بار','موکا',111,5),
('اسپرسو بار','کورتادو',135,6),

('سرد بر پایه قهوه','آیس اسپرسو',110,1),
('سرد بر پایه قهوه','آیس آمریکانو',110,2),
('سرد بر پایه قهوه','آیس لاته',177,3),
('سرد بر پایه قهوه','آیس کاپو',157,4),
('سرد بر پایه قهوه','آیس موکا',111,5),
('سرد بر پایه قهوه','آیس کورتادو',135,6),
('سرد بر پایه قهوه','آفوگاتو',151,7),
('سرد بر پایه قهوه','آرانچا',145,8),

('شیک بار','نوتلا',170,1),
('شیک بار','مام سیتی',135,2),
('شیک بار','پینات چیز',145,3),
('شیک بار','شیک اسپرسو',190,4),
('شیک بار','شکلات',146,5),
('شیک بار','ماسالا',156,6),
('شیک بار','پروتئین',216,7),

('ماکتیل','موهیتو',135,1),
('ماکتیل','لیموناد',125,2),
('ماکتیل','سولارا',145,3),
('ماکتیل','روبی',110,4),
('ماکتیل','گتسبی',145,5),

('گرم نوش','هات چاکلت',125,1),
('گرم نوش','ماسالا',110,2),
('گرم نوش','شیر بیسکوئیت',115,3),
('گرم نوش','شیر عسل زعفرون',110,4),
('گرم نوش','هات پینات',115,5),
('گرم نوش','شیرچای',90,6),

('چای و دمنوش','چای سیاه',30,1),
('چای و دمنوش','دمنوش جنگلی',35,2),
('چای و دمنوش','چای ترش',40,3),
('چای و دمنوش','به لیمو',35,4)
) as v(category, name, price, sort_order)
where not exists (select 1 from menu_items limit 1);
