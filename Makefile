install:
	npm install

start:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite .sql'

build:
	npx tsc && npm run build-webpack

test:
	npx jest -i

lint:
	npx eslint .

migrate-dev:
	npm run migrate-dev
