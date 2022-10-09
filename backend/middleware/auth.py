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
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = {}
        except:
            return jsonify({
                'message': "Invalid Token!"
            }), 401
        return f(current_user, *args, **kwargs)
    return decorated