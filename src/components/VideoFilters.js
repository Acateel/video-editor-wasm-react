import { Button } from 'antd'
import { fetchFile } from '@ffmpeg/ffmpeg'

function VideoFilters({
  ffmpeg,
  videoFile,
  initVideoFile,
  onFilteredStart = () => {},
  onFilteredEnd = () => {},
  onChangeVideo = () => {},
}) {
  const applyFilter = async () => {
    onFilteredStart()

    await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))
    onChangeVideo(undefined)

    // todo: add some new effects
    await ffmpeg.run('-i', 'input.mp4', '-vf', 'hue=s=0', 'output.mp4')

    const data = await ffmpeg.FS('readFile', 'output.mp4')
    const blob = new Blob([data.buffer], { type: 'video/mp4' })

    onChangeVideo(blob)
    onFilteredEnd()
  }

  const resetFilter = async () => {
    onFilteredStart()

    await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(initVideoFile))
    onChangeVideo(undefined)

    await ffmpeg.run('-i', 'input.mp4', 'output.mp4')

    const data = await ffmpeg.FS('readFile', 'output.mp4')
    const blob = new Blob([data.buffer], { type: 'video/mp4' })

    onChangeVideo(blob)
    onChangeVideo(initVideoFile)
    onFilteredEnd()
  }

  return (
    <>
      <Button danger={true} disabled={!videoFile} onClick={() => applyFilter()}>
        Add filter
      </Button>
      <Button disabled={!videoFile} onClick={() => resetFilter()}>
        Reset filter
      </Button>
    </>
  )
}

export default VideoFilters
