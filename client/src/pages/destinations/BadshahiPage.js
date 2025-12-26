import React from 'react';
import './PlaceDetail.css';

const BadshahiPage = () => {
  return (
    <div className="place-page">
      <div className="place-banner" style={{ backgroundImage: "url('/badshahiimg.jpg')" }}>
        <h1>Badshahi Mosque</h1>
      </div>
      <div className="place-content">
        <p>
          The Badshahi Mosque is a Mughal-era imperial mosque in Lahore, Pakistan. Built between 1671–1673 by Emperor Aurangzeb, it’s one of Pakistan’s most iconic landmarks, known for its stunning Mughal architecture with red sandstone and marble inlay.
        </p>
        <img src="/badshahiimg.jpg" alt="Badshahi Mosque" className="place-image" />

        {/* ✅ Correct Google Map Embed */}
        <div className="map-container">
<div className="map-container">
  <iframe
    title="Badshahi Mosque Location"
    width="100%"
    height="400"
    frameBorder="0"
    style={{ border: 0 }}
    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13678.062030690865!2d74.311097!3d31.588247!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483102e0f4d%3A0xd2f1c3918c3f22b2!2sBadshahi%20Mosque!5e0!3m2!1sen!2s!4v1718016543210!5m2!1sen!2s"
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>


        </div>

        <section className="info-section">
          <h2>Highlights</h2>
          <ul>
            <li>Mughal‑era architecture (1671–1673)</li>
            <li>Can accommodate 100,000 worshippers</li>
            <li>Adjacent to Lahore Fort</li>
            <li>UNESCO World Heritage Site candidate</li>
            <li>Best visited at sunset for golden‑hour views</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default BadshahiPage;
