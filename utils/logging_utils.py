import psy2cog
import os
import wandb
import thread
import subprocess
from schema_utils import *
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Dict, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def _init_wandb() -> None:
    """Initialize Weights & Biases with environment‑based configuration."""
    wandb_project = os.getenv("WANDB_PROJECT", "default-project")
    wandb_entity = os.getenv("WANDB_ENTITY", None)
    wandb_mode = os.getenv("WANDB_MODE", "online")  # "online", "offline", "disabled"
    try:
        wandb.init(project=wandb_project, entity=wandb_entity, mode=wandb_mode)
        logger.info("W&B initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize W&B: {e}")
        raise


def log_db(data: DataSchema, retries: int = 3) -> bool:
    """
    Log data to Weights & Biases with retry logic.

    Args:
        data: The data to log (must be compatible with wandb.log).
        retries: Number of retry attempts on failure.

    Returns:
        True if logging succeeded, False otherwise.
    """
    _init_wandb()  # ensure we have a run
    attempt = 0
    while attempt < retries:
        try:
            wandb.log(data)
            logger.info("Data logged successfully.")
            return True
        except Exception as e:
            attempt += 1
            logger.warning(f"Logging attempt {attempt} failed: {e}")
            if attempt >= retries:
                logger.error("All retries exhausted.")
                return False
    return False


def log_db_async_pool(data_list: list, max_workers: int = 4) -> Dict[int, bool]:
    """
    Log multiple data items in parallel using a thread pool.

    Args:
        data_list: List of data items (each suitable for wandb.log).
        max_workers: Maximum number of concurrent threads.

    Returns:
        A dictionary mapping each index to the success status (True/False).
    """
    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_idx = {
            executor.submit(log_db, data): idx
            for idx, data in enumerate(data_list)
        }
        for future in as_completed(future_to_idx):
            idx = future_to_idx[future]
            try:
                results[idx] = future.result()
            except Exception as e:
                logger.error(f"Unexpected error for index {idx}: {e}")
                results[idx] = False
    return results


async def log_db_async(data: DataSchema) -> bool:
    """Asynchronous wrapper for log_db (runs in a thread pool)."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, log_db, data)


async def log_db_async_pool(data_list: list, max_workers: int = 4) -> Dict[int, bool]:
    """
    Asynchronous pool version using asyncio + ThreadPoolExecutor.
    """
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        tasks = [
            loop.run_in_executor(executor, log_db, data)
            for data in data_list
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return {
            idx: isinstance(result, bool) and result
            for idx, result in enumerate(results)
        }

