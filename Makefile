install: hooks
	yarn --cwd server install --frozen-lockfile
	yarn --cwd ui install --frozen-lockfile

hooks:
	git config core.hooksPath misc/git-hooks
	chmod +x misc/git-hooks/*

start:
	@NODE_ENV=$(NODE_ENV) docker-compose up --build --force-recreate

stop:
	docker-compose stop

test:
	yarn --cwd server test

dataset:
	docker exec -it sirius_server yarn cli db dataset
	docker exec -it sirius_server yarn cli questionnaires send --limit 50
