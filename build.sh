#!/bin/sh

npm install
bower install

# clean and prepare public directory
rm -rf public
cp -r src public

# compile jade to html
./node_modules/.bin/jade src -o public -PH
rm -rf public/_partials

# compile sass to css	
./node_modules/.bin/node-sass \
	--output-style comporessed \
	--source-map-embed \
	src/_styles/main.scss public/css/main.css

# Convert ES6 to ES5
./node_modules/.bin/babel src --out-dir public -s inline

# concat bower_components to lib directory
if [ -d "bower_components" ]; then
	./node_modules/.bin/bowcat . -o public/lib -m
fi


# clean unneeded files
/.bin# clean unneeded files
rm -rf public/_styles \
		public/*.jade\
		public/**/*.jade\
		public/*.scss \
		public/**/*.scss