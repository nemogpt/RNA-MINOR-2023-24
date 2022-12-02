import json
import argon2
from flask import Blueprint, jsonify, request
from middleware.auth import token_required
from models.customer import Customer
from models.transaction import Transaction
from models.card import Card
from db import db
from argon2 import PasswordHasher
from sqlalchemy import select, insert, update, delete
from jwt import api_jwt
import datetime


from models.atm import Atm
from util import isWithinLimit, computeDistance

auth_bp = Blueprint('authentication_blueprint', __name__)


@auth_bp.route('/', methods=["GET", "OPTIONS"])
@token_required
def getProfile(current_user, isAdmin):
    # if not isAdmin:
    #     return jsonify({'msg': 'Unauthorized'}),401
    customer_dt_stmt = select(Customer).where(
        Customer.customer_id == current_user)
    customer_dset = db.session.execute(customer_dt_stmt)
    cdata = None
    for cd in customer_dset.scalars():
        cdata = cd
    cdata = vars(cdata)

    txn_stmt = select(Transaction).where(
        Transaction.from_acc == cdata['account_no']).order_by(Transaction.timestamp.desc())
    txn_dset = db.session.execute(txn_stmt)

    card_stmt = select(Card).where(Card.ac_no == cdata['account_no'])
    card_dset = db.session.execute(card_stmt)

    card = None
    for cd in card_dset.scalars():
        card = cd

    card = vars(card)
    del card['_sa_instance_state']

    txnData = []
    for td in txn_dset.scalars():
        td = vars(td)
        del td['_sa_instance_state']
        txnData.append(td)
    del cdata['_sa_instance_state']
    del cdata['password']

    cdata['transactions'] = txnData
    cdata['card'] = card
    return jsonify(cdata), 200


@auth_bp.route('/', methods=["POST", "OPTIONS"])
def login():
    body = request.json
    customer_id = body['customer_id']
    password = body['password']
    if customer_id == 'admin' and password == 'admin':
        token = api_jwt.encode(
            {'customer_data': customer_id, 'is_admin': True}, "secret_key", algorithm="HS256")
        return jsonify({'token': token, 'msg': "Welcome Admin", "is_admin": True}), 200
    customer_data_stmt = select(Customer).where(
        Customer.customer_id == customer_id)
    customer_dataset = db.session.execute(customer_data_stmt)
    customer_data = None
    for cd in customer_dataset.scalars():
        print(cd)
        customer_data = cd
    pwd_hash = customer_data.password
    ph = PasswordHasher()
    try:
        ph.verify(pwd_hash, password)
        token = api_jwt.encode(
            {"customer_data": customer_id, 'is_admin': False}, "secret_key", algorithm="HS256")
        return jsonify({'token': token, "msg": f"Welcome {customer_data.full_name}", "is_admin": False}), 200
    except argon2.exceptions.VerifyMismatchError as e:
        return jsonify({'error': "Invalid Credentials"}), 401


@auth_bp.route("/check_location", methods=["POST"])
def check_location():
    data = request.json
    atm_id = data['atm']
    lat = data['lat']
    lng = data['lng']
    atm_location_stmt = select(Atm).where(Atm.atm_id == atm_id)
    atm_dset = db.session.execute(atm_location_stmt)
    atm_data = None
    for atm_dt in atm_dset.scalars():
        atm_data = atm_dt
    user_location = (lat, lng)
    atm_location = atm_data.location

    print(f"Distance from ATM: {computeDistance(user_location, atm_location)*1000} meters\nIs Within Limit: {isWithinLimit(user_location, atm_location)}")
    return jsonify({'result': isWithinLimit(user_location, atm_location), 'dist': f"{computeDistance(user_location, atm_location)*1000} meters"}), 200


@auth_bp.route('/alluser', methods=["GET"])
@token_required
def allUsers(current_user, isAdmin):
    allData = []
    stmt = select(Customer)
    dset = db.session.execute(stmt)

    for d in dset.scalars():
        d = vars(d)
        del d['_sa_instance_state']
        d['isAdmin'] = False
        allData.append(d)
    return jsonify(allData), 200


@auth_bp.route('/register', methods=["POST", "GET", "OPTIONS"])
def register():
    if request.method == 'POST':
        data = request.json
        customer_id = data['customer_id']
        account_no = data['account_no']
        customer_name = data['customer_name']
        password = data['password']
        acc_type = data['acc_type']
        customer_data_stmt = select(Customer).where(
            Customer.customer_id == customer_id)
        customer_dataset = db.session.execute(customer_data_stmt)
        error = None

        if not customer_id:
            return jsonify({"'error": "Username is required."}), 400
        elif not password:
            return jsonify({'error': 'Password is required.'}), 400
        if not customer_dataset.scalars():
            return jsonify({'error': "Choose different username"}), 400

        if error is None:
            try:
                ph = PasswordHasher()
                hash = ph.hash(password)
                try:

                    stmt = insert(Customer).values(
                        customer_id=customer_id,
                        account_no=account_no,
                        full_name=customer_name,
                        password=hash,
                        ac_type=acc_type

                    )
                    data = db.session.execute(stmt)
                    db.session.commit()
                except Exception as e:
                    print(e)
                    return jsonify({'error': e}), 500
                # Pass on the data and return Registration Successful

            except Exception as e:
                print(e)
                return jsonify({'error': "Something went Wrong, Try again!"}), 400

    print("Sent Data\n", data)

    return jsonify({'account': data}), 200


# cus id data retrieve pin req pin matching
# multiprocessing
# acount data , location match
# if location not match then new thread will wait for notification
# if notification accepts then it will proceed with transaction


# banker's dashboard
