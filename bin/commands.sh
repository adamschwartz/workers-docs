#!/bin/bash

realpath() {
  [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}


docs_engine_path=$(dirname $(dirname $(realpath "$0")))
parent_path=$(dirname $docs_engine_path)
parent_folder_name=$(basename $parent_path)

if [ "$parent_folder_name" != "node_modules" ]; then
  echo "Failed: expected the Cloudflare docs enginee to be inside node_modules"
  exit
fi

project_path=$(dirname $(dirname $docs_engine_path))

if [ "$1" = "bootstrap" ]; then
  cd $project_path

  echo "Deleting .docs"
  rm -rf .docs

  echo "Creating .docs directory"
  mkdir .docs

  echo "Moving cloudflare-docs-engine files into .docs"
  cp -r node_modules/cloudflare-docs-engine/ .docs

  echo "Entering .docs"
  cd .docs

  echo "Removing existing node_modules (local npm link case)"
  rm -rf node_modules/

  echo "Running npm install inside .docs"
  npm install
fi


copysrc() {
  cd $project_path

  echo "Entering .docs"
  cd .docs

  echo "Deleting .docs/docs-config.js"
  rm docs-config.js

  echo "Copying docs-config.js into .docs"
  cp ../docs-config.js ./

  echo "Entering .docs/src/"
  cd src

  echo "Deleting .docs/src/content/"
  rm -rf content/

  echo "Copying content into .docs/src/"
  cp -r ../../src/content ./
}


if [ "$1" = "develop" ]; then
  copysrc

  cd $project_path

  echo "Entering .docs"
  cd .docs

  echo "Running npm run clean"
  npm run clean

  echo "Running npm run develop"
  npm run develop
fi


if [ "$1" = "build" ]; then
  copysrc

  cd $project_path

  echo "Entering .docs"
  cd .docs

  echo "Running npm run build"
  npm run build

  echo "Entering cloudflare-docs-engine"
  cd $docs_engine_path

  echo "Running bin/postbuild.js"
  node bin/postbuild.js
fi
