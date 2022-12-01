import json
import argon2
import random
from flask import Blueprint, jsonify, request, send_file
from middleware.auth import token_required
from models.customer import Customer
from models.transaction import Transaction
from models.card import Card
from models.atm import Atm
from db import db
from argon2 import PasswordHasher
from sqlalchemy import select, insert, update
from datetime import datetime
from util import computeDistance, isWithinLimit
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import textwrap

transaction_bp = Blueprint('transaction_blueprint', __name__)


@transaction_bp.route('/getatms', methods=["GET"])
def get_atms():
    atm_stmt = select(Atm)
    atm_dset = db.session.execute(atm_stmt)
    atms = []
    for a in atm_dset.scalars():
        a = vars(a)
        del a['_sa_instance_state']
        atms.append(a)
    return jsonify(atms), 200


@transaction_bp.route('/', methods=["GET"])
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
    custDetails = select(Customer).where(
        Customer.customer_id == data['username'])
    cust_dset = db.session.execute(custDetails)
    custDetails = None
    for c in cust_dset.scalars():
        custDetails = c
    print(custDetails)
    if custDetails is None:
        return False
    cardDetails = select(Card).where(Card.ac_no == custDetails.account_no)
    card_dset = db.session.execute(cardDetails)
    cardDetails = None
    for c in card_dset.scalars():
        cardDetails = c
    if cardDetails is None:
        return False
    edate = datetime.strptime(data['exp_date'], '%y-%M-%d')
    exp_date = datetime.combine(edate, datetime.min.time())
    or_exp_date = datetime.combine(cardDetails.exp_date, datetime.min.time())
    if (cardDetails.card_no != data['card_no'] or cardDetails.cvv != data['cvv'] or cardDetails.pin != data['pin'] or or_exp_date < exp_date):
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

    dist = computeDistance(atm_loc, user_loc)
    print(f"ATM LOC: {atm_loc} and USER LOC: {user_loc}")
    print(f"{dist} km from ATM")

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
    mth, yr = exp_date.split('/')
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
    if (_validate_pin(pin)):
        ph = PasswordHasher()
        pin_hash = ph.hash(pin)
    cvv = debitData['cvv']
    data = {
        "username": current_user,
        "card_no": card_no,
        "exp_date": exp_date,
        "pin": pin,
        "cvv": cvv
    }
    if (verify_Account(data)):
        custDetails = select(Customer).where(
            Customer.customer_id == data['username'])
        c_dset = db.session.execute(custDetails)
        custDetails = None
        for c in c_dset.scalars():
            custDetails = c
        cardDetails = select(Card).where(Card.ac_no == custDetails.account_no)
        c_dset = db.session.execute(cardDetails)
        cardDetails = None
        for c in c_dset.scalars():
            cardDetails = c
        if (cardDetails.card_type):
            avail = select(Customer.balance).where(
                Customer.customer_id == username)
            av_dset = db.session.execute(avail)
            avail = None
            for a in av_dset.scalars():
                avail = a
            amount = float(debitData['amount'])
            if avail < amount:
                return jsonify({"error": "Balance insufficient"})
            else:
                query = update(Customer).where(
                    Customer.customer_id == username).values(balance=avail-amount)
                db.session.execute(query)
                db.session.commit()
                query = insert(Transaction).values(
                    txn_id=random.randint(1000000000, 9999999999),
                    from_acc=custDetails.account_no,
                    to_acc="000000",
                    amount=amount,
                    timestamp=datetime.now().strftime("%Y-%m-%d")
                )
                db.session.execute(query)

                db.session.commit()
                return jsonify({"success": "Withdrawl successful"})
    return (jsonify({
        "status": 401,
        "msg": "Failed",
        "msg": "Wrong account details"
    })), 401

@transaction_bp.route("/transfer", methods=["POST"])
@token_required
def transfer(current_user, isAdmin):
    debitData = request.json
    username = current_user
    card_no = debitData['card_no']
    exp_date = debitData['exp_data']
    mth, yr = exp_date.split('/')
    exp_date = f"{yr}-{mth}-30"
    pin = debitData['pin']
    if (_validate_pin(pin)):
        ph = PasswordHasher()
        pin_hash = ph.hash(pin)
    cvv = debitData['cvv']
    data = {
        "username": current_user,
        "card_no": card_no,
        "exp_date": exp_date,
        "pin": pin,
        "cvv": cvv
    }
    if (verify_Account(data)):
        custDetails = select(Customer).where(
            Customer.customer_id == data['username'])
        c_dset = db.session.execute(custDetails)
        custDetails = None
        for c in c_dset.scalars():
            custDetails = c
        cardDetails = select(Card).where(Card.ac_no == custDetails.account_no)
        c_dset = db.session.execute(cardDetails)
        cardDetails = None
        for c in c_dset.scalars():
            cardDetails = c
        if (cardDetails.card_type):
            avail = select(Customer.balance).where(
                Customer.customer_id == username)
            av_dset = db.session.execute(avail)
            avail = None
            for a in av_dset.scalars():
                avail = a
            to_acc = debitData.get('to_acc', False)
            to_avail = select(Customer.balance).where(
                Customer.account_no == to_acc)
            tdset = db.session.execute(to_avail)
            to_avail = None
            for t in tdset.scalars():
                to_avail = t
            amount = float(debitData['amount'])
            if avail < amount:
                return jsonify({"error": "Balance insufficient"})
            else:
                query = update(Customer).where(
                    Customer.customer_id == username).values(balance=avail-amount)
                db.session.execute(query)
                db.session.commit()

                if (to_acc):
                    query = update(Customer).where(Customer.account_no == to_acc).values(
                        balance=to_avail+amount)
                    db.session.execute(query)
                    db.session.commit()

                    query = insert(Transaction).values(
                        txn_id=random.randint(1000000000, 9999999999),
                        from_acc=custDetails.account_no,
                        to_acc=to_acc,
                        amount=amount,
                        timestamp=datetime.now().strftime("%Y-%m-%d")
                    )
                    db.session.execute(query)
                    db.session.commit()
                    return jsonify({"success": "Transfer Successful"}),200
    return (jsonify({
        "status": 401,
        "msg": "Failed",
        "msg": "Wrong account details"
    })), 401


@transaction_bp.route('/stats', methods=["GET"])
@token_required
def getStats(current_user, isAdmin):
    if not isAdmin:
        return jsonify({'msg': "Unauthorized"}), 401
    df = pd.read_csv('./analysis/dataset.csv')
    x = df.groupby(by=df['ATM Name'])
    l = []
    for i in df['ATM Name'].unique():
        d = x.get_group(i).groupby(df['Transaction Date'])
        l.append({i: d})
    dict_atms = []

    atms = df['ATM Name'].unique()
    for i in atms:
        a_df = df[df['ATM Name'] == i]
        dict_atms.append(
            {
                'name': i,
                'total_withdrawl': a_df['No Of Withdrawals'],
            }
        )
    x = pd.to_datetime(df['Transaction Date'])
    df['years'] = None
    for i in range(len(df)):
        df['years'][i] = x[i].year
    yr_df = df['years'].unique()
    atms = df['ATM Name'].unique()
    txns = {}
    for i in yr_df:
        d = df[df['years'] == i]
        txns[i] = {}
        for j in atms:
            at_df = d[d['ATM Name'] == j]
            txns[i][j] = at_df['No Of Withdrawals'].sum()
    # df.head()

    yr_df = df['years'].unique()
    atms = df['ATM Name'].unique()
    txns = {}
    for i in yr_df:
        d = df[df['years'] == i]
        txns[i] = {}
        for j in atms:
            at_df = d[d['ATM Name'] == j]
            txns[i][j] = at_df['No Of Withdrawals'].sum()

    fig, ax = plt.subplots(3, 3, figsize=(20, 20))
    fig.suptitle("Analysis of ATM Transactions", fontsize=20)
    j = 0
    k = 0
    for i in txns:
        d_yr = txns[i]
        x = [textwrap.fill(i, 10, break_long_words=True)
             for i in list(d_yr.keys())]
        y = list(d_yr.values())
        color = random.choice(['r', 'g', 'b', 'c', 'y'])
        ax[k][j].bar(x, y, color=color)
        ax[k][j].set_title(f"ATM Transactions of Year {i}")
        if j < 2:
            j += 1
        else:
            k += 1
            j = 0

    plt.savefig('analysis.png')

    stats_max = []
    stats_min = []
    for i in txns:
        stats_max.append({'year': i, 'atm_name': max(
            txns[i]), 'val': float(txns[i][max(txns[i])])})
    for i in txns:
        stats_min.append({'year': i, 'atm_name': min(
            txns[i]), 'val': float(txns[i][min(txns[i])])})

    return jsonify({'image': 'http://localhost:5000/txn/analysis.png', 'stats': {'max': stats_max, 'min': stats_min}}), 200


@transaction_bp.route("/analysis.png", methods=["GET"])
def send_analysis():
    return send_file("analysis.png", mimetype="image/png")
