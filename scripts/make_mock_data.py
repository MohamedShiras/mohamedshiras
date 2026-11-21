#!/usr/bin/env python3
"""Writes PLACEHOLDER data/contributions.json so the cards can be previewed offline.

Not real numbers. The GitHub Action replaces this file with real data
(scripts/fetch_contributions.py) on every run.
"""
import datetime
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(__file__))
from fetch_contributions import build_data  # noqa: E402

random.seed(11)
end = datetime.date.today()
start = end - datetime.timedelta(days=364)
days = []
d = start
while d <= end:
    busy = 0.5 + 0.5 * __import__("math").sin(d.toordinal() / 35)
    r = random.random()
    count = 0 if r < 0.3 else round(random.random() * 9 * busy + (8 if r > 0.94 else 0))
    days.append({"date": d.isoformat(), "count": count, "level": min(4, count // 3)})
    d += datetime.timedelta(days=1)
data = build_data(days)
data["mock"] = True
out = os.path.join(os.path.dirname(__file__), "..", "data", "contributions.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump(data, open(out, "w"), indent=2)
print("wrote placeholder", out, data["total_contributions"])
