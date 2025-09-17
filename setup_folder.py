import os

# Project root
project_name = "carbon_project"

# Define folder structure
folders = [
    f"{project_name}/backend/app/api",
    f"{project_name}/backend/app/core",
    f"{project_name}/backend/app/models",
    f"{project_name}/backend/app/services",
    f"{project_name}/backend/app/utils",
    f"{project_name}/backend/app/ml",
    f"{project_name}/backend/tests",
    f"{project_name}/frontend/lib/screens",
    f"{project_name}/frontend/lib/widgets",
    f"{project_name}/frontend/lib/services",
    f"{project_name}/frontend/lib/models",
    f"{project_name}/frontend/assets",
    f"{project_name}/frontend/test",
    f"{project_name}/data/raw",
    f"{project_name}/data/processed",
    f"{project_name}/data/external",
    f"{project_name}/docs",
    f"{project_name}/models",
    f"{project_name}/reports"
]

# Define empty files
files = [
    f"{project_name}/backend/app/__init__.py",
    f"{project_name}/backend/app/main.py",
    f"{project_name}/backend/app/ml/preprocessing.py",
    f"{project_name}/backend/app/ml/train.py",
    f"{project_name}/backend/app/ml/evaluate.py",
    f"{project_name}/backend/requirements.txt",
    f"{project_name}/backend/Dockerfile",
    f"{project_name}/frontend/lib/main.dart",
    f"{project_name}/frontend/pubspec.yaml",
    f"{project_name}/docs/api_spec.md",
    f"{project_name}/docker-compose.yml",
    f"{project_name}/README.md",
    f"{project_name}/.gitignore"
]

# Create folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Create empty files
for file in files:
    with open(file, "w") as f:
        pass

print(f"✅ Project structure for '{project_name}' created successfully!")
