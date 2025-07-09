def read_text_file(file_path):
    """Đọc file .txt và trả về nội dung."""
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()

def clean_text(text):
    """Làm sạch văn bản."""
    # Xóa các dòng trống và chuẩn hóa các ký tự
    cleaned_text = text.strip().replace("\n", " ").replace("\r", "")
    return cleaned_text

# Hàm chính để format dữ liệu
def format_data(file_path):
    """Đọc và làm sạch dữ liệu từ file."""
    text = read_text_file(file_path)
    return clean_text(text)