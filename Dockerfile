FROM python:3.10-slim

WORKDIR /app

# dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy code
COPY run.py .
COPY application/ ./application

# copy statics & templates
COPY application/static ./static
COPY application/templates ./templates

# expose port
EXPOSE 5000

# run it
ENTRYPOINT ["python", "run.py"]
