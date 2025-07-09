# Scholar AI

## Requirements

- Docker [install here](https://docs.docker.com/engine/install/)
- Python [install here](https://www.python.org/downloads/)

## Create database

```bash
docker pull qdrant/qdrant
docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/data/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant
```

## Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

## Install Packages Requirement

```bash
pip install -r requirements.txt
```

## How to run

1. Create data/ then put your data into
2. Open ./run-data-process.py then replace file path with your correct data file name
3. Run `python ./run-data-process.py` to embed data into Qdrant database
4. Run `python ./api.py` to start API
