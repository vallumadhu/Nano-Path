from langchain_text_splitters  import RecursiveCharacterTextSplitter
device = "cpu"

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)