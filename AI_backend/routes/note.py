import uuid
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter,Form
from services.splitter import splitter
from models.embedding_models import ibm_embedding_model
from db.pinecone import index
from services.chat import talk_to_note

class ChatRequest(BaseModel):
    unique_note_id:str
    query: str
    past_conversations: List[dict[str, str]]

router = APIRouter()

@router.post("/embednote")
def embednote(note:str= Form("")):

    chunks = splitter.split_text(note)
    embeddings = ibm_embedding_model.encode(chunks)
    unique_note_id = str(uuid.uuid4())

    vectors_to_upsert = []

    for i, (doc, embedding) in enumerate(zip(chunks, embeddings)):
        vectors_to_upsert.append({
            "id": f"{unique_note_id}_chunk_{i}",
            "values": embedding.tolist(),
            "metadata": {
                "text": doc,
                "document_id": unique_note_id,
                "chunk_index": i}
        })

        if len(vectors_to_upsert) >= 500:
                embedding_length = len(vectors_to_upsert[0]['values'])
                print(f"Batch {total_processed // 500 + 1}: Index expects 768, Sent: {embedding_length}")
                
                if embedding_length != 768:
                    raise ValueError(f"Dimension mismatch! Expected 768, got {embedding_length}")
                
                index.upsert(vectors=vectors_to_upsert)
                total_processed += len(vectors_to_upsert)
                print(f"{total_processed} vectors processed")
                vectors_to_upsert = []

        if vectors_to_upsert:
            embedding_length = len(vectors_to_upsert[0]['values'])
            print(f"Final batch: Index expects 768, Sent: {embedding_length}")
            
            if embedding_length != 768:
                raise ValueError(f"Dimension mismatch! Expected 768, got {embedding_length}")
            
            index.upsert(vectors=vectors_to_upsert)
            total_processed += len(vectors_to_upsert)
            print(f"{total_processed} total vectors processed")


    return {
            "message":"sucessfully embedded and uploaded to database",
             "note_id":unique_note_id
             }


@router.post("/chatbot")
def chat(data: ChatRequest):

    note_id, query, past_conversations = (
    data.unique_note_id,
    data.query,
    data.past_conversations)


    response = talk_to_note(note_id,query,past_conversations)
    
    return {
        "note_id":data.unique_note_id,
        "query":data.query,
        "response":response
    }