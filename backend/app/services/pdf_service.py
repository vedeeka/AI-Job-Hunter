from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

def create_pdf_bytes(template_name: str, data: dict):
    try:
        env = Environment(loader=FileSystemLoader('backend/app/templates'))
        template = env.get_template(template_name)
        rendered_html = template.render(data)
        return HTML(string=rendered_html).write_pdf()
    except Exception as e:
        print(f"PDF Error: {e}")
        raise e