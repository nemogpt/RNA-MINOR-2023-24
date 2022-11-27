import json
import argon2
from flask import Blueprint, jsonify, request
from middleware.auth import token_required
from models.customer import Customer
from models.transaction import Transaction
from models.card import card
from db import db
from argon2 import PasswordHasher
from sqlalchemy import select, insert, update, delete
from datetime import datetime

transaction_bp = Blueprint('transaction_blueprint', __name__)


@transaction_bp.route('/transact', methods=["GET"])
@token_required
def getBal(current_user):
    # To get the current balance
    username = current_user
    avail = select(Customer.balance).where(customer_id=username)
    avail = avail.scalar()[0]

    return (jsonify({
        "status": 200,
        "msg": "success",
        "avail": avail,
    }))


def _validate_pin(self, pin):
    pin = str(pin)
    if pin.isdigit() and len(pin) == 4:
        return pin
    raise ValueError("Invalid pin number: {}. Expected 4 digit pin".format(
        pin))


def verify_Account(slef, data):
    custDetails = select(Customer.account_no).where(customer_id=data.username)
    custDetails=custDetails.scalar()[0]
    if custDetails is None:
        return False
    cardDetails = select(card).where(card_no=custDetails.ac_no)
    cardDetails=cardDetails.scalar()[0]
    if cardDetails is None:
        return False
    if(cardDetails.card_no!=data.card_no or cardDetails.cvv!=data.cvv or cardDetails.pin!=data.pin or cardDetails.exp_date!=data.exp_date):
        return False
    return True



def withdraw(current_user):
    # to debit the amount from ATM
    debitData = request.json()
    username = current_user
    card_no = debitData['card_no']
    exp_date = debitData['exp_data']
    pin = debitData['pin']
    if(_validate_pin(pin)):
        ph = PasswordHasher() 
        pin_hash=ph.hash(pin) 
    cvv = debitData['cvv']
    data={
        "username":current_user,
        "card_no":card_no,
        "exp_date":exp_date,
        "pin":pin_hash,
        "cvv":cvv
    }
    if(verify_Account(data)):
        cardDetails = select(card).where(card_no=custDetails.ac_no)
        # cardDetails=cardDetails.scalar()[0]
        if(cardDetails.card_type==0):
            avail = select(Customer.balance).where(customer_id=username)
            avail = avail.scalar()[0]
            amount = debitData[amount]
            if avail < amount:
                return jsonify({"error": "Balance insufficient"})
            else:
                query=Customer.update().where(customer_id=username).values(balance=avail-amount)
                return jsonify({"success": "Withdrawl successful"})
    return (jsonify({
        "status": 401,
        "msg": "Failed",
        "msg": "Wrong account details"
    })),401

def transfer(current_user):
    # Transfer money to another account
    transferData = request.json()
    username = current_user
    to_acc=transferData['to_acc']
    from_avail = select(Customer.balance).where(customer_id=username)
    from_avail = from_avail.scalar()[0]
    to_avail = select(Customer.balance).where(customer_id=username)
    to_avail = to_avail.scalar()[0]

    query1=Customer.update().where(customer_id=username).values(balance=from_avail-amount)
    query2=Customer.update().where(account_no=to_acc).values(balance=to_avail+amount)
    print("To be further implemented")


