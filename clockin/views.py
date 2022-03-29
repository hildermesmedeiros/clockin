from django.shortcuts import render
# from django.template import loader
from django.http import StreamingHttpResponse, HttpResponse
from django.http import HttpResponseRedirect
import json
import cv2
from django.conf import settings
import os
import threading
def home(request):
    return render(request, 'home.html')




file_name = os.path.join(settings.STATICFILES_DIRS[0], 'images', 'nocamera.jpg')
file_name = file_name.replace("\\", "/")
