from PyPDF2 import PdfReader
import os
from fastapi import APIRouter, UploadFile
from fastapi.responses import JSONResponse
router = APIRouter()


def pdf_to_text(pdf_path: str) -> str:
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PdfReader(file)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

pdf_path = os.path.join(BASE_DIR,"test.pdf")
text = pdf_to_text(pdf_path)



print(text[:5000])
