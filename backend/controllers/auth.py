import json
import argon2
from flask import Blueprint, jsonify, request
from middleware.auth import token_required
from models.customer import Customer
from db import db
from argon2 import PasswordHasher
from sqlalchemy import select,insert,update,delete
# from sqlalchemy import create_engine
# from sqlalchemy.or import sessionmaker , Session
# from models import Customer


auth_bp = Blueprint('authentication_blueprint', __name__)

@auth_bp.route('/', methods = ["GET"])
@token_required
def getProfile(current_user):
    return jsonify(current_user), 200

@auth_bp.route('/', methods=["POST"])
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
        return {'token': "ejwr", "msg":"Welcome "}
    except argon2.exceptions.VerifyMismatchError as e:
        return jsonify({'error': "Invalid Credentials"})
    # print(customer_data.scalars()[0])

@auth_bp.route('/register', methods=["POST","GET"])
def register():
    if request.method == 'POST':
        
        data = request.json
        customer_id=data['customer_id']
        account_no=data['account_no']
        cust_name=data['customer_name']
        password = data['password']
        acc_type=data['acc_type']
        customer_data_stmt = select(Customer).where(Customer.customer_id == customer_id)
        customer_dataset = db.session.execute(customer_data_stmt)
        error = None

        if not customer_id:
            return jsonify({'error':'Username is required.'})
        elif not password:
            return jsonify({'error':'Password is required.'})
        if not customer_dataset.scalars():
            return jsonify({'error':"Choose different username"})
        
        if error is None:
            try:
                ph=PasswordHasher()
                hash=ph.hash(password)
                
                try:
                        
                        stmt=insert(Customer).values(customer_id=customer_id,
                        account_no=account_no,
                        full_name=cust_name,
                        password=hash,
                        ac_type=acc_type)
                        data=db.session.execute(stmt)
                        db.session.commit()
                except Exception as e:
                    print(e)
                    return jsonify({'error': "Database registering err!"})
                # Pass on the data and return Registration Successful

            except Exception as e:
                print(e)
                return jsonify({'error': "Something went Wrong, Try again!"})

    print("Sent Data", data)
    return jsonify({'account':data})
    

# cus id data retrieve pin req pin matching 
# multiprocessing
# acount data , location match 
# if location not match then new thread will wait for notification 
# if notification accepts then it will proceed with transaction



# banker's dashboard



