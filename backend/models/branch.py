from db import db
import sqlalchemy as sa


class Branch(db.Model):
    branch_id = sa.Column(sa.Integer, primary_key=True)
    branch_name = sa.Column(sa.String, nullable=False)
    branch_address = sa.Column(sa.String, nullable=False)