import uuid
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter,Form
from services.splitter import splitter
from models.embedding_models import embedding_model
from db.pinecone import index
from services.chat import talk_to_note

class ChatRequest(BaseModel):
    unique_note_id:str
    query: str
    past_conversations: List[dict[str, str]]

class NoteRequest(BaseModel):
    note: str

router = APIRouter()

@router.post("/embednote")
def embednote(request: NoteRequest):
    note = request.note
    chunks = splitter.split_text(note)
    embeddings = embedding_model.embed(chunks)
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
                
                if embedding_length != 384:
                    raise ValueError(f"Dimension mismatch! Expected 384, got {embedding_length}")
                
                index.upsert(vectors=vectors_to_upsert)
                vectors_to_upsert = []

        if vectors_to_upsert:
            embedding_length = len(vectors_to_upsert[0]['values'])
            
            if embedding_length != 384:
                raise ValueError(f"Dimension mismatch! Expected 384, got {embedding_length}")
            
            index.upsert(vectors=vectors_to_upsert)


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