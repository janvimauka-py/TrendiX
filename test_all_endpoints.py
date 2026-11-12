import httpx
import sys

BASE_URL = "http://127.0.0.1:5173/api"

endpoints = [
    ("GET", "/overview"),
    ("GET", "/trends"),
    ("GET", "/trends/radar"),
    ("GET", "/products"),
    ("GET", "/sentiment"),
    ("GET", "/behavior"),
    ("GET", "/prediction?timeframe=30"),
    ("GET", "/competitors"),
    ("GET", "/sources/status"),
    ("GET", "/reports"),
    ("GET", "/export/trends"),
    ("GET", "/bookmarks"),
    ("GET", "/notifications"),
    ("POST", "/assistant/ask", {"query": "What products are trending in India?"}),
    ("POST", "/collect/refresh", {}),
]

passed = 0
failed = 0

with httpx.Client(timeout=10.0) as client:
    for item in endpoints:
        method = item[0]
        ep = item[1]
        payload = item[2] if len(item) > 2 else None

        try:
            if method == "GET":
                r = client.get(f"{BASE_URL}{ep}")
            else:
                r = client.post(f"{BASE_URL}{ep}", json=payload)

            if r.status_code == 200:
                print(f"[OK 200] {method} {ep} (size: {len(r.content)} bytes)")
                passed += 1
            else:
                print(f"[FAIL {r.status_code}] {method} {ep}")
                failed += 1
        except Exception as e:
            print(f"[ERR] {method} {ep}: {e}")
            failed += 1

print(f"\nAPI Verification Summary: {passed} PASSED, {failed} FAILED")
if failed > 0:
    sys.exit(1)

