FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 SPARE_AD_BUNDLE=/opt/spare-ad
WORKDIR /site
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 && rm -rf /var/lib/apt/lists/*
COPY services/spare_ad/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt
# An explicit source allowlist keeps private resources out of image layers.
COPY index.html admin.html robots.txt sitemap.xml ./
COPY assets ./assets
COPY data ./data
COPY cv ./cv
COPY blog ./blog
COPY talks ./talks
COPY spare-ad ./spare-ad
COPY services/spare_ad ./services/spare_ad
RUN useradd --uid 10001 --create-home researcher
USER researcher
EXPOSE 8765
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8765/spare-ad/healthz', timeout=4)"
CMD ["gunicorn", "--bind", "0.0.0.0:8765", "--workers", "1", "--threads", "2", "--timeout", "300", "services.spare_ad.server:application"]
