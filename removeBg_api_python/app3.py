# ==========================
# add glow effect on the image

import os
import io
from flask import Flask, request, jsonify
from PIL import Image, ImageFilter
from rembg import remove
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def remove_bg(input_path):
    with open(input_path, "rb") as inp_file:
        img = remove(inp_file.read())
        print('remove bg okay')
        return img

def add_glow_effect(image_data):
    image = Image.open(io.BytesIO(image_data))
    glow = image.filter(ImageFilter.GaussianBlur(radius=100))  # Adjust the radius for the glow effect
    # Composite the original image with the glow effect
    glow = Image.composite(image, glow, image)
    return glow

def overlay_img(overlay_image, background_image_path, position, size):
    background_image = Image.open(background_image_path)
    overlay_image = overlay_image.resize(size)
    background_image.paste(overlay_image, position, overlay_image)
    return background_image

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'okay'})

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return "No file part", 400

    file = request.files['image']

    if file.filename == '':
        return "No selected file", 400

    if file:
        inputFileName = 'input_img.jpg'
        filename = os.path.join(app.config['UPLOAD_FOLDER'], inputFileName)
        file.save(filename)

        position = (10, 10)
        size = (1080, 1920)

        img_without_bg = remove_bg(filename)

        # Add glow effect
        img_with_glow = add_glow_effect(img_without_bg)

        # Overlay the processed image on a background
        result_image = overlay_img(img_with_glow, 'bg.jpg', position, size)

        result_filename = os.path.join(app.config['UPLOAD_FOLDER'], 'result.jpg')
        
        # Save the image with compression
        result_image.save(result_filename, 'JPEG', quality=85)  # Adjust the quality as needed (0-100)

        # Convert the result image to base64
        with open(result_filename, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        return jsonify({'image': base64_image})

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
