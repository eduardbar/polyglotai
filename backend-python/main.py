from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import numpy as np
import os
from typing import Optional
import logging
import json

try:
    import google.generativeai as genai  # type: ignore
except Exception:  # pragma: no cover
    genai = None  # Librería opcional; si no está, se hará fallback

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Modelos Pydantic según RFC-003
class TranslationRequest(BaseModel):
    text: str
    source_lang: str  # 'auto' permitirá detección automática
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str
    confidence_score: float

# Variables globales para el modelo (se cargarán al inicio)
model = None
tokenizer = None
gemini_model = None

app = FastAPI(
    title="Agente NMT Service",
    description="Servicio de inferencia para traducción de lenguajes de bajos recursos",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar orígenes específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Evento de inicio - carga el modelo NMT"""
    global model, tokenizer, gemini_model
    
    logger.info("🚀 Iniciando servicio NMT...")
    
    try:
        # Por ahora, simulamos la carga del modelo
        # En producción, aquí se cargaría el modelo real
        logger.info("📦 Cargando modelo NMT...")
        
        # Simulación de carga de modelo
        model = "simulated_model"
        tokenizer = "simulated_tokenizer"
        
        logger.info("✅ Modelo NMT cargado exitosamente")

        # Inicializar Gemini si hay API key y librería disponible
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and genai:
            try:
                genai.configure(api_key=api_key)
                gemini_model = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("🤝 Integración con Gemini habilitada")
            except Exception as e:
                logger.warning(f"No se pudo inicializar Gemini: {e}")
                gemini_model = None
        else:
            logger.info("Gemini no habilitado (falta API key o librería)")
        
    except Exception as e:
        logger.error(f"❌ Error al cargar el modelo: {e}")
        raise e

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "Agente NMT Service funcionando",
        "version": "1.0.0",
        "status": "ready"
    }

@app.get("/health")
async def health_check():
    """Endpoint de salud del servicio"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": "2025-08-07T02:07:00Z"
    }

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    """
    Endpoint principal de traducción según RFC-005
    
    Pipeline de inferencia:
    1. Pre-procesamiento (tokenización)
    2. Inferencia del modelo
    3. Post-procesamiento (decodificación)
    4. Cálculo de confianza
    """
    try:
        logger.info(f"🔄 Procesando traducción: {request.source_lang} -> {request.target_lang}")
        
        # Validaciones
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="El texto no puede estar vacío")
        
        if request.source_lang == request.target_lang:
            raise HTTPException(status_code=400, detail="Los idiomas de origen y destino deben ser diferentes")
        
        # 1. Pre-procesamiento (tokenización simulada)
        logger.info("📝 Tokenizando texto de entrada...")
        # Aquí se haría la tokenización real
        tokens = request.text.split()  # Simulación
        
        # 2. Inferencia del modelo (Gemini si está disponible; si no, simulación)
        logger.info("🤖 Ejecutando inferencia del modelo...")
        translated_text = None
        confidence_score = None
        detected_lang = None

        if gemini_model is not None:
            try:
                prompt = (
                    "You are a translation engine. If source language is 'auto', detect it. "
                    "Translate the given text strictly from "
                    f"{request.source_lang} to {request.target_lang}.\n"
                    "Return ONLY a JSON object with the following shape: "
                    "{\"translated_text\": string, \"confidence_score\": number between 0 and 1, \"detected_lang\": string}. "
                    "Do not include any additional commentary."
                )
                response = gemini_model.generate_content([
                    prompt,
                    {"text": request.text},
                ])
                raw = response.text or "{}"
                # Manejar posibles fences de código
                raw = raw.strip()
                if raw.startswith("```"):
                    raw = raw.strip("`\n ")
                    # Si venía con ```json
                    if raw.lower().startswith("json"):
                        raw = raw[4:]
                data = json.loads(raw)
                translated_text = str(data.get("translated_text", "")).strip()
                cs = data.get("confidence_score")
                if isinstance(cs, (int, float)):
                    confidence_score = float(max(0.0, min(1.0, cs)))
                dl = data.get("detected_lang")
                if isinstance(dl, str) and dl:
                    detected_lang = dl
            except Exception as e:
                logger.warning(f"Gemini falló, usando simulación. Detalle: {e}")

        if translated_text is None:
            translated_tokens = simulate_translation(tokens, request.source_lang, request.target_lang)
            translated_text = " ".join(translated_tokens)
            confidence_score = calculate_confidence_score(translated_tokens, request.text)
        
        # 3-4 ya calculados en el bloque anterior
        
        logger.info(f"✅ Traducción completada con confianza: {confidence_score:.2f}")
        
        result = TranslationResponse(
            translated_text=translated_text,
            confidence_score=float(confidence_score if confidence_score is not None else 0.5)
        )
        # Anexar cabecera con idioma detectado si existe
        if detected_lang:
            # Usar headers para debug; la interfaz puede leerlos si se expone en API de Node
            # Aquí simplemente lo logueamos
            logger.info(f"🧭 Idioma detectado: {detected_lang}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error en traducción: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servicio de traducción")

def simulate_translation(tokens: list, source_lang: str, target_lang: str) -> list:
    """
    Simula la traducción del modelo NMT
    En producción, aquí se usaría el modelo real
    """
    # Simulación simple: invierte el texto y añade sufijos según el idioma
    translated_tokens = []
    
    for token in tokens:
        # Simular diferentes comportamientos según el par de idiomas
        if source_lang == "en" and target_lang == "es":
            # Inglés -> Español
            translated_tokens.append(f"{token}_es")
        elif source_lang == "es" and target_lang == "en":
            # Español -> Inglés
            translated_tokens.append(f"{token}_en")
        elif source_lang == "en" and target_lang == "ibo":
            # Inglés -> Igbo (lenguaje de bajo recurso)
            translated_tokens.append(f"{token}_ibo")
        else:
            # Otros pares de idiomas
            translated_tokens.append(f"{token}_{target_lang}")
    
    return translated_tokens

def calculate_confidence_score(translated_tokens: list, original_text: str) -> float:
    """
    Calcula la puntuación de confianza del modelo
    En producción, esto se basaría en las probabilidades reales del modelo
    """
    # Simulación de cálculo de confianza
    base_confidence = 0.7
    
    # Factores que afectan la confianza
    text_length_factor = min(len(original_text) / 100, 1.0)  # Textos más largos = menor confianza
    language_complexity_factor = 0.8  # Factor de complejidad del idioma
    
    # Cálculo final
    confidence = base_confidence * text_length_factor * language_complexity_factor
    
    # Añadir algo de aleatoriedad para simular variabilidad real
    confidence += np.random.normal(0, 0.1)
    
    # Asegurar que esté en el rango [0, 1]
    return max(0.0, min(1.0, confidence))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

