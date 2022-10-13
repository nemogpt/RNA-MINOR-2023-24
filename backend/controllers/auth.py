import json
import argon2
from flask import Blueprint, jsonify, request
from middleware.auth import token_required
from models.customer import Customer
from db import db
from argon2 import PasswordHasher
from sqlalchemy import select

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
    return jsonify({'message': 'TODO: Implement LOGIN!'})

@auth_bp.route('/register', methods=["POST"])
def register():
    data = request.json
    print("Sent Data", data)
    return jsonify({'account': 'TODO: Implement REGISTER!!'})
