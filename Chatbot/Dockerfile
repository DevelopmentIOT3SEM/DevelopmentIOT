FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Servidor WSGI de produção (não usa o servidor de desenvolvimento do Flask).
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
