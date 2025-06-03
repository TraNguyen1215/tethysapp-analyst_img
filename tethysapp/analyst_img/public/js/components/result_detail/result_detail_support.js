// // <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"><

// var resultId = dataset_id;

// let filter = ["step", ["to-number", ["get", "WQI"]]];
// filter.push(wqiLookupResult[0].color);

// wqiLookupResult.forEach((e) => {
//     filter.push(parseFloat(e.min_value));
//     filter.push(e.color);
// });

// var startTime;
// var endTime;
// var dataTime = [];

// function findSupportText(wqi) {

//     // Duyệt qua từng đối tượng trong danh sách
//     for (let obj of supportTextResult) {

//         // Kiểm tra nếu coef nằm trong khoảng giá trị của đối tượng hiện tại
//         if (wqi >= parseFloat(obj.min_value) && wqi <= parseFloat(obj.max_value)) {
//             // Trả về giá trị text của đối tượng

//             return obj.support_01;
//         }
//     }
    
//     // Nếu không tìm thấy khoảng giá trị phù hợp, trả về null hoặc giá trị mặc định khác tùy theo yêu cầu
//     return "";
// }

// function findSupportTextPolygon(wqi) {
//     // Duyệt qua từng đối tượng trong danh sách
//     for (let obj of supportTextResult) {
//         // Kiểm tra nếu coef nằm trong khoảng giá trị của đối tượng hiện tại
//         if (wqi >= parseFloat(obj.min_value) && wqi <= parseFloat(obj.max_value)) {
//             // console.log(obj);
//             // Trả về giá trị text của đối tượng
//             return [obj.support_02, obj.support_03];
//         }
//     }
//     // Nếu không tìm thấy khoảng giá trị phù hợp, trả về null hoặc giá trị mặc định khác tùy theo yêu cầu
//     return ["", ""];
// }

// function findTitleText(wqi) {
//     // Duyệt qua từng đối tượng trong danh sách
//     for (let obj of supportTextResult) {
//         // Kiểm tra nếu coef nằm trong khoảng giá trị của đối tượng hiện tại
//         if (wqi >= parseFloat(obj.min_value) && wqi <= parseFloat(obj.max_value)) {
//             // Trả về giá trị text của đối tượng
//             return obj.title;
//         }
//     }
//     // Nếu không tìm thấy khoảng giá trị phù hợp, trả về null hoặc giá trị mặc định khác tùy theo yêu cầu
//     return "";
// }

// var supportMap = new maplibregl.Map({
//     container: "support-map",
//     style: {
//         version: 8,
//         sources: {},
//         layers: [],
//     },

//     center: [106.95, 10.9350383],
//     maxBounds: [
//         [101.5, 8.0],
//         [108.5, 11.5],
//     ],

//     zoom: 6,
// });

// supportMap.addControl(new maplibregl.NavigationControl());

// supportMap.on("load", async function () {
//     // var diem_xa_thai_img = supportMap.loadImage("/static/analyst_img/images/diem_xa_thai.png");
//     // var diem_khai_thac_nm_img = supportMap.loadImage("/static/analyst_img/images/diem_khai_thac_nuoc_mat.png");
//     // var diem_khai_thac_dd_img = supportMap.loadImage("/static/analyst_img/images/diem_khai_thac_nuoc_duoi_dat.png");

//     // supportMap.addImage("diem_xa_thai", diem_xa_thai_img.data);
//     // supportMap.addImage("diem_khai_thac_nuoc_mat", diem_khai_thac_nm_img.data);
//     // supportMap.addImage("diem_khai_thac_nuoc_duoi_dat", diem_khai_thac_dd_img.data);

//     const imagePromises = [supportMap.loadImage("/static/analyst_img/images/diem_xa_thai.png"), supportMap.loadImage("/static/analyst_img/images/diem_khai_thac_nuoc_mat.png"), supportMap.loadImage("/static/analyst_img/images/diem_khai_thac_nuoc_duoi_dat.png")];

//     Promise.all(imagePromises).then((images) => {
//         supportMap.addImage("diem_xa_thai", images[0].data);
//         supportMap.addImage("diem_khai_thac_nuoc_mat", images[1].data);
//         supportMap.addImage("diem_khai_thac_nuoc_duoi_dat", images[2].data);

//         // Thêm layer polygon sau khi đã tải xong ảnh
//         // map.addLayer({
//         //     "id": "drawn-polygons",
//         //     "type": "fill",
//         //     "source": "draw",
//         //     // ... (các thuộc tính khác)
//         // });
//     });

//     // Lớp nền
//     supportMap.addSource("becagisSource", {
//         type: "raster",
//         tiles: ["https://maps.becagis.vn/tiles/basemap/light/{z}/{x}/{y}.png"],
//         tileSize: 256,
//     });

//     // Lớp điểm khai thác
//     supportMap.addSource("mat_do_dan_so", {
//         type: "vector",
//         tiles: ["https://martin.mkdc.com.vn/table.dss_wqi.mat_do_dan_so_cap_xa.geom/{z}/{x}/{y}"],
//         tilejson: "3.0.0",
//     });

//     // Lớp điểm xả thải
//     supportMap.addSource("diem_xa_thai", {
//         type: "vector",
//         tiles: ["https://martin.mkdc.com.vn/table.dss_wqi.diem_xa_thai.geom/{z}/{x}/{y}"],
//         tilejson: "3.0.0",
//     });

//     // Lớp điểm khai thác nước mặt
//     supportMap.addSource("diem_khai_thac_nuoc_mat", {
//         type: "vector",
//         tiles: ["https://martin.mkdc.com.vn/table.dss_wqi.diem_khai_thac_nuoc_mat.geom/{z}/{x}/{y}"],
//         tilejson: "3.0.0",
//     });

//     // Lớp điểm khai thác nước dưới đất
//     supportMap.addSource("diem_khai_thac_nuoc_duoi_dat", {
//         type: "vector",
//         tiles: ["https://martin.mkdc.com.vn/table.dss_wqi.diem_khai_thac_nuoc_duoi_dat.geom/{z}/{x}/{y}"],
//         tilejson: "3.0.0",
//     });

//     // Lớp kết quả
//     supportMap.addSource("results", {
//         type: "geojson",
//         data: `/apps/analyst_img/api/results/${resultId}/features/`,
//         // 'tilejson': '3.0.0'
//     });

//     supportMap.addLayer({
//         id: "becagis-layer",
//         type: "raster",
//         source: "becagisSource",
//         minzoom: 0,
//         maxzoom: 22,
//     });

//     supportMap.addLayer({
//         id: "mat_do_dan_so_layer",
//         type: "fill",
//         source: "mat_do_dan_so",
//         "source-layer": "table.dss_wqi.mat_do_dan_so_cap_xa.geom",
//         layout: {
//             visibility: "none",
//         },
//         paint: {
//             "fill-opacity": 0.5,
//             "fill-color": ["interpolate", ["linear"], ["to-number", ["get", "mat_do"]], 50, "#fffcdd", 100, "#fcee7d", 200, "#fbe087", 500, "#f39e4b", 1000, "#e2862f", 2000, "#ec7e9e", 99999999, "#e94b5a"],
//         },
//         minzoom: 0,
//     });

//     supportMap.addLayer({
//         id: "diem_xa_thai_layer",
//         type: "symbol",
//         source: "diem_xa_thai",
//         "source-layer": "table.dss_wqi.diem_xa_thai.geom",
//         layout: {
//             visibility: "none",
//             "icon-image": "diem_xa_thai",
//             "icon-size": 0.4,
//         },
//     });

//     supportMap.addLayer({
//         id: "diem_khai_thac_nuoc_mat_layer",
//         type: "symbol",
//         source: "diem_khai_thac_nuoc_mat",
//         "source-layer": "table.dss_wqi.diem_khai_thac_nuoc_mat.geom",
//         layout: {
//             visibility: "none",
//             "icon-image": "diem_khai_thac_nuoc_mat",
//             "icon-size": 0.4,
//         },
//     });

//     supportMap.addLayer({
//         id: "diem_khai_thac_nuoc_duoi_dat_layer",
//         type: "symbol",
//         source: "diem_khai_thac_nuoc_duoi_dat",
//         "source-layer": "table.dss_wqi.diem_khai_thac_nuoc_duoi_dat.geom",
//         layout: {
//             visibility: "none",
//             "icon-image": "diem_khai_thac_nuoc_duoi_dat",
//             "icon-size": 0.4,
//         },
//     });

//     supportMap.addLayer({
//         id: "result_layer",
//         type: "circle",
//         source: "results",
//         paint: {
//             "circle-radius": 8,
//             "circle-color": filter,
//         },
//     });

//     supportMap.addLayer({
//         id: "results-heatmap",
//         type: "heatmap",
//         source: "results",
//         paint: {
//             // Increase the heatmap weight based on frequency and property WQI
//             "heatmap-weight": ["interpolate", ["linear"], ["get", "WQI"], 0, 0, 100, 1],
//             // Increase the heatmap color weight by zoom level
//             // heatmap-intensity is a multiplier on top of heatmap-weight
//             "heatmap-intensity": [
//                 "interpolate",
//                 ["linear"],
//                 ["zoom"],
//                 0,
//                 2, // Increased intensity at low zoom levels
//                 9,
//                 5, // Increased intensity at high zoom levels
//             ],
//             // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
//             // Begin color ramp at 0-stop with a 0-transparency color
//             // to create a blur-like effect.
//             "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(33,102,172,0)", 0.2, "rgb(103,169,207)", 0.4, "rgb(209,229,240)", 0.6, "rgb(253,219,199)", 0.8, "rgb(239,138,98)", 1, "rgb(178,24,43)"],
//             // Adjust the heatmap radius by zoom level
//             "heatmap-radius": [
//                 "interpolate",
//                 ["linear"],
//                 ["zoom"],
//                 0,
//                 5, // Increased radius at low zoom levels
//                 9,
//                 30, // Increased radius at high zoom levels
//             ],
//             // Transition from heatmap to circle layer by zoom level
//             "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
//         },
//     });

//     supportMap.on("data", function (e) {
//         if (e.sourceId === "results" && e.isSourceLoaded) {
//             resultFeatures = supportMap.queryRenderedFeatures({ layers: ["result_layer"] });
//             let dateTimeTemp = new Set();
//             resultFeatures.forEach((element) => {
//                 dateTimeTemp.add(element.properties.time);
//             });

//             dataTime = [...dateTimeTemp];
//             dataTime.sort((a, b) => a - b);

//             initSlider();
//         }
//     });

//     supportMap.on("click", function (e) {
//         var features = supportMap.queryRenderedFeatures(e.point, { layers: ["result_layer"] });
//         if (!features.length) {
//             return;
//         }
//         var coordinates = features[0].geometry.coordinates;
//         var properties = features[0].properties;

//         var wqiValue = properties.WQI;
//         var id = properties.id;
//         var supportText = findSupportText(wqiValue);
//         var titleText = findTitleText(wqiValue);

//         var dataObj = {};
//         var labels = [];
//         var data = [];
//         features.forEach((element) => {
//             if (id === element.properties.id) {
//                 dataObj[element.properties.time] = element.properties.WQI;
//             }
//         });

//         var keys = Object.keys(dataObj).map(Number);
//         keys.sort((a, b) => a - b);
//         keys.forEach((key) => {
//             labels.push(convertTimeFromMilisecond(key));
//             data.push(dataObj[key]);
//         });

//         createChart(labels, data);

//         console.log(`hehe: ${supportText}`);


//         supportText = supportText.replaceAll("@id", id).replaceAll("@ket_qua", wqiValue.toFixed(2));

//         $("#support-text").html(supportText);

//         // Tạo một popup
//         new maplibregl.Popup({ closeButton: true })
//             .setLngLat(coordinates)
//             .setHTML(
//                 `
//                 <h6>Thông tin</h6>
//                 <p>ID trạm: ${properties.id}</p>
//                 <p>Chỉ số chất lượng nước: ${parseFloat(properties.WQI).toFixed(2)}</p>
//                 <p>Phân loại: ${titleText}</p>
//                 <a class="btn btn-info" id="support-button" data-href="#" href="#supportModal" data-bs-toggle="modal"><span>Phân tích</span></a>`
//             )
//             .addTo(supportMap);
//     });

//     // Thay đổi con trỏ chuột khi di chuyển qua điểm
//     supportMap.on("mouseenter", "result_layer", function () {
//         supportMap.getCanvas().style.cursor = "pointer";
//     });

//     // Thay đổi con trỏ chuột về lại ban đầu khi rời khỏi điểm
//     supportMap.on("mouseleave", "result_layer", function () {
//         supportMap.getCanvas().style.cursor = "";
//     });
// });

// var legend = document.getElementById("legend");
// supportMap.getContainer().appendChild(legend);

// var myChart;

// function createChart(labels, data) {
//     var chartElement = document.getElementById("wqi-chart").getContext("2d");
//     try {
//         myChart.destroy();
//     } catch (t) {}

//     myChart = new Chart(chartElement, {
//         type: "line",
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: "WQI",
//                     data: data,
//                     fill: false,
//                     borderColor: "rgb(75, 192, 192)",
//                     tension: 0.1,
//                 },
//             ],
//         },
//         options: {
//             maintainAspectRatio: true,
//             aspectRatio: 2,
//         },
//     });
// }

// function convertTimeFromMilisecond(time) {
//     var date = new Date(time);

//     var year = date.getFullYear();
//     var month = date.getMonth() + 1;
//     var day = date.getDate();

//     return `${day}-${month}-${year}`;
// }

// // Bật/tắt layer

// document.getElementById("switchMDDS").addEventListener("click", function () {
//     var isChecked = document.getElementById("switchMDDS").checked;
//     if (isChecked) {
//         $("#legend-mdds").removeClass("d-none");
//         supportMap.setLayoutProperty("mat_do_dan_so_layer", "visibility", "visible");
//     } else {
//         $("#legend-mdds").addClass("d-none");
//         supportMap.setLayoutProperty("mat_do_dan_so_layer", "visibility", "none");
//     }
// });

// document.getElementById("switchCLN").addEventListener("click", function () {
//     var isChecked = document.getElementById("switchCLN").checked;
//     if (isChecked) {
//         supportMap.setLayoutProperty("result_layer", "visibility", "visible");
//         supportMap.setLayoutProperty("filteredLayer", "visibility", "visible");
//     } else {
//         supportMap.setLayoutProperty("result_layer", "visibility", "none");
//         supportMap.setLayoutProperty("filteredLayer", "visibility", "none");
//     }
// });

// document.getElementById("switchDXT").addEventListener("click", function () {
//     var isChecked = document.getElementById("switchDXT").checked;
//     if (isChecked) {
//         $("#legend-dxt").removeClass("d-none");
//         supportMap.setLayoutProperty("diem_xa_thai_layer", "visibility", "visible");
//     } else {
//         $("#legend-dxt").addClass("d-none");
//         supportMap.setLayoutProperty("diem_xa_thai_layer", "visibility", "none");
//     }
// });

// document.getElementById("switchDKTNM").addEventListener("click", function () {
//     var isChecked = document.getElementById("switchDKTNM").checked;
//     if (isChecked) {
//         $("#legend-dktnm").removeClass("d-none");
//         supportMap.setLayoutProperty("diem_khai_thac_nuoc_mat_layer", "visibility", "visible");
//     } else {
//         $("#legend-dktnm").addClass("d-none");
//         supportMap.setLayoutProperty("diem_khai_thac_nuoc_mat_layer", "visibility", "none");
//     }
// });

// document.getElementById("switchDKTNDD").addEventListener("click", function () {
//     var isChecked = document.getElementById("switchDKTNDD").checked;
//     if (isChecked) {
//         $("#legend-dktndd").removeClass("d-none");
//         supportMap.setLayoutProperty("diem_khai_thac_nuoc_duoi_dat_layer", "visibility", "visible");
//     } else {
//         $("#legend-dktndd").addClass("d-none");
//         supportMap.setLayoutProperty("diem_khai_thac_nuoc_duoi_dat_layer", "visibility", "none");
//     }
// });

// function initSlider() {
//     let current = 0;
//     let isPlaying = false;
//     let step = 1;
//     let intervalId;

//     $("#slider-tooltip-text").text(new Date(dataTime[0]).toLocaleDateString("en-GB"));

//     $("#slider").slider({
//         range: true,
//         min: 0,
//         max: dataTime.length - 1,
//         step: step,
//         values: [0, 0], // Giá trị mặc định
//         slide: function (event, ui) {
//             current = ui.value;
//             let dateString = new Date(dataTime[current]).toLocaleDateString("en-GB");
//             $("#slider-tooltip-text").text(dateString);
//             handlerTimeSlider(dataTime[current], supportMap);
//         },
//     });

//     // Xử lý sự kiện khi nhấn nút play
//     $("#play-button").click(function () {
//         if (!isPlaying) {
//             isPlaying = true;
//             $("#play-button").html(`
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-fill" viewBox="0 0 16 16">
//   <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"/>
// </svg>
//                 `);
//             // var current = startTime;
//             var end = dataTime.length - 1;

//             if (current === end) {
//                 current = 0;
//             }

//             // Tạo hàm thực hiện chạy qua các ngày
//             function run() {
//                 current += step;
//                 $("#slider").slider("values", 1, current); // Cập nhật giá trị của slider
//                 let dateString = new Date(dataTime[current]).toLocaleDateString("en-GB");

//                 $("#slider-tooltip-text").text(dateString);

//                 // $("#selected-date").text(currentDate.toLocaleDateString());
//                 handlerTimeSlider(dataTime[current], supportMap);
//                 if (current < end && isPlaying) {
//                     intervalId = setTimeout(run, 500);
//                 } else {
//                     isPlaying = false;
//                     $("#play-button").html(`
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
//                 <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
//             </svg>   
//                         `);
//                 }
//             }

//             run(); // Bắt đầu chạy
//         } else {
//             isPlaying = false;
//             clearInterval(intervalId);
//             $("#play-button").html(`
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
//                 <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
//             </svg>   
//                 `);
//         }
//     });
// }

// function handlerTimeSlider(time, myMap) {
//     // Xử lý logic dựa trên các thuộc tính của điểm

//     var features = myMap.queryRenderedFeatures({ layers: ["result_layer"], filter: ["==", "time", time] });

//     if (!features.length) {
//         return;
//     }

//     let layer = myMap.getLayer("filteredLayer");

//     // Kiểm tra xem layer có tồn tại không
//     if (layer !== undefined) {
//         myMap.removeLayer("filteredLayer");
//         myMap.removeSource("filteredSource");
//     }

//     // Tạo source mới từ các feature đã lọc
//     myMap.addSource("filteredSource", {
//         type: "geojson",
//         data: {
//             type: "FeatureCollection",
//             features: features,
//         },
//     });

//     // Thêm layer mới vào bản đồ
//     myMap.addLayer({
//         id: "filteredLayer",
//         type: "circle",
//         source: "filteredSource",
//         paint: {
//             "circle-radius": 8,
//             "circle-color": filter,
//         },
//     });
// }

// // Draw polygon
// MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
// MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
// MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";

// const draw = new MapboxDraw({
//     displayControlsDefault: false,
//     controls: {
//         polygon: true,
//         point: true,
//         trash: true,
//     },
// });

// supportMap.addControl(draw);
// const markers = {}; // Object to store markers for each point feature by ID

// var currentMarkerId;

// // Function to handle creating and updating markers
// function createMarkerForPoint(feature) {
//     const coordinates = feature.geometry.coordinates;

//     // Check if marker already exists for this feature
//     if (markers[feature.id]) {
//         return; // Do not create new marker if it already exists
//     }

//     // Create a new draggable marker
//     const marker = new maplibregl.Marker()
//         .setLngLat(coordinates)
//         .setPopup(
//             new maplibregl.Popup({ closeButton: false }).setHTML(`
//                 <div class="d-flex" style="justify-content: space-between; align-items: center;">
//                     <h6 style="margin-bottom: 0px;">Thông tin</h6>
//                     <button class="btn" id="delete-marker">
//                         <i class="bi bi-trash3"></i>
//                     </button>
//                 </div>
//                 <p id="wqi-popup-location-${feature.id}" >Vị trí: Đang tải...</p>
//                 <p>Kinh độ: ${coordinates[0].toFixed(6)}</p>
//                 <p>Vĩ độ: ${coordinates[1].toFixed(6)}</p>
//                 <a class="btn btn-info" id="support-button" data-href="#" href="#calc-modal" data-bs-toggle="modal"><span>Tính toán</span></a>
//             `)
//         )
//         .addTo(supportMap);

//     // Fetch location info and update popup content
//     getLocationInfo(coordinates[0], coordinates[1], marker, feature);

//     // Event listener for dragging the marker
//     // marker.on('dragend', () => {
//     //     const newCoordinates = marker.getLngLat();
//     //     feature.geometry.coordinates = [newCoordinates.lng, newCoordinates.lat];

//     //     // Update the feature coordinates after dragging
//     //     draw.delete(feature.id);
//     //     draw.add(feature);
//     // });

//     // Add event listener for delete button in the popup
//     marker.getPopup().on("open", () => {
//         currentMarkerId = feature.id;
//         $(`#wqi-popup-location-${feature.id}`).text(locationData[feature.id]);

//         const deleteButton = document.getElementById("delete-marker");
//         if (deleteButton) {
//             deleteButton.addEventListener("click", () => {
//                 deleteMarkerForPoint(feature); // Delete marker when clicked
//             });
//         }
//     });

//     // Store marker in markers object by feature ID
//     markers[feature.id] = marker;
// }

// // Function to delete marker and feature
// function deleteMarkerForPoint(feature) {
//     const marker = markers[feature.id];
//     if (marker) {
//         marker.remove(); // Remove the marker from map
//         draw.delete(feature.id); // Delete the feature from the draw control
//         delete markers[feature.id]; // Remove from markers object
//     }
// }
// const locationData = {};

// // Function to fetch location info and update popup content
// function getLocationInfo(lng, lat, marker, feature) {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`;

//     fetch(url)
//         .then((response) => response.json())
//         .then((data) => {
//             if (data && data.address) {
//                 const locationName = data.display_name;

//                 // Store location information for future use
//                 locationData[feature.id] = locationName || "Không xác định";

//                 // Update popup content if it's open
//                 $(`#wqi-popup-location-${feature.id}`).text(locationData[feature.id]);
//             } else {
//                 console.log("Không tìm thấy thông tin khu vực.");
//             }
//         })
//         .catch((error) => {
//             console.error("Lỗi khi lấy thông tin địa lý:", error);
//         });
// }

// // Function to handle the draw events
// function updateArea(e) {
//     const data = draw.getAll();

//     data.features.forEach((feature) => {
//         const featureType = feature.geometry.type;

//         // Handle polygons for WQI calculations
//         if (featureType === "Polygon") {
//             handlePolygonFeature(feature);
//         }

//         // Handle points with markers
//         else if (featureType === "Point") {
//             if (e.type === "draw.create") {
//                 // Create a marker for a newly drawn point
//                 createMarkerForPoint(feature);
//             } else if (e.type === "draw.update") {
//                 // Update the marker position when the point is updated
//                 // updateMarkerPosition(feature);
//             } else if (e.type === "draw.delete") {
//                 // Remove the marker for deleted points
//                 deleteMarkerForPoint(feature);
//             }
//         }
//     });
// }

// // Attach event listeners to handle create, update, and delete events
// supportMap.on("draw.create", updateArea);
// supportMap.on("draw.update", updateArea);
// supportMap.on("draw.delete", updateArea);

// // Function to handle polygon feature WQI calculations
// function handlePolygonFeature(feature) {
//     const polygon = turf.polygon(feature.geometry.coordinates);
//     const points = supportMap.queryRenderedFeatures({ layers: ["result_layer"] });

//     const pointsInPolygon = points.filter((point) => {
//         return turf.booleanPointInPolygon(turf.point(point.geometry.coordinates), polygon);
//     });

//     if (pointsInPolygon.length > 0) {
//         let min_wqi = 100;
//         let max_wqi = 0;
//         let sum_wqi = 0;

//         pointsInPolygon.forEach((point) => {
//             const wqi = point.properties["WQI"];
//             min_wqi = Math.min(min_wqi, wqi);
//             max_wqi = Math.max(max_wqi, wqi);
//             sum_wqi += wqi;
//         });

//         const avg_wqi = sum_wqi / pointsInPolygon.length;
//         $("#avg-wqi").text(avg_wqi.toFixed(2));
//         $("#min-wqi").text(min_wqi.toFixed(2));
//         $("#max-wqi").text(max_wqi.toFixed(2));

//         const supportTexts = findSupportTextPolygon(avg_wqi);

//         $("#support-text-box").toggleClass("d-none", supportTexts[0] === "" && supportTexts[1] === "");
//         $("#support-02-label").toggleClass("d-none", supportTexts[0] === "");
//         $("#support-03-label").toggleClass("d-none", supportTexts[1] === "");

//         $("#support-02").html(supportTexts[0]);
//         $("#support-03").html(supportTexts[1]);

//         $("#supportModalPolygon").modal("show");
//     }
// }

// function calculateWQI(params) {
//     // Bước 1: Lấy giá trị của từng thông số từ các ô input
//     // const params = {
//     //     pH: parseFloat(document.querySelector('input[name="pH"]').value),
//     //     Aldrin: parseFloat(document.querySelector('input[name="Aldrin"]').value),
//     //     As: parseFloat(document.querySelector('input[name="As"]').value),
//     //     Cd: parseFloat(document.querySelector('input[name="Cd"]').value),
//     //     Pb: parseFloat(document.querySelector('input[name="Pb"]').value),
//     //     Cr6: parseFloat(document.querySelector('input[name="Cr6"]').value),
//     //     Cu: parseFloat(document.querySelector('input[name="Cu"]').value),
//     //     Zn: parseFloat(document.querySelector('input[name="Zn"]').value),
//     //     Hg: parseFloat(document.querySelector('input[name="Hg"]').value),
//     //     DO: parseFloat(document.querySelector('input[name="DO"]').value),
//     //     BOD5: parseFloat(document.querySelector('input[name="BOD5"]').value),
//     //     COD: parseFloat(document.querySelector('input[name="COD"]').value),
//     //     TOC: parseFloat(document.querySelector('input[name="TOC"]').value),
//     //     N_NH4: parseFloat(document.querySelector('input[name="N_NH4"]').value),
//     //     N_NO3: parseFloat(document.querySelector('input[name="N_NO3"]').value),
//     //     N_NO2: parseFloat(document.querySelector('input[name="N_NO2"]').value),
//     //     P_PO4: parseFloat(document.querySelector('input[name="P_PO4"]').value),
//     //     Coliform: parseFloat(document.querySelector('input[name="Coliform"]').value),
//     //     Ecoli: parseFloat(document.querySelector('input[name="Ecoli"]').value)
//     // };

//     // Bước 2: Xác định WQI thành phần cho mỗi thông số
//     function calculateIndividualWQI(param, value) {
//         switch (param) {
//             case "pH":
//                 return calculateWQIpH(value); // Hàm tính WQI cho pH
//             case "DO":
//                 return calculateWQIDO(value); // Hàm tính WQI cho DO
//             case "Aldrin":
//                 return calculateWQIII(value, 0.1); // Ví dụ: Aldrin có ngưỡng là 0.1 µg/l
//             case "As":
//                 return calculateWQIIII(value, asLevels); // Dùng bảng AsLevels cho As
//             case "BOD5":
//                 return calculateWQIIV(value, bod5Levels); // Dùng bảng BOD5 cho BOD5
//             case "Coliform":
//                 return calculateWQIV(value, coliformLevels); // Dùng bảng Coliform cho Coliform
//             case "BHC":
//                 return calculateWQIII(value, 0.2); // Ví dụ: BHC có ngưỡng là 0.2 µg/l
//             case "Dieldrin":
//                 return calculateWQIII(value, 0.01); // Dieldrin có ngưỡng là 0.01 µg/l
//             case "DDTs":
//                 return calculateWQIII(value, 0.1); // DDTs có ngưỡng là 0.1 µg/l
//             case "Heptachlor":
//                 return calculateWQIII(value, 0.05); // Heptachlor có ngưỡng là 0.05 µg/l
//             case "Heptachlorepoxide":
//                 return calculateWQIII(value, 0.05); // Heptachlorepoxide có ngưỡng là 0.05 µg/l
//             case "Cd":
//                 return calculateWQIIII(value, metalLevels); // Bảng kim loại nặng
//             case "Pb":
//                 return calculateWQIIII(value, metalLevels); // Bảng kim loại nặng
//             case "Cr6":
//                 return calculateWQIIII(value, metalLevels); // Bảng kim loại nặng
//             case "Cu":
//                 return calculateWQIIII(value, metalLevels); // Bảng kim loại nặng
//             case "Zn":
//                 return calculateWQIIII(value, metalLevels); // Bảng kim loại nặng
//             case "Hg":
//                 return calculateWQIIII(value, metalLevels); // Bảng kim loại nặng
//             case "T":
//                 return calculateWQIIV(value, temperatureLevels); // Dùng bảng nhiệt độ cho T
//             case "TSS":
//                 return calculateWQIIV(value, tssLevels); // Bảng TSS
//             case "Salinity":
//                 return calculateWQIIV(value, salinityLevels); // Bảng độ mặn
//             case "N_NH4":
//                 return calculateWQIIV(value, ammoniaLevels); // Bảng N-NH4
//             case "N_NO3":
//                 return calculateWQIIV(value, nitrateLevels); // Bảng N-NO3
//             case "N_NO2":
//                 return calculateWQIIV(value, nitriteLevels); // Bảng N-NO2
//             case "COD":
//                 return calculateWQIIV(value, codLevels); // Bảng COD
//             case "TOC":
//                 return calculateWQIIV(value, tocLevels); // Bảng TOC
//             default:
//                 return 0; // Giá trị mặc định nếu không có công thức cụ thể
//         }
//     }

//     // Hàm tính WQI cho pH
//     function calculateWQIpH(pH) {
//         if (pH >= 6.5 && pH <= 8.5) {
//             return 100; // Giá trị WQI tối đa
//         } else if (pH < 6.5) {
//             return (pH / 6.5) * 100;
//         } else if (pH > 8.5) {
//             return ((14 - pH) / (14 - 8.5)) * 100;
//         }
//         return 0;
//     }

//     // Hàm tính WQI cho DO
//     function calculateWQIDO(DO) {
//         if (DO >= 5) {
//             return 100; // Giá trị WQI tối đa
//         } else {
//             return (DO / 5) * 100;
//         }
//     }

//     // Hàm tính WQI cho các chất ô nhiễm (Nhóm III)
//     function calculateWQIII(value, threshold) {
//         return value <= threshold ? 100 : 10; // Ngưỡng giới hạn WQI cho các chất ô nhiễm
//     }

//     // Hàm tính WQI cho kim loại nặng (Nhóm IV)
//     function calculateWQIIII(value, metalLevels) {
//         for (let i = 0; i < metalLevels.length - 1; i++) {
//             if (value >= metalLevels[i].BPi && value < metalLevels[i + 1].BPi) {
//                 return interpolateWQI(value, metalLevels[i], metalLevels[i + 1]);
//             }
//         }
//         return 10; // Trả về WQI tối thiểu nếu không nằm trong ngưỡng
//     }

//     // Hàm tính WQI cho các thông số hữu cơ (Nhóm V)
//     function calculateWQIIV(value, parameterLevels) {
//         for (let i = 0; i < parameterLevels.length - 1; i++) {
//             if (value >= parameterLevels[i].BPi && value < parameterLevels[i + 1].BPi) {
//                 return interpolateWQI(value, parameterLevels[i], parameterLevels[i + 1]);
//             }
//         }
//         return 10; // Trả về WQI tối thiểu nếu không nằm trong ngưỡng
//     }

//     // Hàm tính WQI cho Coliform (Nhóm V)
//     function calculateWQIV(value, coliformLevels) {
//         for (let i = 0; i < coliformLevels.length - 1; i++) {
//             if (value >= coliformLevels[i].BPi && value < coliformLevels[i + 1].BPi) {
//                 return interpolateWQI(value, coliformLevels[i], coliformLevels[i + 1]);
//             }
//         }
//         return 10;
//     }

//     // Hàm nội suy giữa hai giá trị WQI
//     function interpolateWQI(Cp, lower, upper) {
//         return lower.qi + ((upper.qi - lower.qi) / (upper.BPi - lower.BPi)) * (Cp - lower.BPi);
//     }

//     // Các bảng giá trị ví dụ
//     const asLevels = [
//         { BPi: 0.05, qi: 100 },
//         { BPi: 0.1, qi: 50 },
//         { BPi: 0.2, qi: 10 },
//     ];

//     const bod5Levels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 3, qi: 50 },
//         { BPi: 5, qi: 25 },
//         { BPi: 8, qi: 10 },
//     ];

//     const coliformLevels = [
//         { BPi: 100, qi: 100 },
//         { BPi: 1000, qi: 50 },
//         { BPi: 10000, qi: 10 },
//     ];

//     const metalLevels = [
//         { BPi: 0.01, qi: 100 },
//         { BPi: 0.05, qi: 50 },
//         { BPi: 0.1, qi: 10 },
//     ];

//     // Các bảng cho các chỉ số khác như nhiệt độ, TSS, độ mặn, v.v.
//     const temperatureLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 25, qi: 80 },
//         { BPi: 30, qi: 60 },
//         { BPi: 35, qi: 40 },
//     ];

//     const tssLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 50, qi: 50 },
//         { BPi: 100, qi: 10 },
//     ];

//     const salinityLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 3, qi: 80 },
//         { BPi: 5, qi: 50 },
//         { BPi: 10, qi: 20 },
//     ];

//     const ammoniaLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 0.5, qi: 50 },
//         { BPi: 1, qi: 10 },
//     ];

//     const nitrateLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 10, qi: 50 },
//         { BPi: 20, qi: 10 },
//     ];

//     const nitriteLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 1, qi: 50 },
//         { BPi: 5, qi: 10 },
//     ];

//     const codLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 10, qi: 50 },
//         { BPi: 20, qi: 10 },
//     ];

//     const tocLevels = [
//         { BPi: 0, qi: 100 },
//         { BPi: 10, qi: 50 },
//         { BPi: 20, qi: 10 },
//     ];

//     // Bước 3: Tính toán tổng WQI dựa trên giá trị cao nhất của các WQI thành phần
//     let sumWQI = 0;
//     for (const [param, value] of Object.entries(params)) {
//         if (!isNaN(value)) {
//             const individualWQI = calculateIndividualWQI(param, value);
//             sumWQI += individualWQI;
//         }
//     }

//     sumWQI = sumWQI / Object.entries(params).length;

//     // Bước 4: Hiển thị kết quả WQI tổng thể
//     return sumWQI;
// }

// $(document).ready(function () {
//     // Đăng ký sự kiện click cho nút
//     $("#temp-calculate-btn").click(function () {
//         // Lấy tất cả các dòng dữ liệu
//         let rows = document.querySelectorAll("#paramsTableBody tr"); // Lấy tất cả các hàng trong tbody
//         let wqiResults = {}; // Object lưu kết quả WQI cho từng thời điểm

//         rows.forEach((row) => {
//             // Lấy thời gian
//             let time = row.querySelector("td:nth-child(2) input").value;  // Lấy giá trị thời gian
//             let date = new Date(time);  // Chuyển đổi thành đối tượng Date

//             // Định dạng lại thời gian theo hh:mm:00 dd-mm-yyyy
//             let hours = String(date.getHours()).padStart(2, '0');  // Lấy giờ và thêm số 0 nếu cần
//             let minutes = String(date.getMinutes()).padStart(2, '0');  // Lấy phút và thêm số 0 nếu cần
//             let day = String(date.getDate()).padStart(2, '0');  // Lấy ngày và thêm số 0 nếu cần
//             let month = String(date.getMonth() + 1).padStart(2, '0');  // Lấy tháng (lưu ý tháng trong JavaScript bắt đầu từ 0)
//             let year = date.getFullYear();  // Lấy năm

//             let formattedTime = `${hours}:${minutes}:00 ${day}-${month}-${year}`;  // Kết hợp thành định dạng yêu cầu


//             // Lấy các giá trị từ các ô input
//             const params = {};

//             const paramNames = [
//                 'pH', 'Aldrin', 'BHC', 'Dieldrin', 'DDTs', 'Heptachlor', 'Heptachlorepoxide',
//                 'As', 'Cd', 'Pb', 'Cr6', 'Cu', 'Zn', 'Hg', 'DO', 'T', 'BOD5', 'COD', 'TOC',
//                 'N_NH4', 'N_NO3', 'N_NO2', 'P_PO4', 'Coliform', 'Ecoli', 'Salinity', 'TSS', 'CL'
//             ];

//             paramNames.forEach((param, index) => {
//                 const input = row.querySelector(`input[name="${param}"]`);
//                 if (input) {
//                     params[param] = parseFloat(input.value) || 0; // Lấy giá trị hoặc 0 nếu không có
//                 }
//             });

//             let result = calculateWQI(params);
//             wqiResults[formattedTime] = result;
//         });

//         $('#wqi-result').empty();
//         $('#wqi-result').append(`<p style="margin-bottom: 8px;"><b>Kết quả tính toán</b></p>`);
//         Object.entries(wqiResults).forEach(([key, value]) => {
//             $('#wqi-result').append(`<p>${key}: <b>${parseInt(value)}</b></p>`);
//         });
        
//         // var result = calculateWQI();  // Giả sử calculateWQI() trả về giá trị WQI

//         // // Tính toán màu sắc dựa trên WQI
//         // var color = getColorForWQI(result);

//         // // Cập nhật màu sắc của marker
//         // setMarkerColor(markers[currentMarkerId], color);

        

//         // $('#wqi-result').text(`Giá trị WQI: ${parseInt(result)}`);
//         // $(`#result-wqi-${currentMarkerId}`).text(`Giá trị WQI: ${parseInt(result)}`);
//     });
// });

// function setMarkerColor(marker, color) {
//     // Lấy phần tử DOM của marker
//     var $elem = $(marker.getElement());

//     // Tìm và thay đổi thuộc tính fill của phần tử svg
//     $elem.find('svg g[fill="' + marker._color + '"]').attr("fill", color);

//     // Cập nhật màu mới vào thuộc tính _color của marker
//     marker._color = color;
// }

// // Hàm tính màu sắc dựa trên giá trị WQI
// function getColorForWQI(wqi) {
//     if (wqi <= 0) {
//         return "#802323"; // Màu đỏ tối cho WQI <= 0
//     } else if (wqi <= 10) {
//         return "#802323"; // Màu đỏ tối cho WQI <= 10
//     } else if (wqi <= 26) {
//         return "#fe0000"; // Màu đỏ sáng cho WQI <= 26
//     } else if (wqi <= 51) {
//         return "#f4b083"; // Màu cam sáng cho WQI <= 51
//     } else if (wqi <= 76) {
//         return "#ffff00"; // Màu vàng cho WQI <= 76
//     } else if (wqi <= 91) {
//         return "#00af50"; // Màu xanh lá cho WQI <= 91
//     } else {
//         return "#01b0f2"; // Màu xanh dương cho WQI > 91
//     }
// }
