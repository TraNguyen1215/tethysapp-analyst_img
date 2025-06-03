let pdfDoc = null;
let currentPage = 1;
let isRendering = false; // Biến để kiểm soát trạng thái rendering tránh tình trạng render chéo

// dataset.js
var dataset_table_1 = null;

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
        url: `/apps/analyst-img/api/material`,
        type: 'GET',
        success: function (res) {
            let data = res['data'];
            fillDataToTable(data);
        },
        error: function (error) {
            console.error('Error fetching data', error);
        }
    });

    // Sự kiện nút "Xóa đã chọn"
    $('#delete-selected').on('click', function () {
        let selectedIds = [];
        $('#result-table-1 .select-row:checked').each(function () {
            let rowData = dataset_table_1.row($(this).closest('tr')).data();
            selectedIds.push(rowData.id);
        });

        if (selectedIds.length > 1) {
            if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} bộ dữ liệu đã chọn?`)) {
                $.ajax({
                    url: '/apps/analyst-img/api/delete-multiple-material',
                    type: 'DELETE',
                    data: JSON.stringify({ ids: selectedIds }),
                    contentType: 'application/json',
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    },
                    success: function () {
                        selectedIds.forEach(id => {
                            dataset_table_1.rows().data().toArray().forEach((item, index) => {
                                if (item.id === id) {
                                    dataset_table_1.row(index).remove().draw();
                                }
                            });
                        });
                        window.location.reload();
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
    if (dataset_table_1 !== null) {
        dataset_table_1.destroy();
        dataset_table_1 = null;
        $('#result-table-1 tbody').off();
    }

    dataset_table_1 = $('#result-table-1').DataTable({
        data: data,
        language: {
            zeroRecords: 'Không có kết quả tìm kiếm phù hợp',
            lengthMenu: 'Số bộ dữ liệu cho mỗi trang _MENU_',
            info: 'Đang hiển thị _START_ đến _END_ trong tổng số _TOTAL_ bộ dữ liệu',
            search: 'Tìm kiếm',
        },
        dom: '<"top"i>rt<"bottom"flp><"clear">',
        pageLength: 10,
        order: [[0, 'asc']],
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
                title: 'Tên tài liệu',
            },
            {
                data: 'desc',
                title: 'Mô tả',
                width: '300px',
            },
            {
                data: 'create_at',
                title: 'Ngày tạo',
                width: '200px',
                render: data => {
                    if (!data) return '';
                    let datetime = new Date(Date.parse(data));
                    return datetime.toLocaleString('en-GB');
                },
            },
            {
                data: 'update_at',
                title: 'Ngày cập nhật',
                width: '200px',
                render: data => {
                    if (!data) return '';
                    let datetime = new Date(Date.parse(data));
                    return datetime.toLocaleString('en-GB');
                },
            },
            {
                data: 'id_deas',
                title: 'Loại tài liệu',
                render: function (data) {
                    if (data === 1) {
                        return 'Bệnh đạo ôn';
                    }
                    if (data === 2) {
                        return 'Bệnh cháy lá do vi khuẩn';
                    }
                    if (data === 3) {
                        return 'Bệnh đốm nâu';
                    }
                    return 'Không xác định'; // Trường hợp mặc định nếu không khớp
                }
            },
            {
                data: 'id',
                title: 'Thao tác',
                width: '240px',
                className: 'text-center',
                orderable: false,
                render: (data) => `
                    <div class="result-btn" style="text-align: center;">
                        <a class="btn btn-outline-primary view-result-btn data-id="${data}">Chỉnh sửa</a>
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
    const row = dataset_table_1.rows().data().toArray().findIndex(item => item.id == id);
    if (row !== -1) {
        const rowData = dataset_table_1.row(row).data();
        const title = rowData.title;
        console.log('Delete dataset:', id, title);

        if (confirm(`Bạn có chắc chắn muốn xóa bộ dữ liệu với tên: ${title}?`)) {
            dataset_table_1.row(row).remove().draw();
            $.ajax({
                url: `/apps/analyst-img/api/material/delete/${id}`,
                type: 'DELETE',
                headers: {
                    'X-CSRFToken': getCSRFToken()
                },
                success: function () {
                    alert('Xóa thành công!');
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
        $('#result-table-1 .select-row').prop('checked', isChecked);
    });
}

// Checkbox từng dòng
function addRowSelectEvent() {
    $('#result-table-1').on('click', '.select-row', function () {
        let allChecked = $('#result-table-1 .select-row').length === $('#result-table-1 .select-row:checked').length;
        $('#select-all').prop('checked', allChecked);
    });
}

// Tìm kiếm
function add_filter_dataset_event() {
    let search_input = $('#search-result-input');
    if (search_input.length) {
        search_input.on('keyup', function () {
            let search_keyword = search_input.val();
            dataset_table_1.search(search_keyword).draw();
        });
    }
}

// Lấy CSRF Token
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// Tải dữ liệu loại bệnh từ API
let diseaseOptions = [];

function loadDiseaseOptions() {
    $.ajax({
        url: '/apps/analyst-img/api/diseases', // API lấy danh sách loại bệnh
        type: 'GET',
        success: function (res) {
            $.each(res.diseases, function (index, disease) {
                // console.log('Loại bệnh:', disease);
                diseaseOptions.push(disease);
            });
            // console.log('Danh sách loại bệnh:', diseaseOptions);
        },
        error: function (error) {
            console.error('Không thể tải danh sách loại bệnh:', error);
        }
    });
}

// Gọi API khi tải trang
$(document).ready(function () {
    loadDiseaseOptions();
});

// Chỉnh sửa bộ dữ liệu
$('#result-table-1').on('click', '.view-result-btn', function () {
    let row = $(this).closest('tr');
    let rowData = dataset_table_1.row(row).data();
    let rowIndex = dataset_table_1.row(row).index();

    $(row).find('td').each(function (index) {
        let columnName = dataset_table_1.settings().init().columns[index]?.data;
        if (columnName !== 'STT' && columnName !== 'create_at' && columnName !== 'update_at' && columnName !== undefined && index !== 0 && index !== 1 && index !== dataset_table_1.columns().count() - 1) {
            if (columnName === 'id_deas') {
                // Cột "Loại bệnh" -> Hiển thị select
                let currentDisease = rowData[columnName];
                let selectHTML = `<select class="form-control">`;
                diseaseOptions.forEach(disease => {
                    selectHTML += `<option value="${disease.id}" ${disease.id === currentDisease ? 'selected' : ''}>${disease.vnname}</option>`;
                });
                selectHTML += `</select>`;
                $(this).html(selectHTML);
            } else {
                // Các cột khác -> Hiển thị input
                let originalText = $(this).text();
                $(this).html(`<input type="text" class="form-control" value="${originalText}" />`);
            }
        }
    });

    $(this).removeClass('view-result-btn').addClass('save-row-btn').text('Lưu');

    $('.save-row-btn').off('click').on('click', function () {
        let updatedData = {};

        // Lấy dữ liệu từ các ô input và select
        $(row).find('td').each(function (index) {
            let columnName = dataset_table_1.settings().init().columns[index]?.data;

            if (columnName !== 'create_at' && columnName !== 'update_at' && index !== 0 && index !== dataset_table_1.columns().count() - 1) {
                let input = $(this).find('input, select');
                if (input.length) {
                    updatedData[columnName] = input.val();
                    $(this).text(input.find(':selected').text() || input.val()); // Cập nhật giao diện
                }
            }
        });

        $.ajax({
            url: `/apps/analyst-img/api/material/update/${rowData.id}/`,
            type: 'PUT',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
            contentType: 'application/json',
            data: JSON.stringify({
                title: updatedData.title,
                description: updatedData.desc,
                id_deas: updatedData.id_deas,
            }),
            success: function (response) {
                dataset_table_1.row(rowIndex).data({ ...rowData, ...updatedData }).draw();
                // sau khi tải lên hiện model
                $('#uploadModal').modal('show');
                if ($('#modal-buton').click(function () {
                    window.location.reload();
                })) {
                    $('#uploadModal').modal('hide');
                }
            },
            error: function (xhr) {
                alert('Có lỗi xảy ra khi cập nhật!');
            }
        });
        
        $(this).removeClass('save-row-btn').addClass('view-result-btn').text('Chỉnh sửa');
    });
});



// nếu là người dùng thì mới hiện phần này
$(document).ready(function () {
    $('#pdf-canvas-left, #pdf-canvas-right, #prev-button, #next-button').hide();
    $('#loading').show();

    $.ajax({
        url: `/apps/analyst-img/api/material`,
        type: 'GET',
        success: function (data) {
            // console.log(data);

            $('#loading').hide();
            const monthList = $('#month-list');
            monthList.empty();
            $.each(data.data, function (index, item) {
                const li = $('<li>', {
                    class: 'pdf-list',
                    'data-news-path': item.dir,
                    text: item.title
                });
                // console.log(item.desc);
                
                const descriptionDiv = $('<div>', { class: 'description d-none' });
                const descriptionSpan = $('<span>', { text: item.desc });
                descriptionDiv.append(descriptionSpan);
                


                // Xác định div tương ứng với id_deas
                const divSelector = `#${item.id_deas}`;  // id_deas tương ứng với div có id là 1, 2, 3, hoặc 4

                // Thêm li và description vào div tương ứng
                $(divSelector).find('#month-list').append(li);
                $(divSelector).find('#month-list').append(descriptionDiv);
                

                // Thêm sự kiện click
                li.on('click', function () {
                    const newsPath = $(this).data('news-path');
                    loadPdf(newsPath);

                    $('.description').addClass('d-none');
                    $('.pdf-list').removeClass('selected');

                    $(this).addClass('selected');
                    descriptionDiv.removeClass('d-none');
                });
            });

            if (data.data.length > 0) {
                loadPdf(data.data[0].dir);
                monthList.find('.pdf-list').first().click();
            }
        },
        error: function () {
            $('#loading').hide();
            console.log('Error', error);
        }
    });
});

function loadPdf(newsPath) {
    const pdfPath = `/apps/analyst-img/api/material${newsPath}`;
    $('#loading').show();
    pdfjsLib.getDocument(pdfPath).promise.then(function (pdfDoc_) {
        $('#loading').hide();
        pdfDoc = pdfDoc_;
        $('#pdf-canvas-left, #pdf-canvas-right, #prev-button, #next-button').show();
        renderPage(currentPage);
    }).catch(function (error) {
        $('#loading').hide();
        console.log('Error', error);
    });
}

function renderPage(pageNum) {
    if (!pdfDoc || isRendering) return;

    isRendering = true;

    const renderSinglePage = (pageNum, canvasSelector) => {
        pdfDoc.getPage(pageNum).then(function (page) {
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = $(canvasSelector)[0];
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);

            renderTask.promise.then(function () {
                isRendering = false;
            }).catch(function (error) {
                isRendering = false;
                console.error('Error rendering page:', error);
            });
        }).catch(function (error) {
            console.error('Error fetching page:', error);
        });
    };

    renderSinglePage(pageNum, '#pdf-canvas-left');

    // Render trang kế tiếp nếu có
    if (pageNum + 1 <= pdfDoc.numPages) {
        renderSinglePage(pageNum + 1, '#pdf-canvas-right');
    }
}

$(document).ready(function () {
    $('#prev-button').on('click', function () {
        if (currentPage > 1) {
            currentPage -= 2;
            renderPage(currentPage);
        }
    });

    $('#next-button').on('click', function () {
        if (currentPage + 1 < pdfDoc.numPages) {
            currentPage += 2;
            renderPage(currentPage);
        }
    });
});
