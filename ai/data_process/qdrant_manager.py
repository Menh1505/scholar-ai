"""
Qdrant integration module for Scholar AI
Lưu và quản lý embeddings trong Qdrant vector database
"""
import uuid
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from config.settings import settings


class QdrantManager:
    """Manager class cho việc tương tác với Qdrant"""
    
    def __init__(self):
        self.client = QdrantClient(
            host=settings.QDRANT_HOST, 
            port=settings.QDRANT_PORT
        )
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        self.collection_name = settings.COLLECTION_NAME
    
    def create_collection_if_not_exists(self):
        """Tạo collection nếu chưa tồn tại"""
        try:
            collections = self.client.get_collections()
            existing_collections = [c.name for c in collections.collections]
            
            if self.collection_name not in existing_collections:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=384,  # all-MiniLM-L6-v2 dimension
                        distance=Distance.COSINE
                    )
                )
                print(f"✅ Đã tạo collection '{self.collection_name}'")
            else:
                print(f"✅ Collection '{self.collection_name}' đã tồn tại")
        except Exception as e:
            print(f"❌ Lỗi khi tạo collection: {str(e)}")
            raise
    
    def embed_chunks(self, chunks: List[Dict[str, Any]]) -> List[List[float]]:
        """
        Tạo embeddings cho list chunks
        """
        texts = [chunk["full_context"] for chunk in chunks]
        embeddings = self.model.encode(
            texts,
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        return embeddings.tolist()
    
    def clear_collection(self):
        """Xóa toàn bộ dữ liệu trong collection"""
        try:
            self.client.delete_collection(self.collection_name)
            print(f"✅ Đã xóa collection '{self.collection_name}'")
            self.create_collection_if_not_exists()
        except Exception as e:
            print(f"❌ Lỗi khi xóa collection: {str(e)}")
    
    def save_chunks_to_qdrant(self, chunks: List[Dict[str, Any]], clear_existing: bool = False):
        """
        Lưu chunks vào Qdrant với embeddings
        """
        if not chunks:
            print("❌ Không có chunks để lưu")
            return
        
        # Clear existing data if requested
        if clear_existing:
            self.clear_collection()
        else:
            self.create_collection_if_not_exists()
        
        print(f"🔄 Bắt đầu tạo embeddings cho {len(chunks)} chunks...")
        embeddings = self.embed_chunks(chunks)
        
        print("🔄 Đang upload vào Qdrant...")
        points = []
        
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "university_name": chunk["university_name"],
                    "section_type": chunk["section_type"],
                    "field_name": chunk.get("field_name", ""),
                    "content": chunk["content"],
                    "source_file": chunk.get("source_file", ""),
                    "chunk_index": chunk.get("chunk_index", i)
                }
            )
            points.append(point)
        
        # Upload theo batch để tránh timeout
        batch_size = 100
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            self.client.upsert(
                collection_name=self.collection_name,
                points=batch
            )
            print(f"✅ Đã upload batch {i//batch_size + 1}/{(len(points)-1)//batch_size + 1}")
        
        print(f"🎉 Hoàn thành! Đã lưu {len(chunks)} chunks vào Qdrant")
    
    def get_collection_info(self) -> Dict[str, Any]:
        """Lấy thông tin về collection"""
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "status": "success",
                "vectors_count": info.vectors_count,
                "segments_count": info.segments_count,
                "config": info.config
            }
        except Exception as e:
            return {
                "status": "error", 
                "error": str(e)
            }


# Convenience functions for backward compatibility
def save_data_to_qdrant(chunks: List[Dict[str, Any]], clear_existing: bool = True):
    """
    Function wrapper để tương thích với code cũ
    """
    manager = QdrantManager()
    manager.save_chunks_to_qdrant(chunks, clear_existing)


def embed_chunks(chunks: List[Dict[str, Any]]) -> List[List[float]]:
    """
    Function wrapper để tương thích với code cũ
    """
    manager = QdrantManager()
    return manager.embed_chunks(chunks)
