.PHONY: run
run:
	air

.PHONY: gen
gen:
	cd db && sqlc generate
	swag init -g server.go

.PHONY: pg
pg:
	docker run -d --name shreddr-pg -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=shreddr postgres:17