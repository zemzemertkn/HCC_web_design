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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "bt") setBtImage(imageUrl);
      else if (type === "ultrason") setUltrasonImage(imageUrl);
    }
  };

  const handleCalculate = () => {
    navigate("/sonuc");
  };

  return (
    <div className="input-page">
      <h2>Hasta Bilgileri ve Laboratuvar Verileri</h2>

      {/* Hasta Bilgileri */}
      <div className="left-section">
        <h3>Hasta Bilgileri</h3>
        <div className="form-group">
          <label>Hasta Adı Soyadı</label>
          <input
            type="text"
            name="name"
            placeholder="Örn., Ayşe Yılmaz"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Hasta Yaşı</label>
          <input
            type="number"
            name="age"
            placeholder="Örn., 45"
            value={form.age}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Cinsiyet</label>
          <input
            type="text"
            name="gender"
            placeholder="Örn., Kadın"
            value={form.gender}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Alkol Tüketimi</label>
          <input
            type="text"
            name="alcohol"
            placeholder="Evet/Hayır"
            value={form.alcohol}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Sigara Kullanımı</label>
          <input
            type="text"
            name="smoking"
            placeholder="Evet/Hayır"
            value={form.smoking}
            onChange={handleChange}
          />
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
              />
            </div>
          ))}
        </div>
      </div>

      {/* Ultrason Yükleme */}
      <div className="bt-section" style={{ marginTop: "40px" }}>
        <h3>Ultrason Görüntüsü Yükleme</h3>
        <label htmlFor="ultrason-upload" className="upload-area">
          {ultrasonImage ? (
            <img
              src={ultrasonImage}
              alt="Ultrason Görüntüsü"
              style={{ maxWidth: "100%", borderRadius: "12px" }}
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
          accept="image/*"
          onChange={(e) => handleFileChange(e, "ultrason")}
          style={{ display: "none" }}
        />
      </div>

      {/* BT Yükleme */}
      <div className="bt-section" style={{ marginTop: "40px" }}>
        <h3>MR Görüntüsü Yükleme</h3>
        <label htmlFor="bt-upload" className="upload-area">
          {btImage ? (
            <img
              src={btImage}
              alt="BT Görüntüsü"
              style={{ maxWidth: "100%", borderRadius: "12px" }}
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
          accept="image/*"
          onChange={(e) => handleFileChange(e, "bt")}
          style={{ display: "none" }}
        />
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
