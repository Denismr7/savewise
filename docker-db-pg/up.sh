#!/bin/bash
echo "Creating pg-scripts..."
rm -f pg-scripts/*.sql
cp ./db/postgresql/build.sql pg-scripts/build.sql
cp ./db/postgresql/seed.sql pg-scripts/seed.sql
cp ./db/postgresql/testing.sql pg-scripts/testing.sql
if [[ -z $1 ]]; then
    docker-compose -f docker-compose.yml up
else
    if [[ ("$1" == "-d") || ("$2" == "-d") || ("$1" == "--detach") || ("$2" == "--detach") ]]; then
        docker-compose -f docker-compose.yml up -d
    else
        docker-compose -f docker-compose.yml up
    fi
fi