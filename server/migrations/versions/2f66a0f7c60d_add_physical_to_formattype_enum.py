"""Add 'physical' to FormatType enum

Revision ID: 2f66a0f7c60d
Revises: a081ab4f68df
Create Date: 2025-05-27 14:41:10.236558

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2f66a0f7c60d'
down_revision: Union[str, None] = 'a081ab4f68df'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE formattype ADD VALUE IF NOT EXISTS 'physical'")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
