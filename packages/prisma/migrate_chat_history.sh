#!/bin/bash
set -e


# User-friendly logging functions with color and timestamp
log() {
  local level="$1"
  local msg="$2"
  local color_reset="\033[0m"
  local color_info="\033[1;34m"
  local color_warn="\033[1;33m"
  local color_error="\033[1;31m"
  local color_success="\033[1;32m"
  local ts="$(date '+%Y-%m-%d %H:%M:%S')"
  case "$level" in
    INFO)
      echo -e "${color_info}[$ts] [INFO]${color_reset} $msg" ;;
    WARN)
      echo -e "${color_warn}[$ts] [WARN]${color_reset} $msg" ;;
    ERROR)
      echo -e "${color_error}[$ts] [ERROR]${color_reset} $msg" ;;
    SUCCESS)
      echo -e "${color_success}[$ts] [SUCCESS]${color_reset} $msg" ;;
    *)
      echo -e "[$ts] $msg" ;;
  esac
}

# Step 1: Ensure PostgreSQL is running (manual step, not automated here)
log INFO "Make sure your PostgreSQL server is running and accessible."


# Step 2: Ensure .env file and DATABASE_URL
ENV_PATH="../../.env"
if [ ! -f "$ENV_PATH" ]; then
  ENV_PATH="../../../.env"
fi
if [ ! -f "$ENV_PATH" ]; then
  echo "[ERROR] .env file not found in project root. Creating with system defaults."
  ENV_PATH="../../.env"
  echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/openai_oauth?schema=public"' > "$ENV_PATH"
  echo '[INFO] Created .env with default DATABASE_URL.'
fi


# Ensure DATABASE_URL is set in .env
if ! grep -q '^DATABASE_URL=' "$ENV_PATH"; then
  echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/openai_oauth?schema=public"' >> "$ENV_PATH"
fi

# Step 2b: Docker setup, then database/user setup, then .env update
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }
log "[STEP 1] Docker PostgreSQL setup..."
DOCKER_PG=$(docker ps --format '{{.Names}}' --filter ancestor=postgres | head -n 1)
if [ -z "$DOCKER_PG" ]; then
  # Remove any existing container and its data volume
  if docker ps -a --format '{{.Names}}' | grep -q '^openai_oauth_pg$'; then
    log "[INFO] Removing existing Docker container 'openai_oauth_pg' and its data volume..."
    VOLUME=$(docker inspect openai_oauth_pg --format '{{ range .Mounts }}{{ if eq .Destination "/var/lib/postgresql/data" }}{{ .Name }}{{ end }}{{ end }}')
    docker rm -f openai_oauth_pg > /tmp/docker_pg_remove_container.log 2>&1
    if [ $? -ne 0 ]; then
      log "[ERROR] Failed to remove existing container. See /tmp/docker_pg_remove_container.log for details."
      cat /tmp/docker_pg_remove_container.log
      exit 1
    fi
    if [ -n "$VOLUME" ]; then
      log "[INFO] Removing Docker volume $VOLUME..."
      docker volume rm "$VOLUME" > /tmp/docker_pg_remove_volume.log 2>&1 || true
    fi
    log "[INFO] Removed existing container and volume."
  fi
  # Generate a secure random password for the postgres user
  USERPASS=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
  log "[INFO] Generated secure password for 'postgres' user."
  # URL-encode the password for use in the DATABASE_URL
  urlencode() {
    local LANG=C i c e s="$1"
    for ((i=0;i<${#s};i++)); do
      c=${s:$i:1}
      case "$c" in
        [a-zA-Z0-9.~_-]) printf "$c" ;;
        *) printf '%%%02X' "'${c}" ;;
      esac
    done
  }
  USERPASS_URLENCODED=$(urlencode "$USERPASS")
  docker run -d --name openai_oauth_pg -e POSTGRES_PASSWORD="$USERPASS" -p 5432:5432 postgres:15 > /tmp/docker_pg_create_container.log 2>&1
  if [ $? -ne 0 ]; then
    log "[ERROR] Failed to start PostgreSQL Docker container. See /tmp/docker_pg_create_container.log for details."
    cat /tmp/docker_pg_create_container.log
    exit 1
  fi
  log "[INFO] Started PostgreSQL container 'openai_oauth_pg'. Waiting for DB to be ready..."
  for i in {1..30}; do
    sleep 2
    docker exec openai_oauth_pg pg_isready -U postgres > /dev/null 2>&1 && break
    if [ $i -eq 30 ]; then
      log "[ERROR] PostgreSQL container did not become ready in time."
      exit 1
    fi
  done
  DOCKER_PG=openai_oauth_pg
else
  log "[INFO] Found running PostgreSQL container: $DOCKER_PG"
  # Generate a secure random password for the postgres user
  USERPASS=$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
  log "[INFO] Generated secure password for 'postgres' user."
  # URL-encode the password for use in the DATABASE_URL
  urlencode() {
    local LANG=C i c e s="$1"
    for ((i=0;i<${#s};i++)); do
      c=${s:$i:1}
      case "$c" in
        [a-zA-Z0-9.~_-]) printf "$c" ;;
        *) printf '%%%02X' "'${c}" ;;
      esac
    done
  }
  USERPASS_URLENCODED=$(urlencode "$USERPASS")
fi

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGDATABASE=openai_oauth
PGPASS="$USERPASS"

log "[STEP 2] Creating 'postgres' user and database if needed..."
log "[STEP 2.0] Ensuring 'postgres' role exists..."
PGPASSWORD="$USERPASS" psql -h "$PGHOST" -U "$PGUSER" -p "$PGPORT" -d postgres -c "SELECT 1 FROM pg_roles WHERE rolname = 'postgres';" > /tmp/check_role_exists.log 2>&1 || true
if ! grep -q 1 /tmp/check_role_exists.log; then
    log "[DIAGNOSE] Listing all roles in the running container for diagnosis..."
    docker exec "$DOCKER_PG" psql -U postgres -d postgres -c '\du' || true
    # Ensure 'postgres' role exists inside the container
    log "[DIAGNOSE] Ensuring 'postgres' role exists inside the container..."
    docker exec "$DOCKER_PG" psql -U postgres -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='postgres';" | grep -q 1
    if [ $? -ne 0 ]; then
      log "[INFO] 'postgres' role missing in container. Creating..."
      docker exec "$DOCKER_PG" psql -U postgres -d postgres -c "CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD '$USERPASS';" > /tmp/container_create_role.log 2>&1
      if [ $? -ne 0 ]; then
        log "[ERROR] Could not create 'postgres' role inside container. See /tmp/container_create_role.log for details."
        cat /tmp/container_create_role.log
        exit 1
      fi
      log "[INFO] 'postgres' role created inside container."
    else
      log "[INFO] 'postgres' role already exists inside container."
    fi
    log "[DIAGNOSE] Testing DB connection from inside the container..."
    docker exec "$DOCKER_PG" psql -U postgres -d postgres -c 'SELECT 1;' > /tmp/container_psql_test.log 2>&1
    if [ $? -eq 0 ]; then
      log "[INFO] [CONTAINER] Successfully connected to postgres DB as postgres user."
    else
      log "[ERROR] [CONTAINER] Could not connect to postgres DB as postgres user. See /tmp/container_psql_test.log for details."
      cat /tmp/container_psql_test.log
    fi
  log "[INFO] 'postgres' role does not exist. Creating..."
  PGPASSWORD="$USERPASS" psql -h "$PGHOST" -U "$PGUSER" -p "$PGPORT" -d postgres -c "CREATE ROLE postgres WITH SUPERUSER LOGIN PASSWORD '$USERPASS';" > /tmp/create_role.log 2>&1
  if [ $? -ne 0 ]; then
    log "[ERROR] Could not create 'postgres' role. See /tmp/create_role.log for details."
    cat /tmp/create_role.log
    exit 1
  fi
  log "[INFO] 'postgres' role created."
else
  log "[INFO] 'postgres' role already exists."
fi
log "[STEP 2.1] Ensuring database '$PGDATABASE' exists..."
PGPASSWORD="$USERPASS" psql -h "$PGHOST" -U "$PGUSER" -p "$PGPORT" -d postgres -c "SELECT 1 FROM pg_database WHERE datname = '$PGDATABASE';" > /tmp/check_db_exists.log 2>&1
if ! grep -q 1 /tmp/check_db_exists.log; then
  log "[INFO] Database $PGDATABASE does not exist. Creating..."
  PGPASSWORD="$USERPASS" psql -h "$PGHOST" -U "$PGUSER" -p "$PGPORT" -d postgres -c "CREATE DATABASE \"$PGDATABASE\";" > /tmp/create_db.log 2>&1
  if [ $? -ne 0 ]; then
    log "[ERROR] Could not create database $PGDATABASE. See /tmp/create_db.log for details."
    cat /tmp/create_db.log
    exit 1
  fi
  log "[INFO] Database $PGDATABASE created."
else
  log "[INFO] Database $PGDATABASE already exists."
log "[STEP 2.2] Testing database connection with psql..."
PGPASSWORD="$USERPASS" psql -h "$PGHOST" -U "$PGUSER" -p "$PGPORT" -d "$PGDATABASE" -c '\q' > /tmp/test_db_connection.log 2>&1
if [ $? -eq 0 ]; then
  log "[INFO] Successfully connected to $PGDATABASE as $PGUSER."
else
  log "[ERROR] Could not connect to $PGDATABASE as $PGUSER. See /tmp/test_db_connection.log for details."
  cat /tmp/test_db_connection.log
  exit 1
fi
fi

log INFO "Database setup complete. Proceeding to Drizzle migration."

# Step 3: Update .env DATABASE_URL (already handled above)

# Step 4: Run Drizzle migration
log INFO "Running Drizzle migration..."
npx drizzle-kit migrate:deploy --config=../../apps/backend/drizzle.config.ts
if [ $? -eq 0 ]; then
  log SUCCESS "Drizzle migration completed."
else
  log ERROR "Drizzle migration failed. Check the output above."
  exit 1
fi

# Step 5: Generate Drizzle client (no codegen needed, just restart backend)
log SUCCESS "Drizzle migration and setup complete. Restart your backend server to apply changes."

log SUCCESS "Migration and client generation complete. Restart your backend server to apply changes."
