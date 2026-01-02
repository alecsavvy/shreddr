begin;

drop index if exists idx_events_creator_id;
drop index if exists idx_events_date;
drop index if exists idx_events_location;

drop table if exists events;

drop index if exists idx_users_wallet_address;

drop table if exists users;

drop extension if exists postgis;

commit;