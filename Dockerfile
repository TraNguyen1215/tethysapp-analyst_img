# Sử dụng base image của Tethys
FROM tethysplatform/tethys-core:latest

# Cài đặt pip (nếu chưa có)
RUN apt-get update && apt-get install -y python3-pip

# Cài đặt thư viện hệ thống bổ sung
RUN apt-get update && apt-get install -y libgdal-dev python3-dev
RUN apt install -y wget
RUN apt install -y bash
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
RUN bash miniconda.sh -b -p /opt/conda
RUN rm miniconda.sh
ENV PATH=/opt/conda/bin:$PATH

# Thiết lập thư mục làm việc
WORKDIR /tethysapp

# Sao chép file `requirements.txt` vào container
COPY ./requirements.txt ./requirements.txt

# Cài đặt thư viện Python từ `requirements.txt`
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép mã nguồn ứng dụng Tethys vào container
COPY ./tethysapp/analyst_img /tethysapp/analyst_img

# Cài đặt Tethys (nếu chưa cài)
RUN pip install tethys-platform
RUN pip install pbr
RUN pip install "bokeh>=2.0.0"
# Cài đặt cơ sở dữ liệu và tài nguyên tĩnh
#RUN tethys manage syncdb --noinput
# RUN tethys manage migrate --noinput
# RUN tethys manage collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Khởi động server
CMD ["bash", "-c", "source activate tethys && tethys manage start"]
