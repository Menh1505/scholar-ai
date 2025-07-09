import os
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from openai import OpenAI

# Cấu hình
openai_api_key = "" 

app = Flask(__name__)

# Qdrant & embedding setup
collection_name = "scholar-ai"
qdrant_client = QdrantClient(host="localhost", port=6333)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    query_text = data.get("question", "").strip()

    if not query_text:
        return jsonify({"error": "No question provided"}), 400

    # Bước 1: Convert câu hỏi thành vector
    query_vector = embedding_model.encode([query_text], normalize_embeddings=True)[0]

    # Bước 2: Truy vấn Qdrant
    search_result = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=15  # lấy 15 đoạn gần nhất
    )

    # Bước 3: Tạo context từ Qdrant
    context = "\n".join([
        f"{hit.payload['country']}: {hit.payload['content']}"
        for hit in search_result
    ])

    # Bước 4: Tạo prompt đầy đủ
    system_prompt = "You are a helpful study abroad advisor."
    user_prompt = f"""Based on the following university information, answer the question below clearly and completely.

University data:
{context}

Question: {query_text}
Answer:"""

    # Bước 5: Gửi prompt đến OpenAI GPT
    client = OpenAI(api_key=openai_api_key)
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3,
        max_tokens=512
    )

    answer = response.choices[0].message.content.strip()
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)