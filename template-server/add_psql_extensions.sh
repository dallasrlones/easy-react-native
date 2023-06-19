#!/bin/bash

set -e

echo "Running installation of extensions..."

echo "Waiting for postgres to be ready..."

DB_USER=${POSTGRES_USER:-"postgres"}
DB_NAME=${POSTGRES_DB:-"db_name"}
DB_PASSWORD=${POSTGRES_PASSWORD:-"password"}

until PGPASSWORD="${DB_PASSWORD}" psql -U "${DB_USER}" -d "${DB_NAME}" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - continuing..."

echo "Installing uuid-ossp extension..."

psql -U "${DB_USER}" -d "${DB_NAME}" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

echo "Extension Installation completed successfully."
