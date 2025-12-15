# Dockerfile for Django backend on Render
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app


# Install dependencies
COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port (Render uses 10000 by default for Docker)
EXPOSE 10000

# Start server (temporary: run Django system check for debugging)
CMD ["python", "manage.py", "check"]
