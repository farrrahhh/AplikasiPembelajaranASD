from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path

from app.ingestion import extract_code_examples, extract_definitions, extract_exercises

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
PDF_CONTENTS_PATH = BACKEND_DIR / "pdf_contents.json"
PDF_DIRECTORY = PROJECT_ROOT / "SlidePerkuliahan"


TUTORIAL_BLUEPRINTS = [
    {
        "slug": "w01-pengantar",
        "week": "W01",
        "title": "Pengantar",
        "icon": "book",
        "description": "Pengantar perkuliahan, paradigma prosedural, notasi algoritmik, dan gambaran umum algoritma serta struktur data.",
        "intro": (
            "Topik pembuka ini mengikuti urutan awal materi dosen: dimulai dari pengantar kuliah, "
            "cara berpikir prosedural, notasi algoritmik, lalu peta besar algoritma, struktur data, dan ADT."
        ),
        "chapters": [
            {
                "slug": "pengantar-dan-paradigma",
                "title": "Pengantar dan paradigma prosedural",
                "file_names": [
                    "W01_A1_PengantarPerkuliahan.pdf",
                    "W01_A2_ParadigmaProsedural.pdf",
                ],
            },
            {
                "slug": "algoritma-dan-adt",
                "title": "Algoritma, struktur data, dan ADT",
                "file_names": [
                    "W01_A3_AlgoritmaStrukturDataADT.pdf",
                    "W01_A4_JenisStrukturDataADTUmum.pdf",
                ],
            },
            {
                "slug": "notasi-dan-cakupan-materi",
                "title": "Notasi algoritmik dan cakupan materi dasar",
                "file_names": [
                    "W01_B1_NotasiAlgoritmikDanContohADTSederhana.pdf",
                    "W01_B2_BahasaC.pdf",
                    "W01_B3_ModularitasC.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w02-adt-sederhana",
        "week": "W02",
        "title": "ADT Sederhana",
        "icon": "spark",
        "description": "ADT dalam bahasa C, contoh ADT sederhana, array, pointer, dan latihan dasar representasi data.",
        "intro": (
            "Topik minggu ini merangkum bagaimana ADT sederhana diterapkan dalam C, "
            "lalu bergerak ke array dan pointer sebagai fondasi implementasi struktur data."
        ),
        "chapters": [
            {
                "slug": "adt-dalam-c",
                "title": "ADT dalam C dan contoh sederhana",
                "file_names": [
                    "W02_A1_ADTdalamBahasaC.pdf",
                    "W02_A2_ContohADTSederhana.pdf",
                ],
            },
            {
                "slug": "array-statik-dan-dinamik",
                "title": "Array statik, array dinamik, dan tabel",
                "file_names": [
                    "W02_A4_Array.pdf",
                    "W02_B1_ArrayStatikVsDinamik.pdf",
                ],
            },
            {
                "slug": "pointer-dalam-c",
                "title": "Pointer dan latihan pointer",
                "file_names": [
                    "W02_B2_Pointer.pdf",
                    "W02_B3_Latihan_Pointer.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w03-list",
        "week": "W03",
        "title": "List",
        "icon": "linked-list",
        "description": "ADT List dan berbagai representasi list berbasis array, termasuk latihan penerapannya.",
        "intro": (
            "Materi minggu ini fokus pada ADT List sebelum masuk ke struktur berkait. "
            "Urutannya dimulai dari konsep list, lalu beberapa cara representasi berbasis array."
        ),
        "chapters": [
            {
                "slug": "adt-list",
                "title": "Konsep ADT List",
                "file_names": [
                    "W03_A1_ADTList.pdf",
                ],
            },
            {
                "slug": "representasi-array-list",
                "title": "Representasi list dengan array",
                "file_names": [
                    "W03_A2_ADTListDenganArrayKontigu.pdf",
                    "W03_B1_ADTListDenganArrayTersebar.pdf",
                    "W03_B2_ADTListDenganArrayDinamis.pdf",
                ],
            },
            {
                "slug": "latihan-array-list",
                "title": "Latihan list berbasis array",
                "file_names": [
                    "W03_B4_LatihanArray.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w05-mesin-karakter-kata",
        "week": "W05",
        "title": "Mesin Karakter/Kata",
        "icon": "target",
        "description": "Pemrosesan karakter dan kata, termasuk implementasi mesin kata di bahasa C dan latihannya.",
        "intro": (
            "Di sini urutan belajar bergerak dari pembacaan karakter, akuisisi kata, "
            "hingga implementasi modul mesin kata yang benar-benar dipakai dalam C."
        ),
        "chapters": [
            {
                "slug": "mesin-karakter",
                "title": "Mesin karakter",
                "file_names": [
                    "W05_B1_MesinKarakter.pdf",
                ],
            },
            {
                "slug": "mesin-kata-dasar",
                "title": "Mesin kata dasar",
                "file_names": [
                    "W05_B2_MesinKata.pdf",
                ],
            },
            {
                "slug": "implementasi-c-dan-variasi",
                "title": "Implementasi mesin kata di C dan variasinya",
                "file_names": [
                    "W05_B3_MesinKata dalam Bahasa C.pdf",
                    "W05_B4_MesinKata versi 2 dan 3.pdf",
                    "W05_Latihan_MesinKata.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w06-stack-queue",
        "week": "W06",
        "title": "Stack & Queue",
        "icon": "stack",
        "description": "Definisi, operasi, implementasi C, dan latihan dasar untuk Stack dan Queue.",
        "intro": (
            "Minggu ini menggabungkan dua struktur data linear yang dibatasi aturannya: "
            "Stack dengan prinsip LIFO dan Queue dengan prinsip FIFO."
        ),
        "chapters": [
            {
                "slug": "stack-dasar",
                "title": "Stack: definisi, operasi, dan latihan",
                "file_names": [
                    "W06_B1_Stack.pdf",
                    "W06_B2_Stack dalam Bahasa C.pdf",
                    "W06_B3_Stack_LatihanSoal.pdf",
                ],
            },
            {
                "slug": "queue-dasar",
                "title": "Queue: definisi, operasi, dan latihan",
                "file_names": [
                    "W06_A1_Queue.pdf",
                    "W06_A2_Queue dalam Bahasa C.pdf",
                    "W06_A3_Queue_LatihanSoal.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w07-set-map",
        "week": "W07",
        "title": "Set & Map",
        "icon": "star",
        "description": "Konsep himpunan, map, dan hashing sebagai dasar operasi keanggotaan dan pemetaan data.",
        "intro": (
            "Di bagian ini materi dosen memperkenalkan abstraksi himpunan dan map, "
            "lalu menunjukkan bagaimana hashing membantu efisiensi operasi tertentu."
        ),
        "chapters": [
            {
                "slug": "set",
                "title": "Konsep Set",
                "file_names": [
                    "W07_A1_Set.pdf",
                ],
            },
            {
                "slug": "map",
                "title": "Konsep Map",
                "file_names": [
                    "W07_A2_Map.pdf",
                ],
            },
            {
                "slug": "hash-map",
                "title": "Hash dan Map",
                "file_names": [
                    "W07_A3_HashDanMap.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w09-w10-list-linier",
        "week": "W09-W10",
        "title": "List Linier",
        "icon": "linked-list",
        "description": "Struktur data berkait, operasi primitif list linier, skema pemrosesan, variasi list, serta representasi list untuk Stack dan Queue.",
        "intro": (
            "Topik ini adalah lanjutan penting setelah List. Fokusnya ada pada list linier "
            "berbasis pointer, operasi primitif, skema traversal, dan berbagai variasinya."
        ),
        "chapters": [
            {
                "slug": "struktur-berkait",
                "title": "Struktur data berkait dan representasi pointer",
                "file_names": [
                    "W09_A1_StrukturDataBerkait.pdf",
                    "W09_A2_ADTListDenganStrukturBerkait.pdf",
                    "W09_B2_StrukturBerkaitDenganPointer.pdf",
                ],
            },
            {
                "slug": "pemrosesan-dan-operasi-list",
                "title": "Skema pemrosesan dan operasi primitif list",
                "file_names": [
                    "W09_A3_SkemaPemrosesanList.pdf",
                    "W09_B1_OperasiPrimitifListLinier.pdf",
                    "W09_B3_StrukturBerkaitDenganArray.pdf",
                    "W09_B4_LatihanSoalList.pdf",
                ],
            },
            {
                "slug": "variasi-list",
                "title": "Variasi list linier",
                "file_names": [
                    "W10_A1_VariasiListLinier.pdf",
                    "W10_A2_ListLinierDgDummyElmt.pdf",
                    "W10_A3_ListPointerGanda.pdf",
                    "W10_A4_ListSirkuler.pdf",
                    "W10_A5_LatihanSoal_VariasiList.pdf",
                ],
            },
            {
                "slug": "representasi-list-untuk-stack-queue",
                "title": "Representasi list untuk Stack dan Queue",
                "file_names": [
                    "W10_B1_Stack_RepList.pdf",
                    "W10_B2_Queue_RepList.pdf",
                    "W10_B3_LatihanSoal_Queue_Berkait.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w13-binary-tree",
        "week": "W13",
        "title": "Binary Tree",
        "icon": "tree",
        "description": "Materi pohon biner, traversal, representasi node, dan latihan lanjutan.",
        "intro": (
            "Urutan materi tree dimulai dari ide dasar node dan relasi parent-child, "
            "lalu bergerak ke traversal dan latihan penerapannya."
        ),
        "chapters": [
            {
                "slug": "binary-tree-bagian-1",
                "title": "Binary Tree bagian 1",
                "file_names": [
                    "W13_A1_PohonBiner_Bagian1.pdf",
                ],
            },
            {
                "slug": "latihan-awal-tree",
                "title": "Latihan awal pohon biner",
                "file_names": [
                    "W13_A2_PohonBiner1_LatihanSoal.pdf",
                ],
            },
            {
                "slug": "binary-tree-bagian-2",
                "title": "Binary Tree bagian 2",
                "file_names": [
                    "W13_B1_PohonBiner_Bagian2.pdf",
                ],
            },
            {
                "slug": "latihan-lanjutan-tree",
                "title": "Latihan lanjutan pohon biner",
                "file_names": [
                    "W13_B2_PohonBiner2_LatihanSoal.pdf",
                ],
            },
        ],
    },
    {
        "slug": "w14-w15-aplikasi",
        "week": "W14-W15",
        "title": "Aplikasi",
        "icon": "graph",
        "description": "Graph, latihan graph, polinom, multilist, relasi M-N, dan studi kasus pengelolaan memori.",
        "intro": (
            "Bagian penutup ini menggabungkan graph dengan beberapa studi kasus aplikasi struktur data "
            "yang lebih kompleks, termasuk polinom, multilist, relasi, dan pengelolaan memori."
        ),
        "chapters": [
            {
                "slug": "graph",
                "title": "Graph",
                "file_names": [
                    "W14_A1_Graph.pdf",
                    "W14_A2_Latihan_Graph.pdf",
                ],
            },
            {
                "slug": "polinom-dan-memori",
                "title": "Studi kasus polinom dan pengelolaan memori",
                "file_names": [
                    "W14_B1_SK1_PolinomRepKontigu.pdf",
                    "W14_B2_SK1_PolinomRepBerkait.pdf",
                    "W14_B4_SK3_PengelolaanMemoriKontigu.pdf",
                    "W14_B5_SK3_PengelolaanMemoriBerkait.pdf",
                ],
            },
            {
                "slug": "multilist-dan-relasi",
                "title": "Multi list dan relasi M-N",
                "file_names": [
                    "W15_A1_SK3_MultiList.pdf",
                    "W15_A2_SK4_RelasiMN.pdf",
                ],
            },
        ],
    },
]


def _display_title(filename: str) -> str:
    return filename.replace(".pdf", "").replace("_", " ")


def _clean_lines(raw_text: str) -> list[str]:
    cleaned: list[str] = []
    seen: set[str] = set()

    for raw_line in raw_text.splitlines():
        line = " ".join(raw_line.strip().split())
        if not line:
            continue
        if line.startswith("IF2110") or line.startswith("IF2111"):
            continue
        if "Institut Teknologi Bandung" in line or "Sekolah Teknik Elektro" in line:
            continue
        if re.fullmatch(r"\d{1,2}/\d{2}/\d{4}.*", line):
            continue
        if line in seen:
            continue
        seen.add(line)
        cleaned.append(line)

    return cleaned


def _chapter_summary(lines: list[str]) -> str:
    summary_lines = [line for line in lines if len(line) > 25][:3]
    return " ".join(summary_lines)[:560].strip()


def _chapter_points(lines: list[str]) -> list[str]:
    points: list[str] = []

    for line in lines:
        normalized = line.lstrip("•- ").strip()
        if 18 <= len(normalized) <= 140:
            points.append(normalized)
        if len(points) == 5:
            break

    return points


def _pdf_url(file_name: str) -> str:
    return f"/api/material-files/{file_name}"


@lru_cache(maxsize=1)
def _load_pdf_contents() -> dict[str, str]:
    with PDF_CONTENTS_PATH.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    return {item["file"]: item.get("content", "") for item in data}


def get_tutorial_catalog() -> list[dict[str, object]]:
    catalog = []

    for topic in TUTORIAL_BLUEPRINTS:
        pdf_count = sum(len(chapter["file_names"]) for chapter in topic["chapters"])
        catalog.append(
            {
                "slug": topic["slug"],
                "week": topic["week"],
                "title": topic["title"],
                "icon": topic["icon"],
                "description": topic["description"],
                "chapter_count": len(topic["chapters"]),
                "pdf_count": pdf_count,
            }
        )

    return catalog


def get_tutorial_topic(topic_slug: str) -> dict[str, object]:
    topic = next((item for item in TUTORIAL_BLUEPRINTS if item["slug"] == topic_slug), None)
    if topic is None:
        raise KeyError(topic_slug)

    pdf_contents = _load_pdf_contents()
    chapters = []
    topic_pdf_count = 0

    for chapter in topic["chapters"]:
        chapter_resources = []
        combined_text_parts: list[str] = []

        for file_name in chapter["file_names"]:
            raw_text = pdf_contents.get(file_name, "")
            lines = _clean_lines(raw_text)
            excerpt = " ".join(lines[:2])[:240].strip()

            chapter_resources.append(
                {
                    "file_name": file_name,
                    "title": _display_title(file_name),
                    "week": file_name[:3] if file_name.startswith("W") else "PDF",
                    "pdf_url": _pdf_url(file_name),
                    "excerpt": excerpt,
                }
            )
            combined_text_parts.append(raw_text)

        combined_text = "\n".join(combined_text_parts)
        lines = _clean_lines(combined_text)
        concepts = extract_definitions(combined_text)[:6]
        code_examples = extract_code_examples(combined_text)[:4]
        exercises = extract_exercises(combined_text)[:4]

        topic_pdf_count += len(chapter_resources)
        chapters.append(
            {
                "slug": chapter["slug"],
                "title": chapter["title"],
                "summary": _chapter_summary(lines),
                "key_points": _chapter_points(lines),
                "concepts": [
                    {
                        "name": concept["name"],
                        "definition": concept["definition"][:260].strip(),
                        "importance": concept.get("importance", "intermediate"),
                    }
                    for concept in concepts
                ],
                "code_examples": [
                    {
                        "title": example["concept"],
                        "language": (
                            "C"
                            if "#include" in example["code"] or "typedef" in example["code"]
                            else example["language"]
                        ),
                        "code": example["code"][:900].strip(),
                    }
                    for example in code_examples
                ],
                "exercises": [
                    {
                        "statement": exercise["statement"][:280].strip(),
                        "difficulty": exercise["difficulty"],
                        "type": exercise["type"],
                    }
                    for exercise in exercises
                ],
                "resources": chapter_resources,
            }
        )

    return {
        "slug": topic["slug"],
        "week": topic["week"],
        "title": topic["title"],
        "icon": topic["icon"],
        "description": topic["description"],
        "intro": topic["intro"],
        "chapter_count": len(chapters),
        "pdf_count": topic_pdf_count,
        "chapters": chapters,
    }
