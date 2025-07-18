import PdfButton from "./PdfButton";
import React from "react";
import "./TahminSonuc.css";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate'i ekledik
import { FaUserMd, FaRobot } from "react-icons/fa";

const TahminSonuc = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Geri dönmek için navigate'i ekledik

  // InputPage'den state ile gönderilen verileri alıyoruz
  const sonuclar = location.state?.sonuclar;

  // llmYanit'ı dinamik hale getiriyoruz
  const llmYanit = `
    Model, yüklenen ultrason görüntüsünü ve girilen laboratuvar verilerini (AFP: ${sonuclar?.afp}, ALT: ${sonuclar?.alt} vb.) analiz ederek, hastanın fibroz evresini '${sonuclar?.tahmin}' olarak tahmin etmiştir.
    Bu sonuç, bir uzman hekim tarafından klinik bulgularla birlikte değerlendirilmelidir.
  `;
  
  // Eğer sonuç verisi yoksa (örneğin sayfa direkt açıldıysa), kullanıcıyı bilgilendir.
  if (!sonuclar) {
    return (
        <div className="tahmin-container">
            <h2 className="baslik">Sonuç Bulunamadı</h2>
            <p>Lütfen tahmin yapmak için ana sayfaya geri dönün.</p>
            <button onClick={() => navigate("/")} style={{padding: "10px 20px", marginTop: "20px"}}>Ana Sayfaya Dön</button>
        </div>
    )
  }

  return (
    <div className="tahmin-container" id="tahmin-container">
      {/* PdfButton'a hasta adını ve soyadını gönderiyoruz */}
      <PdfButton elementId="tahmin-container" hasta={`${sonuclar.name} ${sonuclar.surname}`} />

      <h2 className="baslik"> Fibroz Evre Tahmini</h2>

      <div className="kart hasta-karti">
        <FaUserMd className="ikon" />
        <div>
          <p>
            <strong>Hasta Adı Soyadı:</strong> {sonuclar.name} {sonuclar.surname}
          </p>
          <p>
            <strong>Modelin Tahmini Fibroz Evresi:</strong>{" "}
            <span className="risk-kutusu">{sonuclar.tahmin}</span>
          </p>
        </div>
      </div>

      <div className="kart yorum-karti">
        <FaRobot className="ikon" />
        <div>
          <h3>Yapay Zekâ Modelinin Değerlendirmesi</h3>
          <p>{llmYanit}</p>
        </div>
      </div>
      
      {/* Yeni bir tahmin yapmak için butonu ekledik */}
      <button onClick={() => navigate("/")} style={{padding: "10px 20px", marginTop: "40px"}}>Yeni Bir Tahmin Yap</button>
    </div>
  );
};

export default TahminSonuc;