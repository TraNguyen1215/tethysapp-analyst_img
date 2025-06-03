$('.sidebar-general').on('click', function () {
    $('.analysis-content').addClass('d-none');
    $('.support-content').addClass('d-none');
    $('.general-content').removeClass('d-none');

    $('.sidebar-general').addClass('active');
    $('.sidebar-analysis').removeClass('active');
    $('.sidebar-support').removeClass('active');
});

$('.sidebar-analysis').on('click', function () {
    $('.general-content').addClass('d-none');
    $('.support-content').addClass('d-none');
    $('.analysis-content').removeClass('d-none');

    $('.sidebar-analysis').addClass('active');
    $('.sidebar-general').removeClass('active');
    $('.sidebar-support').removeClass('active');
});

$('.sidebar-support').on('click', function () {
    $('.analysis-content').addClass('d-none');
    $('.general-content').addClass('d-none');
    $('.support-content').removeClass('d-none');

    $('.sidebar-support').addClass('active');
    $('.sidebar-analysis').removeClass('active');
    $('.sidebar-general').removeClass('active');
});