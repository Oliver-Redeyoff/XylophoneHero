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
            imageScaleFactor: 0.45,
            modalName: 'ResNet50',
        }
        this.selectInstrument = this.selectInstrument.bind(this);

    }

    changeSettings() {
      this.setState(
         { minPoseConfidence: document.getElementById("minPose").value,
            minPartConfidence: document.getElementById("minPart").value,
            maxPoseDetections: document.getElementById("maxPose").value,
            outputStride: document.getElementById("outStride").value,
            imageScaleFactor: document.getElementById("scaleFac").value
          })
      console.log(this.state.minPoseConfidence)
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

    changeModal(modalName) {
        this.setState({modalName: modalName});
        console.log(modalName);
    }

    render() {
        let pageHtml;
        if (this.state.page == 1) {
          pageHtml =
          <div>
          <div className='cameraViewParent'>
              <div className='cameraView'>
                  <Camera currentInstrument={this.state.currentInstrument} isHero={this.state.isHero} songId={this.state.songID} modalName={this.state.modalName}/>
              </div>

              
          </div>
          <div className="buttons">
          <center><button className="instrumentButtons">
            <img src={xylobutton} alt="Xylophone Button" className="instrumentButtons" onClick={() => this.selectInstrument("xylophone")}/>
            </button>

          <button className="instrumentButtons">  
            <img src={guitarbutton} alt="Guitar Button" className="instrumentButtons" onClick={() => this.selectInstrument("guitar")}/>
            </button></center>

            <center><button className="modeButtons" onClick={() => this.selectMode(false)}>Freeplay</button>
            <div className="divider"/>
            <button className="modeButtons" onClick={() => this.selectMode(true)}>Gamemode</button></center>
            </div>;
          </div>;
        }
        if (this.state.page==2) {
          pageHtml =
          <div>
          <div className='cameraViewParent'>
              <div className='cameraView'>
                  <Camera currentInstrument={this.state.currentInstrument} isHero={this.state.isHero} songId={this.state.songID} modalName={this.state.modalName} minPoseConfience={this.state.minPoseConfidence}/>
              </div>
            </div>

              
          <div className="settings">
            <label className="settingsLabel">minPoseConfidence</label> 
            <input id="minPose" onChange={() => this.changeSettings()} className="settingsInput" type="range" min="0.01" max="0.99" step="0.01" defaultValue="0.2" required/>
            
            <label className="settingsLabel">minPartConfidence</label>
            <input id="minPart" onChange={() => this.changeSettings()} className="settingsInput" type="range" min="0.01" max="0.99" step="0.01" defaultValue="0.5" required/>
            
            <label className="settingsLabel">maxPoseDetections</label>
            <input id="maxPose" onChange={() => this.changeSettings()} className="settingsInput" type="range" min="1" max="5" defaultValue="2" step="1" required/>
            
            <label className="settingsLabel">outputStride</label> 
            <input id="outStride" onChange={() => this.changeSettings()} className="settingsInput" type="range" min="16" max="32" defaultValue="32" step="16" required/>
            
            <text className="settingsText">imageScaleFactor</text> 
            <input className="settingsInput" type="range" min="0.2" max="1" value="0.45" step="0.01" required/>

            <text className="settingsText">Model</text>
            <input className="settingsInput" type="radio" name="model" value='ResNet50' onChange={() => {this.changeModal('ResNet50')}}/>
            <label for="ResNet50">ResNet (use for the best accuracy)</label>
            <input className="settingsInput" type="radio" name="model" value='MobileNetV1' onChange={() => {this.changeModal('MobileNetV1')}}/>
            <label for="MobileNetV1">MobileNet (use for the best fps)</label>
            
            <label className="settingsLabel">imageScaleFactor</label> 
            <input id="scaleFac" onChange={() => this.changeSettings()} className="settingsInput" type="range" min="0.2" max="1" defaultValue="0.45" step="0.01" required/>
          
          </div>
          </div>;

        }if (this.state.page==3) {
            console.log(this.state);
          pageHtml =
          <div>
          <div className='cameraViewParent'>
              <div className='cameraView'>
                  <Camera currentInstrument={this.state.currentInstrument} isHero={this.state.isHero} songId={this.state.songID} modalName={this.state.modalName}/>
              </div>

              <div className='songButtons'>
                <button className='songButton' onClick={() => this.selectSong(0)}>Wii Theme Tune</button>
                <div className="divider"></div>
                <button className='songButton' onClick={() => this.selectSong(1)}>Old Town Road</button>
                <div className="divider"></div>
                <button className='songButton' onClick={() => this.selectSong(2)}>Take on Me</button>
                <div className="divider"></div>
                <button className='songButton' onClick={() => this.selectSong(3)}>Never Gonna Give You Up</button>
              </div>
          </div>
          <div className="buttons">
          <center><button className="instrumentButtons">
            <img src={xylobutton} alt="Xylophone Button" className="instrumentButtons" onClick={() => this.selectInstrument("xylophone")}/>
            </button>

          <button className="instrumentButtons">  
            <img src={guitarbutton} alt="Guitar Button" className="instrumentButtons" onClick={() => this.selectInstrument("guitar")}/>
            </button></center>

            <center><button className="modeButtons" onClick={() => this.selectMode(false)}>Freeplay</button>
            <div className="divider"/>
            <button className="modeButtons" onClick={() => this.selectMode(true)}>Gamemode</button></center>
            </div>;
          </div>;
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

                    <Menu instruments={instrumentTemplate} selectInstrument={this.selectInstrument} />
                </div>
                <div className="right">
                  {pageHtml}
                </div>

            </div>
        );
      }
    }

    export default App;
