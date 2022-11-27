from db import db
import sqlalchemy as sa
from models.branch import Branch


class Atm(db.Model):
    atm_id = sa.Column(sa.String, primary_key=True)
    atm_address = sa.Column(sa.String, nullable=False)
    atm_branch = sa.Column("branch", sa.ForeignKey(Branch.branch_id))
    location = sa.Column(sa.ARRAY(sa.Float))
    balance = sa.Column(sa.Float)
