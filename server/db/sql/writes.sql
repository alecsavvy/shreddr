-- name: InsertUser :one
insert into users (public_key) values ($1) returning *;

-- name: InsertEvent :one
insert into events (id, name, description, date, venue_id, price_cents, image_url) values ($1, $2, $3, $4, $5, $6, $7) returning *;

-- name: InsertVenue :one
insert into venues (id, name, description, latitude, longitude, country, region, city, capacity) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *;