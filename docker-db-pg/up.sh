#!/bin/bash
if [[ ("$1" == "-h") || ("$1" == "--help") ]]; then
    echo "Use: up [commands]"
    echo "commands:"
    echo "-u, --update: update database scripts before to up"
    echo "-d, --detach: run in detached mode: run containers in the background"
    exit 0
fi
if [[ ("$1" == "-u") || ("$1" == "--update") ]]; then
    if [[ -z "${SAVEW_VERSION}" ]]; then
        echo "Could not update the database scripts: The environment variable SAVEW_VERSION is missing"
        exit 1
    else
        echo "Updating pg-scripts for $SAVEW_VERSION version ..."
        rm -f pg-scripts/*.sql
        cp ./db/$SAVEW_VERSION/build.sql pg-scripts/build.sql
        cp ./db/$SAVEW_VERSION/seed.sql pg-scripts/seed.sql
        cp ./db/$SAVEW_VERSION/testing.sql pg-scripts/testing.sql
    fi
fi
if [[ -z $1 ]]; then
    docker-compose -f docker-compose.yml up
else
    if [[ ("$1" == "-d") || ("$2" == "-d") || ("$1" == "--detach") || ("$2" == "--detach") ]]; then
        docker-compose -f docker-compose.yml up -d
    else
        docker-compose -f docker-compose.yml up
    fi
fi