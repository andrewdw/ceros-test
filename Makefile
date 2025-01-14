DOCKER_COMPOSE := -f docker-compose.yaml

.PHONY: dev dev-down docker-compose-up docker-compose-up-debug docker-compose-down dev-purge build

docker-compose-up:
	docker compose ${DOCKER_COMPOSE} up -d

docker-compose-up-debug:
	docker compose ${DOCKER_COMPOSE} up

docker-compose-down:
	docker compose ${DOCKER_COMPOSE} down

dev: docker-compose-up

dev-down: docker-compose-down

dev-purge: ## Stop containers and remove all images
	docker compose ${DOCKER_COMPOSE} down --rmi all

build:
	docker compose ${DOCKER_COMPOSE} build