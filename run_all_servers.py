import subprocess
import time

# List of your files and the ports you want them on
servers = [
    ["uvicorn", "backend/app/main:app", "--port", "8000"],
    ["uvicorn", "backend/app/api/endpoints/profile:app", "--port", "8001"],
    ["uvicorn", "backend/app/api/endpoints/pipeline:app", "--port", "8002"],
]

processes = []

for cmd in servers:
    p = subprocess.Popen(cmd)
    processes.append(p)
    print(f"Started {' '.join(cmd)}")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    for p in processes:
        p.terminate()
    print("Stopped all servers.")