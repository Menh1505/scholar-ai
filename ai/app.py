"""
Flask API cho Scholar AI RAG System
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

from core.rag_service import ScholarAIService
from config.settings import settings
from utils.validation import validate_environment, print_validation_report


def create_app():
    """Factory function để tạo Flask app"""
    app = Flask(__name__)
    CORS(app)
    
    # Validate environment trước khi khởi động
    validation_results = validate_environment()
    if not validation_results["overall_status"]:
        print("❌ Hệ thống chưa sẵn sàng!")
        print_validation_report(validation_results)
        return None
    
    # Initialize service
    rag_service = ScholarAIService()
    
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "service": "Scholar AI RAG",
            "version": "2.0"
        })
    
    @app.route('/query', methods=['POST'])
    def query():
        """Main query endpoint"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({"error": "No JSON data provided"}), 400
            
            query_text = data.get("question", "").strip()
            university_filter = data.get("university", "").strip()
            section_filter = data.get("section", "").strip()
            field_filter = data.get("field", "").strip()
            
            result = rag_service.process_query(
                query_text=query_text,
                university_filter=university_filter if university_filter else None,
                section_filter=section_filter if section_filter else None,
                field_filter=field_filter if field_filter else None
            )
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({
                "error": f"Internal server error: {str(e)}",
                "answer": "Xin lỗi, đã có lỗi xảy ra trong quá trình xử lý.",
                "sources": []
            }), 500
    
    @app.route('/universities', methods=['GET'])
    def get_universities():
        """Lấy danh sách các trường đại học có trong hệ thống"""
        try:
            # Lấy từ Qdrant collection
            from qdrant_client import QdrantClient
            client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
            
            # Scroll để lấy tất cả records
            result = client.scroll(
                collection_name=settings.COLLECTION_NAME,
                limit=1000
            )
            
            universities = set()
            for point in result[0]:
                universities.add(point.payload.get("university_name", ""))
            
            return jsonify({
                "universities": sorted(list(universities))
            })
            
        except Exception as e:
            return jsonify({
                "error": f"Error fetching universities: {str(e)}",
                "universities": []
            }), 500
    
    @app.route('/sections', methods=['GET'])
    def get_sections():
        """Lấy danh sách các section types có trong hệ thống"""
        try:
            from qdrant_client import QdrantClient
            client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
            
            result = client.scroll(
                collection_name=settings.COLLECTION_NAME,
                limit=1000
            )
            
            sections = set()
            for point in result[0]:
                sections.add(point.payload.get("section_type", ""))
            
            return jsonify({
                "sections": sorted(list(sections))
            })
            
        except Exception as e:
            return jsonify({
                "error": f"Error fetching sections: {str(e)}",
                "sections": []
            }), 500
    
    return app


def main():
    """Main function để chạy ứng dụng"""
    print("🚀 Khởi động Scholar AI API Server...")
    
    app = create_app()
    if app is None:
        print("❌ Không thể khởi động server do lỗi cấu hình")
        return
    
    print(f"✅ Server sẵn sàng tại http://{settings.FLASK_HOST}:{settings.FLASK_PORT}")
    print("📚 API Endpoints:")
    print("  POST /query - Hỏi đáp với RAG")
    print("  GET  /universities - Danh sách trường đại học")
    print("  GET  /sections - Danh sách loại thông tin")
    print("  GET  /health - Health check")
    
    app.run(
        host=settings.FLASK_HOST,
        port=settings.FLASK_PORT,
        debug=settings.FLASK_DEBUG
    )


if __name__ == "__main__":
    main()
