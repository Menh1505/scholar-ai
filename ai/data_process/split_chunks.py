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
                if len(content) > 1200:
                    sub_chunks = split_long_content(content, university_name, section_name, field, file_path)
                    chunks.extend(sub_chunks)
    
    # Validate chunks trước khi return
    valid_chunks = [chunk for chunk in chunks if validate_chunk(chunk)]
    return valid_chunks


def split_data_into_chunks(schools_directory: str = None) -> List[Dict[str, Any]]:
    """
    Format nội dung của từng field thành text dễ đọc.
    """
    if isinstance(field_data, str):
        return field_data
    
    elif isinstance(field_data, dict):
        if field_name == "cost":
            return format_cost_data(field_data)
        elif field_name == "contacts":
            return format_contacts_data(field_data)
        else:
            # Xử lý dict thông thường
            parts = []
            for key, value in field_data.items():
                if isinstance(value, dict):
                    sub_parts = [f"{k}: {v}" for k, v in value.items()]
                    parts.append(f"{key.replace('_', ' ').title()}: {'; '.join(sub_parts)}")
                else:
                    parts.append(f"{key.replace('_', ' ').title()}: {value}")
            return "\n".join(parts)
    
    elif isinstance(field_data, list):
        return "\n".join([str(item) for item in field_data])
    
    else:
        return str(field_data)

def format_cost_data(cost_data):
    """
    Format đặc biệt cho dữ liệu chi phí.
    """
    parts = []
    
    for category, details in cost_data.items():
        if isinstance(details, dict):
            # Chi phí có nhiều khoản mục
            detail_parts = []
            for item, amount in details.items():
                if isinstance(amount, (int, float)):
                    detail_parts.append(f"{item.replace('_', ' ').title()}: ${amount:,}")
                else:
                    detail_parts.append(f"{item.replace('_', ' ').title()}: {amount}")
            parts.append(f"{category.replace('_', ' ').title()}:\n" + "\n".join(f"  - {part}" for part in detail_parts))
        else:
            # Chi phí đơn giản
            if isinstance(details, (int, float)):
                parts.append(f"{category.replace('_', ' ').title()}: ${details:,}")
            else:
                parts.append(f"{category.replace('_', ' ').title()}: {details}")
    
    return "\n\n".join(parts)

def format_contacts_data(contacts_data):
    """
    Format đặc biệt cho dữ liệu liên hệ.
    """
    parts = []
    
    for key, value in contacts_data.items():
        if isinstance(value, dict):
            sub_parts = [f"{k}: {v}" for k, v in value.items()]
            parts.append(f"{key.replace('_', ' ').title()}: {'; '.join(sub_parts)}")
        elif value:  # Chỉ thêm nếu có giá trị
            parts.append(f"{key.replace('_', ' ').title()}: {value}")
    
    return "\n".join(parts)

def split_long_content(content, university_name, section_name, field_name, source_file):
    """
    Chia các content dài thành các chunks nhỏ hơn nhưng vẫn giữ ngữ cảnh.
    """
    chunks = []
    
    # Chia theo paragraph hoặc dòng mới
    paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]
    if len(paragraphs) <= 1:
        paragraphs = [p.strip() for p in content.split('\n') if p.strip()]
    
    current_chunk = ""
    chunk_number = 1
    
    for paragraph in paragraphs:
        if len(current_chunk + paragraph) < 1000:
            current_chunk += paragraph + "\n\n"
        else:
            if current_chunk:
                chunks.append({
                    "university_name": university_name,
                    "section_type": f"{section_name} (Phần {chunk_number})",
                    "field_name": field_name,
                    "content": current_chunk.strip(),
                    "full_context": f"{university_name} - {section_name} (Phần {chunk_number}): {current_chunk.strip()}",
                    "source_file": source_file
                })
                chunk_number += 1
            current_chunk = paragraph + "\n\n"
    
    # Thêm chunk cuối cùng
    if current_chunk:
        chunks.append({
            "university_name": university_name,
            "section_type": f"{section_name} (Phần {chunk_number})",
            "field_name": field_name,
            "content": current_chunk.strip(),
            "full_context": f"{university_name} - {section_name} (Phần {chunk_number}): {current_chunk.strip()}",
            "source_file": source_file
        })
    
    return chunks

def process_all_university_json_files(schools_directory):
    """
    Xử lý tất cả các file JSON trong thư mục schools.
    """
    all_chunks = []
    
    if not os.path.exists(schools_directory):
        print(f"❌ Thư mục {schools_directory} không tồn tại")
        return all_chunks
    
    json_files = [f for f in os.listdir(schools_directory) if f.endswith('.json')]
    
    if not json_files:
        print(f"❌ Không tìm thấy file JSON nào trong {schools_directory}")
        return all_chunks
        
    print(f"📁 Tìm thấy {len(json_files)} file JSON")
    
    for filename in json_files:
        file_path = os.path.join(schools_directory, filename)
        try:
            chunks = process_university_json(file_path)
            all_chunks.extend(chunks)
            print(f"✅ Đã xử lý {filename}: {len(chunks)} chunks")
        except Exception as e:
            print(f"❌ Lỗi khi xử lý {filename}: {e}")
    
    return all_chunks

# Hàm chính để split dữ liệu thành chunks
def split_data_into_chunks(schools_directory):
    """Chia dữ liệu JSON thành các chunks phù hợp cho RAG."""
    return process_all_university_json_files(schools_directory)