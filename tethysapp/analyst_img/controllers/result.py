from django.shortcuts import render
from tethys_sdk.routing import controller

@controller(url='/result')
def result(request):
    context = {}

    return render(request, 'analyst_img/pages/result.html', context)

@controller(url='/result-detail/{id}')
def result_detail(request, id):
    context = {}

    return render(request, 'analyst_img/pages/result_detail.html', context)
