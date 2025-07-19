// src/components/TahminSonuc.js (GÜNCEL VERSİYON - Dinamik Sonuç Gösterimi)
import PdfButton from "./PdfButton";
import React from "react";
import "./TahminSonuc.css"; // CSS dosyasını içe aktarın
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate'i de içe aktarın
import { FaUserMd, FaRobot, FaStethoscope, FaFlask, FaLaptopMedical } from "react-icons/fa"; // Yeni ikonlar eklendi

const TahminSonuc = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Yeni bir tahmin yap butonu için

  // navigate ile state üzerinden gelen veriyi alıyoruz
  // İçinde hastaAdiSoyadi, apiResult, patientDetails objeleri olacak
  const { hastaAdiSoyadi, apiResult, patientDetails } = location.state || {};

  // Eğer gerekli veri yoksa (örn. sayfa direkt açıldıysa), ana sayfaya yönlendir
  if (!apiResult || !hastaAdiSoyadi) {
    return (
        <div className="tahmin-container">
            <h2 className="baslik">Sonuç Bulunamadı</h2>
            <p>Lütfen tahmin yapmak için ana sayfaya geri dönün.</p>
            <button className="calculate-btn" onClick={() => navigate("/")} style={{ marginTop: "20px" }}>Ana Sayfaya Dön</button>
        </div>
    );
  }

  // API yanıtından ilgili bilgileri çıkaralım
  const overallRisk = apiResult?.overall_risk_level || "Belirlenemedi";
  const mriRecommendation = apiResult?.mri_recommendation || false;
  const finalRecommendation = apiResult?.final_recommendation || "Detaylı öneri bulunamadı.";
  const detailedSummary = apiResult?.detailed_report_summary || ["Yapay zeka değerlendirmesi bekleniyor."];

  // LLM yanıtını detailed_summary'den birleştirelim
  // Her bir maddeyi ayrı bir paragraf olarak göstermek için map kullanıyoruz.
  const llmYanitElements = detailedSummary.map((item, index) => (
    <p key={index} className="llm-yanit">{item}</p>
  ));

  // Risk kutusunun arka plan rengini belirleme (CSS sınıfları TahminSonuc.css'de tanımlı)
  let riskBoxClass = "risk-kutusu";
  if (overallRisk === "Düşük Risk") {
    riskBoxClass += " risk-dusuk";
  } else if (overallRisk === "Orta Risk") {
    riskBoxClass += " risk-orta";
  } else if (overallRisk === "Yüksek Risk") {
    riskBoxClass += " risk-yuksek";
  }

  return (
    <div className="tahmin-container" id="tahmin-container"> {/* PDF için ID */}
      <PdfButton elementId="tahmin-container" hasta={hastaAdiSoyadi} />

      <h2 className="baslik">HCC Risk Tahmini ve Değerlendirme Raporu</h2>

      {/* Hasta Bilgileri ve Genel Risk */}
      <div className="kart hasta-karti">
        <FaUserMd className="ikon" />
        <div>
          <p><strong>Hasta Adı Soyadı:</strong> {hastaAdiSoyadi}</p>
          <p>
            <strong>Genel HCC Risk Seviyesi:</strong>{" "}
            <span className={riskBoxClass}>{overallRisk}</span>
          </p>
          {mriRecommendation && (
            <p className="mri-uyari">
              <FaLaptopMedical /> <strong>MRI Önerisi:</strong> Evet, ileri görüntüleme (MRI) önerilmektedir.
            </p>
          )}
        </div>
      </div>

      {/* Detaylı Klinik ve Laboratuvar Bilgileri (InputPage'den gelenler) */}
       {patientDetails && (
        <div className="kart">
          <FaFlask className="ikon" />
          <div>
            <h3>Girilen Bilgiler</h3>
            <p><strong>Yaş:</strong> {patientDetails.age || 'N/A'}</p>
            <p><strong>Cinsiyet:</strong> {patientDetails.gender || 'N/A'}</p>
            <p><strong>Alkol Tüketimi:</strong> {patientDetails.alcohol || 'N/A'}</p>
            <p><strong>Sigara Kullanımı:</strong> {patientDetails.smoking || 'N/A'}</p>
            <p><strong>AFP:</strong> {patientDetails.afp || 'N/A'}</p>
            <p><strong>ALT:</strong> {patientDetails.alt || 'N/A'}</p>
            <p><strong>AST:</strong> {patientDetails.ast || 'N/A'}</p>
            <p><strong>ALP (Alkaline Phosphotase):</strong> {patientDetails.alp || 'N/A'}</p>
            <p><strong>GGT:</strong> {patientDetails.ggt || 'N/A'}</p>
            <p><strong>Total Bilirubin:</strong> {patientDetails.total_bilirubin || 'N/A'}</p>
            <p><strong>Direct Bilirubin:</strong> {patientDetails.direct_bilirubin || 'N/A'}</p>
            <p><strong>Total Proteins:</strong> {patientDetails.total_protiens || 'N/A'}</p>
            <p><strong>Albumin:</strong> {patientDetails.albumin || 'N/A'}</p>
            <p><strong>Albumin/Globulin Oranı:</strong> {patientDetails.albumin_and_globulin_ratio || 'N/A'}</p>
          </div>
        </div>
      )}


      {/* Yapay Zekâ Modelinin Değerlendirmesi ve Öneriler */}
      <div className="kart yorum-karti">
        <FaRobot className="ikon" />
        <div>
          <h3>Yapay Zekâ Modelinin Detaylı Değerlendirmesi</h3>
          {/* detailedSummary bir dizi olduğu için map ile her bir öğeyi render ediyoruz */}
          {llmYanitElements.length > 0 ? (
            llmYanitElements
          ) : (
            <p className="llm-yanit">Yapay zeka değerlendirmesi bekleniyor.</p>
          )}
          <p className="final-oneriler">
            <FaStethoscope /> <strong>Uzman Önerisi:</strong> {finalRecommendation}
          </p>
        </div>
      </div>

      {/* Yeni Bir Tahmin Yap Butonu */}
      <div className="button-container">
        <button className="calculate-btn" onClick={() => navigate("/")}>
          Yeni Bir Tahmin Yap
        </button>
      </div>
    </div>
  );
};

export default TahminSonuc;