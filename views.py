
import json
import os
import shutil
import tempfile
from base64 import b64decode, b64encode

from cartoview.app_manager.models import App, AppInstance
from cartoview.app_manager.views import AppsThumbnail, StandardAppViews
from django.shortcuts import HttpResponse
from PIL import Image

from . import APP_NAME


def generate_thumbnails(base64_image, size=(250, 250)):
    format, image = base64_image.split(';base64,')
    image = b64decode(image)
    dirpath = tempfile.mkdtemp()
    original_path = os.path.join(dirpath, 'original.png')
    thumbnail_path = os.path.join(dirpath, 'thumbnail.png')
    with open(original_path, 'wb') as f:
        f.write(image)
    im = Image.open(original_path)
    im.thumbnail(size)
    im.save(thumbnail_path, "PNG")
    with open(thumbnail_path, "rb") as image_file:
        encoded_image = b64encode(image_file.read())
    shutil.rmtree(dirpath)
    return format + ';base64,' + encoded_image


class Geoobservation(StandardAppViews):
    def save(self, request, instance_id=None):
        res_json = dict(success=False)
        data = json.loads(request.body)
        map_id = data.get('map', None)
        title = data.get('title', "")
        config = data.get('config', None)
        base64_image = config.get('logo', None).get('base64', None)
        encoded_image = generate_thumbnails(base64_image)
        config['logo']['base64'] = encoded_image
        access = data.get('access', None)
        config.update(access=access)
        config = json.dumps(data.get('config', None))
        abstract = data.get('abstract', "")
        keywords = data.get('keywords', [])

        if instance_id is None:
            instance_obj = AppInstance()
            instance_obj.app = App.objects.get(name=self.app_name)
            instance_obj.owner = request.user
        else:
            instance_obj = AppInstance.objects.get(pk=instance_id)

        instance_obj.title = title
        instance_obj.config = config
        instance_obj.abstract = abstract
        instance_obj.map_id = map_id
        instance_obj.save()
        thumbnail_obj = AppsThumbnail(instance_obj)
        thumbnail_obj.create_thumbnail()

        owner_permissions = [
            'view_resourcebase',
            'download_resourcebase',
            'change_resourcebase_metadata',
            'change_resourcebase',
            'delete_resourcebase',
            'change_resourcebase_permissions',
            'publish_resourcebase',
        ]

        if access == "private":
            permessions = {
                'users': {
                    '{}'.format(request.user): owner_permissions,
                }
            }
        else:
            permessions = {
                'users': {
                    '{}'.format(request.user): owner_permissions,
                    'AnonymousUser': [
                        'view_resourcebase',
                    ],
                }
            }
        # set permissions so that no one can view this appinstance other than
        #  the user
        instance_obj.set_permissions(permessions)

        # update the instance keywords
        if hasattr(instance_obj, 'keywords'):
            for k in keywords:
                if k not in instance_obj.keyword_list():
                    instance_obj.keywords.add(k)

        res_json.update(dict(success=True, id=instance_obj.id))
        return HttpResponse(json.dumps(res_json),
                            content_type="application/json")

    def __init__(self, app_name):
        super(Geoobservation, self).__init__(app_name)
        self.view_template = "%s/geoform.html" % app_name


geo_observation = Geoobservation(APP_NAME)
