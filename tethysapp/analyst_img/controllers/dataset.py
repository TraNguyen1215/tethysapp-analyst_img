from django.shortcuts import render
from tethys_sdk.routing import controller

@controller(url='/dataset')
def dataset(request):
    context = {}

    return render(request, 'analyst_img/pages/dataset.html', context)