import React, {useState} from 'react';
import Camera from './components/Camera.js';
import './App.css';
import icon from './Assets/icon.png';
import Menu from './Menu.js';
import instruments, {instrumentTemplate} from './Instruments.js';

function App() {
  const [currentInstrument, selectInstrument] = useState(null);
  console.log(currentInstrument);
  const selectHandler = (name) => {
    const newInstrument = instruments(name);
    selectInstrument(newInstrument);
  }

  return (
    <div>

      <div className="left">
        <img src={icon} alt="Icon" />
        <h1>Xylophone Hero</h1>
      </div>
      <Menu instruments={instrumentTemplate} selectInstrument={selectHandler} />
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
