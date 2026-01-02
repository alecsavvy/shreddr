-- name: GetUserByWallet :one
select * from users where wallet_address = $1;

-- name: GetEvent :one
select * from events where id = $1;

-- name: ListEvents :many
select * from events;

