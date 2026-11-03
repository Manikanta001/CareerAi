from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.mongodb import get_database
from app.utils.helpers import success_response

router = APIRouter(prefix="/coding", tags=["Coding Practice"])

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

@router.get("/problems")
def list_coding_problems():
    db = get_database()
    if db is not None:
        problems = list(db.coding_problems.find({}))
        for p in problems:
            p["id"] = str(p["_id"])
            del p["_id"]
        if problems:
            return success_response(problems, "Coding problems retrieved")
    return success_response(DEFAULT_CODING_PROBLEMS, "Coding problems retrieved")

@router.get("/problems/{problem_id}")
def get_coding_problem(problem_id: str):
    problems = DEFAULT_CODING_PROBLEMS
    p = next((prob for prob in problems if prob["id"] == problem_id), problems[0])
    return success_response(p, "Problem details retrieved")
