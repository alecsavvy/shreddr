-- name: InsertUser :one
insert into users (public_key) values ($1) on conflict (public_key) do nothing returning *;

-- name: DeleteUser :exec
update users set deleted_at = now() where public_key = $1;

-- name: DeleteEvent :exec
update events set deleted_at = now() where id = $1;

-- name: DeleteVenue :exec
update venues set deleted_at = now() where id = $1;

-- name: InsertEvent :one
insert into events (id, name, description, date, venue_id, price_cents, image_url) values ($1, $2, $3, $4, $5, $6, $7) returning *;

-- name: InsertVenue :one
insert into venues (id, name, description, latitude, longitude, country, region, city, capacity) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;