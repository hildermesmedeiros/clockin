import cv2
from django.conf import settings
import os
import threading
file_name = os.path.join(settings.STATICFILES_DIRS[0], 'images', 'nocamera.jpg')
file_name = file_name.replace("\\", "/")
class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.video.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
        self.video.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
        (self.grabbed, self.frame) = self.video.read()
        threading.Thread(target=self.update, args=()).start()

    def __del__(self):
        self.video.release()

    def get_frame(self):
        image = self.frame
        _, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()

    def update(self):
        while True:
            (self.grabbed, self.frame) = self.video.read()

from django.shortcuts import render
def gen(camera):
    while True:
        try:
            frame = camera.get_frame()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        except cv2.error as e:
            # handle error: empty frame
            if e.err == "!_src.empty()":
                break

            return render(request, 'camoffbase.html')
