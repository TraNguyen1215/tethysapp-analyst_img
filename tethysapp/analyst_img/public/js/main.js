$(document).ready(function () {
    // Lấy URL hiện tại
    var current_url = window.location.pathname;

    // Đối tượng ánh xạ đường dẫn URL với ID của menu tương ứng
    var menu_map = {
        '/apps/analyst_img/': '#home-menu',
        '/apps/analyst_img/result/': '#result-menu',
        '/apps/analyst_img/result/add/': '#result-menu',
        '/apps/analyst_img/dataset/': '#dataset-menu',
        '/apps/analyst_img/add_dataset/': '#dataset-add',
    };

    // Tìm menu tương ứng với URL hiện tại
    var active_menu_id = menu_map[current_url];

    // Nếu tìm thấy menu tương ứng, thêm lớp 'active'
    if (active_menu_id) {
        $(active_menu_id).addClass('active');
    }
});