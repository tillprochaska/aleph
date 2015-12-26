import logging

from aleph.model.metadata import Metadata
from aleph.ingest import ingest_url, ingest_file

log = logging.getLogger(__name__)


class Crawler(object):

    def crawl(self, **kwargs):
        raise NotImplemented()

    def metadata(self):
        return Metadata(data={
            'crawler': self.__class__.__name__
        })

    def emit_url(self, source, meta, url):
        ingest_url.delay(source.id, meta, url)

    def emit_file(self, source, meta, file_path):
        ingest_file(source.id, meta, file_path)

    def __repr__(self):
        return '<%s()>' % self.__class__.__name__
