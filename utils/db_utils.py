import pandas as pd
import numpy as np
from typing import Any, Dict, List, Optional, Type, TypeVa
import psy2cog
from psy2cog.concurrent import *
import os
from dotenv import load_dotenv
import joblib
from db_utils import *
from schema_utils import *
from security_utils import *
import os
import logging
from typing import Any, Dict, List, Optional, Type, TypeVar
from schema_utils import *
import asyncpg
from asyncpg import Pool, Connection


load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "giscausal")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

# Connection pool settings
MIN_POOL_SIZE = int(os.getenv("DB_MIN_POOL", "1"))
MAX_POOL_SIZE = int(os.getenv("DB_MAX_POOL", "10"))

# Global pool instance
_pool: Optional[Pool] = None



def load_queries_from_file(filepath: str) -> Dict[str, str]:
    """
    Load SQL queries from a file.
    Expected format: each query starts with a comment line like "-- ===== NAME =====
    and ends when the next comment or EOF is reached.
    """
    queries = {}
    with open(filepath, 'r') as f:
        lines = f.readlines()
    current_name = None
    current_sql = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('-- ====='):
            # New query block
            if current_name is not None:
                queries[current_name] = '\n'.join(current_sql).strip()
                current_sql = []
            # Extract name (e.g., "CREATE_USERS_TABLE")
            current_name = stripped.strip('-- =====').strip().replace(' ', '_').upper()
        elif current_name is not None:
            # Skip empty lines and comments that are not headers
            if stripped and not stripped.startswith('--'):
                current_sql.append(line)
    # Last query
    if current_name is not None:
        queries[current_name] = '\n'.join(current_sql).strip()
    return queries

# SQL file path 
SQL_FILE = os.path.join(os.path.dirname(__file__), "sql", "queries.sql")
QUERIES = load_queries_from_file(SQL_FILE)


async def init_db_pool() -> Pool:
    """Initialize the connection pool."""
    global _pool
    if _pool is None:
        try:
            _pool = await asyncpg.create_pool(
                host=DB_HOST,
                port=DB_PORT,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                min_size=MIN_POOL_SIZE,
                max_size=MAX_POOL_SIZE,
                command_timeout=60,
            )
            logger.info("Database connection pool created.")
        except Exception as e:
            logger.error(f"Failed to create DB pool: {e}")
            raise
    return _pool


async def close_db_pool() -> None:
    """Close the connection pool."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
        logger.info("Database connection pool closed.")


async def get_connection() -> Connection:
    """Get a connection from the pool."""
    pool = await init_db_pool()
    return await pool.acquire()


async def release_connection(conn: Connection) -> None:
    """Release a connection back to the pool."""
    pool = await init_db_pool()
    await pool.release(conn)


T = TypeVar('T', bound=BaseModel)

async def execute_query(
    query_name: str,
    *args,
    fetch: str = "none",  # "one", "all", or "none"
    model: Optional[Type[T]] = None,
) -> Any:
    """
    Execute a named SQL query with parameters.
    - query_name: key in QUERIES dict.
    - args: positional parameters for the query.
    - fetch: "one" (single row), "all" (list of rows), or "none" (no return).
    - model: optional Pydantic model to convert the result(s) to.
    Returns:
      - If fetch="one" and model given: model instance or None.
      - If fetch="all" and model given: list of model instances.
      - Otherwise: raw asyncpg records (or None).
    """
    sql = QUERIES.get(query_name)
    if not sql:
        raise ValueError(f"Query '{query_name}' not found.")

    pool = await init_db_pool()
    async with pool.acquire() as conn:
        try:
            if fetch == "one":
                row = await conn.fetchrow(sql, *args)
                if row and model:
                    return model(**dict(row))
                return row
            elif fetch == "all":
                rows = await conn.fetch(sql, *args)
                if model:
                    return [model(**dict(row)) for row in rows]
                return rows
            else:  # "none"
                await conn.execute(sql, *args)
                return None
        except Exception as e:
            logger.error(f"Query '{query_name}' failed: {e}")
            raise


# Specific DB Operations (with schemas)
async def create_user(username: str, plain_password: str, display_name: Optional[str] = None) -> UserInDB:
    """
    Hash password and insert a new user.
    Returns UserInDB instance.
    """
    from schema_utils import hash_password
    hashed = hash_password(plain_password)
    row = await execute_query(
        "INSERT_USER",
        username,
        hashed,
        display_name,
        fetch="one",
        model=UserInDB,
    )
    return row


async def get_user_by_username(username: str) -> Optional[UserInDB]:
    """Retrieve a user by username."""
    return await execute_query(
        "GET_USER_BY_USERNAME",
        username,
        fetch="one",
        model=UserInDB,
    )


async def log_prediction(
    user_id: int,
    prediction: int,
    confidence: float,
    model_name: Optional[str] = None,
    inference_time: Optional[float] = None,
) -> int:
    """
    Insert a prediction and return its ID.
    """
    row = await execute_query(
        "INSERT_PREDICTION",
        user_id,
        prediction,
        confidence,
        model_name,
        inference_time,
        fetch="one",
    )
    return row["id"] if row else None


async def get_user_predictions(user_id: int, limit: int = 100) -> List[PredictionSchema]:
    """Get recent predictions for a user."""
    rows = await execute_query(
        "GET_USER_PREDICTIONS",
        user_id,
        limit,
        fetch="all",
        model=PredictionSchema,
    )
    return rows
