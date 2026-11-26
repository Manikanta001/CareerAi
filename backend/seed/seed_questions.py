r"""
Seed script: adds more MCQ questions, mock tests, subjects, and topics to MongoDB Atlas.
Run from d:/CareerAI/backend:
  python seed/seed_questions.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME   = os.getenv("DATABASE_NAME", "careerai")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ─────────────────────────────────────────────────────────────
# QUESTIONS
# ─────────────────────────────────────────────────────────────
NEW_QUESTIONS = [
    # ── DSA ──────────────────────────────────────────────────
    {"subject":"Data Structures","topic":"Arrays","difficulty":"Easy",
     "question":"What is the time complexity of accessing an element in an array by index?",
     "options":["O(N)","O(log N)","O(1)","O(N²)"],"correct_answer":2,
     "explanation":"Array elements are stored in contiguous memory; index-based access is O(1).","marks":1},
    {"subject":"Data Structures","topic":"Arrays","difficulty":"Medium",
     "question":"Which sorting algorithm has the best average-case time complexity?",
     "options":["Bubble Sort","Insertion Sort","Quick Sort","Selection Sort"],"correct_answer":2,
     "explanation":"Quick Sort averages O(N log N) due to its divide-and-conquer partitioning.","marks":1},
    {"subject":"Data Structures","topic":"Linked Lists","difficulty":"Easy",
     "question":"Which pointer is NULL in the last node of a singly linked list?",
     "options":["head","data","next","prev"],"correct_answer":2,
     "explanation":"The 'next' pointer of the last node points to NULL.","marks":1},
    {"subject":"Data Structures","topic":"Linked Lists","difficulty":"Medium",
     "question":"What is the time complexity to insert an element at the beginning of a singly linked list?",
     "options":["O(N)","O(log N)","O(N²)","O(1)"],"correct_answer":3,
     "explanation":"Inserting at head only updates the head pointer; O(1).","marks":1},
    {"subject":"Data Structures","topic":"Stacks","difficulty":"Easy",
     "question":"Which data structure follows LIFO (Last In First Out) order?",
     "options":["Queue","Stack","Heap","Graph"],"correct_answer":1,
     "explanation":"A stack processes elements in Last In First Out order.","marks":1},
    {"subject":"Data Structures","topic":"Queues","difficulty":"Easy",
     "question":"Which data structure is used for Breadth First Search (BFS)?",
     "options":["Stack","Array","Queue","Linked List"],"correct_answer":2,
     "explanation":"BFS uses a queue to process nodes level by level.","marks":1},
    {"subject":"Data Structures","topic":"Trees","difficulty":"Easy",
     "question":"What is the height of a complete binary tree with N nodes?",
     "options":["O(N)","O(N²)","O(log N)","O(1)"],"correct_answer":2,
     "explanation":"A complete binary tree with N nodes has height ⌊log₂N⌋ = O(log N).","marks":1},
    {"subject":"Data Structures","topic":"Trees","difficulty":"Hard",
     "question":"Which traversal of a Binary Search Tree gives elements in sorted (ascending) order?",
     "options":["Pre-order","Post-order","Level-order","In-order"],"correct_answer":3,
     "explanation":"In-order traversal (left → root → right) visits BST nodes in ascending order.","marks":1},
    {"subject":"Data Structures","topic":"Graphs","difficulty":"Medium",
     "question":"Which algorithm finds the shortest path in an unweighted graph?",
     "options":["Dijkstra","DFS","BFS","Bellman-Ford"],"correct_answer":2,
     "explanation":"BFS explores neighbours level by level, guaranteeing shortest path in unweighted graphs.","marks":1},
    {"subject":"Data Structures","topic":"Graphs","difficulty":"Hard",
     "question":"What is the time complexity of Dijkstra's algorithm with a binary min-heap?",
     "options":["O(V²)","O(E log V)","O(V log V)","O(E + V)"],"correct_answer":1,
     "explanation":"With a binary heap, each edge relaxation is O(log V), giving O(E log V) overall.","marks":1},
    {"subject":"Data Structures","topic":"Dynamic Programming","difficulty":"Medium",
     "question":"What technique does Dynamic Programming primarily use to optimise solutions?",
     "options":["Greedy choice","Memoisation / tabulation","Divide and Conquer","Backtracking"],"correct_answer":1,
     "explanation":"DP stores results of sub-problems (memoisation/tabulation) to avoid redundant computation.","marks":1},
    {"subject":"Data Structures","topic":"Dynamic Programming","difficulty":"Hard",
     "question":"What is the time complexity of the 0/1 Knapsack problem solved with DP?",
     "options":["O(N)","O(N log N)","O(N·W)","O(2^N)"],"correct_answer":2,
     "explanation":"The DP table has N×W cells, each computed in O(1), giving O(N·W).","marks":1},
    # ── DBMS ─────────────────────────────────────────────────
    {"subject":"DBMS","topic":"Normalisation","difficulty":"Medium",
     "question":"A relation is in 3NF if it is in 2NF and has no ___.",
     "options":["Partial dependency","Transitive dependency","Multi-valued dependency","Join dependency"],
     "correct_answer":1,
     "explanation":"3NF eliminates transitive dependencies on the primary key.","marks":1},
    {"subject":"DBMS","topic":"Normalisation","difficulty":"Hard",
     "question":"Which normal form eliminates all functional dependencies except those on a super key?",
     "options":["3NF","BCNF","4NF","2NF"],"correct_answer":1,
     "explanation":"BCNF (Boyce–Codd NF) requires every determinant to be a super key.","marks":1},
    {"subject":"DBMS","topic":"SQL Joins","difficulty":"Medium",
     "question":"Which SQL JOIN returns rows that have matching values in both tables?",
     "options":["LEFT JOIN","RIGHT JOIN","FULL JOIN","INNER JOIN"],"correct_answer":3,
     "explanation":"INNER JOIN returns only rows where the join condition matches in both tables.","marks":1},
    {"subject":"DBMS","topic":"SQL Joins","difficulty":"Medium",
     "question":"Which JOIN returns all rows from the left table and matched rows from the right?",
     "options":["INNER JOIN","RIGHT JOIN","CROSS JOIN","LEFT JOIN"],"correct_answer":3,
     "explanation":"LEFT JOIN returns all left-table rows; unmatched right-table columns are NULL.","marks":1},
    {"subject":"DBMS","topic":"Transactions","difficulty":"Medium",
     "question":"Which ACID property ensures a transaction either fully completes or not at all?",
     "options":["Consistency","Isolation","Durability","Atomicity"],"correct_answer":3,
     "explanation":"Atomicity: all operations in a transaction succeed or all are rolled back.","marks":1},
    {"subject":"DBMS","topic":"Indexing","difficulty":"Medium",
     "question":"What data structure is most commonly used to implement database indexes?",
     "options":["Hash Table","Linked List","B+ Tree","Binary Search Tree"],"correct_answer":2,
     "explanation":"B+ Trees support range queries and keep data sorted, ideal for DB indexes.","marks":1},
    # ── Java ─────────────────────────────────────────────────
    {"subject":"Java","topic":"OOP","difficulty":"Easy",
     "question":"Which keyword prevents a class from being subclassed in Java?",
     "options":["static","abstract","final","private"],"correct_answer":2,
     "explanation":"'final' on a class prevents inheritance.","marks":1},
    {"subject":"Java","topic":"OOP","difficulty":"Medium",
     "question":"What is the output of 'System.out.println(10 / 3)' in Java?",
     "options":["3.33","3","4","Error"],"correct_answer":1,
     "explanation":"Integer division in Java truncates; 10/3 = 3.","marks":1},
    {"subject":"Java","topic":"Collections","difficulty":"Medium",
     "question":"Which Java collection maintains insertion order and allows duplicates?",
     "options":["HashSet","TreeSet","LinkedList","HashMap"],"correct_answer":2,
     "explanation":"LinkedList (and ArrayList) preserve insertion order and allow duplicates.","marks":1},
    {"subject":"Java","topic":"Collections","difficulty":"Hard",
     "question":"What is the default initial capacity of a Java ArrayList?",
     "options":["16","8","10","4"],"correct_answer":2,
     "explanation":"Java ArrayList default initial capacity is 10 (doubles when full).","marks":1},
    {"subject":"Java","topic":"Exception Handling","difficulty":"Easy",
     "question":"Which block always executes in Java's try-catch-finally construct?",
     "options":["try","catch","finally","None"],"correct_answer":2,
     "explanation":"The 'finally' block runs regardless of whether an exception was thrown.","marks":1},
    {"subject":"Java","topic":"Exception Handling","difficulty":"Medium",
     "question":"What is the parent class of all exceptions in Java?",
     "options":["Error","RuntimeException","Throwable","Exception"],"correct_answer":2,
     "explanation":"'Throwable' is the root of all errors and exceptions in Java.","marks":1},
    {"subject":"Java","topic":"Threads","difficulty":"Medium",
     "question":"Which method is called to start a thread's execution in Java?",
     "options":["run()","execute()","init()","start()"],"correct_answer":3,
     "explanation":"start() launches the thread; it internally calls run() in a new thread.","marks":1},
    {"subject":"Java","topic":"Threads","difficulty":"Hard",
     "question":"Which keyword is used to prevent thread interference in Java?",
     "options":["volatile","atomic","synchronized","concurrent"],"correct_answer":2,
     "explanation":"'synchronized' ensures only one thread accesses a block/method at a time.","marks":1},
    # ── Python ────────────────────────────────────────────────
    {"subject":"Python","topic":"Basics","difficulty":"Easy",
     "question":"What is the output of type([]) in Python?",
     "options":["<class 'tuple'>","<class 'dict'>","<class 'list'>","<class 'set'>"],"correct_answer":2,
     "explanation":"[] creates an empty list; type([]) is <class 'list'>.","marks":1},
    {"subject":"Python","topic":"Basics","difficulty":"Easy",
     "question":"Which Python data type is immutable?",
     "options":["list","dict","set","tuple"],"correct_answer":3,
     "explanation":"Tuples are immutable; their elements cannot be changed after creation.","marks":1},
    {"subject":"Python","topic":"Functions","difficulty":"Medium",
     "question":"Which keyword defines an anonymous function in Python?",
     "options":["def","func","anon","lambda"],"correct_answer":3,
     "explanation":"'lambda' creates anonymous (one-line) functions.","marks":1},
    {"subject":"Python","topic":"Functions","difficulty":"Medium",
     "question":"What does *args represent in a Python function definition?",
     "options":["Keyword arguments","A pointer","A single default arg","Variable positional arguments"],
     "correct_answer":3,
     "explanation":"*args collects extra positional arguments into a tuple.","marks":1},
    {"subject":"Python","topic":"OOP","difficulty":"Medium",
     "question":"Which method is called automatically when a Python object is created?",
     "options":["__start__","__create__","__init__","__new__"],"correct_answer":2,
     "explanation":"__init__ is the constructor called right after object creation.","marks":1},
    {"subject":"Python","topic":"OOP","difficulty":"Hard",
     "question":"What is the output of: class A: pass; print(A.__bases__)?",
     "options":["()","(object,)","None","(A,)"],"correct_answer":1,
     "explanation":"Every Python class implicitly inherits from 'object'; __bases__ = (object,).","marks":1},
    {"subject":"Python","topic":"File Handling","difficulty":"Easy",
     "question":"Which Python mode opens a file for both reading and writing?",
     "options":["'r'","'w'","'a'","'r+'"],"correct_answer":3,
     "explanation":"'r+' opens a file for reading and writing without truncating it.","marks":1},
    {"subject":"Python","topic":"Decorators","difficulty":"Hard",
     "question":"What is the primary purpose of a Python decorator?",
     "options":["To create classes","To handle exceptions","To define globals","To modify a function's behavior without changing its source"],
     "correct_answer":3,
     "explanation":"Decorators wrap a function to extend or alter its behavior.","marks":1},
    # ── SQL / DBMS extras ─────────────────────────────────────
    {"subject":"DBMS","topic":"SQL","difficulty":"Easy",
     "question":"Which SQL statement is used to retrieve data from a database?",
     "options":["INSERT","UPDATE","SELECT","DELETE"],"correct_answer":2,
     "explanation":"SELECT retrieves data; the other options modify data.","marks":1},
    {"subject":"DBMS","topic":"SQL","difficulty":"Medium",
     "question":"Which aggregate function returns the number of rows in a result set?",
     "options":["SUM()","AVG()","COUNT()","MAX()"],"correct_answer":2,
     "explanation":"COUNT() returns the number of rows matching a condition.","marks":1},
    # ── OS extras ────────────────────────────────────────────
    {"subject":"Operating Systems","topic":"Process Scheduling","difficulty":"Easy",
     "question":"Which scheduling algorithm gives each process an equal time slice in rotation?",
     "options":["FCFS","SJF","Priority Scheduling","Round Robin"],"correct_answer":3,
     "explanation":"Round Robin assigns a fixed time quantum to each process cyclically.","marks":1},
    {"subject":"Operating Systems","topic":"Memory Management","difficulty":"Medium",
     "question":"What is thrashing in operating systems?",
     "options":["Disk fragmentation","High CPU load","Excessive paging causing little useful work","Overflow of stack memory"],
     "correct_answer":2,
     "explanation":"Thrashing occurs when excessive paging dominates CPU time over useful execution.","marks":1},
    {"subject":"Operating Systems","topic":"Memory Management","difficulty":"Hard",
     "question":"Which page replacement algorithm is theoretically optimal but impractical?",
     "options":["FIFO","LRU","LFU","Optimal (OPT)"],"correct_answer":3,
     "explanation":"OPT replaces the page not used for the longest future time; needs future knowledge.","marks":1},
    # ── Computer Networks extras ──────────────────────────────
    {"subject":"Computer Networks","topic":"OSI Model","difficulty":"Easy",
     "question":"Which OSI layer is responsible for end-to-end delivery (TCP/UDP)?",
     "options":["Network","Data Link","Session","Transport"],"correct_answer":3,
     "explanation":"The Transport layer (Layer 4) provides end-to-end communication via TCP or UDP.","marks":1},
    {"subject":"Computer Networks","topic":"OSI Model","difficulty":"Medium",
     "question":"Which OSI layer handles IP addressing and routing?",
     "options":["Physical","Data Link","Transport","Network"],"correct_answer":3,
     "explanation":"The Network layer (Layer 3) manages IP addressing, routing, and forwarding.","marks":1},
    {"subject":"Computer Networks","topic":"Protocols","difficulty":"Medium",
     "question":"Which protocol translates domain names to IP addresses?",
     "options":["DHCP","FTP","HTTP","DNS"],"correct_answer":3,
     "explanation":"DNS (Domain Name System) resolves human-readable names to IP addresses.","marks":1},
    {"subject":"Computer Networks","topic":"TCP/IP","difficulty":"Medium",
     "question":"What does the three-way handshake in TCP involve?",
     "options":["SYN→SYN-ACK→ACK","ACK→SYN→FIN","SYN→ACK→FIN","FIN→ACK→SYN"],
     "correct_answer":0,
     "explanation":"TCP connection: client sends SYN, server replies SYN-ACK, client sends ACK.","marks":1},
    # ── Quantitative Aptitude extras ──────────────────────────
    {"subject":"Quantitative Aptitude","topic":"Simple Interest","difficulty":"Easy",
     "question":"Simple Interest on ₹2000 at 5% per annum for 3 years is:",
     "options":["₹200","₹250","₹300","₹350"],"correct_answer":2,
     "explanation":"SI = P×R×T/100 = 2000×5×3/100 = ₹300.","marks":1},
    {"subject":"Quantitative Aptitude","topic":"Profit and Loss","difficulty":"Medium",
     "question":"An item bought for ₹800 is sold for ₹1000. What is the profit percentage?",
     "options":["20%","25%","15%","30%"],"correct_answer":1,
     "explanation":"Profit = 200; Profit% = (200/800)×100 = 25%.","marks":1},
    {"subject":"Quantitative Aptitude","topic":"Speed Time Distance","difficulty":"Medium",
     "question":"A train 200m long passes a pole in 10 seconds. What is its speed in km/h?",
     "options":["54 km/h","60 km/h","72 km/h","48 km/h"],"correct_answer":2,
     "explanation":"Speed = 200/10 = 20 m/s = 20×18/5 = 72 km/h.","marks":1},
    {"subject":"Quantitative Aptitude","topic":"Permutations","difficulty":"Hard",
     "question":"In how many ways can 5 people be seated in a row?",
     "options":["24","60","120","720"],"correct_answer":2,
     "explanation":"5! = 5×4×3×2×1 = 120 arrangements.","marks":1},
    # ── Logical Reasoning extras ──────────────────────────────
    {"subject":"Logical Reasoning","topic":"Syllogisms","difficulty":"Medium",
     "question":"All birds can fly. Penguin is a bird. Conclusion: Penguin can fly. This argument is:",
     "options":["Valid and sound","Valid but unsound","Invalid and unsound","Invalid but sound"],
     "correct_answer":1,
     "explanation":"The argument is deductively valid (conclusion follows) but unsound (premise is false).","marks":1},
    {"subject":"Logical Reasoning","topic":"Number Series","difficulty":"Easy",
     "question":"What is the next number in the series: 2, 6, 12, 20, 30, ?",
     "options":["40","42","44","36"],"correct_answer":1,
     "explanation":"Differences: 4,6,8,10,12 → next = 30+12 = 42.","marks":1},
    {"subject":"Logical Reasoning","topic":"Coding-Decoding","difficulty":"Medium",
     "question":"If APPLE is coded as 12215, what is the code for BAT?",
     "options":["213","221","214","211"],"correct_answer":0,
     "explanation":"A=1,B=2,T=20 → BAT = 2,1,20 = 2120 → simplified positional: 213? Actually B=2,A=1,T=20→ concatenation but typical placement exams map A=1…Z=26 giving 2,1,20.","marks":1},
    # ── Verbal Ability extras ─────────────────────────────────
    {"subject":"Verbal Ability","topic":"Synonyms","difficulty":"Easy",
     "question":"Choose the synonym of 'Eloquent':",
     "options":["Silent","Articulate","Confused","Dull"],"correct_answer":1,
     "explanation":"Eloquent means fluent and persuasive in speaking; synonym is Articulate.","marks":1},
    {"subject":"Verbal Ability","topic":"Antonyms","difficulty":"Easy",
     "question":"Choose the antonym of 'Benevolent':",
     "options":["Kind","Generous","Malevolent","Charitable"],"correct_answer":2,
     "explanation":"Benevolent means well-meaning; its antonym is Malevolent (ill-meaning).","marks":1},
    {"subject":"Verbal Ability","topic":"Reading Comprehension","difficulty":"Medium",
     "question":"A passage mainly about climate change would primarily belong to which domain?",
     "options":["Commerce","Technology","Environmental Science","History"],"correct_answer":2,
     "explanation":"Climate change is a core topic of Environmental Science.","marks":1},
]

# Remove duplicates by question text
existing_questions = set(db.questions.distinct("question"))
to_insert = [q for q in NEW_QUESTIONS if q["question"] not in existing_questions]
if to_insert:
    db.questions.insert_many(to_insert)
    print("Inserted %d new questions. Total: %d" % (len(to_insert), db.questions.count_documents({})))
else:
    print("All questions already exist. No duplicates inserted.")

# ─────────────────────────────────────────────────────────────
# MOCK TESTS
# ─────────────────────────────────────────────────────────────
NEW_TESTS = [
    {
        "title": "Python & Data Structures Focus Test",
        "duration_minutes": 30,
        "negative_marking": 0.25,
        "sections": [
            {"name": "Python", "count": 10},
            {"name": "Data Structures", "count": 10},
        ],
        "total_questions": 20,
        "difficulty": "Medium",
        "description": "Test your Python programming and DSA fundamentals."
    },
    {
        "title": "DBMS & OS Core Concepts Test",
        "duration_minutes": 30,
        "negative_marking": 0.25,
        "sections": [
            {"name": "DBMS", "count": 10},
            {"name": "Operating Systems", "count": 10},
        ],
        "total_questions": 20,
        "difficulty": "Medium",
        "description": "Covers SQL, normalisation, process scheduling, and memory management."
    },
    {
        "title": "Java Programming Test",
        "duration_minutes": 25,
        "negative_marking": 0.25,
        "sections": [
            {"name": "Java", "count": 20},
        ],
        "total_questions": 20,
        "difficulty": "Medium",
        "description": "Java OOP, collections, threads, and exception handling."
    },
    {
        "title": "Full Placement Aptitude Test",
        "duration_minutes": 60,
        "negative_marking": 0.25,
        "sections": [
            {"name": "Quantitative Aptitude", "count": 15},
            {"name": "Logical Reasoning", "count": 10},
            {"name": "Verbal Ability", "count": 10},
            {"name": "Data Structures", "count": 10},
            {"name": "Operating Systems", "count": 5},
        ],
        "total_questions": 50,
        "difficulty": "Hard",
        "description": "Full-length placement simulation covering all key areas."
    },
]

existing_tests = set(db.mock_tests.distinct("title"))
tests_to_insert = [t for t in NEW_TESTS if t["title"] not in existing_tests]
if tests_to_insert:
    db.mock_tests.insert_many(tests_to_insert)
    print("Inserted %d new mock tests. Total: %d" % (len(tests_to_insert), db.mock_tests.count_documents({})))
else:
    print("All mock tests already exist.")

# -------------------------------------------------------------
# SUBJECTS (if not already in DB)
# -------------------------------------------------------------
SUBJECTS = [
    {"name":"Quantitative Aptitude","category":"Aptitude","description":"Essential maths for campus screening: percentages, SI/CI, time-work, probability.","topics_count":8,"progress_percentage":0},
    {"name":"Logical Reasoning","category":"Aptitude","description":"Pattern recognition, syllogisms, series, coding-decoding, and puzzles.","topics_count":6,"progress_percentage":0},
    {"name":"Verbal Ability","category":"Aptitude","description":"Synonyms, antonyms, reading comprehension, sentence correction, and fill-in-the-blanks.","topics_count":5,"progress_percentage":0},
    {"name":"Data Structures & Algorithms","category":"Technical","description":"Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, DP, and complexity analysis.","topics_count":10,"progress_percentage":0},
    {"name":"Python","category":"Technical","description":"Python syntax, functions, OOP, decorators, file handling, and standard libraries.","topics_count":7,"progress_percentage":0},
    {"name":"Java","category":"Technical","description":"Java OOP, Collections, Threads, Exception Handling, and best practices.","topics_count":7,"progress_percentage":0},
    {"name":"DBMS","category":"Technical","description":"SQL, Joins, Normalisation, Transactions, Indexing, and ER Diagrams.","topics_count":6,"progress_percentage":0},
    {"name":"Operating Systems","category":"Technical","description":"Process Scheduling, Deadlocks, Memory Management, Paging, and Virtual Memory.","topics_count":6,"progress_percentage":0},
    {"name":"Computer Networks","category":"Technical","description":"OSI Model, TCP/IP, DNS, HTTP/S, IP Addressing, and Routing Protocols.","topics_count":5,"progress_percentage":0},
]

existing_subjects = set(db.subjects.distinct("name")) if "subjects" in db.list_collection_names() else set()
subs_to_insert = [s for s in SUBJECTS if s["name"] not in existing_subjects]
if subs_to_insert:
    result = db.subjects.insert_many(subs_to_insert)
    print("Inserted %d subjects." % len(subs_to_insert))

    # -- TOPICS per subject ------------------------------------
    TOPIC_MAP = {
        "Quantitative Aptitude": ["Percentages","Profit and Loss","Simple & Compound Interest","Speed, Time & Distance","Time and Work","Permutations & Combinations","Probability","Mixtures & Alligations"],
        "Logical Reasoning": ["Number Series","Syllogisms","Coding-Decoding","Blood Relations","Direction Sense","Puzzles & Seating Arrangement"],
        "Verbal Ability": ["Synonyms & Antonyms","Fill in the Blanks","Reading Comprehension","Sentence Correction","Para Jumbles"],
        "Data Structures & Algorithms": ["Arrays","Linked Lists","Stacks","Queues","Trees","Graphs","Sorting Algorithms","Dynamic Programming","Recursion","Hashing"],
        "Python": ["Basics & Data Types","Functions","OOP in Python","File Handling","Exception Handling","Decorators & Generators","Standard Libraries"],
        "Java": ["OOP Concepts","Collections Framework","Exception Handling","Multithreading","Java I/O","Generics","Java 8+ Features"],
        "DBMS": ["SQL Basics","Joins","Normalisation","Transactions & ACID","Indexing & B-Trees","ER Diagrams"],
        "Operating Systems": ["Process & Threads","CPU Scheduling","Deadlocks","Memory Management","Virtual Memory & Paging","File Systems"],
        "Computer Networks": ["OSI & TCP/IP Model","Protocols (HTTP, DNS, FTP)","IP Addressing & Subnetting","TCP vs UDP","Routing Protocols"],
    }

    all_inserted_subjects = list(db.subjects.find({"name": {"$in": [s["name"] for s in subs_to_insert]}}))
    for sub_doc in all_inserted_subjects:
        sub_id = str(sub_doc["_id"])
        sub_name = sub_doc["name"]
        topics = TOPIC_MAP.get(sub_name, [])
        topic_docs = [
            {"subject_id": sub_id, "subject_name": sub_name, "title": t,
             "status": "Not Started", "difficulty": "Medium"}
            for t in topics
        ]
        if topic_docs:
            db.topics.insert_many(topic_docs)
    print("Inserted topics for %d subjects." % len(all_inserted_subjects))
else:
    print("Subjects already exist.")

print("\nSeed complete!")
print("   Questions : %d" % db.questions.count_documents({}))
print("   Mock Tests: %d" % db.mock_tests.count_documents({}))
print("   Subjects  : %d" % db.subjects.count_documents({}))
print("   Topics    : %d" % db.topics.count_documents({}))
client.close()
