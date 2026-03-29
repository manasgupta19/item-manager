import React, { useState } from "react";

const OnboardingTutorial = ({ slides, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === slides.length - 1;

  const handleRestart = () => setCurrentIndex(0);
  const handlePrev = () => setCurrentIndex(currentIndex - 1);
  const handleNext = () => setCurrentIndex(currentIndex + 1);

  const { title, text, icon } = slides[currentIndex];

  return (
    <div className="modal-overlay">
      <div className="modal-content onboarding-card">
        <div className="tutorial-progress">
          Slide {currentIndex + 1} of {slides.length}
        </div>
        
        <div className="tutorial-body">
          <div className="tutorial-icon">{icon}</div>
          <h2 className="form-title">{title}</h2>
          <p className="tutorial-text">{text}</p>
        </div>

        <div className="modal-actions tutorial-nav">
          <button 
            onClick={handleRestart} 
            className="back-btn" 
            disabled={isFirstSlide}
          >
            Restart
          </button>
          
          <button 
            onClick={handlePrev} 
            className="back-btn" 
            disabled={isFirstSlide}
          >
            Prev
          </button>

          {!isLastSlide ? (
            <button onClick={handleNext} className="submit-btn">
              Next
            </button>
          ) : (
            <button onClick={onFinish} className="submit-btn finish-btn">
              Finish & Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;