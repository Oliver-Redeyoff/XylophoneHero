import React from 'react';
import Camera from './components/Camera.js';
import './App.css';
import icon from './Assets/icon.png';
import settingsIcon from './Assets/settingsIcon.png';
import playIcon from './Assets/playIcon.png';

// the vertical side bar was broken before I touched it - James
class App extends React.Component {
    constructor(self) {
        super(self);
        this.state = {
            calib: false,
            page: 1
        }
        this.callBackGetData = this.callBackGetData.bind(this);
    }

    setCalib() {
        this.setState(
            {calib: true}
        )
    }

    setPage(pageNum) {
      this.setState(
        {page: pageNum}
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
        let pageHtml;
        if (this.state.page == 1) {
          pageHtml =
          <div className='cameraViewParent'>
              <div className='cameraView'>
                  <Camera calib={this.state.calib} callBack={this.callBackGetData}/>
              </div>
              <button className="calibButton" onClick={() => this.offsetFun()}> Calibrate < /button>
          </div>;
        }
        if (this.state.page==2) {
          pageHtml =
          <h1>This is settings</h1>;
        }

        return (
            <div>
                <div className="left">
                    <img className="brandIcon" src={icon} alt="Icon"/>

                    <hr />

                    <div className="sidebarSection" onClick={() => this.setPage(1)}>
                      <img className="iconBig" src={playIcon} alt="play"/>
                      <p style={{marginTop: '-5px'}}>Main menu</p>
                    </div>

                    <div className="sidebarSection" onClick={() => this.setPage(2)}>
                      <img src={settingsIcon} alt="settings"/>
                      <p>Settings</p>
                    </div>

                </div>
                <div className="right">
                  {pageHtml}
                </div>

            </div>
    )
    ;
    }
    }

    export default App;
