// src/components/InputPage.js (GÜNCEL VERSİYON - API İle Tam Entegrasyon)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InputPage.css"; // CSS dosyasını içe aktarın

const InputPage = () => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    age: "",
    gender: "", // "Erkek", "Kadın", "Belirtmek istemiyorum"
    alcohol: "",
    smoking: "",
    afp: "", // Bu değer şu an Lab modelinde kullanılmasa da formda var.
    alt: "",
    ast: "",
    alp: "", // Formda ALP olarak giriliyor, API'de Alkaline_Phosphotase
    total_bilirubin: "",
    direct_bilirubin: "",
    total_protiens: "", // Yeni eklenecek form alanı
    albumin: "",
    albumin_and_globulin_ratio: "", // Yeni eklenecek form alanı
    ggt: "", // Bu da labda vardı, kontrolünü ekleyelim
  });

  // Dosya objelerini tutmak için state'ler
  const [btFile, setBtFile] = useState(null); // MR (BT) görüntü dosyası objesi
  const [ultrasonFile, setUltrasonFile] = useState(null); // USG görüntü dosyası objesi

  // Görüntü önizlemeleri için URL'ler
  const [btImageUrl, setBtImageUrl] = useState(null);
  const [ultrasonImageUrl, setUltrasonImageUrl] = useState(null);

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
        setBtFile(file); // Dosya objesini kaydet
        setBtImageUrl(imageUrl); // Önizleme URL'sini kaydet
      } else if (type === "ultrason") {
        setUltrasonFile(file); // Dosya objesini kaydet
        setUltrasonImageUrl(imageUrl); // Önizleme URL'sini kaydet
      }
    } else { // Dosya seçimi iptal edilirse veya dosya yoksa sıfırla
        if (type === "bt") {
            setBtFile(null);
            setBtImageUrl(null);
        } else if (type === "ultrason") {
            setUltrasonFile(null);
            setUltrasonImageUrl(null);
        }
    }
  };

  const handleCalculate = async () => {
    const api_url = "http://localhost:8000/evaluate_hcc_risk";

    // Tüm form değerlerini toplayalım (patientDetails için kullanılacak)
    const rawPatientData = { // rawLabData yerine rawPatientData daha genel isim
        name: form.name,
        surname: form.surname,
        age: form.age, // String olarak kalacak
        gender: form.gender, // String olarak kalacak
        alcohol: form.alcohol,
        smoking: form.smoking,
        afp: form.afp,
        alt: form.alt,
        ast: form.ast,
        alp: form.alp,
        ggt: form.ggt,
        total_bilirubin: form.total_bilirubin,
        direct_bilirubin: form.direct_bilirubin,
        total_protiens: form.total_protiens,
        albumin: form.albumin,
        albumin_and_globulin_ratio: form.albumin_and_globulin_ratio,
    };

    // Zorunlu hasta bilgileri kontrolü
    if (!rawPatientData.name || !rawPatientData.surname || !rawPatientData.age || !rawPatientData.gender) {
        alert("Lütfen hasta bilgilerini (Ad, Soyad, Yaş, Cinsiyet) eksiksiz doldurun.");
        return;
    }
    // Yaşın sayısal bir değer olduğundan emin olun
    if (isNaN(parseFloat(rawPatientData.age))) {
        alert("Hata: 'Hasta Yaşı' alanı sayı formatında değil veya boş. Lütfen kontrol edin.");
        return;
    }


    // API için lab verilerini temizleme ve sayıya dönüştürme
    const labDataForApi = {};
    // API'nin LabData modelinde beklediği alan adları ve formdaki karşılıkları
    const labFormToApiMap = {
        "total_bilirubin": "Total_Bilirubin",
        "direct_bilirubin": "Direct_Bilirubin",
        "alp": "Alkaline_Phosphotase",
        "alt": "Alamine_Aminotransferase",
        "ast": "Aspartate_Aminotransferase",
        "total_protiens": "Total_Protiens",
        "albumin": "Albumin",
        "albumin_and_globulin_ratio": "Albumin_and_Globulin_Ratio",
        // GGT ve AFP API LabData modelinde yoktu, bu yüzden buraya eklemiyoruz
    };

    // Gender ve Age'i döngü dışında doğrudan atayalım
    labDataForApi.Age = parseFloat(rawPatientData.age);
    labDataForApi.Gender = rawPatientData.gender === "Erkek" ? 1 : 0; // 'Erkek' -> 1, 'Kadın'/'Belirtmek istemiyorum' -> 0


    for (const formFieldName in labFormToApiMap) {
        const apiFieldName = labFormToApiMap[formFieldName];
        let value = rawPatientData[formFieldName];

        // Boş stringleri kontrol et ve sıfıra dönüştür
        if (value === "") {
            value = "0"; // Boş string yerine "0" stringi gönderelim, parseFloat sorun yaşamasın
        }

        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            alert(`Hata: '${formFieldName}' laboratuvar değeri sayı formatında değil veya boş. Lütfen kontrol edin.`);
            return; // Hata durumunda işlemi durdur
        }
        labDataForApi[apiFieldName] = parsedValue;
    }

    // 2. FormData objesini oluşturma
    const formData = new FormData();
    formData.append("lab_data", JSON.stringify(labDataForApi));

    if (ultrasonFile) {
      formData.append("usg_file", ultrasonFile);
    }
    if (btFile) { // btFile, MR görüntüsü için kullanılıyor
      formData.append("mri_file", btFile);
    }

    try {
      const response = await fetch(api_url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Hatası: ${response.status} - ${errorData.detail || response.statusText}`);
      }

      const result = await response.json();
      console.log("API Yanıtı:", result);

      navigate("/sonuc", {
        state: {
          hastaAdiSoyadi: `${rawPatientData.name} ${rawPatientData.surname}`,
          apiResult: result, // API'den gelen tüm sonucu aktar
          patientDetails: rawPatientData // API'ye direkt gitmeyen tüm ham veriyi de aktaralım (afp, alcohol, smoking, ggt gibi)
        },
      });

    } catch (error) {
      console.error("Tahmin alınırken hata oluştu:", error);
      alert(`Tahmin yapılırken bir hata oluştu: ${error.message}. Lütfen console'a ve API terminaline bakın.`);
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

      {/* Laboratuvar Sonuçları - GÜNCELLENMİŞ VE TAMAMLANMIŞ HALİ */}
      <div className="right-section" style={{ marginTop: "40px" }}>
        <h3>Laboratuvar Sonuçları</h3>
        <div className="lab-grid">
          <div className="lab-item" key="afp">
            <label>AFP</label>
            <input
              type="text"
              name="afp"
              placeholder="Örn., 5.2"
              value={form.afp}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="alt">
            <label>ALT</label>
            <input
              type="text"
              name="alt"
              placeholder="Örn., 25"
              value={form.alt}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="ast">
            <label>AST</label>
            <input
              type="text"
              name="ast"
              placeholder="Örn., 30"
              value={form.ast}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="alp">
            <label>ALP (Alkaline Phosphotase)</label>
            <input
              type="text"
              name="alp"
              placeholder="Örn., 120"
              value={form.alp}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="ggt">
            <label>GGT</label>
            <input
              type="text"
              name="ggt"
              placeholder="Örn., 40"
              value={form.ggt}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="total_bilirubin">
            <label>Total Bilirubin</label>
            <input
              type="text"
              name="total_bilirubin"
              placeholder="Örn., 0.8"
              value={form.total_bilirubin}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="direct_bilirubin">
            <label>Direct Bilirubin</label>
            <input
              type="text"
              name="direct_bilirubin"
              placeholder="Örn., 0.2"
              value={form.direct_bilirubin}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="total_protiens">
            <label>Total Proteins</label>
            <input
              type="text"
              name="total_protiens"
              placeholder="Örn., 7.0"
              value={form.total_protiens}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="albumin">
            <label>Albumin</label>
            <input
              type="text"
              name="albumin"
              placeholder="Örn., 4.2"
              value={form.albumin}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="lab-item" key="albumin_and_globulin_ratio">
            <label>Albumin/Globulin Oranı</label>
            <input
              type="text"
              name="albumin_and_globulin_ratio"
              placeholder="Örn., 1.2"
              value={form.albumin_and_globulin_ratio}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Görüntü Yükleme Alanları */}
      <div className="image-section-wrapper" style={{ marginTop: "40px" }}>
        <div className="bt-section">
          <h3>Ultrason Görüntüsü Yükleme</h3>
          <label htmlFor="ultrason-upload" className="upload-area">
            {ultrasonImageUrl ? (
              <img
                src={ultrasonImageUrl}
                alt="Ultrason Görüntüsü Önizlemesi"
              />
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
            name="usg_file" // FormData için name
            accept="image/*"
            onChange={(e) => handleFileChange(e, "ultrason")}
            style={{ display: "none" }}
          />
        </div>

        <div className="bt-section">
          <h3>MR Görüntüsü Yükleme</h3>
          <label htmlFor="bt-upload" className="upload-area">
            {btImageUrl ? (
              <img
                src={btImageUrl}
                alt="MR Görüntüsü Önizlemesi"
              />
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
            name="mri_file" // FormData için name
            accept="image/*" // Şimdilik sadece resim, ileride NIfTI gibi formatlar eklenebilir.
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