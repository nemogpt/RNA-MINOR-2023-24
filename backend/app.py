from flask import Flask
from db import db


def create_app(config_filename = "config.cfg"):
    app = Flask(__name__)
    if config_filename:
        app.config.from_pyfile(config_filename)
    
    db.init_app(app)
    with app.app_context():
        from models.branch import Branch
        from models.card import Card
        from models.customer import Customer
        from models.atm import ATM
        from models.transaction import Transaction
        db.create_all()

        from controllers.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix="/auth")

        return app

