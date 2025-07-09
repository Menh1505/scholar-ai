from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct
import uuid
from split_chunks import split_data_into_chunks

# ======= Embedder setup =======
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks):
    """
    Nhận list chunks (dict), trả về list vector embeddings.
    """
    texts = [chunk["content"] for chunk in chunks]
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    return embeddings.tolist()

# ======= Qdrant setup =======
qdrant = QdrantClient(host="localhost", port=6333)
collection_name = "scholar-ai"

def create_collection():
    """
    Tạo lại collection (xóa cũ nếu có) với cấu hình vector Cosine.
    """
    qdrant.recreate_collection(
        collection_name=collection_name,
        vectors_config={
            "size": 384,  # vector size của all-MiniLM-L6-v2
            "distance": "Cosine"
        }
    )

def save_to_qdrant(chunks, embeddings):
    """
    Lưu các vector và metadata vào Qdrant.
    """
    points = []
    for i, chunk in enumerate(chunks):
        payload = {
            "content": chunk["content"],
            "country": chunk["country"]
        }
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embeddings[i],
                payload=payload
            )
        )
    
    qdrant.upsert(collection_name=collection_name, points=points)

# ======= Main runner =======
def save_data_to_qdrant(chunks):
    create_collection()
    embeddings = embed_chunks(chunks)
    save_to_qdrant(chunks, embeddings)
    print(f"✅ Đã lưu {len(chunks)} trường vào Qdrant.")


# ======= Example usage =======
if __name__ == "__main__":
    with open("/home/menhythien/source/scholarAi/data/info.txt", "r", encoding="utf-8") as f:
        raw_text = f.read()

    chunks = split_data_into_chunks(raw_text)

    save_data_to_qdrant(chunks)