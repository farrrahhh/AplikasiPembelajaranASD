from app import llm
from app.topic_content import TOPIC_CONTENT_BLUEPRINTS


EXPECTED_CODE_SNIPPETS = {
    "Linked List": ["struct Node", "current->next", "malloc"],
    "Stack": ["top == MAX - 1", "stack[++top]", "stack[top--]"],
    "Queue": ["(rear + 1) % MAX", "queue[rear]", "queue[front]"],
    "Tree": ["struct TreeNode", "preorder(node->left)", "node->right"],
    "Graph": ["int graph[4][4]", "graph[v][i]", "for (int i = 0;"],
    "Sorting Algorithms": ["for (int i = 0;", "arr[j + 1]", "merge_sort(arr"],
}


def test_all_topic_examples_use_c_style_code():
    for topic_name, expected_snippets in EXPECTED_CODE_SNIPPETS.items():
        examples = TOPIC_CONTENT_BLUEPRINTS[topic_name]["examples"]
        combined_code = "\n".join(item["code"] for item in examples)

        for snippet in expected_snippets:
            assert snippet in combined_code


def test_all_topic_exercises_explicitly_reference_c():
    for topic_name, blueprint in TOPIC_CONTENT_BLUEPRINTS.items():
        for exercise in blueprint["exercises"]:
            question = exercise["question"].lower()

            assert "bahasa c" in question or "program c" in question


def test_llm_prompt_requires_c_content(monkeypatch):
    captured_prompt = {}
    llm._TOPIC_CONTENT_CACHE.clear()

    def fake_request(prompt):
        captured_prompt.update(prompt)
        return None

    monkeypatch.setattr(llm, "_request_openai_json", fake_request)

    llm.generate_topic_learning_content(
        topic_name="Stack",
        difficulty_level="Beginner",
        weakness_level="high",
        adaptive_focus="Fokus pada operasi push dan pop.",
        fallback_materials=[{"title": "T", "content": "C"}],
        fallback_examples=[{"title": "E", "description": "D", "code": "printf(\"ok\\n\");"}],
        fallback_summary="Ringkasan",
        fallback_exercises=[
            {
                "question": "Dalam bahasa C, apa itu Stack?",
                "reference_answer": "Stack di C menyimpan data dengan pola LIFO.",
                "keywords": ["stack", "c"],
                "explanation": "Jawaban membahas Stack di C.",
            }
        ],
    )

    instructions = captured_prompt["instructions"].lower()

    assert "bahasa c" in instructions
    assert "setiap contoh kode wajib menggunakan sintaks bahasa c" in instructions
