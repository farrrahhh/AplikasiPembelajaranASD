from app.tutorials import get_tutorial_catalog, get_tutorial_topic


def test_tutorial_catalog_contains_linked_list_topic():
    catalog = get_tutorial_catalog()
    slugs = {item["slug"] for item in catalog}

    assert "w03-list" in slugs
    assert "w06-stack-queue" in slugs


def test_tutorial_catalog_order_matches_lecture_weeks():
    catalog = get_tutorial_catalog()

    assert [item["week"] for item in catalog] == [
        "W01",
        "W02",
        "W03",
        "W05",
        "W06",
        "W07",
        "W09-W10",
        "W13",
        "W14-W15",
    ]


def test_linked_list_tutorial_has_chapters_and_pdf_resources():
    payload = get_tutorial_topic("w09-w10-list-linier")

    assert payload["week"] == "W09-W10"
    assert payload["title"] == "List Linier"
    assert payload["chapter_count"] >= 4
    assert payload["pdf_count"] >= 6
    assert payload["chapters"][0]["resources"][0]["pdf_url"].startswith("/api/material-files/")
