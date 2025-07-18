import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InputPage.css";

const InputPage = () => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    age: "",
    gender: "",
    alcohol: "",
    smoking: "",
    afp: "",
    alt: "",
    ast: "",
    alp: "",
    ggt: "",
    bilirubin: "",
    albumin: "",
  });

  const [btImage, setBtImage] = useState(null);
  const [ultrasonImage, setUltrasonImage] = useState(null);
  
  // YENİ EKLENDİ: API'ye göndereceğimiz asıl dosyayı saklamak için
  const [ultrasonDosyasi, setUltrasonDosyasi] = useState(null); 
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "bt") {
        setBtImage(imageUrl);
      } else if (type === "ultrason") {
        setUltrasonImage(imageUrl); // Bu satır önizleme için
        // GÜNCELLENDİ: Sadece önizleme değil, dosyanın kendisini de hafızaya alıyoruz
        setUltrasonDosyasi(file); 
      }
    }
  };

  // GÜNCELLENDİ: API'ye bağlanıp sonucu sonuç sayfasına yönlendiren fonksiyon
  const handleCalculate = async () => {
    if (!ultrasonDosyasi) {
        alert("Lütfen önce bir Ultrason Görüntüsü yükleyin.");
        return;
    }

    // API'ye göndermek için FormData oluştur
    const formData = new FormData();
    formData.append("dosya", ultrasonDosyasi);

    try {
        // Python API'mize isteği gönderiyoruz
        const response = await fetch('http://127.0.0.1:8000/tahmin_et', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.hata) {
            alert(`API Hatası: ${data.hata}`);
        } else {
            // API'den gelen sonucu ve form verilerini birleştirip sonuç sayfasına gönder
            const sonuclar = {
                ...form, // Hasta verileri
                tahmin: data.tahmin_edilen_evre // Modelin tahmini
            };
            
            console.log("Sonuç sayfasına gönderilen veri:", sonuclar);
            navigate("/sonuc", { state: { sonuclar: sonuclar } });
        }
    } catch (error) {
        alert("API sunucusuna bağlanırken bir hata oluştu.");
        console.error("API Hatası:", error);
    }
  };

  return (
    <div className="input-page">
      <h2>Hasta Bilgileri ve Laboratuvar Verileri</h2>

      {/* Hasta Bilgileri */}
      <div className="left-section">
        <h3>Hasta Bilgileri</h3>
        <div className="hasta-grid-2col">
          <div className="form-group">
            <label>Hasta Adı</label>
            <input
              type="text"
              name="name"
              placeholder="Örn., Ayşe"
              value={form.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Hasta Soyadı</label>
            <input
              type="text"
              name="surname"
              placeholder="Örn., Yılmaz"
              value={form.surname}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Hasta Yaşı</label>
            <input
              type="text"
              name="age"
              placeholder="Örn., 45"
              value={form.age}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Cinsiyet</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Seçiniz</option>
              <option value="Kadın">Kadın</option>
              <option value="Erkek">Erkek</option>
              <option value="Belirtmek istemiyorum">Belirtmek istemiyorum</option>
            </select>
          </div>

          <div className="form-group">
            <label>Alkol Tüketimi</label>
            <select
              name="alcohol"
              value={form.alcohol}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Seçiniz</option>
              <option value="Evet">Evet</option>
              <option value="Hayır">Hayır</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sigara Kullanımı</label>
            <select
              name="smoking"
              value={form.smoking}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Seçiniz</option>
              <option value="Evet">Evet</option>
              <option value="Hayır">Hayır</option>
            </select>
          </div>
        </div>
      </div>

      {/* Laboratuvar Sonuçları */}
      <div className="right-section" style={{ marginTop: "40px" }}>
        <h3>Laboratuvar Sonuçları</h3>
        <div className="lab-grid">
          {[
            ["AFP", "afp", "5.2"],
            ["ALT", "alt", "25"],
            ["AST", "ast", "30"],
            ["ALP", "alp", "120"],
            ["GGT", "ggt", "40"],
            ["Bilirubin", "bilirubin", "0.8"],
            ["Albumin", "albumin", "4.2"],
          ].map(([label, name, placeholder]) => (
            <div className="lab-item" key={name}>
              <label>{label}</label>
              <input
                type="text"
                name={name}
                placeholder={`Örn., ${placeholder}`}
                value={form[name]}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Görüntü Yükleme Alanları */}
      <div className="image-section-wrapper" style={{ marginTop: "40px" }}>
        <div className="bt-section">
          <h3>Ultrason Görüntüsü Yükleme</h3>
          <label htmlFor="ultrason-upload" className="upload-area">
            {ultrasonImage ? (
              <img src={ultrasonImage} alt="Ultrason Görüntüsü" />
            ) : (
              <div>
                <strong>Ultrason Görüntüsü Yükle</strong>
                <small>Görüntüyü buraya sürükleyin veya gözatın</small>
              </div>
            )}
          </label>
          <input
            type="file"
            id="ultrason-upload"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "ultrason")}
            style={{ display: "none" }}
          />
        </div>

        <div className="bt-section">
          <h3>MR Görüntüsü Yükleme</h3>
          <label htmlFor="bt-upload" className="upload-area">
            {btImage ? (
              <img src={btImage} alt="BT Görüntüsü" />
            ) : (
              <div>
                <strong>MR Görüntüsü Yükle</strong>
                <small>Görüntüyü buraya sürükleyin veya gözatın</small>
              </div>
            )}
          </label>
          <input
            type="file"
            id="bt-upload"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "bt")}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Hesapla Butonu */}
      <div className="button-container" style={{ marginTop: "40px" }}>
        <button className="calculate-btn" onClick={handleCalculate}>
          Hesapla
        </button>
      </div>
    </div>
  );
};

export default InputPage;