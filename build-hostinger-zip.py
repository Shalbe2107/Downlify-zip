import os
import zipfile

ZIP_OUTPUT = "public/quick-downloader-hostinger.zip"
DIST_OUTPUT = "dist/quick-downloader-hostinger.zip"

INCLUDED_FILES = [
    "server.js",
    "server.ts",
    "package.json",
    ".env.example",
    "HOSTINGER_GUIDE.md",
    "index.html",
    "tsconfig.json",
    "vite.config.ts",
]

INCLUDED_DIRS = [
    "dist",
    "public",
    "server",
    "data",
]

# Ensure output directory exists
os.makedirs("public", exist_ok=True)
if os.path.exists(ZIP_OUTPUT):
    os.remove(ZIP_OUTPUT)

print("Creating Hostinger deployment archive...")
with zipfile.ZipFile(ZIP_OUTPUT, "w", zipfile.ZIP_DEFLATED) as zipf:
    for file_name in INCLUDED_FILES:
        if os.path.exists(file_name):
            zipf.write(file_name, arcname=file_name)
            print(f"Added file: {file_name}")

    for dir_name in INCLUDED_DIRS:
        if os.path.exists(dir_name):
            for root, dirs, files in os.walk(dir_name):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Don't include the zip file inside itself
                    if file.endswith(".zip") or "__pycache__" in file_path or ".DS_Store" in file_path:
                        continue
                    arcname = os.path.relpath(file_path, ".")
                    zipf.write(file_path, arcname=arcname)
            print(f"Added directory: {dir_name}")

# Also copy to dist/ if dist exists
if os.path.exists("dist"):
    import shutil
    shutil.copy2(ZIP_OUTPUT, DIST_OUTPUT)
    print(f"Copied to {DIST_OUTPUT}")

file_size_mb = os.path.getsize(ZIP_OUTPUT) / (1024 * 1024)
print(f"SUCCESS: Created {ZIP_OUTPUT} ({file_size_mb:.2f} MB)")
