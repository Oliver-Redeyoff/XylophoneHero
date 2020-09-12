import React from 'react';
import Camera from './components/Camera.js';
import './App.css';
import icon from './Assets/icon.png';

// the vertical side bar was broken before I touched it - James
class App extends React.Component {
    constructor(self) {
        super(self);
        this.state = {
            calib: false
        }
        this.callBackGetData = this.callBackGetData.bind(this);
    }

    setCalib() {
        this.setState(
            {calib: true}
        )
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
                    < img src={icon} alt="Icon"/>
                    < h1> XylophoneHero < /h1>
                        < button className="calibButton" onClick={() => this.offsetFun()}> Calibrate < /button>
                </div>
                <div className="right">
                    <div className='cameraViewParent'>
                        <div className='cameraView'>
                            <Camera calib={this.state.calib} callBack={this.callBackGetData}/>
                        </div>
                    </div>
                </div>

            </div>
    )
    ;
    }
    }

    export default App;
