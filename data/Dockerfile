FROM python:3.7

RUN apt-get update && \
    apt-get install -y python3-pip

RUN mkdir /app
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app