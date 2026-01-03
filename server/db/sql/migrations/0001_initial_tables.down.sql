begin;

drop index if exists idx_events_venue_id;
drop index if exists idx_events_date;

drop table if exists events;

drop index if exists idx_venues_name;
drop index if exists idx_venues_country;
drop index if exists idx_venues_region;
drop index if exists idx_venues_city;

drop table if exists venues;

drop index if exists idx_users_public_key;

drop table if exists users;

commit;