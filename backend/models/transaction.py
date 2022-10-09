from db import db
import sqlalchemy as sa
from models.customer import Customer


class Transaction(db.Model):
    txn_id = sa.Column(sa.String, primary_key=True)
    timestamp = sa.Column(sa.DateTime, server_default=sa.sql.expression.text('NOW()'))
    from_acc = sa.Column("from_acc", sa.ForeignKey(Customer.account_no), nullable=False)
    to_acc = sa.Column("to_acc", sa.ForeignKey(Customer.account_no), nullable=False)
    amount = sa.Column(sa.Float, nullable=False)