-- name: GetUser :one
select * from users where public_key = $1;

-- name: GetEvent :one
select * from events where id = $1;

-- name: ListEvents :many
select * from events;

-- name: ListVenues :many
select * from venues;

-- name: GetVenue :one
select * from venues where id = $1;