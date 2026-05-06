import os
import json
from PyPDF2 import PdfReader

def extract_pdf_content(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = "".join(page.extract_text() for page in reader.pages)
        return text
    except Exception as e:
        return f"Error reading {pdf_path}: {str(e)}"

def process_pdfs_in_folder(folder_path):
    result = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, file_name)
            content = extract_pdf_content(pdf_path)
            result.append({"file": file_name, "content": content})
    return result

if __name__ == "__main__":
    folder_path = "/Users/user/Documents/AplikasiPembelajaranASD/SlidePerkuliahan"
    output_path = "/Users/user/Documents/AplikasiPembelajaranASD/backend/pdf_contents.json"

    extracted_data = process_pdfs_in_folder(folder_path)

    with open(output_path, "w") as output_file:
        json.dump(extracted_data, output_file, indent=4)

    print(f"Extraction complete. Data saved to {output_path}")