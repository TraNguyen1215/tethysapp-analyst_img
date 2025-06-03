function analysis(event) {
    let sel_var = "WQI";
    let sel_result_set = dataset_id;

    let no_data_element = document.getElementById(`no-data-${event}`);
    let has_data_element = document.getElementById(`has-data-${event}`);
    let loading_element = document.getElementById(`loading-${event}`);

    // Hiển thị trạng thái Loading
    loading_element.style.display = "block";
    no_data_element.classList.add('d-none');
    has_data_element.classList.add('d-none');

    const csrftoken = getCookie('csrftoken');

    $.ajax({
        type: 'POST',
        url: '/apps/analyst_img/analysis/ajax/',
        headers: {
            'X-CSRFToken': csrftoken
        },
        data: JSON.stringify({ 'sel_var': sel_var, 'sel_result_set': sel_result_set, 'depends': [event] }),
        success: function (data) {
            // Ẩn Loading và hiển thị kết quả
            loading_element.style.display = "none";
            has_data_element.classList.remove('d-none');
            $(`#analysis_chart_${event}`).html(data);

            let yeu_to = getParamNameFromId(event);
            let ket_qua = parseFloat((coef * coef).toFixed(2));

            let text = findText(ket_qua, yeu_to);
            let textFinal = text.replaceAll('@yeu_to', `<b>${yeu_to}</b>`).replaceAll('@ket_qua', `<b>${ket_qua}</b>`);
            let text_element = document.getElementById(`text-${event}`);
            text_element.innerHTML = textFinal;
        },
        error: function (error) {
            // Hiển thị lại trạng thái No Data khi lỗi xảy ra
            loading_element.style.display = "none";
            has_data_element.classList.add('d-none');
            no_data_element.classList.remove('d-none');
        },
    });
}

function getParamNameFromId(id) {
    switch (id) {
        case 'nearest_discharge_distance':
            return 'Khoảng cách tới điểm xả thải';
        case 'total_nearby_discharge_power':
            return 'Lưu lượng xả thải';
        case 'population_density':
            return 'Mật độ dân số';
        default:
            return '';
    }
}

function findText(r2, yeu_to) {
    for (let obj of correlationCfgResult) {
        if (r2 >= parseFloat(obj.min_value) && r2 <= parseFloat(obj.max_value)) {
            return obj.detail[yeu_to];
        }
    }
    return '';
}
