from db import db
import sqlalchemy as sa
from models.branch import Branch

class Customer(db.Model):
    customer_id = sa.Column(sa.String, primary_key=True)
    account_no = sa.Column(sa.String, unique=True, nullable=False)
    full_name = sa.Column(sa.String, nullable=False)
    balance = sa.Column(sa.Float, nullable=True)
    ac_type = sa.Column(sa.Integer) # 0 - Saving, 1 - Current, 2 - Credit
    password=sa.Column(sa.String,nullable=False)
    home_branch = sa.Column("home_branch",sa.ForeignKey(Branch.branch_id))
