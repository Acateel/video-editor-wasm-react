import { Button } from 'antd'
import { fetchFile } from '@ffmpeg/ffmpeg'
import { useState } from 'react'
import FilterSelector from './ui/FilterSelector'
import { filters } from '../common/constant'

function VideoFilters({
  ffmpeg,
  videoFile,
  initVideoFile,
  onFilteredStart = () => {},
  onFilteredEnd = () => {},
  onChangeVideo = () => {},
}) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0].name)

  const applyFilter = async () => {
    onFilteredStart()

    await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))
    onChangeVideo(undefined)

    let filteredComand = filters.find(
      (filter) => filter.name === selectedFilter
    ).setting

    if (filteredComand) {
      await ffmpeg.run('-i', 'input.mp4', '-vf', filteredComand, 'output.mp4')
    } else {
      await ffmpeg.run('-i', 'input.mp4', 'output.mp4')
    }

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
      <FilterSelector
        filters={filters}
        selectedFilter={selectedFilter}
        onChange={(filter) => setSelectedFilter(filter)}
      />
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
