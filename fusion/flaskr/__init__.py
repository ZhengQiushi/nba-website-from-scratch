import os

from flask import Flask
from datetime import timedelta



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://truth:916003@192.168.80.230:3306/my_basketball',
        SQLALCHEMY_TRACK_MODIFICATIONS = True,
        POSTS_PER_PAGE = 50,
        SEND_FILE_MAX_AGE_DEFAULT = timedelta(seconds = 1)
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import games
    app.register_blueprint(games.bp)


    from . import teams
    app.register_blueprint(teams.bp)

    from . import blog
    app.register_blueprint(blog.bp)
    app.add_url_rule('/', endpoint='index')

    

    return app