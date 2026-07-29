--  
-- Cafe Ketab — افزودن جدول مشتری‌ها (اجرای دوم، بعد از supabase-setup.sql) 
-- این فایل رو هم توی SQL Editor کپی و Run کن — ایمنه برای اجرای چندباره 
-- 

create table if not exists customers ( 
id bigint generated always as identity primary key, 
name text not null, 
phone text not null unique, 
created_at timestamptz not null default now() 
);

alter table customers enable row level security;

drop policy if exists "anyone can register as customer" on customers; 
create policy "anyone can register as customer" 
on customers for insert 
with check (true);

drop policy if exists "anyone can read customers" on customers; 
create policy "anyone can read customers" 
on customers for select 
using (true);

-- ستون‌های customer_name و customer_phone از قبل روی جدول orders هست، 
-- فقط مطمئن می‌شیم که وجود دارن (اگه از قبل ساخته شده، خطا نمیده): 
alter table orders add column if not exists customer_name text; 
alter table orders add column if not exists customer_phone text;
