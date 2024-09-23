import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { VideoPlayer } from './VideoPlayer'
import { sliderValueToVideoTime } from '../utils/utils'
import VideoUpload from './VideoUpload'
import VideoConversionButton from './VideoConversionButton'
import VideoFilters from './VideoFilters'
import RangeSlider from './ui/RangeSlider'
import './VideoEditor.css'
const ffmpeg = createFFmpeg({ log: false })

function VideoEditor() {
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false)
  const [videoFile, setVideoFile] = useState()
  const [initVideoFile, setInitVideoFile] = useState()
  const [videoPlayerState, setVideoPlayerState] = useState()
  const [videoPlayer, setVideoPlayer] = useState()
  const [gifUrl, setGifUrl] = useState()
  const [sliderValues, setSliderValues] = useState([0, 100])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // loading ffmpeg on startup
    ffmpeg.load().then(() => {
      setFFmpegLoaded(true)
    })
  }, [])

  useEffect(() => {
    const min = sliderValues[0]
    // when the slider values are updated, updating the
    // video time
    if (min !== undefined && videoPlayerState && videoPlayer) {
      videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues])

  useEffect(() => {
    if (videoPlayer && videoPlayerState) {
      // allowing users to watch only the portion of
      // the video selected by the slider
      const [min, max] = sliderValues

      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min)
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max)

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime)
      }
      if (videoPlayerState.currentTime > maxTime) {
        // looping logic
        videoPlayer.seek(minTime)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoPlayerState])

  useEffect(() => {
    // when the current videoFile is removed,
    // restoring the default state
    if (!videoFile) {
      setVideoPlayerState(undefined)
      setSliderValues([0, 100])
      setVideoPlayerState(undefined)
      setGifUrl(undefined)
    }
  }, [videoFile])

  return (
    <div>
      <Spin
        spinning={processing || !ffmpegLoaded}
        tip={!ffmpegLoaded ? 'Waiting for FFmpeg to load...' : 'Processing...'}
      >
        <div className={'upload-div'}>
          <VideoUpload
            disabled={!!videoFile}
            onChange={(videoFile) => {
              setVideoFile(videoFile)
              setInitVideoFile(videoFile)
            }}
            onRemove={() => {
              setVideoFile(undefined)
              setInitVideoFile(undefined)
            }}
          />
        </div>
        <div className="container">
          <div>
            {videoFile ? (
              <VideoPlayer
                src={URL.createObjectURL(videoFile)}
                onPlayerChange={(videoPlayer) => {
                  setVideoPlayer(videoPlayer)
                }}
                onChange={(videoPlayerState) => {
                  setVideoPlayerState(videoPlayerState)
                }}
              />
            ) : (
              <h1>Upload a video</h1>
            )}
          </div>
          <div className={'filter-div filter-selector-container'}>
            <VideoFilters
              ffmpeg={ffmpeg}
              videoFile={videoFile}
              initVideoFile={initVideoFile}
              onFilteredStart={() => {
                setProcessing(true)
              }}
              onFilteredEnd={() => {
                setProcessing(false)
              }}
              onChangeVideo={(videoFile) => {
                setVideoFile(videoFile)
              }}
            />
          </div>
          <div className={'slider-div'}>
            <h3>Cut Video</h3>
            <RangeSlider
              disabled={!videoPlayerState}
              value={sliderValues}
              onChange={(values) => {
                setSliderValues(values)
              }}
            />
          </div>
          <div className={'conversion-div'}>
            <VideoConversionButton
              onConversionStart={() => {
                setProcessing(true)
              }}
              onConversionEnd={() => {
                setProcessing(false)
              }}
              ffmpeg={ffmpeg}
              videoPlayerState={videoPlayerState}
              sliderValues={sliderValues}
              videoFile={videoFile}
              onGifCreated={(girUrl) => {
                setGifUrl(girUrl)
              }}
            />
          </div>
          {gifUrl && (
            <div className={'gif-div'}>
              <h3>Resulting GIF</h3>
              <img
                src={gifUrl}
                className={'gif'}
                alt={'GIF file generated in the client side'}
              />
              <a
                href={gifUrl}
                download={'test.gif'}
                className={'ant-btn ant-btn-default'}
              >
                Download
              </a>
            </div>
          )}
        </div>
      </Spin>
    </div>
  )
}

export default VideoEditor
