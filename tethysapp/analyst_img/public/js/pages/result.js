var dataset_table = null;

// Loading overlay
function showLoading() {
    $('#loading').show();
}

function hideLoading() {
    $('#loading').hide();
}

// Document Ready
$(document).ready(function () {
    // Hiển thị và ẩn overlay cho tất cả các yêu cầu AJAX
    $(document).ajaxStart(showLoading).ajaxStop(hideLoading);

    // Lấy danh sách bộ dữ liệu
    $.ajax({
        url: '/apps/analyst-img/api/results',
        type: 'GET',
        success: function (res) {
            let data = res['histories'];
            fillDataToTable(data);
        },
        error: function (error) {
            console.error('Error fetching data', error);
        }
    });

    // Sự kiện nút "Xóa đã chọn"
    $('#delete-selected').on('click', function () {
        let selectedIds = [];
        $('#result-table .select-row:checked').each(function () {
            let rowData = dataset_table.row($(this).closest('tr')).data();
            selectedIds.push(rowData.id);
        });

        if (selectedIds.length > 1) {
            if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} bộ dữ liệu đã chọn?`)) {
                $.ajax({
                    url: '/apps/analyst-img/api/delete-multiple-results',
                    type: 'DELETE',
                    data: JSON.stringify({ ids: selectedIds }),
                    contentType: 'application/json',
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    },
                    success: function () {
                        selectedIds.forEach(id => {
                            dataset_table.rows().data().toArray().forEach((item, index) => {
                                if (item.id === id) {
                                    dataset_table.row(index).remove().draw();
                                }
                            });
                        });
                        $('#uploadModal').modal('show');
                        if ($('#modal-buton').click(function () {
                            window.location.reload();
                        })) {
                            $('#uploadModal').modal('hide');
                        }
                    },
                    error: function () {
                        alert('Có lỗi xảy ra khi xóa!');
                    }
                });
            }
        } 
        else if (selectedIds.length === 1 || selectedIds.length === 0) {
            deleteDataset(selectedIds[0]);
        }  
    });
});

// Điền dữ liệu vào DataTable
function fillDataToTable(data) {
    
    if (dataset_table !== null) {
        dataset_table.clear();
        dataset_table.destroy();
        dataset_table = null;
        $('#result-table tbody').off();
    }

    dataset_table = $('#result-table').DataTable({
        data: data,
        language: {
            zeroRecords: 'Không có kết quả tìm kiếm phù hợp',
            lengthMenu: 'Số bộ dữ liệu cho mỗi trang _MENU_',
            info: 'Đang hiển thị _START_ đến _END_ trong tổng số _TOTAL_ bộ dữ liệu',
            search: 'Tìm kiếm',
        },
        dom: '<"top"i>rt<"bottom"flp><"clear">',
        pageLength: 10,
        order: [[1, 'asc']],
        columns: [
            {
                title: "<input type='checkbox' id='select-all'/>",
                width: '50px',
                orderable: false,
                render: () => `<input type='checkbox' class='select-row'/>`,
            },
            {
                title: 'STT',
                width: '50px',
                render: (data, type, full, meta) => meta.row + 1,
            },
            {
                data: 'title',
                title: 'Tên dữ liệu',
            },
            {
                data: 'create_time',
                title: 'Ngày tạo',
                width: '200px',
                render: data => {
                    if (!data) return '';
                    let datetime = new Date(Date.parse(data));
                    return datetime.toLocaleString('en-GB');
                },
            },
            {
                data: 'catagery',
                title: 'Loại bệnh',
                width: '200px',
            },
            {
                data: 'accuracy',
                title: 'Độ chính xác (%)',
                width: '200px',
            },
            {
                data: 'status',
                title: 'Trạng thái',
                width: '140px',
            },
            {
                data: 'id',
                title: 'Thao tác',
                width: '240px',
                className: 'text-center',
                orderable: false,
                render: (data) => `
                    <div class="result-btn" style="text-align: center;">
                        <a class="btn btn-outline-success view-result-btn" href="/apps/analyst-img/result-detail/${data}/">Chi tiết</a>
                        <button class="btn btn-outline-danger delete-result-btn" onclick="deleteDataset('${data}')">Xóa</button>
                    </div>
                `,
            }
        ]
    });

    add_filter_dataset_event();
    addSelectAllEvent();
    addRowSelectEvent();
}

// Xóa dataset theo ID
function deleteDataset(id) {
    const row = dataset_table.rows().data().toArray().findIndex(item => item.id == id);
    if (row !== -1) {
        const rowData = dataset_table.row(row).data();
        const title = rowData.title;

        if (confirm(`Bạn có chắc chắn muốn xóa bộ dữ liệu với tên: ${title}?`)) {
            dataset_table.row(row).remove().draw();
            $.ajax({
                url: `/apps/analyst-img/api/delete-results/${id}`,
                type: 'DELETE',
                headers: {
                    'X-CSRFToken': getCSRFToken()
                },
                success: function () {
                    $('#uploadModal').modal('show');
                    if ($('#modal-buton').click(function () {
                        window.location.reload();
                    })) {
                        $('#uploadModal').modal('hide');
                    }
                },
                error: function () {
                    alert('Có lỗi xảy ra khi xóa!');
                }
            });
        }
    } else {
        alert('Không tìm thấy bản ghi để xóa!');
    }
}

// Checkbox "Chọn tất cả"
function addSelectAllEvent() {
    $('#select-all').on('click', function () {
        let isChecked = $(this).prop('checked');
        $('#result-table .select-row').prop('checked', isChecked);
    });
}

// Checkbox từng dòng
function addRowSelectEvent() {
    $('#result-table').on('click', '.select-row', function () {
        let allChecked = $('#result-table .select-row').length === $('#result-table .select-row:checked').length;
        $('#select-all').prop('checked', allChecked);
    });
}

// Tìm kiếm
function add_filter_dataset_event() {
    let search_input = $('#search-result-input');
    if (search_input.length) {
        search_input.on('keyup', function () {
            let search_keyword = search_input.val();
            dataset_table.search(search_keyword).draw();
        });
    }
}

// Lấy CSRF Token
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}
