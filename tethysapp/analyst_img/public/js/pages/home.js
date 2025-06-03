function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

$(document).ready(function () {
    let isProcessing = false;
    let isStopped = false;

    $('#image-upload').on('change', function () {
        const files = this.files;
        const $resultList = $('#result-list');
        $resultList.empty();

        if (files.length > 0) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if ($resultList.find(`.result-item[data-file-name="${file.name}"]`).length === 0) {
                        $resultList.append(`
                            <div class="col-md-3 result-item" data-file-name="${file.name}">
                                <img src="${e.target.result}" alt="${file.name}" class="img-fluid mb-2">
                                <p class="file-name text-muted">${file.name}</p>
                                <p class="result-text text-muted">Chờ tra cứu...</p>
                            </div>
                        `);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    });

    $('#upload-form').on('submit', function (e) {
        e.preventDefault();

        if (isProcessing) {
            alert('Đang xử lý, vui lòng đợi kết quả trước khi tra cứu tiếp!');
            return;
        }

        const files = $('#image-upload')[0].files;
        if (files.length === 0) {
            alert('Vui lòng tải lên ít nhất một ảnh!');
            return;
        }

        isProcessing = true;
        isStopped = false;
        $('#loading-spinner').show();

        Array.from(files).forEach((file, index) => {
            const $currentResultItem = $('#result-list').find(`.result-item[data-file-name="${file.name}"]`);
            const $currentResultText = $currentResultItem.find('.result-text');

            // Bỏ qua nếu ảnh đã có kết quả hoặc nút "Chi tiết"
            if ($currentResultItem.find('.result-buttons').length > 0) {
                if (index === files.length - 1) {
                    isProcessing = false; // Đảm bảo trạng thái xử lý được reset
                    $('#loading-spinner').hide();
                }
                return;
            }

            $currentResultText.text('Đang xử lý...');
            const formData = new FormData();
            formData.append('image', file);

            $.ajax({
                url: '/apps/analyst-img/api/predict-image/',
                type: 'POST',
                data: formData,
                headers: {
                    'X-CSRFToken': getCSRFToken()
                },
                processData: false,
                contentType: false,
                success: function (response) {
                    if (!isStopped) {
                        if ($currentResultItem.find('.result-buttons').length === 0) {
                            $currentResultText.text(response.vnname);
                            $currentResultItem.append(`
                                <div class="result-buttons mt-2">
                                    <a class="btn btn-outline-success view-result-btn" href="/apps/analyst-img/result-detail/${response.id}/">Chi tiết</a>
                                </div>
                            `);
                        }
                    }
                },
                error: function () {
                    $currentResultText.text('Lỗi khi xử lý ảnh!').css('color', 'red');
                },
                complete: function () {
                    if (index === files.length - 1) {
                        isProcessing = false;
                        $('#loading-spinner').hide();
                    }
                },
            });
        });
    });

    $('#clear-button').on('click', function () {
        if (isProcessing) {
            isStopped = true;
            $('#result-list .result-item').each(function () {
                const $resultText = $(this).find('.result-text');
                if (!$(this).find('.result-buttons').length) {
                    $resultText.text('Xử lý ảnh không thành công').css('color', 'red');
                }
            });
        }
    });
});
