import requests
import json
from groq import Groq
from config import OPEN_ROUTER_KEY,GROQ_API_KEY

class ChatModel:
    def __init__(self,model_name:str | None = "openai/gpt-oss-20b:free",OPENROUTER_API_KEY:str | None=None):
        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.model_name = model_name
        self.OPENROUTER_API_KEY = OPENROUTER_API_KEY
    
    def invoke(self, prompt: str | None = None, messages: list | None = [],k_chunks: list | None = None):

        messages.append(
                    {
                    "role": "user",
                    "content": prompt
                    })
        if k_chunks:
            context = "\n\n".join([f"chunk index:{chunk['metadata']['chunk_index']} \n chunk data:\n{chunk['metadata']['text']}" for chunk in k_chunks])
            messages.insert(0, {
                            "role": "system",
                            "content": f"Use the following context to answer the user's question:\n\n{context}"
                        })
            
        payload = {
                "model": self.model_name,
                "messages": messages,
                "reasoning": {"enabled": True}
            }

        response = requests.post(
            url=self.url,
            headers={
                "Authorization": f"Bearer {self.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps(payload)
            )
        
        if response.status_code != 200:
            raise RuntimeError(f"OpenRouter error {response.status_code}: {response.text}")

        data = response.json()
        return data["choices"][0]["message"]["content"]
    
    def info(self):
        return {
            "model_name":self.model_name,
            "accessed_using":self.url
        }

class ChatModel2:
    def __init__(self, model_name: str = "openai/gpt-oss-20b", api_key: str = GROQ_API_KEY):
        self.model_name = model_name
        self.client = Groq()
        self.client.api_key = api_key

    def invoke(self, prompt: str = "", messages: list = None, k_chunks: list = None):
        messages = messages or []
        messages.append({"role": "user", "content": prompt})

        if k_chunks:
            context = "\n\n".join(
                f"chunk index:{c['metadata']['chunk_index']}\nchunk data:\n{c['metadata']['text']}" 
                for c in k_chunks
            )
            messages.insert(0, {"role": "system", "content": f"Use the following context to answer the user's question:\n\n{context}"})

        completion = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=1,
            max_completion_tokens=8192,
            top_p=1,
            reasoning_effort="medium",
            stream=False,
            stop=None
        )


        return completion.choices[0].message.content

    def info(self):
        return {"model_name": self.model_name, "accessed_using": "Groq API"}




# GPT_OSS_20b = ChatModel(model_name="openai/gpt-oss-20b:free",OPENROUTER_API_KEY=OPEN_ROUTER_KEY)
GPT_OSS_20b = ChatModel2()
GEMINI_FLASH = ChatModel(model_name="google/gemini-2.0-flash-exp:free",OPENROUTER_API_KEY=OPEN_ROUTER_KEY)