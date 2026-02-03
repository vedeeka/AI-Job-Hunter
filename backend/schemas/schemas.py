from pydantic import BaseModel

class ResumeRequest(BaseModel):
    template_name: str
    user_description: str