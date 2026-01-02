-- name: InsertUser :one
insert into users (id, wallet_address) values ($1, $2) returning *;

-- name: InsertEvent :one
insert into events (id, name, description, date, location, creator_address, price_cents, image_url) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *;