import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List
from app.database.mongodb import get_database
from app.utils.helpers import success_response
from app.config import settings
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/coding", tags=["Coding Practice"])

LANGUAGE_IDS = {"python": 71, "javascript": 63, "java": 62, "c": 50, "cpp": 54}


class CodeRunRequest(BaseModel):
    language: str = Field(..., pattern="^(python|javascript|java|c|cpp)$")
    source_code: str = Field(..., min_length=1, max_length=50000)
    stdin: str = Field(default="", max_length=10000)
    problem_id: str | None = None

DEFAULT_CODING_PROBLEMS = [
    {
        "id": "cp1",
        "title": "Two Sum Problem",
        "category": "Arrays & Hashing",
        "difficulty": "Easy",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
        "examples": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}
        ],
        "expected_concepts": ["Hash Map", "Array Iteration"],
        "sample_solution": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []",
        "explanation": "Using a Hash Map gives O(N) time complexity and O(N) space complexity."
    },
    {
        "id": "cp2",
        "title": "Reverse a Linked List",
        "category": "Linked List",
        "difficulty": "Easy",
        "description": "Given the head of a singly linked list, reverse the list, and return the reversed list's head.",
        "constraints": "Number of nodes in the list is in range [0, 5000].",
        "examples": [
            {"input": "head = [1,2,3,4,5]", "output": "[5,4,3,2,1]", "explanation": "List pointers are reversed."}
        ],
        "expected_concepts": ["Pointers", "Iteration / Recursion"],
        "sample_solution": "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
        "explanation": "Iterate through nodes, updating `curr.next` to point to `prev` node."
    },
    {
        "id": "cp3",
        "title": "Longest Substring Without Repeating Characters",
        "category": "Sliding Window",
        "difficulty": "Medium",
        "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
        "constraints": "0 <= s.length <= 5 * 10^4",
        "examples": [
            {"input": "s = 'abcabcbb'", "output": "3", "explanation": "The answer is 'abc', with length 3."}
        ],
        "expected_concepts": ["Sliding Window", "Set"],
        "sample_solution": "def lengthOfLongestSubstring(s):\n    char_set = set()\n    left = 0\n    res = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        res = max(res, right - left + 1)\n    return res",
        "explanation": "Maintain a sliding window `[left, right]` with unique characters using a hash set."
    }
]


def _make_problem(problem_id, title, category, difficulty, description, constraints, example_input, example_output, concepts, explanation):
    """Build concise original practice prompts for familiar interview patterns."""
    return {
        "id": problem_id,
        "title": title,
        "category": category,
        "difficulty": difficulty,
        "description": description,
        "constraints": constraints,
        "examples": [{"input": example_input, "output": example_output}],
        "expected_concepts": concepts,
        "explanation": explanation,
    }


DEFAULT_CODING_PROBLEMS.extend([
    _make_problem("cp4", "Valid Parentheses", "Stack", "Easy", "Given a string containing bracket characters, determine whether every opening bracket is closed by the same type in the correct order.", "1 <= s.length <= 10^4", 's = "([])"', "true", ["Stack", "String"], "A stack tracks the most recent unmatched opening bracket."),
    _make_problem("cp5", "Merge Two Sorted Lists", "Linked List", "Easy", "Combine two ascending linked lists into one ascending list by reusing their nodes.", "0 <= total nodes <= 10^4", "list1 = [1,2,4], list2 = [1,3,4]", "[1,1,2,3,4,4]", ["Linked List", "Two Pointers"], "Advance the pointer holding the smaller current value and attach it to the result."),
    _make_problem("cp6", "Best Time to Buy and Sell Stock", "Arrays", "Easy", "Choose one day to buy and a later day to sell; return the largest positive gain, or zero when no gain is possible.", "1 <= prices.length <= 10^5", "prices = [7,1,5,3,6,4]", "5", ["Array", "Greedy"], "Track the lowest price seen so far and compare each later selling price against it."),
    _make_problem("cp7", "Valid Palindrome", "Two Pointers", "Easy", "Check whether a phrase reads the same in both directions after ignoring punctuation, spaces, and letter case.", "0 <= s.length <= 2 * 10^5", 's = "A man, a plan, a canal: Panama"', "true", ["String", "Two Pointers"], "Move inward from both ends while skipping characters outside the comparison rules."),
    _make_problem("cp8", "Maximum Subarray", "Dynamic Programming", "Medium", "Find the contiguous non-empty portion of an integer array with the largest sum.", "1 <= nums.length <= 10^5", "nums = [-2,1,-3,4,-1,2,1,-5,4]", "6", ["Array", "Kadane's Algorithm"], "At each position, decide whether to extend the current segment or start a new one."),
    _make_problem("cp9", "Product of Array Except Self", "Arrays", "Medium", "Return an array where each position contains the product of every input value except the value at that position; do not use division.", "2 <= nums.length <= 10^5", "nums = [1,2,3,4]", "[24,12,8,6]", ["Prefix Products", "Suffix Products"], "Combine products accumulated to the left and right of each index."),
    _make_problem("cp10", "3Sum", "Two Pointers", "Medium", "Return all unique triples of distinct array positions whose values sum to zero.", "3 <= nums.length <= 3000", "nums = [-1,0,1,2,-1,-4]", "[[-1,-1,2],[-1,0,1]]", ["Sorting", "Two Pointers"], "Sort first, then fix one value and scan the remainder with two pointers while skipping duplicates."),
    _make_problem("cp11", "Container With Most Water", "Two Pointers", "Medium", "Choose two vertical lines that, together with the x-axis, hold the greatest possible area.", "2 <= height.length <= 10^5", "height = [1,8,6,2,5,4,8,3,7]", "49", ["Greedy", "Two Pointers"], "The shorter boundary limits the area, so move that boundary inward after measuring."),
    _make_problem("cp12", "Binary Search", "Binary Search", "Easy", "Find a target value in an ascending array and return its index, or -1 when it is absent.", "1 <= nums.length <= 10^4", "nums = [-1,0,3,5,9,12], target = 9", "4", ["Array", "Binary Search"], "Repeatedly discard the half whose sorted range cannot contain the target."),
    _make_problem("cp13", "Search a 2D Matrix", "Binary Search", "Medium", "Search for a target in a matrix whose rows are sorted and whose first value in each row exceeds the previous row's last value.", "1 <= rows, columns <= 100", "matrix = [[1,3,5],[7,9,11]], target = 9", "true", ["Matrix", "Binary Search"], "Treat the matrix as one sorted sequence and map each midpoint back to row and column."),
    _make_problem("cp14", "Climbing Stairs", "Dynamic Programming", "Easy", "Count the distinct ways to reach the top of a staircase when each move advances one or two steps.", "1 <= n <= 45", "n = 4", "5", ["Dynamic Programming", "Fibonacci"], "The number of ways to reach a step is the sum of the ways to reach the previous two steps."),
    _make_problem("cp15", "Coin Change", "Dynamic Programming", "Medium", "Given coin denominations and a target amount, return the fewest coins needed, or -1 if the amount cannot be formed.", "1 <= coins.length <= 12; 0 <= amount <= 10^4", "coins = [1,2,5], amount = 11", "3", ["Dynamic Programming", "Unbounded Knapsack"], "Build the best known coin count for each amount using each denomination."),
    _make_problem("cp16", "Number of Islands", "Graphs", "Medium", "Count groups of connected land cells in a grid; horizontal and vertical neighbors connect, diagonals do not.", "1 <= rows, columns <= 300", 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]', "3", ["Graph Traversal", "DFS / BFS"], "Visit each land cell once and traverse its full connected component."),
    _make_problem("cp17", "Course Schedule", "Graphs", "Medium", "Given course prerequisite pairs, determine whether all courses can be completed.", "1 <= numCourses <= 2000", "numCourses = 2, prerequisites = [[1,0]]", "true", ["Graph", "Topological Sort"], "A cycle in the prerequisite graph makes completion impossible."),
    _make_problem("cp18", "Invert Binary Tree", "Trees", "Easy", "Swap the left and right child of every node in a binary tree and return its root.", "0 <= nodes <= 100", "root = [4,2,7,1,3,6,9]", "[4,7,2,9,6,3,1]", ["Tree", "DFS / BFS"], "Recursively or iteratively invert each node's children."),
    _make_problem("cp19", "Lowest Common Ancestor of a Binary Tree", "Trees", "Medium", "Find the deepest node that is an ancestor of both given nodes in a binary tree.", "2 <= nodes <= 10^5", "root = [3,5,1,6,2,0,8], p = 5, q = 1", "3", ["Tree", "Depth-First Search"], "A subtree reports a match when it contains either target; a node receiving matches from both sides is the answer."),
    _make_problem("cp20", "Merge Intervals", "Intervals", "Medium", "Combine every pair of overlapping intervals and return the resulting non-overlapping intervals.", "1 <= intervals.length <= 10^4", "intervals = [[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]", ["Sorting", "Intervals"], "Sort by start time, then extend the last output interval when the next one overlaps."),
])

@router.get("/problems")
def list_coding_problems():
    db = get_database()
    if db is not None:
        problems = list(db.coding_problems.find({}))
        for p in problems:
            p["id"] = str(p["_id"])
            del p["_id"]
        if problems:
            known_ids = {problem["id"] for problem in problems}
            problems.extend(problem for problem in DEFAULT_CODING_PROBLEMS if problem["id"] not in known_ids)
            return success_response(problems, "Coding problems retrieved")
    return success_response(DEFAULT_CODING_PROBLEMS, "Coding problems retrieved")

@router.get("/problems/{problem_id}")
def get_coding_problem(problem_id: str):
    p = next((prob for prob in DEFAULT_CODING_PROBLEMS if prob["id"] == problem_id), None)
    if p is None:
        db = get_database()
        if db is not None:
            try:
                from bson import ObjectId
                if ObjectId.is_valid(problem_id):
                    p = db.coding_problems.find_one({"_id": ObjectId(problem_id)})
                    if p:
                        p["id"] = str(p.pop("_id"))
            except Exception:
                p = None
    if p is None:
        raise HTTPException(status_code=404, detail="Coding problem not found")
    return success_response(p, "Problem details retrieved")


@router.post("/run")
def run_code(req: CodeRunRequest, current_user: dict = Depends(get_current_user)):
    """Run code only through an external sandbox; never execute it in the API process."""
    if not settings.JUDGE0_URL:
        raise HTTPException(
            status_code=503,
            detail="Secure code execution is not configured. Set JUDGE0_URL in backend/.env."
        )

    headers = {"Content-Type": "application/json"}
    if settings.JUDGE0_API_KEY:
        headers["X-Auth-Token"] = settings.JUDGE0_API_KEY
    payload = {
        "language_id": LANGUAGE_IDS[req.language],
        "source_code": req.source_code,
        "stdin": req.stdin,
        "cpu_time_limit": 3,
        "memory_limit": 128000,
    }
    try:
        response = httpx.post(
            f"{settings.JUDGE0_URL.rstrip('/')}/submissions?base64_encoded=false&wait=true",
            json=payload,
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()
        result = response.json()
        return success_response({
            "status": result.get("status", {}).get("description", "Unknown"),
            "stdout": result.get("stdout") or "",
            "stderr": result.get("stderr") or "",
            "compile_output": result.get("compile_output") or "",
            "time": result.get("time"),
            "memory": result.get("memory"),
        }, "Code execution completed")
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Code execution service unavailable: {exc}") from exc
