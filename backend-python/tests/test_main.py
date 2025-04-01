import pytest
from fastapi.testclient import TestClient
from main import app
import numpy as np

client = TestClient(app)

class TestTranslationAPI:
    def test_root_endpoint(self):
        """Test the root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Agente NMT Service funcionando"
        assert data["version"] == "1.0.0"
        assert data["status"] == "ready"

    def test_health_endpoint(self):
        """Test the health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "model_loaded" in data
        assert "timestamp" in data

    def test_translate_success(self):
        """Test successful translation"""
        request_data = {
            "text": "Hello world",
            "source_lang": "en",
            "target_lang": "es"
        }
        
        response = client.post("/translate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "translated_text" in data
        assert "confidence_score" in data
        assert isinstance(data["confidence_score"], float)
        assert 0 <= data["confidence_score"] <= 1

    def test_translate_empty_text(self):
        """Test translation with empty text"""
        request_data = {
            "text": "",
            "source_lang": "en",
            "target_lang": "es"
        }
        
        response = client.post("/translate", json=request_data)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "no puede estar vacío" in data["detail"]

    def test_translate_same_languages(self):
        """Test translation with same source and target languages"""
        request_data = {
            "text": "Hello world",
            "source_lang": "en",
            "target_lang": "en"
        }
        
        response = client.post("/translate", json=request_data)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "deben ser diferentes" in data["detail"]

    def test_translate_whitespace_text(self):
        """Test translation with whitespace-only text"""
        request_data = {
            "text": "   ",
            "source_lang": "en",
            "target_lang": "es"
        }
        
        response = client.post("/translate", json=request_data)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "no puede estar vacío" in data["detail"]

    def test_translate_missing_fields(self):
        """Test translation with missing required fields"""
        # Missing text
        response = client.post("/translate", json={
            "source_lang": "en",
            "target_lang": "es"
        })
        assert response.status_code == 422

        # Missing source_lang
        response = client.post("/translate", json={
            "text": "Hello",
            "target_lang": "es"
        })
        assert response.status_code == 422

        # Missing target_lang
        response = client.post("/translate", json={
            "text": "Hello",
            "source_lang": "en"
        })
        assert response.status_code == 422

    def test_translate_different_language_pairs(self):
        """Test translation with different language pairs"""
        test_cases = [
            ("en", "es", "Hello world"),
            ("es", "en", "Hola mundo"),
            ("en", "ibo", "Hello world"),
            ("fr", "de", "Bonjour le monde"),
        ]
        
        for source_lang, target_lang, text in test_cases:
            request_data = {
                "text": text,
                "source_lang": source_lang,
                "target_lang": target_lang
            }
            
            response = client.post("/translate", json=request_data)
            assert response.status_code == 200
            
            data = response.json()
            assert "translated_text" in data
            assert "confidence_score" in data
            assert isinstance(data["confidence_score"], float)
            assert 0 <= data["confidence_score"] <= 1

    def test_translate_long_text(self):
        """Test translation with longer text"""
        long_text = "This is a longer text that should be translated properly. " * 10
        
        request_data = {
            "text": long_text,
            "source_lang": "en",
            "target_lang": "es"
        }
        
        response = client.post("/translate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "translated_text" in data
        assert "confidence_score" in data

    def test_translate_special_characters(self):
        """Test translation with special characters"""
        special_text = "Hello world! ¿Cómo estás? 你好世界! 🌍"
        
        request_data = {
            "text": special_text,
            "source_lang": "en",
            "target_lang": "es"
        }
        
        response = client.post("/translate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "translated_text" in data
        assert "confidence_score" in data

class TestTranslationFunctions:
    """Test the internal translation functions"""
    
    def test_simulate_translation(self):
        """Test the simulate_translation function"""
        from main import simulate_translation
        
        # Test English to Spanish
        tokens = ["Hello", "world"]
        result = simulate_translation(tokens, "en", "es")
        assert isinstance(result, list)
        assert len(result) == len(tokens)
        assert all("_es" in token for token in result)
        
        # Test Spanish to English
        result = simulate_translation(tokens, "es", "en")
        assert all("_en" in token for token in result)
        
        # Test English to Igbo
        result = simulate_translation(tokens, "en", "ibo")
        assert all("_ibo" in token for token in result)

    def test_calculate_confidence_score(self):
        """Test the calculate_confidence_score function"""
        from main import calculate_confidence_score
        
        # Test with short text
        tokens = ["Hello", "world"]
        score = calculate_confidence_score(tokens, "Hello world")
        assert isinstance(score, float)
        assert 0 <= score <= 1
        
        # Test with longer text
        long_tokens = ["This", "is", "a", "longer", "text"] * 5
        score = calculate_confidence_score(long_tokens, "This is a longer text " * 5)
        assert isinstance(score, float)
        assert 0 <= score <= 1

    def test_confidence_score_consistency(self):
        """Test that confidence scores are consistent for same input"""
        from main import calculate_confidence_score
        
        tokens = ["Hello", "world"]
        text = "Hello world"
        
        # Run multiple times to ensure consistency
        scores = []
        for _ in range(10):
            score = calculate_confidence_score(tokens, text)
            scores.append(score)
            assert 0 <= score <= 1
        
        # Scores should be similar (within reasonable range)
        mean_score = np.mean(scores)
        std_score = np.std(scores)
        assert std_score < 0.2  # Standard deviation should be small

class TestModelLoading:
    """Test model loading functionality"""
    
    def test_startup_event(self):
        """Test that the startup event runs without errors"""
        from main import startup_event
        
        # This should not raise any exceptions
        try:
            startup_event()
        except Exception as e:
            pytest.fail(f"Startup event failed: {e}")

class TestErrorHandling:
    """Test error handling scenarios"""
    
    def test_invalid_json(self):
        """Test handling of invalid JSON"""
        response = client.post("/translate", data="invalid json")
        assert response.status_code == 422

    def test_malformed_request(self):
        """Test handling of malformed request"""
        response = client.post("/translate", json={"invalid": "data"})
        assert response.status_code == 422

    def test_method_not_allowed(self):
        """Test that only POST is allowed for translate endpoint"""
        response = client.get("/translate")
        assert response.status_code == 405
        
        response = client.put("/translate")
        assert response.status_code == 405
        
        response = client.delete("/translate")
        assert response.status_code == 405

if __name__ == "__main__":
    pytest.main([__file__])

