FROM python:3.11-slim

WORKDIR /server

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8000

RUN useradd -m -u 1001 apiuser && chown -R apiuser:apiuser /server
USER apiuser

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
