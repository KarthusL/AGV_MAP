# Use Debian Bullseye as the base image
FROM debian:bullseye

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV VIRTUAL_ENV="/opt/venv"

# Install Python, pip, and python3-venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment and activate it
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy requirements.txt and install dependencies
COPY requirements.txt /app/
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . /app/

# Command to run the application
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
