import os
import sys
import logging
from datetime import datetime, timezone
from pymongo import MongoClient

# Add parent dir to path so imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.utils.security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")

def seed_database():
    admin_password = os.getenv("SEED_ADMIN_PASSWORD")
    demo_password = os.getenv("SEED_DEMO_PASSWORD")
    if not admin_password or not demo_password:
        raise RuntimeError("Set SEED_ADMIN_PASSWORD and SEED_DEMO_PASSWORD before seeding accounts")

    logger.info("Connecting to MongoDB...")
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.DATABASE_NAME]

    # 1. Seed Demo Accounts
    logger.info("Seeding Admin and Demo User accounts...")
    admin_pass = hash_password(admin_password)
    user_pass = hash_password(demo_password)

    admin_user = {
        "name": "System Administrator",
        "email": "admin@careerai.com",
        "password": admin_pass,
        "role": "ADMIN",
        "created_at": datetime.now(timezone.utc)
    }
    demo_user = {
        "name": "Alex Student",
        "email": "user@careerai.com",
        "password": user_pass,
        "role": "USER",
        "created_at": datetime.now(timezone.utc)
    }

    db.users.update_one({"email": admin_user["email"]}, {"$set": admin_user}, upsert=True)
    user_res = db.users.find_one_and_update({"email": demo_user["email"]}, {"$set": demo_user}, upsert=True, return_document=True)
    demo_user_id = str(user_res["_id"])

    # 2. Seed Profile
    logger.info("Seeding Demo User Profile...")
    profile_data = {
        "user_id": demo_user_id,
        "name": "Alex Student",
        "email": "user@careerai.com",
        "phone": "+91 9876543210",
        "location": "Bengaluru, India",
        "education": "B.Tech in Computer Science and Engineering",
        "degree": "B.Tech",
        "college": "National Institute of Technology",
        "graduation_year": 2026,
        "cgpa": 8.5,
        "technical_skills": ["C", "C++", "Java", "Python", "SQL", "Git", "FastAPI", "React", "MongoDB", "OOP", "DSA"],
        "soft_skills": ["Problem Solving", "Team Leadership", "Communication", "Time Management"],
        "certifications": ["AWS Certified Cloud Practitioner", "NPTEL Data Structures in C++"],
        "projects": [
            {"title": "CareerAI Platform", "tech": "FastAPI, React, MongoDB", "desc": "AI driven career intelligence platform."},
            {"title": "E-Commerce Microservice", "tech": "Python, Docker, Redis", "desc": "Scalable REST API with caching."}
        ],
        "experience": [
            {"role": "Software Engineering Intern", "company": "TechStart Inc", "duration": "3 months"}
        ],
        "preferred_career": "Software Developer",
        "preferred_job_type": "Full Time",
        "preferred_location": "Bengaluru / Remote"
    }
    db.profiles.update_one({"user_id": demo_user_id}, {"$set": profile_data}, upsert=True)

    # 3. Seed Careers
    logger.info("Seeding Careers...")
    careers_list = [
        {
            "title": "Software Developer",
            "description": "Designs, develops, tests, and maintains enterprise software applications.",
            "required_skills": ["Java", "Python", "SQL", "Git", "DSA", "OOP"],
            "preferred_skills": ["Docker", "REST API", "CI/CD", "Linux"],
            "recommended_education": "B.Tech/B.E in Computer Science or IT",
            "important_subjects": ["DSA", "OOP", "DBMS", "OS"],
            "difficulty": "Medium",
            "average_readiness_requirements": "Core language proficiency + 2 projects + LeetCode Medium DSA",
            "learning_resources": [{"name": "Java Developer Roadmap", "url": "https://roadmap.sh/java"}],
            "project_recommendations": ["Full Stack Management System", "REST API Service"]
        },
        {
            "title": "Python Developer",
            "description": "Specializes in building Python backends, web APIs, automation scripts, and data pipelines.",
            "required_skills": ["Python", "FastAPI", "MongoDB", "SQL", "Git", "REST API Design"],
            "preferred_skills": ["Docker", "Redis", "Pandas", "PyTest"],
            "recommended_education": "B.Tech CS/IT/ECE",
            "important_subjects": ["DBMS", "Computer Networks", "DSA"],
            "difficulty": "Medium",
            "average_readiness_requirements": "FastAPI + MongoDB async web development experience",
            "learning_resources": [{"name": "FastAPI Official Docs", "url": "https://fastapi.tiangolo.com"}],
            "project_recommendations": ["Async Chat Backend", "AI Resume Parser Service"]
        },
        {
            "title": "Frontend Developer",
            "description": "Constructs responsive, high-performance web applications using modern UI libraries.",
            "required_skills": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git"],
            "preferred_skills": ["TypeScript", "Next.js", "Redux", "Vite"],
            "recommended_education": "B.Tech / B.Sc / BCA",
            "important_subjects": ["Web Development", "UI/UX Basics", "Computer Networks"],
            "difficulty": "Easy",
            "average_readiness_requirements": "Proficiency in React Hooks, state management, and responsive CSS",
            "learning_resources": [{"name": "React Docs", "url": "https://react.dev"}],
            "project_recommendations": ["Interactive Analytics Dashboard", "E-commerce UI"]
        },
        {
            "title": "Full Stack Developer",
            "description": "Engineers both client-side interactive UIs and scalable server-side REST APIs.",
            "required_skills": ["JavaScript", "React", "Node.js", "FastAPI", "MongoDB", "SQL", "Git"],
            "preferred_skills": ["Docker", "AWS", "TypeScript", "Tailwind CSS"],
            "recommended_education": "B.Tech CS / IT",
            "important_subjects": ["DBMS", "Computer Networks", "OOP", "Web Engineering"],
            "difficulty": "Hard",
            "average_readiness_requirements": "End-to-end deployed web application with auth & database",
            "learning_resources": [{"name": "Full Stack Open", "url": "https://fullstackopen.com"}],
            "project_recommendations": ["Placement Management Platform", "Real-time SaaS App"]
        },
        {
            "title": "Data Analyst",
            "description": "Translates complex datasets into strategic insights using SQL, Python, and BI tools.",
            "required_skills": ["Python", "SQL", "Pandas", "NumPy", "Power BI", "Excel"],
            "preferred_skills": ["Tableau", "R", "Statistics"],
            "recommended_education": "B.Tech / B.Sc Stats/Math/CS",
            "important_subjects": ["Probability", "Statistics", "DBMS"],
            "difficulty": "Medium",
            "average_readiness_requirements": "SQL Joins, Aggregations, and Power BI interactive reports",
            "learning_resources": [{"name": "Kaggle Learn", "url": "https://kaggle.com/learn"}],
            "project_recommendations": ["Sales Performance Dashboard", "Customer Churn Analysis"]
        }
    ]
    for c in careers_list:
        db.careers.update_one({"title": c["title"]}, {"$set": c}, upsert=True)

    # 4. Seed Questions (100+ MCQs across Subjects)
    logger.info("Seeding MCQ Practice Questions...")
    questions_list = []
    
    # Quantitative Aptitude Questions
    quant_questions = [
        {"subject": "Quantitative Aptitude", "topic": "Percentages", "difficulty": "Easy", "question": "If 20% of a number is 50, what is 80% of that number?", "options": ["150", "200", "250", "300"], "correct_answer": 1, "explanation": "20% = 50 => 100% = 250. 80% of 250 = 200.", "marks": 1},
        {"subject": "Quantitative Aptitude", "topic": "Profit and Loss", "difficulty": "Medium", "question": "A trader buys an item for $800 and sells it for $1000. What is his profit percentage?", "options": ["20%", "25%", "30%", "15%"], "correct_answer": 1, "explanation": "Profit = $200. Profit % = (200 / 800) * 100 = 25%.", "marks": 1},
        {"subject": "Quantitative Aptitude", "topic": "Time and Work", "difficulty": "Medium", "question": "A can complete a work in 10 days, B in 15 days. Working together, how many days will they take?", "options": ["5 days", "6 days", "8 days", "7.5 days"], "correct_answer": 1, "explanation": "A's 1 day work = 1/10, B's = 1/15. Together = 1/10 + 1/15 = 5/30 = 1/6 => 6 days.", "marks": 1},
        {"subject": "Quantitative Aptitude", "topic": "Time Speed Distance", "difficulty": "Medium", "question": "A train running at 72 km/h crosses a pole in 10 seconds. What is the length of the train?", "options": ["150 m", "200 m", "250 m", "180 m"], "correct_answer": 1, "explanation": "72 km/h = 72 * (5/18) = 20 m/s. Length = Speed * Time = 20 * 10 = 200 m.", "marks": 1},
        {"subject": "Quantitative Aptitude", "topic": "Probability", "difficulty": "Hard", "question": "Two fair dice are thrown. What is the probability that the sum of numbers obtained is 8?", "options": ["5/36", "1/6", "7/36", "1/9"], "correct_answer": 0, "explanation": "Favorable outcomes for sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 cases. Total = 36. Prob = 5/36.", "marks": 1}
    ]
    questions_list.extend(quant_questions)

    # DBMS Questions
    dbms_questions = [
        {"subject": "DBMS", "topic": "SQL", "difficulty": "Easy", "question": "Which SQL statement is used to remove duplicate rows from query results?", "options": ["UNIQUE", "DISTINCT", "DIFFERENT", "REMOVE DUP"], "correct_answer": 1, "explanation": "SELECT DISTINCT removes duplicates from the result set.", "marks": 1},
        {"subject": "DBMS", "topic": "Normalization", "difficulty": "Medium", "question": "A table is in 3NF if it is in 2NF and has no _____ dependency.", "options": ["Partial", "Transitive", "Multi-valued", "Join"], "correct_answer": 1, "explanation": "3NF requires elimination of transitive functional dependencies.", "marks": 1},
        {"subject": "DBMS", "topic": "Joins", "difficulty": "Medium", "question": "Which JOIN returns all rows from the left table and matching rows from the right table?", "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], "correct_answer": 1, "explanation": "LEFT JOIN returns all left table rows regardless of right table matches.", "marks": 1},
        {"subject": "DBMS", "topic": "Transactions", "difficulty": "Hard", "question": "In ACID properties, which property ensures that once a transaction commits, it remains committed even during system failure?", "options": ["Atomicity", "Consistency", "Isolation", "Durability"], "correct_answer": 3, "explanation": "Durability guarantees committed data persists across crashes.", "marks": 1}
    ]
    questions_list.extend(dbms_questions)

    # Programming & DSA Questions
    prog_questions = [
        {"subject": "Java", "topic": "OOP", "difficulty": "Easy", "question": "Which keyword is used in Java to inherit a class?", "options": ["implements", "extends", "inherits", "super"], "correct_answer": 1, "explanation": "Java uses 'extends' for class inheritance and 'implements' for interfaces.", "marks": 1},
        {"subject": "Data Structures", "topic": "Arrays", "difficulty": "Easy", "question": "What is the time complexity to access an element in an array by index?", "options": ["O(1)", "O(N)", "O(log N)", "O(N^2)"], "correct_answer": 0, "explanation": "Array indexing calculates direct memory address in constant O(1) time.", "marks": 1},
        {"subject": "Data Structures", "topic": "Stack", "difficulty": "Easy", "question": "Which data structure follows the LIFO (Last In First Out) principle?", "options": ["Queue", "Stack", "Tree", "Graph"], "correct_answer": 1, "explanation": "Stack operates on LIFO (push and pop at top).", "marks": 1},
        {"subject": "Data Structures", "topic": "Sorting", "difficulty": "Medium", "question": "What is the average time complexity of Quick Sort?", "options": ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"], "correct_answer": 1, "explanation": "Quick Sort has average O(N log N) time complexity.", "marks": 1}
    ]
    questions_list.extend(prog_questions)

    # Generate additional sample MCQs to reach 100+ total
    subjects_pool = [
        ("Quantitative Aptitude", ["Percentages", "Ratios", "Averages", "Number System"]),
        ("Logical Reasoning", ["Series", "Coding-Decoding", "Blood Relations", "Syllogism"]),
        ("Verbal Ability", ["Grammar", "Vocabulary", "Reading Comprehension", "Synonyms"]),
        ("Python", ["Syntax", "Data Types", "Functions", "OOP"]),
        ("Operating Systems", ["Processes", "Threads", "Memory Management", "Paging"]),
        ("Computer Networks", ["OSI Model", "TCP/IP", "HTTP", "IP Addressing"])
    ]

    count = len(questions_list)
    for subj, topics in subjects_pool:
        for top in topics:
            for diff in ["Easy", "Medium", "Hard"]:
                count += 1
                questions_list.append({
                    "subject": subj,
                    "topic": top,
                    "difficulty": diff,
                    "question": f"Sample Practice Question #{count} on {subj} - {top} ({diff})?",
                    "options": [
                        f"Option A for {top}",
                        f"Option B (Correct Answer)",
                        f"Option C for {top}",
                        f"Option D for {top}"
                    ],
                    "correct_answer": 1,
                    "explanation": f"Detailed step-by-step concept explanation for question #{count} on {subj}.",
                    "marks": 1
                })

    db.questions.delete_many({})
    db.questions.insert_many(questions_list)

    # 5. Seed Mock Tests
    logger.info("Seeding Mock Tests...")
    mock_tests = [
        {
            "title": "Comprehensive Placement Mock Test - Set 1",
            "duration_minutes": 60,
            "total_questions": 50,
            "negative_marking": 0.25,
            "sections": [
                {"name": "Quantitative Aptitude", "count": 15},
                {"name": "Logical Reasoning", "count": 10},
                {"name": "Verbal Ability", "count": 10},
                {"name": "Programming & DSA", "count": 10},
                {"name": "DBMS & OS", "count": 5}
            ]
        },
        {
            "title": "Core Computer Science Placement Test",
            "duration_minutes": 45,
            "total_questions": 30,
            "negative_marking": 0.25,
            "sections": [
                {"name": "Programming & DSA", "count": 10},
                {"name": "DBMS", "count": 10},
                {"name": "Operating Systems & Networks", "count": 10}
            ]
        }
    ]
    for mt in mock_tests:
        db.mock_tests.update_one({"title": mt["title"]}, {"$set": mt}, upsert=True)

    # 6. Seed Sample Jobs
    logger.info("Seeding Sample Jobs...")
    jobs = [
        {
            "title": "Graduate Software Engineer 2026",
            "company": "TechCorp Solutions",
            "location": "Bengaluru / Hyderabad (Hybrid)",
            "job_type": "Full-time",
            "experience": "0-1 years",
            "required_skills": ["Java", "Python", "SQL", "OOP", "Git"],
            "preferred_skills": ["FastAPI", "Docker"],
            "description": "Building next-generation microservices and web APIs for enterprise cloud clients.",
            "responsibilities": ["Develop clean backend APIs", "Participate in code reviews", "Write unit tests"],
            "eligibility": "B.Tech/B.E 2025/2026 graduates with 60%+ throughout",
            "application_url": "https://example.com/jobs/1",
            "posted_date": "2 days ago"
        },
        {
            "title": "Junior Python & Backend Developer",
            "company": "InnovateAI Labs",
            "location": "Remote (India)",
            "job_type": "Full-time",
            "experience": "0-2 years",
            "required_skills": ["Python", "FastAPI", "MongoDB", "REST API Design", "Git"],
            "preferred_skills": ["Docker", "Redis"],
            "description": "Design and implement scalable Python FastAPI services connected to MongoDB.",
            "responsibilities": ["Build REST endpoints", "Optimize database queries", "Integrate AI services"],
            "eligibility": "B.Tech CS/IT with strong Python fundamentals",
            "application_url": "https://example.com/jobs/2",
            "posted_date": "1 day ago"
        },
        {
            "title": "Frontend React Developer Intern",
            "company": "NextGen Web Systems",
            "location": "Pune / Remote",
            "job_type": "Internship to Full-time",
            "experience": "Fresher",
            "required_skills": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
            "preferred_skills": ["Vite", "Redux"],
            "description": "Construct intuitive user interfaces and dashboards using React and Tailwind CSS.",
            "responsibilities": ["Translate Figma designs to React", "Ensure responsive mobile UI"],
            "eligibility": "Passionate frontend developer graduating 2025-2026",
            "application_url": "https://example.com/jobs/3",
            "posted_date": "3 days ago"
        }
    ]
    for j in jobs:
        db.jobs.update_one({"title": j["title"]}, {"$set": j}, upsert=True)

    logger.info("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
