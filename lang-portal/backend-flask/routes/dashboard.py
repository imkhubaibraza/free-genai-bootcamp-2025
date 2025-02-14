from flask import jsonify
from flask_cors import cross_origin
from datetime import datetime, timedelta

def load(app):
    @app.route('/dashboard/recent-session', methods=['GET'])
    @cross_origin()
    def get_recent_session():
        try:
            cursor = app.db.cursor()
            
            # Get most recent study session with related data
            cursor.execute('''
                SELECT 
                    ss.id,
                    g.name as group_name,
                    sa.name as activity_name,
                    ss.created_at as start_time,
                    COUNT(wri.id) as review_items_count
                FROM study_sessions ss
                JOIN groups g ON g.id = ss.group_id
                JOIN study_activities sa ON sa.id = ss.study_activity_id
                LEFT JOIN word_review_items wri ON wri.study_session_id = ss.id
                GROUP BY ss.id
                ORDER BY ss.created_at DESC
                LIMIT 1
            ''')
            
            session = cursor.fetchone()
            
            if not session:
                return jsonify({
                    'session': None
                })
            
            return jsonify({
                'session': {
                    'id': session['id'],
                    'group_name': session['group_name'],
                    'activity_name': session['activity_name'],
                    'start_time': session['start_time'],
                    'review_items_count': session['review_items_count']
                }
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/dashboard/stats', methods=['GET'])
    @cross_origin()
    def get_study_stats():
        try:
            cursor = app.db.cursor()
            
            # Get total vocabulary count
            cursor.execute('SELECT COUNT(*) as total_vocabulary FROM words')
            total_vocabulary = cursor.fetchone()["total_vocabulary"]

            # Get total unique words studied
            cursor.execute('''
                SELECT COUNT(DISTINCT word_id) as total_words
                FROM word_review_items wri
                JOIN study_sessions ss ON wri.study_session_id = ss.id
            ''')
            total_words = cursor.fetchone()["total_words"]
            
            # Get mastered words (words with >80% success rate and at least 5 attempts)
            cursor.execute('''
                WITH word_stats AS (
                    SELECT 
                        word_id,
                        COUNT(*) as total_attempts,
                        SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) as success_rate
                    FROM word_review_items wri
                    JOIN study_sessions ss ON wri.study_session_id = ss.id
                    GROUP BY word_id
                    HAVING total_attempts >= 5
                )
                SELECT COUNT(*) as mastered_words
                FROM word_stats
                WHERE success_rate >= 0.8
            ''')
            mastered_words = cursor.fetchone()["mastered_words"]
            
            # Get overall success rate
            cursor.execute('''
                SELECT 
                    SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) as success_rate
                FROM word_review_items wri
                JOIN study_sessions ss ON wri.study_session_id = ss.id
            ''')
            success_rate = cursor.fetchone()["success_rate"] or 0
            
            # Get total number of study sessions
            cursor.execute('SELECT COUNT(*) as total_sessions FROM study_sessions')
            total_sessions = cursor.fetchone()["total_sessions"]
            
            # Get number of groups with activity in the last 30 days
            cursor.execute('''
                SELECT COUNT(DISTINCT group_id) as active_groups
                FROM study_sessions
                WHERE created_at >= date('now', '-30 days')
            ''')
            active_groups = cursor.fetchone()["active_groups"]
            
            # Calculate current streak (consecutive days with at least one study session)
            cursor.execute('''
                WITH daily_sessions AS (
                    SELECT 
                        date(created_at) as study_date,
                        COUNT(*) as session_count
                    FROM study_sessions
                    GROUP BY date(created_at)
                ),
                streak_calc AS (
                    SELECT 
                        study_date,
                        julianday(study_date) - julianday(lag(study_date, 1) over (order by study_date)) as days_diff
                    FROM daily_sessions
                )
                SELECT COUNT(*) as streak
                FROM (
                    SELECT study_date
                    FROM streak_calc
                    WHERE days_diff = 1 OR days_diff IS NULL
                    ORDER BY study_date DESC
                )
            ''')
            current_streak = cursor.fetchone()["streak"]
            
            return jsonify({
                "total_vocabulary": total_vocabulary,
                "total_words_studied": total_words,
                "mastered_words": mastered_words,
                "success_rate": success_rate,
                "total_sessions": total_sessions,
                "active_groups": active_groups,
                "current_streak": current_streak
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
