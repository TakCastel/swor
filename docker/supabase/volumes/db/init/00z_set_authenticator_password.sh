#!/bin/bash
# Définit le mot de passe du rôle authenticator depuis l'environnement,
# pour ne pas le committer en dur dans les scripts SQL.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -c "ALTER ROLE authenticator WITH LOGIN PASSWORD '${AUTHENTICATOR_PASSWORD:-postgres}'"
