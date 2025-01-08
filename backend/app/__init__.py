from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for cross-origin requests

    # Register routes
    from .routes import bp as main_routes
    app.register_blueprint(main_routes)

    return app