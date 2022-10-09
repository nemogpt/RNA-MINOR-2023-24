from db import db
import sqlalchemy as sa
from models.customer import Customer

class Card(db.Model):
    card_no = sa.Column(sa.String, primary_key=True)
    card_type = sa.Column(sa.Integer, nullable=False) # 0 - Debit, 1 - Credit
    pin = sa.Column(sa.String, nullable=False)
    cvv = sa.Column(sa.String, nullable = False)
    exp_date = sa.Column(sa.Date, nullable=False)
    credit_limit = sa.Column(sa.Float)
    txn_limit = sa.Column(sa.Float)
    ac_no = sa.Column("ac_no", sa.ForeignKey(Customer.account_no))