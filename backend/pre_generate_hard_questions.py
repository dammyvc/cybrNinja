from app import create_app
from app.models import mongo
from openai import OpenAI
from utils.logger import get_logger
import json
import time

app_logger = get_logger()

def pre_generate_questions(openai_client, difficulty="hard", target_questions=5, batch_size=1):
    questions_collected = []
    max_attempts_per_batch = 3
    
    while len(questions_collected) < target_questions:
        prompt = f"""
        Generate exactly {batch_size} unique '{difficulty}' phishing-related quiz questions.
        '{difficulty}' means complex scenarios and advanced tactics (e.g., encrypted emails, subtle spoofing, urgent financial requests).
        Use varied tactics (e.g., spoofing, smishing, vishing, attachments, fake logins, social engineering)
        and scenarios (e.g., work, shopping, banking, social media, tech support).
        Return a JSON array of {batch_size} objects, like:
        [
            {{"text": "Encrypted email from CEO asks for reports. What do you do?", "options": [{{"text": "Send reports", "is_correct": false, "feedback": "Verify unexpected requests."}}, {{"text": "Call CEO", "is_correct": true, "feedback": "Use a separate channel."}}, {{"text": "Wait", "is_correct": false, "feedback": "Delaying risks missing verification."}}], "difficulty": "{difficulty}", "hint": "Verify via known channels."}},
            ...
        ]
        Each object needs:
        - "text": short question,
        - "options": exactly 3 objects with "text", "is_correct" (boolean), "feedback",
        - "difficulty": "{difficulty}",
        - "hint": short hint.
        Return ONLY the array—start with '[' and end with ']'. No wrapping (e.g., {{"questions": [...]}}).
        """
        
        valid_questions = []
        for attempt in range(max_attempts_per_batch):
            try:
                response = openai_client.chat.completions.create(
                    model="gpt-4-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"}
                )
                questions_data = json.loads(response.choices[0].message.content)
                
                # Handle response formats
                if isinstance(questions_data, dict):
                    if "text" in questions_data and isinstance(questions_data["text"], list):
                        questions_data = questions_data["text"]
                        app_logger.warning(f"Extracted list from 'text' key")
                    elif all(k in questions_data for k in ["text", "options", "difficulty", "hint"]):
                        questions_data = [questions_data]
                        app_logger.warning(f"Wrapped single question dict in list")
                    else:
                        app_logger.error(f"Unexpected dict format: {questions_data}")
                        continue
                
                # Validate as list
                if not isinstance(questions_data, list):
                    app_logger.error(f"Expected list, got {type(questions_data)}: {questions_data}")
                    continue
                
                if len(questions_data) != batch_size:
                    app_logger.warning(f"Expected {batch_size} questions, got {len(questions_data)}")
                    continue
                
                # Filter valid questions
                valid_questions = [
                    q for q in questions_data 
                    if isinstance(q, dict) and 
                        "text" in q and 
                        "options" in q and len(q["options"]) == 3 and 
                        "difficulty" in q and q["difficulty"] == difficulty and 
                        "hint" in q
                ]
                if len(valid_questions) < len(questions_data):
                    app_logger.error(f"Filtered out {len(questions_data) - len(valid_questions)} invalid questions")
                    continue
                
                break  # Success
            
            except json.JSONDecodeError as e:
                app_logger.error(f"JSON decode error (attempt {attempt + 1}): {str(e)}")
            except Exception as e:
                app_logger.error(f"Error in batch (attempt {attempt + 1}): {str(e)}")
            
            if attempt < max_attempts_per_batch - 1:
                time.sleep(1)
        
        if valid_questions:
            for q in valid_questions:
                if len(questions_collected) < target_questions:
                    questions_collected.append(q)
            
            app_logger.debug(f"Collected: {len(questions_collected)} {difficulty} questions")
            
            for question_data in questions_collected:
                if "question_id" not in question_data:
                    question_id = f"q{mongo.db.questions.count_documents({}) + 1}"
                    question_data["question_id"] = question_id
                    mongo.db.questions.insert_one(question_data)
            questions_collected = [q for q in questions_collected if "question_id" in q]
        else:
            app_logger.warning(f"No valid questions after {max_attempts_per_batch} attempts")
    
    app_logger.info(f"Generated and stored {len(questions_collected)} {difficulty} questions")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        api_key = app.config.get("OPENAI_API_KEY")
        if not api_key:
            app_logger.error("OPENAI_API_KEY is not set")
            raise ValueError("OPENAI_API_KEY is missing")
        openai_client = OpenAI(api_key=api_key)
        app_logger.debug("OpenAI client initialized in script")
        
        pre_generate_questions(openai_client)