import json
import argon2
from flask import Blueprint, jsonify, request
from middleware.auth import token_required
from models.customer import Customer
from models.transaction import Transaction
from models.card import Card
from models.atm import Atm
from db import db
from argon2 import PasswordHasher
from sqlalchemy import select, insert, update, delete
from datetime import datetime
from util import computeDistance, isWithinLimit

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


def _validate_pin(pin):
    pin = str(pin)
    if pin.isdigit() and len(pin) == 4:
        return pin
    raise ValueError("Invalid pin number: {}. Expected 4 digit pin".format(
        pin))


def verify_Account(data):
    custDetails = select(Customer).where(Customer.customer_id==data['username'])
    cust_dset = db.session.execute(custDetails)
    custDetails = None
    for c in cust_dset.scalars():
        custDetails = c
    print(custDetails)
    if custDetails is None:
        return False
    cardDetails = select(Card).where(Card.ac_no==custDetails.account_no)
    card_dset = db.session.execute(cardDetails)
    cardDetails = None
    for c in card_dset.scalars():
        cardDetails = c
    if cardDetails is None:
        return False
    edate = datetime.strptime(data['exp_date'], '%y-%M-%d')
    exp_date = datetime.combine(edate, datetime.min.time())
    or_exp_date = datetime.combine(cardDetails.exp_date, datetime.min.time())
    print(data['exp_date'], exp_date)
    if(cardDetails.card_no!=data['card_no'] or cardDetails.cvv!=data['cvv'] or cardDetails.pin!=data['pin'] or or_exp_date>=exp_date):
        return False
    return True

@transaction_bp.route('/processWithdraw', methods=['POST'])
@token_required
def processWithdraw(current_user, isAdmin):
    body = request.json
    atm = body['atm']
    atm_data = select(Atm).where(Atm.atm_id == atm)
    atm_dset = db.session.execute(atm_data)
    atm = None
    for a in atm_dset.scalars():
        atm = a
    atm_loc = atm.location
    lat = body['lat']
    lng = body['lng']
    user_loc = (lat, lng)

    if (not isWithinLimit(user_loc, atm_loc)):
        return jsonify({'msg': "Location Mismatch"}), 401
    return jsonify({'msg': "Proceed with Transaction"}), 200

@transaction_bp.route("/withdraw", methods=["POST"])
@token_required
def withdraw(current_user, isAdmin):
    # to debit the amount from ATM
    debitData = request.json
    username = current_user
    card_no = debitData['card_no']
    exp_date = debitData['exp_data']
    mth,yr = exp_date.split('/')
    exp_date = f"{yr}-{mth}-30"
    pin = debitData['pin']
    atm = debitData['atm']
    atm_data = select(Atm).where(Atm.atm_id == atm)
    atm_dset = db.session.execute(atm_data)
    atm = None
    for a in atm_dset.scalars():
        atm = a
    atm_loc = atm.location
    print(atm_loc)
    lat = debitData['lat']
    lng = debitData['lng']
    userLoc = (lat, lng)
    dist = computeDistance(atm_loc, userLoc)
    print(f"{dist} km from ATM")
    if (not isWithinLimit(userLoc, atm_loc)):
        return jsonify({'msg': 'Location Mismatch'}),401
    if(_validate_pin(pin)):
        ph = PasswordHasher() 
        pin_hash=ph.hash(pin) 
    cvv = debitData['cvv']
    data={
        "username":current_user,
        "card_no":card_no,
        "exp_date":exp_date,
        "pin":pin,
        "cvv":cvv
    }
    if(verify_Account(data)):
        custDetails = select(Customer).where(Customer.customer_id==data['username'])
        c_dset = db.session.execute(custDetails)
        custDetails = None
        for c in c_dset.scalars():
            custDetails = c
        cardDetails = select(Card).where(Card.ac_no==custDetails.account_no)
        c_dset = db.session.execute(cardDetails)
        cardDetails = None
        for c in c_dset.scalars():
            cardDetails = c
        # cardDetails=cardDetails.scalar()[0]
        print(cardDetails.card_type)
        if(cardDetails.card_type):
            avail = select(Customer.balance).where(Customer.customer_id==username)
            av_dset = db.session.execute(avail)
            avail = None
            for a in av_dset.scalars():
                avail = a
            amount = debitData['amount']
            if avail < amount:
                return jsonify({"error": "Balance insufficient"})
            else:
                query=update(Customer).where(Customer.customer_id==username).values(balance=avail-amount)
                db.session.execute(query)
                db.session.commit()
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


