begin;

create table if not exists users (
    id serial primary key,
    wallet_address text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create index if not exists idx_users_wallet_address on users (wallet_address);

create extension if not exists postgis;

create table if not exists events (
    id serial primary key,
    name text not null,
    description text not null,
    date timestamp not null,
    location geography(Point, 4326) not null,
    creator_address text not null,
    price_cents bigint not null,
    image_url text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create index if not exists idx_events_creator_address on events (creator_address);
create index if not exists idx_events_date on events (date);
create index if not exists idx_events_location on events using gist (location);

commit;