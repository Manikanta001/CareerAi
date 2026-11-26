"""Company-specific practice content, aligned to the patterns shown in CareerAI.

Question wording is original practice material. It is not represented as an
official paper or a verified previous-year question.
"""


def _q(company, number, section, subject, topic, difficulty, prompt, options, answer, explanation):
    return {
        "id": f"company_{company}_{number}",
        "company": company,
        "section": section,
        "subject": subject,
        "topic": topic,
        "difficulty": difficulty,
        "question": prompt,
        "options": options,
        "correct_answer": answer,
        "explanation": explanation,
        "marks": 1,
    }


COMPANY_PATTERNS = {
    "tcs": {
        "slug": "tcs", "company": "TCS", "name": "TCS NQT Pattern", "duration_minutes": 165,
        "summary": "Aptitude (20 Qs), Reasoning (20 Qs), Verbal (25 Qs), Coding (2 Problems)",
        "sections": [
            {"name": "Aptitude", "count": 20, "focus": "Percentages, ratios, averages, time and work, speed and distance, and data interpretation."},
            {"name": "Reasoning", "count": 20, "focus": "Series, arrangements, directions, syllogisms, and pattern-based logic."},
            {"name": "Verbal", "count": 25, "focus": "Grammar, vocabulary, sentence correction, and reading comprehension."},
            {"name": "Coding", "count": 2, "focus": "Practise arrays, strings, searching, sorting, and clear input/output handling."},
        ],
        "strategy": ["Keep a steady pace and mark lengthy questions for a later pass.", "For coding, explain the simple approach first, then improve it and test edge cases."],
        "questions": [
            _q("tcs", 1, "Aptitude", "Quantitative Aptitude", "Percentages", "Easy", "A value rises from 240 to 300. What is the percentage increase?", ["20%", "25%", "30%", "60%"], 1, "The increase is 60; 60 / 240 × 100 = 25%."),
            _q("tcs", 2, "Aptitude", "Quantitative Aptitude", "Ratios", "Easy", "The ratio of red to blue tokens is 3:5. If there are 40 tokens total, how many are red?", ["12", "15", "20", "25"], 1, "There are 8 total ratio parts; each part is 5, so red tokens = 3 × 5 = 15."),
            _q("tcs", 3, "Aptitude", "Quantitative Aptitude", "Time and Work", "Medium", "A can finish a task in 12 days and B in 6 days. How long do they take together?", ["3 days", "4 days", "6 days", "9 days"], 1, "Their daily rates add to 1/12 + 1/6 = 1/4 of the task per day."),
            _q("tcs", 4, "Reasoning", "Logical Reasoning", "Number Series", "Easy", "Find the next number: 4, 9, 16, 25, 36, ?", ["42", "45", "49", "64"], 2, "These are consecutive squares 2² through 6²; next is 7² = 49."),
            _q("tcs", 5, "Reasoning", "Logical Reasoning", "Directions", "Easy", "Mira walks 4 km north, then 3 km east. In which direction is she from her starting point?", ["North", "East", "North-east", "South-east"], 2, "She is north and east of the starting point, so the direction is north-east."),
            _q("tcs", 6, "Verbal", "Verbal Ability", "Grammar", "Easy", "Choose the grammatically correct sentence.", ["Each of the files are ready.", "Each of the files is ready.", "Each files is ready.", "Each file are ready."], 1, "Each is singular, so it takes the singular verb is."),
            _q("tcs", 7, "Verbal", "Verbal Ability", "Vocabulary", "Easy", "Choose the closest meaning of 'concise'.", ["Brief and clear", "Uncertain", "Overly detailed", "Unrelated"], 0, "Concise means expressing something clearly in few words."),
            _q("tcs", 8, "Verbal", "Verbal Ability", "Reading Comprehension", "Medium", "A report says a pilot reduced average response time from 10 seconds to 7 seconds. What can be concluded?", ["Response time fell by 30%", "Traffic fell by 30%", "Every response now takes 7 seconds", "The system handles 30% more users"], 0, "The reduction is 3 / 10 = 30%; the statement does not establish the other claims."),
            _q("tcs", 9, "Verbal", "Verbal Ability", "Sentence Completion", "Medium", "The team tested the patch thoroughly, ____ deployment was postponed until approval.", ["because", "but", "unless", "therefore"], 1, "But expresses the contrast between successful testing and postponed deployment."),
            _q("tcs", 10, "Reasoning", "Logical Reasoning", "Syllogisms", "Medium", "All analysts use spreadsheets. Some spreadsheet users know SQL. Which conclusion must be true?", ["All analysts know SQL", "Some analysts know SQL", "All SQL users are analysts", "No conclusion that analysts know SQL follows"], 3, "The group of spreadsheet users who know SQL may not include any analysts."),
        ],
        "coding_focus": ["Find a pair of values that meets a target using a hash map.", "Return the longest substring without repeated characters."],
    },
    "infosys": {
        "slug": "infosys", "company": "Infosys", "name": "Infosys Test Pattern", "duration_minutes": 100,
        "summary": "Mathematical Ability (15 Qs), Reasoning (15 Qs), Verbal (20 Qs), Pseudo-code (5 Qs)",
        "sections": [
            {"name": "Mathematical Ability", "count": 15, "focus": "Arithmetic, probability, permutations, data interpretation, and applied mathematics."},
            {"name": "Reasoning", "count": 15, "focus": "Arrangements, deductions, series, coding-decoding, and analytical puzzles."},
            {"name": "Verbal", "count": 20, "focus": "Reading comprehension, grammar, sentence completion, and vocabulary."},
            {"name": "Pseudo-code", "count": 5, "focus": "Trace loops, conditions, arrays, operators, and variable updates carefully."},
        ],
        "strategy": ["Write down intermediate values when tracing pseudo-code.", "Use estimation to catch arithmetic mistakes, then verify the exact calculation."],
        "questions": [
            _q("infosys", 1, "Mathematical Ability", "Quantitative Aptitude", "Probability", "Medium", "A bag has 3 green and 2 yellow balls. What is the probability of drawing a yellow ball?", ["2/5", "3/5", "1/2", "2/3"], 0, "There are 2 favorable outcomes among 5 equally likely balls."),
            _q("infosys", 2, "Mathematical Ability", "Quantitative Aptitude", "Averages", "Easy", "The average of 5 values is 18. A sixth value of 30 is added. What is the new average?", ["19", "20", "21", "22"], 1, "The original sum is 90; (90 + 30) / 6 = 20."),
            _q("infosys", 3, "Mathematical Ability", "Quantitative Aptitude", "Permutations", "Medium", "How many different arrangements can be made from the letters A, B, and C?", ["3", "6", "9", "12"], 1, "Three distinct letters can be arranged in 3! = 6 ways."),
            _q("infosys", 4, "Reasoning", "Logical Reasoning", "Ordering", "Medium", "Ravi is taller than Neha. Neha is taller than Omar. Who is shortest?", ["Ravi", "Neha", "Omar", "Cannot be determined"], 2, "The order is Ravi > Neha > Omar, so Omar is shortest."),
            _q("infosys", 5, "Reasoning", "Logical Reasoning", "Letter Series", "Easy", "What comes next: B, E, H, K, ?", ["L", "M", "N", "O"], 2, "Each letter advances by three positions; K advances to N."),
            _q("infosys", 6, "Reasoning", "Logical Reasoning", "Coding-Decoding", "Medium", "If each letter is shifted forward by one, how is CODE encoded?", ["DPEF", "BNCD", "DPDF", "EQFG"], 0, "C→D, O→P, D→E, and E→F."),
            _q("infosys", 7, "Verbal", "Verbal Ability", "Grammar", "Easy", "Choose the correct word: The results were different ____ we expected.", ["than", "from", "to", "with"], 1, "The standard construction is different from what we expected."),
            _q("infosys", 8, "Verbal", "Verbal Ability", "Vocabulary", "Easy", "Choose the opposite of 'expand'.", ["Extend", "Enlarge", "Contract", "Increase"], 2, "Contract means to become smaller, the opposite of expand."),
            _q("infosys", 9, "Pseudo-code", "Programming Fundamentals", "Loops", "Easy", "What is printed? x = 1; repeat 3 times: x = x * 2; print x.", ["3", "6", "8", "16"], 2, "Starting at 1, three doublings produce 2, 4, then 8."),
            _q("infosys", 10, "Pseudo-code", "Programming Fundamentals", "Conditionals", "Medium", "Set n = 7. If n mod 2 equals 0 print 'A'; otherwise print 'B'. What is printed?", ["A", "B", "7", "Nothing"], 1, "7 is odd, so the otherwise branch prints B."),
        ],
        "coding_focus": ["Trace nested conditions and loops without skipping assignment order.", "Practise array traversal and basic string manipulation."],
    },
    "accenture": {
        "slug": "accenture", "company": "Accenture", "name": "Accenture Placement Pattern", "duration_minutes": 135,
        "summary": "Cognitive Ability (50 Qs), Technical Assessment (40 Qs), Coding (2 Problems)",
        "sections": [
            {"name": "Cognitive Ability", "count": 50, "focus": "Numerical reasoning, patterns, logical deductions, and verbal comprehension."},
            {"name": "Technical Assessment", "count": 40, "focus": "Programming fundamentals, DSA, OOP, databases, networks, and operating systems."},
            {"name": "Coding", "count": 2, "focus": "Solve algorithmic tasks, explain complexity, and validate boundary cases."},
        ],
        "strategy": ["Alternate between quick cognitive questions and deeper technical revision during preparation.", "For coding, test empty, smallest, duplicate, and large-input cases."],
        "questions": [
            _q("accenture", 1, "Cognitive Ability", "Quantitative Aptitude", "Ratios", "Easy", "A 12 L solution is mixed with water in a ratio of 3:1. How much water is present?", ["3 L", "4 L", "6 L", "9 L"], 0, "The mixture has 4 equal parts; water is one part, or 12 / 4 = 3 L."),
            _q("accenture", 2, "Cognitive Ability", "Logical Reasoning", "Patterns", "Easy", "Choose the next pair: AZ, BY, CX, DW, ?", ["EV", "FU", "EX", "EW"], 0, "The first letter moves forward while the second moves backward: E and V."),
            _q("accenture", 3, "Cognitive Ability", "Verbal Ability", "Comprehension", "Medium", "A system is reliable when it continues serving requests despite one component failing. Which quality is described?", ["Fault tolerance", "Normalization", "Compilation", "Serialization"], 0, "Fault tolerance is the ability to continue operating when components fail."),
            _q("accenture", 4, "Technical Assessment", "Data Structures", "Arrays", "Easy", "What is the time complexity of reading an array element by a valid index?", ["O(1)", "O(log n)", "O(n)", "O(n log n)"], 0, "Array indexing computes the element address directly."),
            _q("accenture", 5, "Technical Assessment", "DBMS", "SQL", "Easy", "Which clause filters grouped results after aggregation?", ["WHERE", "HAVING", "ORDER BY", "FROM"], 1, "HAVING filters groups after GROUP BY; WHERE filters rows before grouping."),
            _q("accenture", 6, "Technical Assessment", "Object-Oriented Programming", "Polymorphism", "Medium", "What does runtime polymorphism commonly allow?", ["A subclass to provide an implementation selected through a base type", "A variable to store only one value", "A class to inherit from several concrete classes in Java", "A method to skip type checking"], 0, "Overridden methods can be selected at runtime through a base-class or interface reference."),
            _q("accenture", 7, "Technical Assessment", "Operating Systems", "Processes", "Easy", "Which resource is normally private to a process rather than shared by its threads?", ["Address space", "Process code", "Open file table", "All process resources are private to every thread"], 0, "Threads in a process share its address space; separate processes have distinct address spaces."),
            _q("accenture", 8, "Technical Assessment", "Computer Networks", "HTTP", "Easy", "Which HTTP method is conventionally used to retrieve a resource without changing server state?", ["GET", "POST", "PATCH", "DELETE"], 0, "GET is defined for retrieving a representation and is intended to be safe."),
            _q("accenture", 9, "Technical Assessment", "Data Structures", "Hash Maps", "Medium", "Which data structure is a natural choice for checking whether each value has appeared before?", ["Hash set", "Stack", "Queue", "Binary heap"], 0, "A hash set provides average constant-time membership checks."),
            _q("accenture", 10, "Cognitive Ability", "Quantitative Aptitude", "Work Rate", "Medium", "A machine completes 60 units in 5 minutes at a constant rate. How many units does it complete in 8 minutes?", ["84", "90", "96", "100"], 2, "The rate is 12 units per minute; 12 × 8 = 96."),
        ],
        "coding_focus": ["Find a longest or shortest subarray using a sliding window.", "Traverse a grid or graph and count connected components."],
    },
    "wipro": {
        "slug": "wipro", "company": "Wipro", "name": "Wipro Elite Pattern", "duration_minutes": 128,
        "summary": "Aptitude & Reasoning (40 Qs), Written English (1 Essay), Coding (2 Problems)",
        "sections": [
            {"name": "Aptitude & Reasoning", "count": 40, "focus": "Arithmetic, data interpretation, series, arrangements, and logical reasoning."},
            {"name": "Written English", "count": 1, "focus": "Plan a clear introduction, two organized supporting points, and a concise conclusion."},
            {"name": "Coding", "count": 2, "focus": "Practise arrays, strings, loops, and clean handling of input and edge cases."},
        ],
        "strategy": ["For the essay, reserve time to outline and proofread; keep each paragraph focused on one idea.", "In aptitude, write units and intermediate calculations to avoid avoidable errors."],
        "essay_prompt": "Some people believe remote work improves productivity, while others value working in an office. Discuss both views and give your opinion.",
        "questions": [
            _q("wipro", 1, "Aptitude & Reasoning", "Quantitative Aptitude", "Profit and Loss", "Easy", "An item costing 500 is sold for 575. What is the profit percentage?", ["10%", "12%", "15%", "18%"], 2, "Profit is 75; 75 / 500 × 100 = 15%."),
            _q("wipro", 2, "Aptitude & Reasoning", "Quantitative Aptitude", "Speed and Distance", "Medium", "A car travels 150 km in 3 hours at a constant speed. How far will it travel in 5 hours?", ["200 km", "225 km", "250 km", "300 km"], 2, "The speed is 50 km/h, so 50 × 5 = 250 km."),
            _q("wipro", 3, "Aptitude & Reasoning", "Logical Reasoning", "Number Series", "Easy", "What comes next: 3, 7, 15, 31, ?", ["47", "55", "62", "63"], 3, "Each term doubles and adds one: 31 × 2 + 1 = 63."),
            _q("wipro", 4, "Aptitude & Reasoning", "Logical Reasoning", "Directions", "Easy", "A person faces west and turns left. Which direction are they facing now?", ["North", "South", "East", "West"], 1, "A left turn from west points south."),
            _q("wipro", 5, "Aptitude & Reasoning", "Quantitative Aptitude", "Averages", "Easy", "The average of 10, 14, and 18 is:", ["12", "14", "16", "42"], 1, "(10 + 14 + 18) / 3 = 14."),
            _q("wipro", 6, "Aptitude & Reasoning", "Logical Reasoning", "Syllogisms", "Medium", "All roses are flowers. No flower is a mineral. Which statement follows?", ["Some minerals are roses", "No rose is a mineral", "All flowers are roses", "Some roses are minerals"], 1, "Roses are flowers and flowers are not minerals, so roses are not minerals."),
            _q("wipro", 7, "Aptitude & Reasoning", "Quantitative Aptitude", "Time and Work", "Medium", "A completes a task in 8 days. What fraction of the task does A complete in 2 days at a constant rate?", ["1/2", "1/4", "1/8", "3/4"], 1, "A completes 1/8 per day; in 2 days that is 2/8 = 1/4."),
            _q("wipro", 8, "Aptitude & Reasoning", "Logical Reasoning", "Ordering", "Medium", "P is before Q, and R is after Q. Which order is required?", ["R, P, Q", "Q, P, R", "P, Q, R", "P, R, Q"], 2, "P must precede Q, and R must follow Q, giving P, Q, R."),
            _q("wipro", 9, "Aptitude & Reasoning", "Quantitative Aptitude", "Simple Interest", "Medium", "Find the simple interest on 2,000 at 5% per year for 2 years.", ["100", "150", "200", "250"], 2, "Simple interest = principal × rate × time = 2,000 × .05 × 2 = 200."),
            _q("wipro", 10, "Aptitude & Reasoning", "Verbal Ability", "Grammar", "Easy", "Choose the correct sentence.", ["Neither answer are correct.", "Neither answer is correct.", "Neither answers is correct.", "Neither answer were correct."], 1, "Neither is singular here, so it takes is."),
        ],
        "coding_focus": ["Write a function to count character frequencies in a string.", "Check whether an array contains a pair with a requested sum."],
    },
    "cognizant": {
        "slug": "cognizant", "company": "Cognizant", "name": "Cognizant GenC Pattern", "duration_minutes": 100,
        "summary": "Quantitative (25 Qs), Analytical (25 Qs), Verbal (25 Qs)",
        "sections": [
            {"name": "Quantitative", "count": 25, "focus": "Percentages, ratios, averages, probability, work rates, and data interpretation."},
            {"name": "Analytical", "count": 25, "focus": "Series, arrangements, deductions, coding-decoding, and data sufficiency."},
            {"name": "Verbal", "count": 25, "focus": "Grammar, vocabulary, sentence completion, and comprehension."},
        ],
        "strategy": ["Read the whole question before calculating; identify exactly what is being asked.", "For analytical questions, write the constraints down rather than holding them all in memory."],
        "questions": [
            _q("cognizant", 1, "Quantitative", "Quantitative Aptitude", "Percentages", "Easy", "What is 15% of 360?", ["36", "45", "54", "60"], 2, "0.15 × 360 = 54."),
            _q("cognizant", 2, "Quantitative", "Quantitative Aptitude", "Ratios", "Easy", "A recipe uses flour and sugar in a ratio of 4:1. If it uses 500 g total, how much flour is needed?", ["100 g", "250 g", "400 g", "450 g"], 2, "The five parts total 500 g, so one part is 100 g and flour is 400 g."),
            _q("cognizant", 3, "Quantitative", "Quantitative Aptitude", "Probability", "Medium", "A fair coin is flipped twice. What is the probability of getting two heads?", ["1/2", "1/3", "1/4", "3/4"], 2, "The equally likely outcomes are HH, HT, TH, and TT; one of four is HH."),
            _q("cognizant", 4, "Analytical", "Logical Reasoning", "Number Series", "Easy", "Find the next number: 5, 10, 20, 40, ?", ["45", "60", "75", "80"], 3, "Each term doubles, so the next number is 80."),
            _q("cognizant", 5, "Analytical", "Logical Reasoning", "Relations", "Medium", "Leena is Arun's sister. Arun is Dev's father. How is Leena related to Dev?", ["Mother", "Aunt", "Sister", "Grandmother"], 1, "Leena is the sister of Dev's father, so she is Dev's aunt."),
            _q("cognizant", 6, "Analytical", "Logical Reasoning", "Ordering", "Medium", "Four tasks J, K, L, M are scheduled. J is before K; L is after K. Which must be true?", ["L is before J", "J is before L", "M is first", "K is last"], 1, "J precedes K and L follows K, so J is before L."),
            _q("cognizant", 7, "Analytical", "Logical Reasoning", "Coding-Decoding", "Easy", "If each letter is shifted back by one, what does DBU become?", ["CAT", "EAV", "CBT", "CZS"], 0, "D→C, B→A, and U→T."),
            _q("cognizant", 8, "Verbal", "Verbal Ability", "Vocabulary", "Easy", "Choose the closest meaning of 'reliable'.", ["Dependable", "Temporary", "Unclear", "Rare"], 0, "Reliable means dependable or consistently trustworthy."),
            _q("cognizant", 9, "Verbal", "Verbal Ability", "Grammar", "Easy", "Complete the sentence: The list of requirements ____ attached to the email.", ["are", "were", "is", "have"], 2, "The subject is the singular noun list, so the verb is."),
            _q("cognizant", 10, "Verbal", "Verbal Ability", "Sentence Ordering", "Medium", "Choose the best order: (1) It is then tested. (2) A requirement is first understood. (3) The feature is implemented.", ["2, 3, 1", "1, 2, 3", "3, 1, 2", "2, 1, 3"], 0, "Understand the requirement, implement the feature, then test it."),
        ],
        "coding_focus": [],
    },
}


COMPANY_QUESTIONS = [question for pattern in COMPANY_PATTERNS.values() for question in pattern["questions"]]
COMPANY_QUESTION_ANSWERS = {question["id"]: question["correct_answer"] for question in COMPANY_QUESTIONS}


def get_company_pattern(slug: str) -> dict | None:
    return COMPANY_PATTERNS.get(slug.lower())


def company_mock_test(slug: str) -> dict | None:
    pattern = get_company_pattern(slug)
    if not pattern:
        return None
    counts = {}
    for question in pattern["questions"]:
        counts[question["section"]] = counts.get(question["section"], 0) + 1
    return {
        "id": f"company-{slug}",
        "title": f"{pattern['company']} Pattern Practice Mock",
        "duration_minutes": 20,
        "total_questions": len(pattern["questions"]),
        "negative_marking": 0,
        "sections": [{"name": name, "count": count} for name, count in counts.items()],
        "company": pattern["company"],
        "company_slug": slug,
        "test_type": "Company-style practice",
    }


def get_company_mock_tests() -> list[dict]:
    return [company_mock_test(slug) for slug in COMPANY_PATTERNS]
