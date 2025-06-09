.PHONY: ALL INSTALL DEV BUILD START LINT CONTENTLAYER CLEAN HELP

# DEFAULT TARGET
all: install dev

## INSTALL DEPENDENCIES
install:
	@echo "INSTALLING DEPENDENCIES..."
	@npm ci --legacy-peer-deps
	@echo "DEPENDENCIES INSTALLED."

## START DEVELOPMENT SERVER
dev:
	@echo "STARTING DEVELOPMENT SERVER..."
	@npm run dev

## BUILD PROJECT WITH CONTENTLAYER
build:
	@echo "BUILDING PROJECT..."
	@npm run build

## BUILDING CONTENTLAYER FILES
contentlayer:
	@echo "BUILDING CONTENTLAYER FILES..."
	@npm run contentlayer

## START PRODUCTION SERVER
start:
	@echo "STARTING PRODUCTION SERVER..."
	@npm run start

## RUN LINTER
lint:
	@echo "RUNNING LINTER..."
	@npm run lint

## CLEAN NODE_MODULES AND BUILD ARTIFACTS
clean:
	@echo "CLEANING UP..."
	@node -e "try{require('fs').rmSync('node_modules',{recursive:true,force:true})}catch(e){}"
	@node -e "try{require('fs').rmSync('.next',{recursive:true,force:true})}catch(e){}"
	@node -e "try{require('fs').rmSync('.contentlayer',{recursive:true,force:true})}catch(e){}"

## DISPLAY HELP
help:
	@echo "AVAILABLE TARGETS:"
	@grep -E '^##' $(MAKEFILE_LIST) | sed -e 's/## //'