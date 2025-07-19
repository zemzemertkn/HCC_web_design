# Gerekli kütüphaneleri içeri aktarıyoruz
# import io
# import numpy as np
# from PIL import Image
# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# import tensorflow as tf

# # ------------------- UYGULAMA KURULUMU -------------------

# # FastAPI uygulamasını başlatıyoruz
# app = FastAPI(
#     title="Fibroz Evreleme API",
#     description="Ultrason görüntüsünden fibroz evresini tahmin eder."
# )

# # Web sitemizin (index.html) API ile konuşabilmesi için CORS izinlerini ayarlıyoruz
# origins = ["*"]  # "*" tüm kaynaklara izin verir, yerel test için en kolayıdır
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ------------------- MODEL YÜKLEME -------------------

# # Model dosyamızın adını belirtiyoruz
# MODEL_DOSYA_ADI = "fibroz_vgg16_model.h5"
# model = None  # Başlangıçta modeli boş olarak tanımlıyoruz

# try:
#     # TensorFlow/Keras ile .h5 modelini yüklüyoruz
#     model = tf.keras.models.load_model(MODEL_DOSYA_ADI)
#     print(f"✅ Model başarıyla yüklendi: {MODEL_DOSYA_ADI}")
# except Exception as e:
#     # Eğer model yüklenemezse bir hata mesajı yazdırıyoruz
#     print(f"❌ HATA: Model dosyası yüklenemedi. Lütfen '{MODEL_DOSYA_ADI}' dosyasının doğru klasörde olduğundan emin olun. Hata: {e}")

# # ------------------- API UÇ NOKTASI (ENDPOINT) -------------------

# @app.post("/tahmin_et")
# async def tahmin_et(dosya: UploadFile = File(...)):
#     """
#     Bu fonksiyon, bir görüntü dosyası alır, onu model için işler
#     ve tahmin sonucunu JSON formatında geri döndürür.
#     """
#     # Eğer model yüklenmemişse, bir hata mesajı döndür
#     if not model:
#         return {"hata": "Model yüklenemediği için tahmin yapılamıyor."}

#     # Gelen dosyanın bir görüntü olup olmadığını kontrol et
#     if not dosya.content_type.startswith("image/"):
#         return {"hata": "Lütfen bir görüntü dosyası (.jpg, .png vb.) yükleyin."}

#     # Görüntüyü byte olarak oku ve işlenebilir formata çevir
#     goruntu_byte = await dosya.read()
#     goruntu = Image.open(io.BytesIO(goruntu_byte))

#     # --- VGG16 MODELİ İÇİN GÖRÜNTÜ ÖN İŞLEME ---
#     # Bu adımlar, modelinizin eğitimde beklediği girdilerle aynı olmalıdır.
#     goruntu_rgb = goruntu.convert("RGB")
#     goruntu_boyutlandirilmis = goruntu_rgb.resize((224, 224))
#     goruntu_dizisi = np.array(goruntu_boyutlandirilmis)
#     goruntu_islenmis = tf.keras.applications.vgg16.preprocess_input(goruntu_dizisi)
#     goruntu_son_hali = np.expand_dims(goruntu_islenmis, axis=0)
#     # ----------------------------------------------

#     # Model ile tahmini yap
#     tahmin_sonucu = model.predict(goruntu_son_hali)

#     # Modelin sayısal çıktısını anlamlı bir metne dönüştür
#     tahmin_edilen_indeks = np.argmax(tahmin_sonucu[0])
#     evre_map = {0: "F0 : fibroz yok ", 1: "F1 : ", 2: "F2", 3: "F3", 4: "F4"} # Bu sıralama modelinize göre değişebilir
#     sonuc_metni = evre_map.get(tahmin_edilen_indeks, "Bilinmeyen Evre")
    
#     print(f"İşlenen dosya: {dosya.filename}, Tahmin edilen evre: {sonuc_metni}")

#     # Sonucu JSON formatında geri döndür
#     return {
#         "dosya_adi": dosya.filename,
#         "tahmin_edilen_evre": sonuc_metni
#     }

# @app.get("/")
# def ana_sayfa():
#     return {"mesaj": "Fibroz Evreleme API'si çalışıyor."}