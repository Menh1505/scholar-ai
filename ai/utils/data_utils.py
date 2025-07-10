"""
Data processing utilities cho Scholar AI
"""
import json
import os
from typing import List, Dict, Any

from config.settings import settings


def load_university_data(file_path: str) -> Dict[str, Any]:
    """Load dữ liệu JSON của trường đại học"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def get_field_mapping() -> Dict[str, str]:
    """Mapping từ field JSON sang tên section tiếng Việt"""
    return {
        "general": "Thông tin chung",
        "programs": "Chương trình đào tạo", 
        "requirements": "Yêu cầu đầu vào",
        "cost": "Chi phí",
        "scholarships": "Học bổng",
        "application": "Hướng dẫn nộp hồ sơ",
        "visa": "Visa và nhập cảnh",
        "housing": "Ký túc xá và đời sống",
        "careers": "Cơ hội nghề nghiệp",
        "contacts": "Thông tin liên hệ"
    }


def format_field_content(field: str, data: Any) -> str:
    """Format nội dung field thành text"""
    if isinstance(data, dict):
        return format_dict_content(data)
    elif isinstance(data, list):
        return format_list_content(data)
    else:
        return str(data)


def format_dict_content(data: Dict[str, Any]) -> str:
    """Format dictionary content"""
    parts = []
    for key, value in data.items():
        if isinstance(value, (dict, list)):
            formatted_value = format_field_content(key, value)
        else:
            formatted_value = str(value)
        parts.append(f"{key}: {formatted_value}")
    return "\n".join(parts)


def format_list_content(data: List[Any]) -> str:
    """Format list content"""
    if not data:
        return ""
    
    if isinstance(data[0], dict):
        parts = []
        for item in data:
            parts.append(format_dict_content(item))
        return "\n\n".join(parts)
    else:
        return "\n".join(str(item) for item in data)


def split_long_content(
    content: str, 
    university_name: str, 
    section_name: str, 
    field: str, 
    source_file: str
) -> List[Dict[str, Any]]:
    """Chia content dài thành các chunks nhỏ hơn"""
    chunks = []
    words = content.split()
    
    # Chia thành các đoạn khoảng 800 từ với overlap 100 từ
    chunk_size = 800
    overlap = 100
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk_words = words[i:i + chunk_size]
        chunk_content = " ".join(chunk_words)
        
        chunk = {
            "university_name": university_name,
            "section_type": section_name,
            "field_name": field,
            "content": chunk_content,
            "full_context": f"{university_name} - {section_name}: {chunk_content}",
            "source_file": source_file,
            "chunk_index": len(chunks)
        }
        chunks.append(chunk)
        
        # Nếu đây là chunk cuối, dừng lại
        if i + chunk_size >= len(words):
            break
    
    return chunks


def get_json_files(directory: str) -> List[str]:
    """Lấy danh sách các file JSON trong thư mục"""
    if not os.path.exists(directory):
        return []
    
    return [
        os.path.join(directory, f) 
        for f in os.listdir(directory) 
        if f.endswith('.json')
    ]


def validate_chunk(chunk: Dict[str, Any]) -> bool:
    """Validate chunk data structure"""
    required_fields = [
        "university_name", "section_type", "field_name", 
        "content", "source_file"
    ]
    
    for field in required_fields:
        if field not in chunk:
            return False
        if not chunk[field] or not str(chunk[field]).strip():
            return False
    
    return True


def analyze_chunks(chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Phân tích thống kê chunks"""
    stats = {
        "total_chunks": len(chunks),
        "universities": set(),
        "sections": set(),
        "fields": set(),
        "avg_content_length": 0
    }
    
    total_length = 0
    
    for chunk in chunks:
        if "university_name" in chunk:
            stats["universities"].add(chunk["university_name"])
        if "section_type" in chunk:
            stats["sections"].add(chunk["section_type"])
        if "field_name" in chunk:
            stats["fields"].add(chunk["field_name"])
        if "content" in chunk:
            total_length += len(str(chunk["content"]))
    
    if len(chunks) > 0:
        stats["avg_content_length"] = total_length // len(chunks)
    
    # Convert sets to counts
    stats["unique_universities"] = len(stats["universities"])
    stats["unique_sections"] = len(stats["sections"])
    stats["unique_fields"] = len(stats["fields"])
    
    # Remove sets from final output
    del stats["universities"]
    del stats["sections"] 
    del stats["fields"]
    
    return stats
