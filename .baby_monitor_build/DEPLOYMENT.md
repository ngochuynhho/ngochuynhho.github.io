# Little Days deployment

Little Days is an installable Progressive Web App (PWA). Android and iOS use the same application and encrypted family dataset, so there is no separate mobile database to maintain.

## Test locally

The sync API is part of `server.py`; the old `python -m http.server` command serves the screen but cannot synchronize records.

```bash
cd /path/to/baby_monitor
python3 server.py
```

Open <http://localhost:8766>. Existing `little-days-v1` browser data on this exact origin is migrated automatically into the first Baby ID and is retained as a compatibility copy.

## Run with Docker

```bash
docker compose up -d --build
```

The included Compose file binds the service to `127.0.0.1:8766`. Put an HTTPS reverse proxy such as Caddy or NGINX in front of it. Do not publish the sync API over unencrypted HTTP or expose it directly without network access controls.

Example Caddy site:

```caddyfile
baby.example.com {
    reverse_proxy 127.0.0.1:8766
}
```

Prefer a private LAN plus VPN rather than public port forwarding. If public access is necessary, add authentication and rate limiting at the reverse proxy as defense in depth.

## Link phones and tablets

1. While the old `localhost:8766` app still shows the existing records, refresh it, open **Sync devices**, and choose **Export backup**.
2. Visit the final HTTPS home-server address, open **Sync devices**, choose **Import backup**, and select that file. Delete or securely archive the readable backup afterward.
3. Choose **Create recovery key** and save the displayed key in a password manager.
4. Open the same HTTPS address on each additional device.
5. Choose **Sync devices**, paste the key under **Link this device**, and synchronize.
6. On Android, use the browser's **Install app** action. On iPhone/iPad Safari, use **Share → Add to Home Screen**.

Baby ID identifies a profile; it is not a credential. The family recovery key grants access to all profiles and must remain secret.

## Storage and backup

The server database is `/data/little-days.sqlite3` inside the container and is held in the `little-days-data` Docker volume. Back up that volume. The snapshots in it are encrypted, but losing both the server database and every paired device loses the synchronized copy. Losing the recovery key prevents a new device from decrypting the backup.

Each device also retains a local browser copy for offline use. The client merges entries by their stable IDs and keeps deletion markers so edits from temporarily offline devices can converge on the next sync.

## Configuration

When running `server.py` directly:

| Variable | Default | Purpose |
|---|---|---|
| `LITTLE_DAYS_HOST` | `127.0.0.1` | Listening interface |
| `LITTLE_DAYS_PORT` | `8766` | HTTP port behind the reverse proxy |
| `LITTLE_DAYS_DATA_DIR` | `./data` | Directory containing the SQLite database |

Use HTTPS and keep one stable origin. Browser storage and PWA installation are scoped to the exact scheme, hostname, and port.
