import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Update for Render deployment
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'capstone-parking-dodv.onrender.com',
    'capstone-parking-dodv.onrender.com',
    os.getenv('RENDER_EXTERNAL_HOSTNAME', ''),
    '*',  # Temporary - remove this later for production
]


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app',
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'config.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'config.wsgi.application'


from urllib.parse import urlparse, unquote

MYSQL_PUBLIC_URL = os.getenv("MYSQL_PUBLIC_URL")

if MYSQL_PUBLIC_URL:
    db_url = urlparse(MYSQL_PUBLIC_URL)
    
    # Properly handle port - convert to integer
    port = 3306  # Default MySQL port
    if db_url.port:
        try:
            port = int(db_url.port)
        except (ValueError, TypeError):
            port = 3306

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': db_url.path.lstrip('/'),
            'USER': unquote(db_url.username or ''),
            'PASSWORD': unquote(db_url.password or ''),
            'HOST': db_url.hostname,
            'PORT': port,  # Now it's an integer, not a string
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('DB_HOST'),
            'PORT': int(os.getenv('DB_PORT', 3306)),  # Convert to int with default
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


MAILERS = {
    'default': {
        'BACKEND': 'django.core.mail.backends.console.EmailBackend',
    },
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://capstone-parking-frontend.onrender.com",  # Add this line
]

SPECTACULAR_SETTINGS = {
    'TITLE': 'Smart Parking API',
    'DESCRIPTION': 'API documentation for the Smart Parking Management System',
    'VERSION': '1.0.0',
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,

    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },

    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'app': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
# Auto-create superuser on deploy
if os.getenv('DJANGO_SUPERUSER_USERNAME'):
    from django.core.management import call_command
    try:
        call_command('createsuperuser', 
                     username=os.getenv('DJANGO_SUPERUSER_USERNAME'),
                     email=os.getenv('DJANGO_SUPERUSER_EMAIL'),
                     password=os.getenv('DJANGO_SUPERUSER_PASSWORD'),
                     interactive=False)
    except:
        pass  # Already exists