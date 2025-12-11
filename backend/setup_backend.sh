#!/bin/bash

echo "Setting up UniMitr Backend..."

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Make migrations
echo "Creating migrations..."
python manage.py makemigrations authapp
python manage.py makemigrations events
python manage.py makemigrations clubs
python manage.py makemigrations volunteering
python manage.py makemigrations internships
python manage.py makemigrations workshops

# Apply migrations
echo "Applying migrations..."
python manage.py migrate

# Create superuser (optional)
echo "To create a superuser, run: python manage.py createsuperuser"

echo "Setup complete! Run 'python manage.py runserver 0.0.0.0:4000' to start the server."