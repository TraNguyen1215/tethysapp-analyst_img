function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

$(document).ready(function () {
    $.ajax({
        url: '/apps/analyst-img/api/diseases',
        type: 'GET',
        success: function (data) {
            console.log(data);
            const diseasesList = $('.select-group #data-type');
            $.each(data.diseases, function (index, item) {
                const option = $('<option>', {
                    class: item.id + ' disease',
                    value: item.id,
                    text: item.vnname
                });
                diseasesList.append(option);
            });

            // Thiết lập sự kiện 'change' cho select
            diseasesList.on('change', function () {
                const selectedOption = $(this).find('option:selected');
                const diseaseName = selectedOption.text();
                console.log('Chọn bệnh: ' + diseaseName);
            });

            if (data.diseases.length > 0) {
                diseasesList.val(diseasesList.find('option').first().val()).change();
            }
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
        }
    });

    const $uploadButton = $(".upload-button");
    const $uploadBox = $(".upload-area");
    const $uploadInput = $("<input type='file' accept='.pdf'>");
    const $saveButton = $("#save-button");
    const $titleInput = $("#data-title");
    const $descriptionInput = $("#data-description");

    // Hàm kiểm tra điều kiện bật nút "Lưu"
    function checkSaveButtonState() {
        const isFileSelected = $uploadInput[0].files.length > 0;
        const isTitleEntered = $titleInput.val().trim() !== "";
        $saveButton.prop("disabled", !(isFileSelected && isTitleEntered));
    }

    $uploadButton.on("click", function () {
        $uploadInput.trigger("click"); // Mở hộp thoại chọn tệp
    });

    $uploadInput.on("change", function () {
        const file = this.files[0];
        if (file) {
            if ( file.name.endsWith(".pdf")) {
                const fileSize = (file.size / 1024).toFixed(2);
                $uploadBox.html(`
                    <div style="text-align: center; padding: 16px;">
                        <p><strong>Tệp đã chọn:</strong> ${file.name} (${fileSize} KB)</p>
                        <button class="upload-button">CHỌN TỆP KHÁC</button>
                    </div>
                `);
                $(".upload-button").on("click", function () {
                    $uploadInput.trigger("click");
                });
            } else {
                alert("Vui lòng chọn tệp có định dạng .pdf!");
                $uploadBox.html(`
                    <div style="text-align: center; padding: 16px;">
                        <p style="color: red;">Tệp không hợp lệ. Vui lòng thử lại.</p>
                        <button class="upload-button">CHỌN TỆP</button>
                    </div>
                `);
                $(".upload-button").on("click", function () {
                    $uploadInput.trigger("click");
                });
            }
        }
        checkSaveButtonState();
    });

    $("#data-type").on("change", checkSaveButtonState);
    $titleInput.on("input", checkSaveButtonState);

    $uploadBox.on("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $uploadBox.css("border", "2px dashed #007bff");
    });

    $uploadBox.on("dragleave", function () {
        $uploadBox.css("border", "2px dashed #ccc");
    });

    $uploadBox.on("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $uploadBox.css("border", "2px dashed #ccc");
        const files = event.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith(".pdf")) {
                const fileSize = (file.size / 1024).toFixed(2);
                $uploadBox.html(`
                    <div style="text-align: center; padding: 16px;">
                        <p><strong>Tệp đã chọn:</strong> ${file.name} (${fileSize} KB)</p>
                        <button class="upload-button">CHỌN TỆP KHÁC</button>
                    </div>
                `);
                $(".upload-button").on("click", function () {
                    $uploadInput.trigger("click");
                });
            } else {
                alert("Vui lòng kéo và thả tệp có định dạng .pdf!");
                $uploadBox.html(`
                    <div style="text-align: center; padding: 16px;">
                        <p style="color: red;">Tệp không hợp lệ. Vui lòng thử lại.</p>
                        <button class="upload-button">CHỌN TỆP</button>
                    </div>
                `);
                $(".upload-button").on("click", function () {
                    $uploadInput.trigger("click");
                });
            }
        }
        checkSaveButtonState();
    });

    $saveButton.on("click", function () {
        const title = $titleInput.val().trim();
        const description = $descriptionInput.val().trim();
        const category = $('#data-type').val(); // Giá trị category từ dropdown
        const publishDate = new Date().toISOString();

        if (!title || !description || !category) {
            alert("Vui lòng điền đầy đủ thông tin trước khi tải lên!");
            return;
        }

        const formData = new FormData();
        formData.append('file', $uploadInput[0].files[0]);
        formData.append('original_title', title);
        formData.append('description', description);
        formData.append('create_date', publishDate);
        formData.append('id_deas', category); // Truyền `id_deas`
        console.log('Form data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }


        $.ajax({
            url: 'http://127.0.0.1:5000/api/material/', // Đảm bảo đường dẫn chính xác
            type: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
                // Điều hướng nếu cần
                // window.location.href = '/apps/analyst-img/dataset';
            },
            error: function (xhr, status, error) {
                console.log('Error:', xhr.responseJSON || error);
                alert("Đã xảy ra lỗi: " + (xhr.responseJSON?.error || error));
            }
        });

        // sau khi tải lên hiện model
        $('#uploadModal').modal('show');
        if ($('#modal-buton').click(function () {
            window.location.href = '/apps/analyst-img/dataset';
        })) {
            $('#uploadModal').modal('hide');

        }
    });
});
