import React from 'react';
import Camera from './components/Camera.js';
import './App.css';
import icon from './Assets/icon.png';
import Menu from './Menu.js';
import instruments, {instrumentTemplate} from './Instruments.js';

// the vertical side bar was broken before I touched it - James
class App extends React.Component {
    constructor(self) {
        super(self);
        this.state = {
            calib: false,
            currentInstrument: null
        }
        this.callBackGetData = this.callBackGetData.bind(this);
        this.selectInstrument = this.selectInstrument.bind(this);

    }

    setCalib() {
        this.setState(
            {calib: true}
        )
    }

    selectInstrument(name) {
      const newInstrument = instruments(name, 0, 100, 0, 100);
      this.setState({
        currentInstrument: newInstrument
      })
    }

    offsetFun() {
        setTimeout(this.setCalib(), 50000)

    }

    callBackGetData(data) {
        data.forEach((part) => {
            if (part.part === "leftWrist" || part.part === "rightWrist") {
                console.log("x position = " + part.position.x)
                console.log("y position = " + part.position.y)
            }
        })
        this.setState({calib: false})
    }

    render() {
        return (
            <div>
                <div className="left">
                    <img src={icon} alt="Icon"/>
                    <h1> XylophoneHero </h1>
                        <button className="calibButton" onClick={() => this.offsetFun()}> Calibrate </button>
                        <Menu instruments={instrumentTemplate} selectInstrument={this.selectInstrument} />
                </div>
                <div className="right">
                    <div className='cameraViewParent'>
                        <div className='cameraView'>
                            <Camera calib={this.state.calib} callBack={this.callBackGetData}/>
                        </div>
                    </div>
                </div>

            </div>
        );
      }
    }

    export default App;
