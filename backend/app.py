from flask import Flask , jsonify
from db import db
from os import environ


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:1234@127.0.0.1:5432/minor"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    with app.app_context():
        from models.branch import Branch
        from models.card import Card
        from models.customer import Customer
        from models.atm import Atm
        from models.transaction import Transaction
        db.create_all()    
        from controllers.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix="/auth")
        return app

