from app import create_app
from app.models import update_leaderboard_positions
import schedule
import time
import threading

app = create_app()

def run_scheduler():
    
    schedule.every().day.at("00:00").do(update_leaderboard_positions)

    while True:
        schedule.run_pending()
        time.sleep(60)  

if __name__ == "__main__":
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))