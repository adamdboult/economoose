
##########
# README #
##########

.PHONY: all
.PHONY: favicon
.PHONY: packages
.PHONY: scripts
.PHONY: styles
.PHONY: csvProcess
.PHONY: clean



all: clean favicon packages scripts styles csvProcess


clean:
	rm -rf ./data/ ./public/
	mkdir -p ./data/csv/
	mkdir -p ./data/json/
	mkdir -p ./public/

favicon:
	cp ./src/img/compiled/* ./public/

packages:
	mkdir ./public/packages/
	cp -R ./node_modules/mathjax/es5 ./public/packages/mathjax
	cp -R ./node_modules/bootstrap/dist ./public/packages/bootstrap
	cp -R ./node_modules/jquery/dist ./public/packages/jquery
	cp -R ./node_modules/angular ./public/packages/angular
	cp -R ./node_modules/angular-route ./public/packages/angular-route
	cp -R ./node_modules/d3/dist ./public/packages/d3

scripts:
	#mkdir ./public/js/
	cp -R ./src/js ./public/js
      
styles:
	mkdir ./public/css/
	cp ./src/styles/**/*.css ./public/css/ || true
	#sass ./src/styles/core.scss:./public/css/core.css
	
csvProcess:
	#python ./csv_manipulation.py
	python ./csv_manipulation/csv_manipulation_pandas.py
	python ./csv_manipulation/csv_to_json.py
	#cp data/csv/corrected.csv corrected-non-pandas.csv
	#cp data/csv/corrected.csv corrected-pandas.csv

