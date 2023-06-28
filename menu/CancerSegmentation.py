import streamlit as st
import numpy as np
import tensorflow as tf
import cv2 as cv
from matplotlib import pyplot as plt
import os

# This is the model structure of neural network
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.losses import Loss
from tensorflow.keras.layers import Input, Conv2D, Conv2DTranspose, MaxPooling2D, Concatenate, Cropping2D, Dropout

class SegmentationModel(): 
    def __init__(self): 
        inputData = Input(shape=(256,256,3))
        c1 = Conv2D(64, 3, activation='relu', padding='same')(inputData)
        c2 = Conv2D(64, 3, activation='relu', padding='same')(c1)

        c3 = MaxPooling2D()(c2)
        c4 = Conv2D(128, 3, activation='relu', padding='same')(c3)
        c5 = Conv2D(128, 3, activation='relu', padding='same')(c4)
        c5 = Dropout(0.5)(c5)

        c6 = MaxPooling2D()(c5)
        c7 = Conv2D(256, 3, activation='relu', padding='same')(c6)
        c8 = Conv2D(256, 3, activation='relu', padding='same')(c7)
        c8 = Dropout(0.5)(c8)

        c9 = MaxPooling2D()(c8)
        c10 = Conv2D(512, 3, activation='relu', padding='same')(c9)
        c11 = Conv2D(512, 3, activation='relu', padding='same')(c10)
        c11 = Dropout(0.5)(c11)

        c12 = Conv2D(1024, 3, activation='relu', padding='same')(c11)
        c12 = Dropout(0.5)(c12)

        c12 = Concatenate()([c12, Cropping2D(cropping=((16, 16), (16, 16)))(c8)])
        u1 = Conv2DTranspose(1024, 2, (2,2))(c12)
        u2 = Conv2D(512, 3, activation='relu', padding='same')(u1)
        u3 = Conv2D(512, 3, activation='relu', padding='same')(u2)
        u3 = Dropout(0.5)(u3)

        u3 = Concatenate()([u3, Cropping2D(cropping=((32, 32), (32, 32)))(c5)])
        u4 = Conv2DTranspose(512, 2, (2,2))(u3)
        u5 = Conv2D(256, 3, activation='relu', padding='same')(u4)
        u6 = Conv2D(256, 3, activation='relu', padding='same')(u5)
        u6 = Dropout(0.5)(u6)

        u6 = Concatenate()([u6, Cropping2D(cropping=((64, 64), (64, 64)))(c2)])
        u7 = Conv2DTranspose(256, 2, (2,2))(u6)
        u8 = Conv2D(128, 3, activation='relu', padding='same')(u7)
        u9 = Conv2D(6, 1, activation='softmax', padding='same')(u8)

        self.model = Model(inputs=inputData, outputs=u9)
        
# Path to the weights of the model     
disease_models_path = os.path.join(os.getcwd(), "disease_models")
# Load the model
model = SegmentationModel().model
model.load_weights(os.path.join(disease_models_path, "cancer_weights.h5"))


def read_image(content: bytes) -> np.ndarray:
    """
    Image bytes to OpenCV image

    :param content: Image bytes
    :returns OpenCV image
    :raises TypeError: If content is not bytes
    :raises ValueError: If content does not represent an image
    """
    if not isinstance(content, bytes):
        raise TypeError(f"Expected 'content' to be bytes, received: {type(content)}")
    image = cv.imdecode(np.frombuffer(content, dtype=np.uint8), cv.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Expected 'content' to be image bytes")
    return image


def cancer_segmentation_menu():
    st.title('Cancer Segmentation using ML')
    st.info('This is a simple example of using a trained ML model to make predictions for cancer segmentation on images.')
    
    
    uploaded_file = st.file_uploader("Choose a file")
    if uploaded_file is not None:
        # To read file as bytes:
        bytes_data = uploaded_file.getvalue()
        
        # url = "http://127.0.0.1:8000/"

        # payload = {}
        # files=[('data', bytes_data)]
        # headers = {
        # 'accept': 'application/json'
        # }

        # response = requests.request("POST", url, headers=headers, data=payload, files=files)
        
        image = tf.io.decode_image(bytes_data) 
        yhat = model.predict(tf.expand_dims(image, axis=0))
        
        print(f"Yhat: {yhat}")
        
        # prediction = json.loads(response.text)
        
        # yhat = np.array(json.loads(prediction['prediction']))
        # yhat = np.squeeze(np.where(yhat > 0.3, 1.0, 0.0))
        
        # result_image = read_image(bytes_data)
        
        # fig, ax = plt.subplots(1, 7, figsize=(20, 10))
        # ax[0].imshow(result_image) 
        # for i in range(6):
        #     ax[i+1].imshow(yhat[:,:,i])
        # st.pyplot(fig)
        
