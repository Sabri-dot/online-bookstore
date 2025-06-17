import React, { useState } from 'react';
import './AboutUs.css';


const quotes = [
  "Books are a uniquely portable magic. – Stephen King",
  "A room without books is like a body without a soul. – Marcus Tullius Cicero",
  "So many books, so little time. – Frank Zappa",
  "Reading is to the mind what exercise is to the body. – Joseph Addison"
];

const AboutUs = () => {
  const [showModal, setShowModal] = useState(false);
  const [showInspireModal, setShowInspireModal] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const openInspireModal = () => setShowInspireModal(true);
  const closeInspireModal = () => {
    setShowInspireModal(false);
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div className="aboutus-container">
      {/* Header i plotë në krye me butonin djathtas */}
      <div
        className="aboutus-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1>Rreth Nesh</h1>
          <p>Një histori pasionante dhe një mision për të ndarë dashurinë për librat.</p>
        </div>

        <button
          className="learn-more-btn"
          onClick={openInspireModal}
          style={{
             marginTop: '50px',
            padding: '10px 30px',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#27ae60',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(39, 174, 96, 0.6)',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          Çfarë na inspiroi?
        </button>
      </div>

      {/* Përmbajtja poshtë header-it: imazhi majtas, tekstet djathtas */}
      <div
        className="aboutus-content"
        style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}
      >
        {/* Imazhi majtas, me animacion dhe stil */}
        <div
          className="aboutus-image hero-image-animated"
          style={{
            maxHeight: '400px',
            flex: '0 0 45%',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
            alt="Bookstore"
            style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
          />

          {/* Butoni Learn More poshtë fotos */}
          <button
            className="learn-more-btn"
            onClick={() => setShowModal(true)}
            style={{
              marginTop: '15px',
              padding: '10px 30px',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#2980b9',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(41, 128, 185, 0.6)',
              userSelect: 'none',
            }}
          >
            Learn More
          </button>
        </div>

        {/* Tekstet djathtas */}
        <div className="aboutus-text enhanced-text">
          <section>
            <h2>Historia Jonë</h2>
            <p>
              Libraria jonë lindi nga një pasion i thellë për librat dhe dëshira për të krijuar
              një vend ku çdo lexues ndihet si në shtëpinë e tij. Filluam ne vitin 2025 , dhe qe atehere ne punojmë me
              zemër për të ndërtuar një hapësirë të ngrohtë dhe mikpritëse, ku çdo libër është një
              udhëtim drejt njohjes, ëndrrave dhe emocionit.
            </p>
          </section>
          <section>
            <h2>Misioni Ynë</h2>
            <p>
              Ne besojmë se librat janë çelësi që hap dyert e imagjinatës dhe diturisë. Synimi ynë
              është të sjellim tek ju koleksione të zgjedhura me përkushtim, të ofrojmë eksperiencë
              të jashtëzakonshme dhe të frymëzojmë çdo vizitor që të gjejë historinë që i prek shpirtin.
            </p>
          </section>
          <section>
            <h2>Ekipi Ynë</h2>
            <p>
              Ekipi ynë përbëhet nga dashamirës të librave — njohës, këshillues dhe shokë leximi që
              janë gjithmonë këtu për t’ju ndihmuar të zbuloni thesaret më të bukura në botën e
              librit. Ne besojmë se çdo libër është një histori që pret të gjendet nga ju.
            </p>
          </section>
        </div>
      </div>

      {/* Modal i thjeshtë për Learn More */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Më shumë rreth nesh</h2>
            <p>
              Ne jemi një ekip i pasionuar që synojmë të ofrojmë librat më të mirë për çdo lexues.
              Libraria jonë u krijua me dashurinë për leximin dhe dëshirën për të ndihmuar njerëzit
              të gjejnë histori që i frymëzojnë dhe i edukojnë.
            </p>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal për thënie inspiruese */}
      {showInspireModal && (
        <div className="modal-backdrop" onClick={closeInspireModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Çfarë na inspiroi?</h2>
            <p style={{ fontStyle: 'italic', fontSize: '1.3rem', marginBottom: '30px' }}>
              "{quotes[quoteIndex]}"
            </p>
            <button className="close-btn" onClick={closeInspireModal}>
              Mbyll
            </button>
          </div>
        </div>
      )}
  </div>
  );
};
export default AboutUs;
