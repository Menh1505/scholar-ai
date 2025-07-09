from data_process.format_data import format_data
from data_process.split_chunks import split_data_into_chunks
from data_process.embed_data import embed_data
from data_process.save_qdrant import save_data_to_qdrant

def run_rag_pipeline(file_path):
    # Bước 1: Đọc và format dữ liệu
    text = format_data(file_path)
    
    # Bước 2: Chia dữ liệu thành các chunks
    chunks = split_data_into_chunks(text)
    
    # Bước 3: Tạo embedding cho các chunks
    embeddings = embed_data(chunks)
    
    # Bước 4: Lưu các chunk và embedding vào Qdrant
    save_data_to_qdrant(chunks, embeddings)

if __name__ == "__main__":
    file_path = "data/thong_tin_du_hoc_clean.txt"  # Đặt tên file của bạn tại đây
    run_rag_pipeline(file_path)