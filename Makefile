install:
	npm ci

develop:
	npm run dev

lint:
	npx eslint .

fix:
	npx eslint --fix .

build:
	NODE_ENV=production npm run build

test:
	echo no tests