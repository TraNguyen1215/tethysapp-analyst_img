from django.shortcuts import render
from tethys_sdk.routing import controller

@controller(url='/')
def home(request):
    context = {}

    return render(request, 'analyst_img/pages/home.html', context)