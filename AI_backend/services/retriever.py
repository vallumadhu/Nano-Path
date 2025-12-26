from db.pinecone import index
from models.embedding_models import embedding_model

def retrieving_chunks(note_id, query_text, top_k=5):
    query_embedding = list(embedding_model.embed([query_text]))[0].tolist()

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        filter={
            "document_id": {"$eq": note_id}
        }
    )
    
    return results["matches"]