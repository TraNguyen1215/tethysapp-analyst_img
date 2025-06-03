from tethys_sdk.base import TethysAppBase


class AnalystImg(TethysAppBase):
    """
    Tethys app class for Analyst Img.
    """

    name = 'Phân tích hình ảnh'
    description = ''
    package = 'analyst_img'  # WARNING: Do not change this value
    index = 'home'
    icon = f'{package}/images/image.png'
    root_url = 'analyst-img'
    color = '#006400'
    tags = ''
    enable_feedback = False
    feedback_emails = []