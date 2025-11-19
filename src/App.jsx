import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Card from './components/Card';
import Footer from './components/Footer';
import Modal from './components/Modal';
import { isoData as initialIsoData, aiInsightsData, privateBidsData } from './data';
import './App.css';

function App() {
  const [isoData, setIsoData] = useState(initialIsoData);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Your logic from the script tag can go here.
    // For example, initializing lucide icons.
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Header />
      <MainContent>
        {isoData.map(item => (
          <Card key={item.id} item={item} />
        ))}
      </MainContent>
      <Footer />
      {showModal && (
        <Modal id="iso-modal" onClose={handleCloseModal}>
          {/* Modal content goes here */}
        </Modal>
      )}
    </div>
  );
}

export default App;