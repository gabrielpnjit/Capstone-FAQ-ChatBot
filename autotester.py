import pandas as pd
import requests

def send_question(question):
    """Send a question to the API and return the answer."""
    url = 'http://127.0.0.1:8000/rag-pinecone/invoke'
    headers = {'Content-Type': 'application/json'}
    payload = {'input': question}
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        response_data = response.json()
        return response_data.get("output", {}).get("answer", "No answer provided")
    else:
        return "API call failed with status code " + str(response.status_code)

def process_excel(file_path, column_name='Question To Ask', answer_column_name='Answer'):
    """Process an Excel file to update it with answers from an API based on questions in a specified column."""
    # Load the Excel file
    data = pd.read_excel(file_path)
    
    # Check if the column exists in the Excel file
    if column_name not in data.columns:
        raise ValueError(f"Column {column_name} not found in the Excel file")
    
    # Ensure there is a column for the answers, explicitly set it to hold object data type
    if answer_column_name not in data.columns:
        data[answer_column_name] = pd.Series(dtype='object')
    else:
        # Convert existing column to object type to ensure compatibility
        data[answer_column_name] = data[answer_column_name].astype('object')

    # Iterate over the rows in the DataFrame
    for index, row in data.iterrows():
        question = row[column_name]
        answer = send_question(question)  # Get the answer from the API
        data.at[index, answer_column_name] = answer  # Update the answer in the DataFrame
    
    # Save the updated DataFrame back to the Excel file
    data.to_excel(file_path, index=False)

# Example usage
if __name__ == "__main__":
    file_path = 'Automatic Tester Questions.xlsx'  # Update this with the actual path to your Excel file
    process_excel(file_path)
