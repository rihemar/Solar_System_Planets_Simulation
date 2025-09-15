import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

import threading
from flask import Flask, jsonify
from flask_cors import CORS


data_origin ={"gesture":"none","fingertip encoding x":"","fingertip encoding y":"" }
data = data_origin
app = Flask(__name__)
CORS(app)

# --- STEP 1: Create GestureRecognizer ---
model_path = r'gesture_recognizer.task'
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.GestureRecognizerOptions(base_options=base_options)
recognizer = vision.GestureRecognizer.create_from_options(options)

def everything():

    # --- STEP 2: Set up webcam ---
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        exit()

    while True:
        ret, frame = cap.read()
        # No pixel flipping (mirror) applied
        # Mirror the frame along the y-axis (horizontal flip)
        frame = cv2.flip(frame, 1)
        if not ret:
            break

        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Convert to MediaPipe Image object
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        # --- STEP 3: Recognize gestures ---
        recognition_result = recognizer.recognize(mp_image)

        # --- STEP 4: Draw gestures ---
        if recognition_result.gestures:
            for hand_gestures in recognition_result.gestures:
                top_gesture = hand_gestures[0]  # Most confident gesture
                text = f"{top_gesture.category_name} ({top_gesture.score:.2f})"
                cv2.putText(frame, text, (50, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # --- STEP 5: Draw hand landmarks ---
        if recognition_result.hand_landmarks:
            # print(recognition_result.hand_landmarks)
            for hand_landmarks in recognition_result.hand_landmarks:
                for landmark in hand_landmarks:
                    x = int(landmark.x * frame.shape[1])
                    y = int(landmark.y * frame.shape[0])
                    cv2.circle(frame, (x, y), 3, (0, 0, 255), -1)

        # --- STEP 6: Display the frame ---
        frame = cv2.resize(frame, (400, 300))

        cv2.imshow('Live Gesture Recognition', frame)


        # --- DATA to be sent PREP ---
        if recognition_result.gestures and recognition_result.hand_landmarks:
            global data
            data ={
                "gesture" : recognition_result.gestures[0][0].category_name,
                "fingertip encoding x" :  recognition_result.hand_landmarks[0][8].x * frame.shape[1],
                "fingertip encoding y" :  recognition_result.hand_landmarks[0][8].y * frame.shape[0],
            }
        else:
            data =data_origin

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


    # --- send data to sock ---
    

@app.route('/gesture')
def get_pose():
    return jsonify(data)

if __name__ == '__main__':
    # Start the camera capture loop in a separate thread
    thread = threading.Thread(target=everything, daemon=True)
    thread.start()

    # Run Flask server
    app.run(host='0.0.0.0', port=5000)

