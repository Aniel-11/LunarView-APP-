import React from 'react';
import styles from './Download.module.css';

function Download() {
  const handleDownload = () => {
    // Open document in new tab
    window.open('http://localhost:8001/download/document', '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>📄</div>
        <h1>Functioneel Ontwerp Document</h1>
        <p className={styles.description}>
          Download het complete functionele ontwerp document van de Lunar View applicatie.
        </p>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>📋 Bevat:</span>
            <ul>
              <li>Probleembeschrijving</li>
              <li>Functionele Requirements</li>
              <li>Use Cases</li>
              <li>Schermontwerpen (Wireframes)</li>
              <li>Technische Architectuur</li>
            </ul>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.label}>📦 Formaat:</span>
            <span>HTML (converteerbaar naar PDF)</span>
          </div>
        </div>

        <button onClick={handleDownload} className={styles.downloadButton}>
          ⬇️ Download Document
        </button>

        <div className={styles.instructions}>
          <h3>💡 PDF maken:</h3>
          <ol>
            <li>Open het gedownloade HTML bestand in je browser</li>
            <li>Druk op <code>Ctrl+P</code> (Windows) of <code>Cmd+P</code> (Mac)</li>
            <li>Selecteer "Opslaan als PDF"</li>
            <li>Klik op "Opslaan"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Download;
