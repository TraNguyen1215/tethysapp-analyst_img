# Tethys App: Rice Leaf Disease Detection System
tethysapp-analyst_img is a application developed on the Tethys Platform that helps identify diseases in rice plants through leaf images. The system uses deep learning models to classify common rice diseases such as blast, bacterial leaf blight, and tungro, aiming to assist farmers in early detection and timely treatment.

## Setup env tethys
- miniconda
- python 3.8 -> 3.11
- read link https://docs.tethysplatform.org/en/stable/installation.html

##  How to create a project with tethys
- https://docs.tethysplatform.org/en/stable/tutorials/key_concepts/new_app_project.html

## Features: Rice Leaf Disease Detection System
- Upload rice leaf images via the web interface for disease diagnosis

- Extract image features and classify using AI models

- Display disease information

- Store analysis results

## Run Backend (cmd)
- https://github.com/TraNguyen1215/img_analyst_backend
- cd img_analyst_backend
- set flask_app=app.py
- debug mode: set flask_debug=1
- flask run

## Run (cmd)
- git clone https://github.com/TraNguyen1215/
- cd tethysapp-analyst_img
- conda activate tethys
- tethys install -d
- tethys manage start
