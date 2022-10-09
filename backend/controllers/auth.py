import json
from flask import Blueprint, jsonify, request
from middleware.auth import token_required
from models.customer import Customer
from app import db

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

    return jsonify({'message': 'TODO: Implement LOGIN!'})

@auth_bp.route('/register', methods=["POST"])
def register():
    return jsonify({'account': 'TODO: Implement REGISTER!!'})
