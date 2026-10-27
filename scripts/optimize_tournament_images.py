"""Create web-sized derivatives, retaining source URLs only in source metadata.

Requires Pillow. Run after import_bkplay.py.
"""
import io
import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/images/tournaments"
OUTPUT.mkdir(parents=True, exist_ok=True)
records = json.loads((ROOT / "app/data/bkplay-tournaments.json").read_text(encoding="utf-8"))


def download(url):
    with urllib.request.urlopen(url, timeout=40) as response:
        raw = response.read()
    image = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert("RGB")
    return image, len(raw)


def save(image, name, dimensions, quality):
    path = OUTPUT / name
    resized = image.copy()
    resized.thumbnail(dimensions, Image.Resampling.LANCZOS)
    resized.save(path, "WEBP", quality=quality, method=6)
    return "/images/tournaments/" + name, path.stat().st_size


def process(record):
    source_id = record["sourceId"]
    result = {"outlineImages": []}
    original_bytes = optimized_bytes = 0
    if record.get("posterUrl"):
        image, size = download(record["posterUrl"])
        original_bytes += size
        result["thumbnailUrl"], size = save(image, source_id + "-thumb.webp", (116, 172), 76)
        optimized_bytes += size
        result["displayPosterUrl"], size = save(image, source_id + "-poster.webp", (780, 1160), 82)
        optimized_bytes += size
    for index, url in enumerate(record.get("outlineImages", [])):
        image, size = download(url)
        original_bytes += size
        # Text sheets need more resolution than a list thumbnail.
        width = min(image.width, 1200)
        height = round(image.height * width / image.width)
        path, size = save(image, f"{source_id}-outline-{index + 1}.webp", (width, height), 84)
        optimized_bytes += size
        result["outlineImages"].append(path)
    return source_id, result, original_bytes, optimized_bytes


def main():
    assets = {}
    original = optimized = 0
    with ThreadPoolExecutor(max_workers=4) as pool:
        for source_id, result, before, after in pool.map(process, records):
            assets[source_id] = result
            original += before
            optimized += after
            print(source_id, "optimized", flush=True)
    (ROOT / "app/data/tournament-image-assets.json").write_text(json.dumps(assets, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    thumbs = list(OUTPUT.glob("*-thumb.webp"))
    print(json.dumps({"tournaments": len(assets), "originalBytes": original, "optimizedBytes": optimized, "thumbnailAverageBytes": sum(p.stat().st_size for p in thumbs) // max(1, len(thumbs)), "thumbnailMaxBytes": max(p.stat().st_size for p in thumbs)}), flush=True)


if __name__ == "__main__":
    main()
