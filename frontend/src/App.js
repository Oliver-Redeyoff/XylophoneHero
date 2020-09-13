import React from 'react';
import Camera from './components/Camera.js';
import './App.css';
import icon from './Assets/icon.png';
import settingsIcon from './Assets/settingsIcon.png';
import playIcon from './Assets/playIcon.png';
import xylobutton from './Assets/xylobutton.png';
import guitarbutton from './Assets/guitarbutton.png';
import Menu from './Menu.js';
import instruments, {instrumentTemplate} from './Instruments.js';

// the vertical side bar was broken before I touched it - James
class App extends React.Component {
    constructor(self) {
        super(self);
        this.state = {
            currentInstrument: null,
            isHero: false,
            songID: -1,
            page: 1,
            minPoseConfidence: 0.1,
            minPartConfidence: 0.5,
            maxPoseDetections: 2,
            outputStride: 32,
            imageScaleFactor: 0.45
        }
        this.selectInstrument = this.selectInstrument.bind(this);

    }

    changeSettings(minPoseConfidence, minPartConfidence, maxPoseDetections, outputStride, imageScaleFactor) {
      this.setState(
         {minPoseConfidence: minPoseConfidence,
            minPartConfidence: minPartConfidence,
            maxPoseDetections: maxPoseDetections,
            outputStride: outputStride,
            imageScaleFactor: imageScaleFactor
          })
    }

    setPage(pageNum) {
      this.setState(
        {page: pageNum}
      )
    }

    selectInstrument(name) {
      const newInstrument = instruments(name, 0, 900, 375, 600);
      this.setState({
        currentInstrument: newInstrument
      })
    }

    selectMode(boo) {
      this.setState({
        isHero: boo
      })
      if(boo === false) {
        this.state.page = 1;
      } else {
        this.state.page = 3;
      }

    }

    selectSong(ID) {
      this.setState({
        songID: ID
      })
    }

    offsetFun() {
        setTimeout(this.setCalib(), 50000)

    }


    render() {
        let pageHtml;
        if (this.state.page == 1) {
          pageHtml =
          <div>
            <div className='cameraViewParent'>
              <div className='cameraView'>
                <Camera currentInstrument={this.state.currentInstrument} isHero={this.state.isHero} songId={this.state.songID}/>
              </div>
            </div>

            <div className="menu">

              <center>
                <button className="instrumentButtons">
                  <img src={xylobutton} alt="Xylophone Button" className="instrumentButtons" onClick={() => this.selectInstrument("xylophone")}/>
                </button>
                <button className="instrumentButtons">
                  <img src={guitarbutton} alt="Guitar Button" className="instrumentButtons" onClick={() => this.selectInstrument("guitar")}/>
                </button>
              </center>

              <center>
                <button className="modeButtons" onClick={() => this.selectMode(false)}>Freeplay</button>
                <div className="divider"/>
                <button className="modeButtons" onClick={() => this.selectMode(true)}>Gamemode</button>
              </center>

            </div>
          </div>;
        }
        if (this.state.page==2) {
          pageHtml =
          <div>

            <Camera currentInstrument={this.state.currentInstrument} isHero={this.state.isHero} songId={this.state.songID}/>

            <div className="settings">
              <text className="settingsText">minPoseConfience</text>
              <input id="minPose" className="settingsInput" type="range" min="0.01" max="0.99" step="0.01" value="0.1" required/>

              <text className="settingsText">minPartConfidence</text>
              <input className="settingsInput" type="range" min="0.01" max="0.99" step="0.01" value="0.5" required/>

              <text className="settingsText">maxPoseDetections</text>
              <input className="settingsInput" type="range" min="1" max="5" value="2" step="1" required/>

              <text className="settingsText">outputStride 32 or 16</text>
              <input className="settingsInput" type="range" min="16" max="32" value="32" step="16" required/>

              <text className="settingsText">imageScaleFactor</text>
              <input className="settingsInput" type="range" min="0.2" max="1" value="0.45" step="0.01" required/>

            </div>
          </div>;

        }if (this.state.page==3) {
          pageHtml =
          <div>

            <Camera currentInstrument={this.state.currentInstrument} isHero={this.state.isHero} songId={this.state.songID}/>

            <div className='songButtons'>
              <button className='songButton' onClick={() => this.selectSong(0)}>Wii Theme Tune</button>
              <div className="divider"></div>
              <button className='songButton' onClick={() => this.selectSong(1)}>Old Town Road</button>
              <div className="divider"></div>
              <button className='songButton' onClick={() => this.selectSong(2)}>Take on Me</button>
              <div className="divider"></div>
              <button className='songButton' onClick={() => this.selectSong(3)}>Never Gonna Give You Up</button>
            </div>

            <div className="menu">
              <center>
                <button className="instrumentButtons">
                  <img src={xylobutton} alt="Xylophone Button" className="instrumentButtons" onClick={() => this.selectInstrument("xylophone")}/>
                </button>

                <button className="instrumentButtons">
                  <img src={guitarbutton} alt="Guitar Button" className="instrumentButtons" onClick={() => this.selectInstrument("guitar")}/>
                </button>
              </center>

              <center>
                <button className="modeButtons" onClick={() => this.selectMode(false)}>Freeplay</button>
                <div className="divider"/>
                <button className="modeButtons" onClick={() => this.selectMode(true)}>Gamemode</button>
              </center>
            </div>

          </div>;
        }

        return (
            <div>
              <div className="header">
                <img src={icon} alt="Icon"/>
                <h1>xylophoneHero</h1>
              </div>
              <div className="content">
                {pageHtml}
              </div>

            </div>
        );
      }
    }

    export default App;
