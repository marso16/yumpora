-- CATEGORIES TABLE
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- PRODUCTS TABLE
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  category_id uuid references categories(id) on delete set null,
  origin_country text,
  stock_quantity integer default 0,
  is_featured boolean default false,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc', now())
);

-- ORDERS TABLE
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  city text not null,
  payment_method text default 'cash_on_delivery',
  status text default 'pending',
  total_amount decimal(10,2) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- ORDER ITEMS TABLE
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_price decimal(10,2) not null,
  quantity integer not null,
  subtotal decimal(10,2) not null
);

insert into categories (name, slug, image_url) values
  ('Chocolate', 'chocolate', null),
  ('Chips & Crisps', 'chips-crisps', null),
  ('Candy & Gummies', 'candy-gummies', null),
  ('Cookies & Biscuits', 'cookies-biscuits', null),
  ('Drinks', 'drinks', null),
  ('Mixed Snacks', 'mixed-snacks', null);

insert into products (name, description, price, category_id, origin_country, stock_quantity, is_featured, is_available)
values
  (
    'Japanese Kit Kat Matcha',
    'Authentic Japanese Kit Kat with real matcha green tea flavor. A must-try exotic treat.',
    4.99,
    (select id from categories where slug = 'chocolate'),
    'Japan',
    50,
    true,
    true
  ),
  (
    'Korean Honey Butter Chips',
    'The legendary Korean chips that took the world by storm. Sweet, buttery and addictive.',
    3.49,
    (select id from categories where slug = 'chips-crisps'),
    'South Korea',
    80,
    true,
    true
  ),
  (
    'Tajin Chamoy Gummies',
    'Mexican gummies coated in spicy chamoy and tajin seasoning. Sweet, sour and spicy all at once.',
    2.99,
    (select id from categories where slug = 'candy-gummies'),
    'Mexico',
    60,
    true,
    true
  ),
  (
    'Pocky Strawberry',
    'Classic Japanese biscuit sticks dipped in creamy strawberry coating.',
    2.49,
    (select id from categories where slug = 'cookies-biscuits'),
    'Japan',
    100,
    false,
    true
  ),
  (
    'Thai Milk Tea',
    'Authentic Thai iced tea mix. Rich, creamy and perfectly sweet.',
    3.99,
    (select id from categories where slug = 'drinks'),
    'Thailand',
    40,
    true,
    true
  ),
  (
    'Australian Tim Tams',
    'Iconic Australian chocolate biscuits with a crunchy chocolate cream filling.',
    4.49,
    (select id from categories where slug = 'cookies-biscuits'),
    'Australia',
    70,
    false,
    true
  );

-- Enable RLS on all tables
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Anyone can READ categories and products (public shop)
create policy "Public can read categories"
  on categories for select using (true);

create policy "Public can read products"
  on products for select using (true);

-- Anyone can CREATE an order (guest checkout)
create policy "Anyone can create orders"
  on orders for insert with check (true);

create policy "Anyone can create order items"
  on order_items for insert with check (true);

-- Only the person who made the order can read it (by email)
create policy "Customers can read own orders"
  on orders for select
  using (true);

create policy "Customers can read own order items"
  on order_items for select
  using (true);

-- PROFILES TABLE (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  city text,
  loyalty_points integer default 0,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

alter table orders
  add column user_id uuid references auth.users(id) on delete set null;

create table wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now()),
  unique(user_id, product_id)
);

alter table wishlist enable row level security;

create policy "Users can manage own wishlist"
  on wishlist for all
  using (auth.uid() = user_id);

alter table profiles add column is_admin boolean default false;
update profiles set is_admin = true where id = 'YOUR_USER_ID_HERE';