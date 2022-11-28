from functools import wraps
from flask import request, jsonify, make_response, app
import jwt


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            # app.config['SECRET_KEY']
            data = jwt.decode(token, "secret_key", algorithms="HS256")
            current_user = data['customer_data']
            isAdmin = data['is_admin']
            return f(current_user, isAdmin, *args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({
                'message': "Invalid Token!"
            }), 401
    return decorated
