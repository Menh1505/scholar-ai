"""
Data chunking module for Scholar AI
Xử lý và chia dữ liệu JSON thành chunks phù hợp cho RAG
"""
import os
from typing import List, Dict, Any

from utils.data_utils import (
    load_university_data, get_field_mapping, format_field_content,
    split_long_content, get_json_files, validate_chunk
)
from config.settings import settings


def process_university_json(file_path: str) -> List[Dict[str, Any]]:
    """
    Xử lý file JSON của từng trường đại học và chia thành chunks.
    Trả về các chunks có cấu trúc phù hợp cho RAG.
    """
    data = load_university_data(file_path)
    university_name = data.get("university", "Unknown University")
    chunks = []
    
    field_mapping = get_field_mapping()
    
    # Xử lý từng field trong JSON
    for field, section_name in field_mapping.items():
        if field in data and data[field]:
            content = format_field_content(field, data[field])
            
            if content.strip():  # Chỉ tạo chunk nếu có nội dung
                chunk = {
                    "university_name": university_name,
                    "section_type": section_name,
                    "field_name": field,
                    "content": content,
                    "full_context": f"{university_name} - {section_name}: {content}",
                    "source_file": file_path
                }
                chunks.append(chunk)
                
                # Nếu content quá dài, chia nhỏ hơn
                if len(content) > settings.MAX_CHUNK_SIZE:
                    sub_chunks = split_long_content(content, university_name, section_name, field, file_path)
                    chunks.extend(sub_chunks)
    
    # Validate chunks trước khi return
    valid_chunks = [chunk for chunk in chunks if validate_chunk(chunk)]
    return valid_chunks


def split_data_into_chunks(schools_directory: str = None) -> List[Dict[str, Any]]:
    """
    Đọc tất cả file JSON trong thư mục và chia thành chunks.
    """
    if schools_directory is None:
        schools_directory = settings.SCHOOLS_DIRECTORY
    
    if not os.path.exists(schools_directory):
        print(f"❌ Thư mục {schools_directory} không tồn tại")
        return []
    
    json_files = get_json_files(schools_directory)
    
    if not json_files:
        print(f"❌ Không tìm thấy file JSON nào trong {schools_directory}")
        return []
    
    all_chunks = []
    
    for file_path in json_files:
        try:
            chunks = process_university_json(file_path)
            all_chunks.extend(chunks)
            print(f"✅ Đã xử lý {os.path.basename(file_path)}: {len(chunks)} chunks")
        except Exception as e:
            print(f"❌ Lỗi khi xử lý {file_path}: {str(e)}")
    
    print(f"🎉 Tổng cộng: {len(all_chunks)} chunks từ {len(json_files)} file")
    return all_chunks


def analyze_chunks(chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Phân tích thống kê về chunks
    """
    if not chunks:
        return {"error": "Không có chunks để phân tích"}
    
    universities = set(chunk["university_name"] for chunk in chunks)
    sections = set(chunk["section_type"] for chunk in chunks)
    fields = set(chunk.get("field_name", "") for chunk in chunks if chunk.get("field_name"))
    
    # Phân tích độ dài content
    content_lengths = [len(chunk["content"]) for chunk in chunks]
    avg_length = sum(content_lengths) / len(content_lengths)
    
    return {
        "total_chunks": len(chunks),
        "universities_count": len(universities),
        "sections_count": len(sections), 
        "fields_count": len(fields),
        "avg_content_length": int(avg_length),
        "max_content_length": max(content_lengths),
        "min_content_length": min(content_lengths),
        "universities": sorted(list(universities)),
        "sections": sorted(list(sections)),
        "fields": sorted(list(fields))
    }
