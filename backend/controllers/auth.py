import json
import argon2
from flask import Blueprint, jsonify, request
from middleware.auth import token_required
from models.customer import Customer
from db import db
from argon2 import PasswordHasher
from sqlalchemy import select,insert,update,delete
from jwt import api_jwt
import datetime


from models.atm import Atm
from util import isWithinLimit,computeDistance

auth_bp = Blueprint('authentication_blueprint', __name__)

@auth_bp.route('/', methods = ["GET","OPTIONS"])
@token_required
def getProfile(current_user):
    return jsonify(current_user), 200

@auth_bp.route('/', methods=["POST", "OPTIONS"])
def login():
    body = request.json
    customer_id = body['customer_id']
    password = body['password']
    customer_data_stmt = select(Customer).where(Customer.customer_id == customer_id)
    customer_dataset = db.session.execute(customer_data_stmt)
    customer_data = None
    for cd in customer_dataset.scalars():
        customer_data = cd
    pwd_hash = customer_data.password
    ph = PasswordHasher()
    try:
        ph.verify(pwd_hash, password)
        token = api_jwt.encode({"customer_data": customer_id}, "secret_key", algorithm="HS256")
        return jsonify({'token': token, "msg":f"Welcome {customer_data.full_name}"}), 200
    except argon2.exceptions.VerifyMismatchError as e:
        return jsonify({'error': "Invalid Credentials"}), 401
    # print(customer_data.scalars()[0])

@auth_bp.route("/check_location", methods=["POST"])
def check_location():
    atm_location_stmt = select(Atm).where(Atm.atm_id=="55919391")
    atm_dset = db.session.execute(atm_location_stmt)
    atm_data = None
    for atm_dt in atm_dset.scalars():
        atm_data = atm_dt
    user_location = request.json['user_location']
    atm_location = atm_data.location
    
    print(isWithinLimit(user_location, atm_location), computeDistance(user_location, atm_location))
    return jsonify({'msg': 'OK'}),200

@auth_bp.route('/register', methods=["POST","GET","OPTIONS"])
def register():
    if request.method == 'POST':
        data = request.json
        customer_id=data['customer_id']
        account_no=data['account_no']
        customer_name=data['customer_name']
        password = data['password']
        acc_type=data['acc_type']
        customer_data_stmt = select(Customer).where(Customer.customer_id == customer_id)
        customer_dataset = db.session.execute(customer_data_stmt)
        error = None

        if not customer_id:
            return jsonify({"'error":"Username is required."}), 400
        elif not password:
            return jsonify({'error':'Password is required.'}), 400
        if not customer_dataset.scalars():
            return jsonify({'error':"Choose different username"}), 400
        
        if error is None:
            try:
                ph=PasswordHasher()
                hash=ph.hash(password) 
                try:
                        
                        stmt=insert(Customer).values(
                        customer_id=customer_id,
                        account_no=account_no,
                        full_name=customer_name,
                        password=hash,
                        ac_type=acc_type
                        
                        )
                        data=db.session.execute(stmt)
                        db.session.commit()
                except Exception as e:
                    print(e)
                    return jsonify({'error': e}), 500
                # Pass on the data and return Registration Successful

            except Exception as e:
                print(e)
                return jsonify({'error': "Something went Wrong, Try again!"}), 400

    print("Sent Data\n", data)

    return jsonify({'account':data}), 200
    

# cus id data retrieve pin req pin matching 
# multiprocessing
# acount data , location match 
# if location not match then new thread will wait for notification 
# if notification accepts then it will proceed with transaction



# banker's dashboard



