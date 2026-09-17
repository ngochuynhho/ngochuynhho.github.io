FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    LITTLE_DAYS_HOST=0.0.0.0 \
    LITTLE_DAYS_PORT=8766 \
    LITTLE_DAYS_DATA_DIR=/data

WORKDIR /app
RUN useradd --system --uid 10001 --create-home little-days && mkdir /data && chown little-days:little-days /data

COPY --chown=little-days:little-days index.html app.js family.js sync.js sw.js manifest.webmanifest *.css server.py ./
COPY --chown=little-days:little-days growth ./growth
COPY --chown=little-days:little-days feedingGuidance ./feedingGuidance
COPY --chown=little-days:little-days icons ./icons

USER little-days
EXPOSE 8766
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8766/api/health', timeout=3)"]
CMD ["python", "server.py"]
