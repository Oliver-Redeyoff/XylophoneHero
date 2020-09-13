import {drawKeyPoints, drawSkeleton} from './utils'
import React, {Component} from 'react'
import * as posenet from '@tensorflow-models/posenet'


class PoseNet extends Component {

  static defaultProps = {
    videoWidth: 900,
    videoHeight: 600,
    flipHorizontal: true,
    algorithm: 'single-pose',
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5,
    maxPoseDetections: 2,
    nmsRadius: 20,
    outputStride: 32,
    imageScaleFactor: 0.45,
    skeletonColor: '#ffadea',
    skeletonLineWidth: 6,
    loadingText: 'Loading...please be patient...'
  };

  static songs = [
    [[5, 1], [-1, 1], [0, 1], [2, 1], [-1, 1], [0, 1], [-1, 1], [5, 1], [3, 1], [3, 1], [3, 1]],
    [[5, 1], [5, 1], [5, 1], [2, 1], [-1, 1], [1, 1], [-1, 1], [0, 1], [-1, 1], [5, 1], [5, 1], [2, 1], [1, 1], [-1, 1], [0, 1]],
    [[5, 1], [5, 1], [3, 1], [1, 1], [-1, 1], [1, 1], [-1, 1], [4, 1], [-1, 1], [4, 1], [-1, 1], [4, 1], [6, 1], [6, 1], [0, 1], [1, 1]],
    [[0, 1], [1, 1], [3, 1], [1, 1], [5, 1], [-1, 1], [6, 1], [-1, 1], [4, 1], [-1, 1], [0, 1], [1, 1], [3, 1], [1, 1], [4, 1], [-1, 1], [0, 1], [-1, 1], [2, -1]],
    [[6, 1], [6, 1], [3, 1], [3, 1], [4, 1], [4, 1], [3, 1], [-1, 1], [2, 1], [2, 1], [1, 1], [1, 1], [0, 1], [0, 1], [6, 1], [-1, 1], [3, 1], [3, 1], [2, 1], [2, 1], [1, 1], [1, 1], [0, 1], [-1, 1], [3, 1], [3, 1], [2, 1], [2, 1], [1, 1], [1, 1], [0, 1], [-1, 1], [6, 1], [6, 1], [3, 1], [3, 1], [4, 1], [4, 1], [3, 1], [-1, 1], [2, 1], [2, 1], [1, 1], [1, 1], [0, 1], [0, 1], [6, 1], [-1, 1]]


  ];
  static timeCount = 0;
  static timeDelay = 0;
  static backlogNotes = [];
  static currentNotes = [];
  static score = 0;
  static songDone = -2;

  constructor(props) {
    super(props, PoseNet.defaultProps);
    this.state = {
      calib : this.props.calib
    };
  }

  getCanvas = elem => {
    this.canvas = elem
  }

  getVideo = elem => {
    this.video = elem
  }

  async componentDidMount() {
    try {
      await this.setupCamera();
    } catch (error) {
      throw new Error(
        'This browser does not support video capture, or this device does not have a camera'
      )
    }

    try {
      this.posenet = await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        quantBytes: 2

      });
    } catch (error) {
      console.log(error)
      throw new Error('PoseNet failed to load');
    } finally {
      setTimeout(() => {
        this.setState({loading: false});
      }, 200);
    }

    this.detectPose();
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      );
    }
    const {videoWidth, videoHeight} = this.props;
    const video = this.video;
    video.width = videoWidth;
    video.height = videoHeight;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: videoWidth,
        height: videoHeight
      }
    })

    video.srcObject = stream;

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play()
        resolve(video)
      }
    })
  }

  detectPose() {
    const {videoWidth, videoHeight} = this.props;
    const canvas = this.canvas;
    const canvasContext = canvas.getContext('2d')

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    this.poseDetectionFrame(canvasContext)
  }

  poseDetectionFrame(canvasContext) {
    let {
      minPoseConfidence,
      minPartConfidence,
      videoWidth,
      videoHeight,
      showVideo,
      showPoints,
      showSkeleton,
      skeletonColor,
      skeletonLineWidth
      } = this.props;
    //console.log(minPoseConfidence);
    //console.log(this.props.minPoseConfidence);
    const posenetModel = this.posenet;
    const video = this.video;

    const findPoseDetectionFrame = async () => {
      /*let {
      minPoseConfidence,
      minPartConfidence,
      videoWidth,
      videoHeight,
      showVideo,
      showPoints,
      showSkeleton,
      skeletonColor,
      skeletonLineWidth
      } = this.props;
    //console.log(minPoseConfidence);
    //console.log(this.props.minPoseConfidence);
    const posenetModel = this.posenet;
    const video = this.video;*/

      let poses = [];
      const pose = await posenetModel.estimateSinglePose(this.video, {
        video: true,
        flipHorizontal: true
      });
      poses.push(pose);


      canvasContext.clearRect(0, 0, videoWidth, videoHeight);

      if (showVideo) {
        canvasContext.save();
        canvasContext.scale(-1, 1);
        canvasContext.translate(-videoWidth, 0);
        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
        canvasContext.restore();
      }

      if(this.props.calib){
        this.props.callBack(poses[0].keypoints);
      }

      poses.forEach(({score, keypoints}) => {
        //console.log(this.props.minPoseConfidence);
        if (score >= minPoseConfidence) {
          if (showPoints) {
            drawKeyPoints(
              keypoints,
              minPartConfidence,
              skeletonColor,
              canvasContext
            );
          }
          if (showSkeleton) {
            drawSkeleton(
              keypoints,
              minPartConfidence,
              skeletonColor,
              skeletonLineWidth,
              canvasContext
            );
          }
        }
      });

      if(this.props.isHero && this.props.currentInstrument?.name === "xylophone" && PoseNet.songDone != this.props.songId) {

        // if this is the beginning of the song, add first note
        console.log(this.props.songId);
        if (PoseNet.backlogNotes.length == 0 && PoseNet.currentNotes.length == 0 && this.props.songId != -1){
          PoseNet.backlogNotes = PoseNet.songs[this.props.songId]



          PoseNet.currentNotes.push(
            {
              id: PoseNet.backlogNotes[0][0],
              x: this.props.currentInstrument.boxes[PoseNet.backlogNotes[0][0]].minX+10,
              y: 0, //this.props.currentInstrument.boxes[PoseNet.songs[this.props.songId][0][0]].minY
              width: this.props.currentInstrument.boxes[PoseNet.backlogNotes[0][0]].maxX-this.props.currentInstrument.boxes[PoseNet.backlogNotes[0][0]].minX-20,
              height: 50,
              inBox: false,
              isScored: false
            })

          PoseNet.timeDelay = PoseNet.backlogNotes[0][1]*30;

          PoseNet.backlogNotes = PoseNet.backlogNotes.slice(1, PoseNet.backlogNotes.length);



        }

        //console.log(PoseNet.backlogNotes[0]);
        //console.log(PoseNet.currentNotes);

        // check if a new note should be added
        if (PoseNet.timeCount == PoseNet.timeDelay && PoseNet.backlogNotes.length != 0) {
          if(PoseNet.backlogNotes[0][0] != -1) {
          PoseNet.currentNotes.push(
            {
              id: PoseNet.backlogNotes[0][0],
              x: this.props.currentInstrument.boxes[PoseNet.backlogNotes[0][0]].minX+10,
              y: 0, //this.props.currentInstrument.boxes[PoseNet.songs[this.props.songId][0][0]].minY
              width: this.props.currentInstrument.boxes[PoseNet.backlogNotes[0][0]].maxX-this.props.currentInstrument.boxes[PoseNet.backlogNotes[0][0]].minX-20,
              height: 50
            })
        }

          PoseNet.timeDelay = /*PoseNet.backlogNotes[0][1]*/ 7;

          PoseNet.timeCount = 0;

          PoseNet.backlogNotes = PoseNet.backlogNotes.slice(1, PoseNet.backlogNotes.length);

        }


        PoseNet.currentNotes.forEach((note) => {

          // if the note is in the box, check if the box is pressed
          if(!note.isScored && note.y > this.props.currentInstrument.boxes[note.id].minY) {
            note.inBox = true;
            //PoseNet.score += 1;
            //note.isScored = true;
          } else {
            note.inBox = false;
          }

          if(note.y > this.props.currentInstrument.boxes[note.id].maxY) {
            PoseNet.currentNotes = PoseNet.currentNotes.slice(1, PoseNet.currentNotes.length);
          }

          canvasContext.rect(note.x, note.y, note.width, note.height);
          canvasContext.stroke();
          note.y += 35;

        })

        if (PoseNet.backlogNotes.length == 0 && PoseNet.currentNotes.length == 0 && this.props.songId != -1){
          PoseNet.songDone = this.props.songId;
          console.log("Score : " + PoseNet.score);
        }

        PoseNet.timeCount += 1;

      }

      if (this.props.currentInstrument != null) {
        const leftWrist = poses[0].keypoints[9].position;
        const rightWrist = poses[0].keypoints[10].position;
        if (this.props.currentInstrument.name === "guitar") {
          this.props.currentInstrument.boxes.forEach(ele => {
            canvasContext.rect(ele.minX, ele.minY, ele.maxX, ele.maxY);
            canvasContext.stroke();
          })
          const boxes = this.props.currentInstrument.boxes;
          if (boxes[0].minX <= leftWrist.x && boxes[0].maxX >= leftWrist.x && boxes[0].minY <= leftWrist.y && boxes[0].maxY >= leftWrist.y) {
            if (!boxes[0].toggle) {
              this.props.currentInstrument.boxes.slice(1).forEach((ele) => {
                if (ele.minX <= rightWrist.x && ele.maxX >= rightWrist.x && ele.minY <= rightWrist.y && ele.maxY >= rightWrist.y) {
                    //console.log(`Triggered ${ele}`);
                    ele.effect();
                  }
              });
              boxes[0].toggle = true;
            }
          } else {
            if (boxes[0].toggle) {
              this.props.currentInstrument.boxes.slice(1).forEach((ele) => {
                if (ele.minX <= rightWrist.x && ele.maxX >= rightWrist.x && ele.minY <= rightWrist.y && ele.maxY >= rightWrist.y) {
                    //console.log(`Triggered ${ele}`);
                    ele.effect();
                  }
              });
              boxes[0].toggle = true;
            }
            boxes[0].toggle = false;
          }
        } else {
          this.props.currentInstrument.boxes.forEach((ele) => {
            //canvasContext.beginPath()
            canvasContext.rect(ele.minX, ele.minY, ele.maxX, ele.maxY);
            canvasContext.stroke();

            if ((ele.minX <= leftWrist.x && ele.maxX >= leftWrist.x && ele.minY <= leftWrist.y && ele.maxY >= leftWrist.y) ||
                (ele.minX <= rightWrist.x && ele.maxX >= rightWrist.x && ele.minY <= rightWrist.y && ele.maxY >= rightWrist.y)) {
                  //console.log(`Triggered ${ele}`);
                  if (!ele.played) {
                    if(!this.props.isHero) {
                      ele.effect();
                      ele.played = true;
                    }

                    PoseNet.currentNotes.forEach((note) => {
                      if (note.inBox && !note.isScored) {
                        ele.effect();
                        ele.played = true;
                        PoseNet.score += 1;
                        note.isScored = true;
                      }
                    })

                  }
              } else if (ele.played) {
                ele.played = false;
              }
          });
      }
      }

      requestAnimationFrame(findPoseDetectionFrame);

    };
    findPoseDetectionFrame()
  }

  render() {
    return (
      <div>
        <div>
          <video id="videoNoShow" playsInline ref={this.getVideo} style={{display: 'none', width: "100%"}} />
          <canvas className="webcam" ref={this.getCanvas} />
        </div>
      </div>
    )
  }
}

export default PoseNet
