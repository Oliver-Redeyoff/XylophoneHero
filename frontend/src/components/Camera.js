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
  }

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
        outputStride: 16,
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
    const {
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

    const posenetModel = this.posenet;
    const video = this.video;

    const findPoseDetectionFrame = async () => {
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
      if (this.props.currentInstrument != null) {
        const leftWrist = poses[0].keypoints[9].position;
        const rightWrist = poses[0].keypoints[10].position;
        console.log(leftWrist);
        console.log(rightWrist);
        this.props.currentInstrument.boxes.forEach((ele) => {
          //canvasContext.beginPath()
          canvasContext.rect(ele.minX, ele.minY, ele.maxX, ele.maxY);
          canvasContext.stroke();
          
          if ((ele.minX <= leftWrist.x && ele.maxX >= leftWrist.x && ele.minY <= leftWrist.y && ele.maxY >= leftWrist.y) ||
              (ele.minX <= rightWrist.x && ele.maxX >= rightWrist.x && ele.minY <= rightWrist.y && ele.maxY >= rightWrist.y)) {
                // console.log(`Triggered ${ele}`);
                // console.log(ele.played);
                if (true || !ele.played) {
                  ele.effect();
                  ele.played = true;
                }
            } else if (false && ele.played) {
              ele.played = false;
            }
        });
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
