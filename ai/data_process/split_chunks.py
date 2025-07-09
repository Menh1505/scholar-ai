import re

def chunk_text(text):
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    chunks = []
    current_country = None

    for line in lines:
        if line.startswith("*"):
            # Cập nhật quốc gia mới
            current_country = line[1:].strip()
        else:
            # Mỗi dòng là một trường
            chunks.append({
                "country": current_country,
                "content": line
            })

    return chunks

# Hàm chính để split dữ liệu thành chunks
def split_data_into_chunks(text):
    """Chia dữ liệu thành các chunks."""
    return chunk_text(text)