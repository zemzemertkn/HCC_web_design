import PdfButton from "./PdfButton";  
import React from "react";
import "./TahminSonuc.css";
import { useLocation } from "react-router-dom";
import { FaUserMd, FaRobot } from "react-icons/fa";

const TahminSonuc = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hasta = queryParams.get("hasta") || "Bilinmiyor";
  const risk = queryParams.get("risk") || "Yüksek Risk";

  const llmYanit = `
    Model, AFP ve GGT seviyelerinin normalin üstünde olması ve yaş/gender gibi klinik verileri göz önüne alarak HCC riskini yüksek olarak değerlendirmiştir.
    Doktorun onayı ve ileri görüntüleme yöntemleriyle doğrulama önerilir.
  `;

  return (
    <div className="tahmin-container">
      <PdfButton elementId="tahmin-container" hasta={hasta} />

      <h2 className="baslik"> HCC Risk Tahmini</h2>

      <div className="kart hasta-karti">
        <FaUserMd className="ikon" />
        <div>
          <p><strong>Hasta Adı Soyadı:</strong> {hasta}</p>
          <p>
  <strong>HCC Risk Seviyesi:</strong>{" "}
  <span className="risk-kutusu">{risk}</span>
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
    </div>
  );
};

export default TahminSonuc;
