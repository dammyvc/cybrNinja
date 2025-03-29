from app import create_app
from app.models import mongo, DIFFICULTY_BY_RANK
from openai import OpenAI
from utils.logger import get_logger
import json
import time

app_logger = get_logger()

def pre_generate_questions(openai_client, target_questions=200, batch_size_per_difficulty=5):
    difficulties = ["easy", "medium", "hard"]
    questions_by_difficulty = {d: [] for d in difficulties}
    max_attempts_per_batch = 3
    
    while any(len(questions_by_difficulty[d]) < target_questions for d in difficulties):
        num_questions = batch_size_per_difficulty * len(difficulties)  # 5 * 3 = 15
        prompt = f"""
        Generate exactly {num_questions} realistic and unique phishing-related quiz questions:
        - {batch_size_per_difficulty} 'easy' (obvious clues, straightforward),
        - {batch_size_per_difficulty} 'medium' (subtle red flags, multi-step reasoning),
        - {batch_size_per_difficulty} 'hard' (complex, requires advanced phishing knowledge).
        Use diverse tactics (e.g., email spoofing, smishing, vishing, malicious attachments, fake login pages, social engineering)
        and scenarios (e.g., workplace, shopping, banking, social media, tech support).
        Return a JSON array of {num_questions} objects, e.g.:
        [
            {{"text": "Question text", "options": [{{"text": "Option 1", "is_correct": false, "feedback": "Feedback"}}, ...], "difficulty": "easy", "hint": "Hint"}},
            ...
        ]
        Each object must have:
        - "text": question string,
        - "options": 3 objects with "text" (string), "is_correct" (boolean), "feedback" (string),
        - "difficulty": "easy", "medium", or "hard",
        - "hint": helpful string.
        Ensure exactly {batch_size_per_difficulty} questions per difficulty, all unique.
        Return ONLY the array—no wrapping object like {{"text": [...]}} or {{"questions": [...]}}, no extra fields.
        Start with '[' and end with ']'.
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
                
                # Handle various response formats
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
                
                if len(questions_data) != num_questions:
                    app_logger.warning(f"Expected {num_questions} questions, got {len(questions_data)}")
                
                # Filter valid questions
                valid_questions = [
                    q for q in questions_data 
                    if isinstance(q, dict) and 
                        "text" in q and 
                        "options" in q and len(q["options"]) == 3 and 
                        "difficulty" in q and q["difficulty"] in difficulties and 
                        "hint" in q
                ]
                if len(valid_questions) < len(questions_data):
                    app_logger.error(f"Filtered out {len(questions_data) - len(valid_questions)} invalid questions")
                
                if valid_questions:
                    # Check difficulty distribution
                    difficulty_counts = {"easy": 0, "medium": 0, "hard": 0}
                    for q in valid_questions:
                        difficulty_counts[q["difficulty"]] += 1
                    if any(difficulty_counts[d] != batch_size_per_difficulty for d in difficulties):
                        app_logger.warning(f"Uneven difficulty distribution: {difficulty_counts}")
                    break  # Success
            
            except json.JSONDecodeError as e:
                app_logger.error(f"JSON decode error (attempt {attempt + 1}): {str(e)}")
            except Exception as e:
                app_logger.error(f"Error in batch (attempt {attempt + 1}): {str(e)}")
            
            if attempt < max_attempts_per_batch - 1:
                time.sleep(1)
        
        if valid_questions:
            # Group and store
            for q in valid_questions:
                difficulty = q["difficulty"]
                if len(questions_by_difficulty[difficulty]) < target_questions:
                    questions_by_difficulty[difficulty].append(q)
            
            progress = {d: len(questions_by_difficulty[d]) for d in difficulties}
            app_logger.debug(f"Collected: {progress}")
            
            for difficulty in difficulties:
                for question_data in questions_by_difficulty[difficulty]:
                    if "question_id" not in question_data:
                        question_id = f"q{mongo.db.questions.count_documents({}) + 1}"
                        question_data["question_id"] = question_id
                        mongo.db.questions.insert_one(question_data)
                questions_by_difficulty[difficulty] = [q for q in questions_by_difficulty[difficulty] if "question_id" in q]
        else:
            app_logger.warning(f"No valid questions after {max_attempts_per_batch} attempts")
    
    for difficulty in difficulties:
        app_logger.info(f"Generated and stored {len(questions_by_difficulty[difficulty])} {difficulty} questions")

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