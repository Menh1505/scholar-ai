"""
Core business logic cho hệ thống Scholar AI RAG
"""
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from openai import OpenAI

from config.settings import settings


class ScholarAIService:
    """Service chính xử lý logic RAG"""
    
    def __init__(self):
        self.qdrant_client = QdrantClient(
            host=settings.QDRANT_HOST, 
            port=settings.QDRANT_PORT
        )
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
    def search_documents(
        self, 
        query_text: str,
        university_filter: Optional[str] = None,
        section_filter: Optional[str] = None,
        field_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Tìm kiếm documents từ Qdrant vector database
        """
        # Convert câu hỏi thành vector
        query_vector = self.embedding_model.encode([query_text], normalize_embeddings=True)[0]
        
        # Tạo filter cho Qdrant
        search_filter = self._build_search_filter(
            university_filter, section_filter, field_filter
        )
        
        # Truy vấn Qdrant
        search_result = self.qdrant_client.search(
            collection_name=settings.COLLECTION_NAME,
            query_vector=query_vector,
            query_filter=search_filter,
            limit=settings.SEARCH_LIMIT,
            score_threshold=settings.SCORE_THRESHOLD
        )
        
        return search_result
    
    def _build_search_filter(
        self, 
        university_filter: Optional[str],
        section_filter: Optional[str], 
        field_filter: Optional[str]
    ) -> Optional[Dict[str, Any]]:
        """Tạo filter cho Qdrant search"""
        if not any([university_filter, section_filter, field_filter]):
            return None
            
        must_conditions = []
        
        if university_filter:
            must_conditions.append({
                "key": "university_name",
                "match": {"value": university_filter}
            })
        if section_filter:
            must_conditions.append({
                "key": "section_type", 
                "match": {"value": section_filter}
            })
        if field_filter:
            must_conditions.append({
                "key": "field_name", 
                "match": {"value": field_filter}
            })
        
        return {"must": must_conditions}
    
    def generate_answer(self, query_text: str, context: str) -> str:
        """
        Generate answer using OpenAI với context từ RAG
        """
        system_prompt = """Bạn là một chuyên gia tư vấn du học Việt Nam, chuyên hỗ trợ học sinh tìm hiểu về các trường đại học quốc tế. 

Hướng dẫn trả lời:
- Trả lời bằng tiếng Việt
- Cung cấp thông tin chính xác dựa trên dữ liệu được cung cấp
- Nếu thiếu thông tin, hãy nói rõ và gợi ý tìm hiểu thêm
- Tổ chức thông tin rõ ràng, dễ đọc
- Đưa ra lời khuyên thực tế cho học sinh"""

        user_prompt = f"""
Dựa trên thông tin sau về các trường đại học:

{context}

Hãy trả lời câu hỏi: {query_text}

Lưu ý: Chỉ sử dụng thông tin được cung cấp ở trên để trả lời."""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=800,
                temperature=0.3
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Xin lỗi, đã có lỗi khi tạo câu trả lời: {str(e)}"
    
    def process_query(
        self,
        query_text: str,
        university_filter: Optional[str] = None,
        section_filter: Optional[str] = None, 
        field_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Xử lý câu hỏi hoàn chỉnh: tìm kiếm + generate answer
        """
        if not query_text.strip():
            return {
                "answer": "Vui lòng nhập câu hỏi.",
                "sources": [],
                "error": "No question provided"
            }
        
        # Tìm kiếm documents
        search_results = self.search_documents(
            query_text, university_filter, section_filter, field_filter
        )
        
        if not search_results:
            return {
                "answer": "Xin lỗi, tôi không tìm thấy thông tin phù hợp với câu hỏi của bạn.",
                "sources": []
            }
        
        # Tạo context và sources
        context_parts = []
        sources = []
        
        for hit in search_results:
            university = hit.payload['university_name']
            section = hit.payload['section_type']
            field = hit.payload.get('field_name', '')
            content = hit.payload['content']
            
            section_info = f"{section} ({field})" if field else section
            context_parts.append(f"**{university} - {section_info}:**\n{content}")
            
            sources.append({
                "university": university,
                "section": section,
                "field": field,
                "score": hit.score,
                "source_file": hit.payload.get('source_file', '')
            })
        
        context = "\n\n".join(context_parts)
        
        # Generate answer
        answer = self.generate_answer(query_text, context)
        
        return {
            "answer": answer,
            "sources": sources
        }
