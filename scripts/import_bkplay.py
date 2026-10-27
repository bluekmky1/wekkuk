"""Import public tournament metadata (no player records) from BKPLAY.

Run: python -m pip install beautifulsoup4; python scripts/import_bkplay.py
"""
import json
import re
import urllib.request
from datetime import date
from pathlib import Path
from urllib.parse import urljoin, parse_qs, urlparse

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://sfa.bkplay.kr"
CHECKED = "2026-10-27"
LIST_URL = BASE + "/tournament/all/list.do?searchStartDate=20261001&searchEndDate=20261231&pageRowCnt=100&pageNo=1&isFirstSearch=false"


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return BeautifulSoup(response.read().decode("utf-8"), "html.parser")


def clean(value):
    return re.sub(r"\s+", " ", value).strip()


def label(value):
    day = date.fromisoformat(value)
    return day.strftime("%Y.%m.%d") + " (" + "월화수목금토일"[day.weekday()] + ")"


def main():
    listing = fetch(LIST_URL)
    links = list(dict.fromkeys(urljoin(BASE, a["href"]) for a in listing.select('a[href*="/tournament/detail.do?tnmtId="]')))
    if not links:
        raise RuntimeError("No tournament links found; existing data left intact")
    records = []
    for url in links:
        soup = fetch(url)
        table = soup.select_one("table.detail")
        if not table:
            raise RuntimeError("Missing public metadata: " + url)
        fields = {}
        for row in table.select("tr"):
            key, value = row.find("th"), row.find("td")
            if key and value:
                fields[clean(key.get_text())] = clean(value.get_text(" ", strip=True))
        schedule = {}
        for item in soup.select("ul.ph > li"):
            key, value = item.find("div"), item.find("p")
            if key and value:
                schedule[clean(key.get_text())] = clean(value.get_text(" ", strip=True))
        dates = re.findall(r"\d{4}\.\d{2}\.\d{2}", schedule.get("대회기간", ""))
        if not dates:
            raise RuntimeError("Missing dates: " + url)
        start, end = dates[0].replace(".", "-"), dates[-1].replace(".", "-")
        month = int(start[5:7])
        if month not in (10, 11, 12):
            continue
        title = clean(soup.select_one(".poster-table h2.title").get_text())
        source_id = parse_qs(urlparse(url).query)["tnmtId"][0]
        area = fields.get("참가지역", "")
        area_parts = area.split()
        # BKPLAY repeats national/province scope before the specific district.
        if len(area_parts) >= 3 and area_parts[-2] in area_parts[:-2]:
            area_parts = area_parts[-2:]
        elif area_parts and area_parts[0] == "전국" and len(area_parts) > 1:
            area_parts = area_parts[1:]
        location = " ".join(area_parts)
        venue_names = [value for key, value in schedule.items() if "경기장" in key]
        poster = soup.select_one(".poster img")
        outline = soup.select_one(".description.from-editor")
        images = list(dict.fromkeys(urljoin(url, img["src"]) for img in outline.select("img[src]"))) if outline else []
        item = {
            "id": "bkplay-" + source_id,
            "sourceId": source_id,
            "title": title,
            "location": location or "전국",
            "dates": label(start) if start == end else label(start) + " ~ " + label(end),
            "startDate": start,
            "endDate": end,
            "month": month,
            "type": "전국대회" if "전국" in area or "전국" in title else "시구군대회",
            "status": "종료" if end < CHECKED else "진행 중" if start <= CHECKED else "경기 준비",
            "venue": ", ".join(venue_names),
            "host": fields.get("주최", ""),
            "organizer": fields.get("주관", ""),
            "supporters": fields.get("후원", ""),
            "sponsors": fields.get("협찬", ""),
            "registration": fields.get("접수기간", ""),
            "entryFee": fields.get("참가비", ""),
            "posterUrl": urljoin(url, poster["src"]) if poster and poster.get("src") else "",
            "outlineImages": images,
            "sourceUrl": url,
            "sourceName": "BKPLAY",
            "verifiedAt": CHECKED.replace("-", "."),
        }
        # Only tournament facts; account holders, bank details, phone numbers and players are excluded.
        records.append(item)
        print(source_id, title, start, end, "outline images:", len(images), flush=True)
    if len({row["id"] for row in records}) != len(records):
        raise RuntimeError("Duplicate source IDs")
    destination = ROOT / "app/data/bkplay-tournaments.json"
    destination.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    document = "# BKPLAY 대회 데이터\n\n확인일: " + CHECKED + " (한국 시간). 공개된 2026년 10~12월 목록과 각 대회 상세를 조회한 정적 스냅샷입니다.\n\n"
    document += "기존 화면 구성에 대회명·일시·지역·경기장·주최·주관·후원·협찬·접수기간·참가비·포스터·이미지 요강을 연결합니다. 선수·팀·대진·점수는 기존 가상 체험 데이터입니다. 원문 이미지에 포함된 고유명사는 수정하지 않습니다. 미확인 사실은 추측하지 않습니다.\n\n"
    document += "재수집: `python scripts/import_bkplay.py` (beautifulsoup4 필요). 스크립트는 참가자 정보에 접근하지 않습니다.\n\n"
    document += "\n".join("- [" + row["title"] + "](" + row["sourceUrl"] + ") · " + row["dates"] for row in records) + "\n"
    (ROOT / "DATA_SOURCES.md").write_text(document, encoding="utf-8")
    print("Imported", len(records), "tournaments")


if __name__ == "__main__":
    main()
