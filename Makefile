install: hooks
	yarn --cwd server install --frozen-lockfile
	yarn --cwd ui install --frozen-lockfile

hooks:
	git config core.hooksPath misc/git-hooks
	chmod +x misc/git-hooks/*

start:
	docker-compose up --build --force-recreate

stop:
	docker-compose stop

dataset:
	docker exec -it sirius_server yarn cli db dataset
	docker exec -it sirius_server yarn cli questionnaires send --limit 50
