import base64
import json
import os
import time
import uuid
import requests
from werkzeug.utils import secure_filename
from datetime import datetime
from dotenv import load_dotenv
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from tethys_sdk.routing import controller
from ..utils import * 
import numpy as np
from django.core.files.storage import FileSystemStorage
from PIL import Image
import numpy as np
import keras
import tensorflow as tf


load_dotenv()
BACKEND_URL = os.getenv('BACKEND_URL')

# Tải mô hình đã lưu
model_path = os.path.abspath("rice_leaf_disease_model")  # Đảm bảo đường dẫn chính xác tới mô hình
model = tf.saved_model.load(model_path)

# Lấy signature của mô hình
predict_fn = model.signatures['serving_default']  # Signature dùng để dự đoán

@csrf_exempt
@controller(url='/api/predict-image')
def predict_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']
        
        # Save the image temporarily
        fs = FileSystemStorage('./files/')
        filename = fs.save(image.name, image)
        img_path = os.path.join(fs.location, filename)
        
        try:
            # Open image and check size
            img = Image.open(img_path)
            # Chuyển đổi sang định dạng RGB nếu cần
            if img.mode != 'RGB':
                img = img.convert('RGB')
            if img.width < 100 or img.height < 100:
                # Save to database with 'Fail' status
                create_time = time.strftime('%Y-%m-%d %H:%M:%S')
                title = image.name
                try:
                    conn = create_connection()
                    cur = conn.cursor()
                    cur.execute(
                        'INSERT INTO public.histories (title, catagery, status, create_time, is_visible) VALUES (%s, %s, %s, %s, 1)',
                        (title, 'None', 'Fail', create_time)
                    )
                    conn.commit()
                    last_row_id = cur.lastrowid
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=500)
                finally:
                    cur.close()
                    conn.close()

                return JsonResponse({
                    'prediction': 'Image is too small',
                    'status': 'Fail',
                    'create_time': create_time,
                    'id': last_row_id,
                    'title': title
                }, status=400)

            # Resize the image to 299x299 (as used during model training)
            img = img.resize((299, 299))

            # Convert image to numpy array and normalize
            img_array = keras.preprocessing.image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
            img_array = img_array / 255.0  # Normalize pixel values to 0-1

            # Make prediction
            input_tensor = tf.convert_to_tensor(img_array)  # Chuyển đổi ảnh thành tensor
            prediction = predict_fn(input_tensor)  # Dự đoán với signature 'serving_default'

            # Get the actual prediction result
            prediction_result = prediction['output_0']  # Lấy kết quả từ output của mô hình (có thể thay đổi theo mô hình của bạn)

            # Interpret prediction result
            predicted_class = np.argmax(prediction_result, axis=1)
            confidence = np.max(prediction_result)

            # Define class labels
            class_labels = ['Bacterialblight', 'Blast', 'Brownspot']
            category = class_labels[predicted_class[0]]
            # chuyển đổi về dạng số
            if (category == 'Blast'):
                category_1 = 1
            elif (category == 'Bacterialblight'):
                category_1 = 2
            elif (category == 'Brownspot'):
                category_1 = 3
            else:
                category_1 = 4
            
            # Lấy kết quả dự đoán và độ chính xác
            confidence = np.max(prediction_result)
            confidence = float(confidence) * 100
            confidence = round(confidence, 2)  # Làm tròn đến 2 chữ số thập phân
            
            # chuyển thanhf dạng string
            confidence = str(confidence)

            # Save to database with 'Success' status
            create_time = time.strftime('%Y-%m-%d %H:%M:%S')
            title = image.name
            try:
                conn = create_connection()
                cur = conn.cursor()
                cur.execute(
                    'INSERT INTO public.histories (title, catagery, status, create_time, is_visible, path, accuracy) VALUES (%s, %s, %s, %s, 1, %s, %s)',
                    (title, category_1, 'Thành công', create_time, img_path, confidence)
                )
                conn.commit()
                cur.close()
                last_row_id = cur.lastrowid
                
                cur_1 = conn.cursor()
                cur_1.execute('SELECT vnname FROM public.diseases WHERE id = %s', (category_1,))
                record = cur_1.fetchone()
                cate = record[0]
                cur_1.close()
                # lấy id của hình ảnh vừa dự đoán
                cur_2 = conn.cursor()
                cur_2.execute('SELECT id FROM public.histories WHERE title = %s AND path = %s ', (title,img_path))
                record_1 = cur_2.fetchone()
                last_row_id_1 = record_1[0]
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
            finally:
                cur.close()
                conn.close()

            # Return prediction result
            return JsonResponse({
                'prediction': category,
                'vnname': cate,
                'confidence': confidence,
                'status': 'Success',
                'create_time': create_time,
                'id': last_row_id_1,
                'title': title,
                'path': img_path
            }, status=200)

        except Exception as e:
            # Save to database with 'Fail' status in case of any error
            create_time = time.strftime('%Y-%m-%d %H:%M:%S')
            title = image.name
            try:
                conn = create_connection()
                cur = conn.cursor()
                cur.execute(
                    'INSERT INTO public.histories (title, catagery, status, create_time, is_visible, path) VALUES (%s, %s, %s, %s, 1, %s)',
                    (title, 'None', 'Thất bại', create_time, img_path)
                )
                conn.commit()
                last_row_id = cur.lastrowid
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
            finally:
                cur.close()
                conn.close()

            return JsonResponse({
                'error': f'Failed to process the image: {str(e)}',
                'status': 'Fail',
                'create_time': create_time,
                'title': title,
                'path': img_path
            }, status=500)

    else:
        return JsonResponse({
            'error': 'No image provided',
            'status': 'Fail'
        }, status=400)

# Api để lấy lịch sử dự đoán
@controller(url='/api/results', method='GET')
def get_histories(request):
    try:
        conn = create_connection()
        cur = conn.cursor()
        
        # Tính toán thời gian 7 ngày trước
        seven_days_ago = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time() - 7 * 24 * 3600))
        
        # Cập nhật trạng thái is_visible thành FALSE = 0
        cur.execute(
            "UPDATE public.histories SET is_visible = 0 WHERE create_time < %s AND is_visible = 1",
            (seven_days_ago,)
        )
        
        conn.commit()
        
        # Lấy các bản ghi có is_visible = TRUE và kết hợp voi bảng diseases để lấy tên bệnh
        cur.execute(
            "SELECT h.title, d.vnname, h.status, h.create_time, h.accuracy, h.path, h.id FROM public.histories h LEFT JOIN public.diseases d ON h.catagery = d.id WHERE h.is_visible = 1"
        )
        records = cur.fetchall()
        
        histories = [
            {
                'title': record[0],
                'catagery': record[1],
                'status': record[2],
                'create_time': record[3],
                'accuracy': record[4],
                'path': record[5],
                'id': record[6],
            }
            for record in records
        ]
        return JsonResponse({'histories': histories})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        cur.close()
        conn.close()
        
# Api để lấy lịch sử dự đoán theo id
@controller(url='/api/result-detail/{id}', method='GET')
def get_history(request, id):
    try:
        conn = create_connection()
        cur = conn.cursor()
        
        # Lấy thông tin chi tiết của lịch sử dự đoán kết hợp với bảng diseases
        cur.execute(
            "SELECT h.id, h.create_time, h.status, d.name, h.title, h.path, h.accuracy FROM public.histories h LEFT JOIN public.diseases d ON h.catagery = d.id WHERE h.id = %s",
            (id,)
        )
        record = cur.fetchone()
        
        history = {
            'id': record[0],
            'create_time': record[1],
            'status': record[2],
            'catagery': record[3],
            'title': record[4],
            'path': record[5],
            'accuracy': record[6]
        }

        return JsonResponse({'history': history})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        cur.close()
        conn.close()

# api lấy ảnh
@controller(url='/api/image/{id}', method='GET')
def get_image(request, id):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('SELECT path FROM public.histories WHERE id = %s', (id,))
        path = cur.fetchone()[0]
        with open(path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type='image/jpeg')
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
        
# Api để xóa lịch sử dự đoán theo id
@csrf_exempt
@controller(url='/api/delete-results/{id}', method='DELETE')
def delete_history(request, id):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM public.histories WHERE id = %s', (id,))
        conn.commit()
        return JsonResponse({'message': 'History deleted successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        cur.close()
        conn.close()

# Api để xóa nhiều lịch sử dự đoán
@csrf_exempt
@controller(url='/api/delete-multiple-results', method='DELETE')
def delete_multiple_histories(request):
    try:
        data = json.loads(request.body)
        ids = data.get('ids', [])  # Lấy danh sách ids từ JSON
        print(ids)
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM public.histories WHERE id IN %s', (tuple(ids),))
        conn.commit()
        return JsonResponse({'message': 'Histories deleted successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        cur.close()
        conn.close()
        

# Api để lấy danh sách bệnh
@controller(url='/api/diseases', method='GET')
def get_diseases(request):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM public.diseases')
        records = cur.fetchall()
        
        diseases = [
            {
                'id': record[0],
                'name': record[1],
                'vnname': record[2],
                'description': record[3],
                'reason': record[4],
                'prac': record[5]
            }
            for record in records
        ]
        return JsonResponse({'diseases': diseases})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        cur.close()
        conn.close()

# Api để lấy tài liệu, thêm tài liệu, xóa tài liệu  
# @controller(url='/api/material', method='GET')
# def get_news(request):
#     try :
#         url = f"{BACKEND_URL}/api/material"
#         response = requests.get(url)
#         data = response.json()
#         return JsonResponse(data)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)
    
@controller(url='/api/material/{path}', method='GET')
def get_news_detail(request, path):
    try:
        url = f"{BACKEND_URL}/api/material/{path}"
        response = requests.get(url)
        response = HttpResponse(response.content, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{path}"'
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@controller(url='/api/material', method='GET')    
def get_news_1(request):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM public.material')
        records = fetch_data(cur)
        
        return JsonResponse({'data': records})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        if conn:
            conn.close()
    
# @csrf_exempt
# @controller(url='/api/material', method='POST')
# def add_news(request):
#     try:
#         data = json.loads(request.body)
#         title = data.get('title')
#         description = data.get('description')
#         file = data.get('file')
        
#         if not title or not description:
#             return JsonResponse({'error': 'Title, description and file are required'}, status=400)
        
#         conn = create_connection()
#         cur = conn.cursor()
#         cur.execute('INSERT INTO public.material (title, "desc") VALUES (%s, %s, %s)', (title, description,))
#         conn.commit()
        
#         return JsonResponse({'message': 'News added successfully'})
    
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)
    
#     finally:
#         if conn:
#             conn.close()

# UPLOAD_FOLDER = './files/'  # Thư mục lưu file

# @csrf_exempt
# @controller(url='/api/material', method='POST')
# def add_material(request):
#     try:
#         data = json.loads(request.body)
#         title = data.get('title')
#         description = data.get('description')
#         file = data.get('file')
        
#         if not title or not description or not file:
#             return JsonResponse({'error': 'Title, description and file are required'}, status=400)
        
#         # Lưu file
#         file_name = secure_filename(file)
#         file_path = os.path.join(UPLOAD_FOLDER, file_name)
#         with open(file_path, 'wb') as f:
#             f.write(base64.b64decode(file))
        
#         conn = create_connection()
#         cur = conn.cursor()
#         cur.execute('INSERT INTO public.material (title, "desc", file) VALUES (%s, %s, %s)', (title, description, file_name))
#         conn.commit()
        
#         return JsonResponse({'message': 'Material added successfully'})
    
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@controller(url='/api/material/update/{id}', method='PUT')
def update_material(request, id):
    try:
        data = json.loads(request.body)

        # Lấy thông tin từ yêu cầu
        title = data.get('title')
        description = data.get('description')
        id_deas = data.get('id_deas')  # Trường "Loại tài liệu"
        update_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Kiểm tra thông tin bắt buộc
        if not title or not description:
            return JsonResponse({'error': 'Title and description are required'}, status=400)

        # Kết nối cơ sở dữ liệu
        conn = create_connection()
        cur = conn.cursor()

        # Cập nhật dữ liệu
        cur.execute('''
            UPDATE public.material
            SET title = %s, "desc" = %s, id_deas = %s, update_at = %s
            WHERE id = %s
        ''', (title, description, id_deas, update_at , id,))
        conn.commit()

        # Kiểm tra số dòng bị ảnh hưởng
        if cur.rowcount == 0:
            return JsonResponse({'error': 'No material found with the given ID'}, status=404)

        return JsonResponse({'message': 'Material updated successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        if conn:
            conn.close()


# Xóa tài liệu        
@controller(url='/api/material/delete/{id}', method='DELETE')
def delete_news(request, id):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM public.material WHERE id = %s', (id,))
        conn.commit()
        return JsonResponse({'message': 'News deleted successfully'})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    finally:
        cur.close()
        conn.close()

# Xóa nhiều tài liệu
@csrf_exempt
@controller(url='/api/delete-multiple-material', method='DELETE')
def delete_multiple_news(request):
    try:
        data = json.loads(request.body)
        ids = data.get('ids', [])  # Lấy danh sách ids từ JSON
        
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM public.material WHERE id IN %s', (tuple(ids),))
        conn.commit()
        
        return JsonResponse({'message': 'News deleted successfully'})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    finally:
        cur.close()
        conn.close()

#Api lấy danh sách các bệnh
@controller(url='/api/diseases')
def get_diseases(request):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM public.diseases')
        result = fetch_data(cur)
        
        return JsonResponse({'diseases': result})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    finally:
        if conn:
            conn.close()
