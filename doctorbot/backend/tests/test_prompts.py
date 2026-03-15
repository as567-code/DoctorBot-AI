from prompts import DOCTOR_SYSTEM_PROMPT, DOCTOR_QUOTES, EXPLAIN_MODE_PREFIX

def test_system_prompt_contains_incarnation_traits():
    prompt = DOCTOR_SYSTEM_PROMPT
    assert "Allons-y" in prompt
    assert "Geronimo" in prompt
    assert "Brilliant" in prompt
    assert "bowties" in prompt.lower() or "Bowties" in prompt

def test_system_prompt_instructs_json_format():
    assert '{"text":' in DOCTOR_SYSTEM_PROMPT or '"text"' in DOCTOR_SYSTEM_PROMPT
    assert '"mood"' in DOCTOR_SYSTEM_PROMPT

def test_system_prompt_lists_valid_moods():
    for mood in ["excited", "serious", "playful", "concerned", "manic"]:
        assert mood in DOCTOR_SYSTEM_PROMPT

def test_quotes_list_not_empty():
    assert len(DOCTOR_QUOTES) >= 10

def test_each_quote_has_text_and_doctor():
    for q in DOCTOR_QUOTES:
        assert "quote" in q
        assert "doctor" in q
        assert len(q["quote"]) > 0
        assert len(q["doctor"]) > 0

def test_explain_mode_prefix():
    assert "Lecture at the Academy" in EXPLAIN_MODE_PREFIX
