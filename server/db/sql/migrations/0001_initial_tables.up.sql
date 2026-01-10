create table if not exists users (
    public_key text primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp
);

create index if not exists idx_users_public_key on users (public_key);
create index if not exists idx_users_deleted_at on users (deleted_at);

create table if not exists venues (
    id text primary key,
    name text not null,
    description text not null,
    latitude double precision not null,
    longitude double precision not null,
    country text not null,
    region text not null,
    city text not null,
    capacity int not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp
);

create index if not exists idx_venues_name on venues (name);
create index if not exists idx_venues_country on venues (country);
create index if not exists idx_venues_region on venues (region);
create index if not exists idx_venues_city on venues (city);
create index if not exists idx_venues_deleted_at on venues (deleted_at);

create table if not exists events (
    id text primary key,
    name text not null,
    description text not null,
    date timestamp not null,
    venue_id text not null references venues(id),
    price_cents bigint not null,
    image_url text not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp
);

create index if not exists idx_events_venue_id on events (venue_id);
create index if not exists idx_events_date on events (date);
create index if not exists idx_events_deleted_at on events (deleted_at);