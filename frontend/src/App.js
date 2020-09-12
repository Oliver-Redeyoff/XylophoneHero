import React from 'react';
import Camera from './components/Camera.js';
import './App.css';
import icon from './Assets/icon.png';

function App() {
  return (
    <div>

      <div className="left">
        <img src={icon} alt="Icon" />
        <h1>Xylophone Hero</h1>
      </div>

      <div className="right">
        <div className='cameraViewParent'>
          <div className='cameraView'>
            <Camera/>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
