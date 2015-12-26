from os import environ as env, path

DEBUG = True
ASSETS_DEBUG = True
CACHE = True

APP_TITLE = 'aleph.grano.local'
APP_NAME = 'aleph'

ARCHIVE_TYPE = 'file'
ARCHIVE_AWS_KEY_ID = env.get('AWS_ACCESS_KEY_ID')
ARCHIVE_AWS_SECRET = env.get('AWS_SECRET_ACCESS_KEY')
# ARCHIVE_BUCKET = 'aleph2-dev.pudo.org'
# ARCHIVE_PATH = '/srv/data/aleph'


SECRET_KEY = env.get('SECRET_KEY')

SQLALCHEMY_DATABASE_URI = env.get('DATABASE_URL', 'sqlite:///aleph.sqlite3')
ELASTICSEARCH_URL = env.get('BONSAI_URL', 'http://localhost:9200')

ALEMBIC_DIR = path.join(path.dirname(__file__), 'migrate')
ALEMBIC_DIR = path.abspath(ALEMBIC_DIR)

TWITTER_API_KEY = None
TWITTER_API_SECRET = None

FACEBOOK_APP_ID = None
FACEBOOK_APP_SECRET = None

SPINDLE_URL = 'https://search.occrp.org/'
SPINDLE_API_KEY = None

CELERY_ALWAYS_EAGER = False
CELERY_TASK_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TIMEZONE = 'UTC'
CELERY_BROKER_URL = env.get('RABBITMQ_BIGWIG_URL',
                            'amqp://guest:guest@localhost:5672//')
CELERY_IMPORTS = ('aleph.processing')
