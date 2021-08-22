#!/bin/bash
echo "Creating database..."
rm -f savewisedb/*.sql
cp ./db/postgresql/build.sql savewisedb/build.sql
cp ./db/postgresql/seed.sql savewisedb/seed.sql
if [[ -z $1 ]]; then
    docker-compose -f docker-compose.yml up
else
    if [[ ("$1" == "-d") || ("$2" == "-d") || ("$1" == "--detach") || ("$2" == "--detach") ]]; then
        docker-compose -f docker-compose.yml up -d
    else
        docker-compose -f docker-compose.yml up
    fi
fi