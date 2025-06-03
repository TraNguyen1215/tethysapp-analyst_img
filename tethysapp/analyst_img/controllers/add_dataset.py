from django.shortcuts import render
from tethys_sdk.routing import controller

@controller(url='/add_dataset')
def dataset(request):
    context = {}

    return render(request, 'analyst_img/pages/add_dataset.html', context)