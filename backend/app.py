from flask import Flask, jsonify, current_app, request, Response
from db import db
from os import environ
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"], "allow_headers": "*",
         "expose_headers": "*", 'SECRET_KEY': 'abcdefgjh'}}, supports_credentials=True)

    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://minor:dev@127.0.0.1:5432/rna"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['CORS_ALLOW_HEADERS'] = '*'
    app.config['CORS_EXPOSE_HEADERS'] = '*'

    db.init_app(app)
    with app.app_context():
        from models.branch import Branch
        from models.card import Card
        from models.customer import Customer
        from models.atm import Atm
        from models.transaction import Transaction
        @current_app.before_request
        def basic_authentication():
            if request.method.lower() == 'options':
                return Response()
        db.create_all()
        from controllers.auth import auth_bp
        from controllers.transaction import transaction_bp
        app.register_blueprint(auth_bp, url_prefix="/auth")
        app.register_blueprint(transaction_bp, url_prefix="/txn")
        return app
