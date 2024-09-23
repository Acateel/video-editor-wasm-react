import Button from './ui/Button'
import { fetchFile } from '@ffmpeg/ffmpeg'
import { useState } from 'react'
import { filters } from '../common/constant'
import './VideoFilters.css'

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
      await ffmpeg.run(
        '-i',
        'input.mp4',
        '-vf',
        filteredComand,
        'output.mp4'
      )
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
    <div className="filter-selector-container">
      <label htmlFor="filterSelector">Select filter: </label>
      <div className="filter-selector-inner-container">
        <select
          className="filter-selector"
          id="filterSelector"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {Object.keys(filters).map((filter) => (
            <option key={filter} value={filter.name}>
              {filters[filter].name}
            </option>
          ))}
        </select>

        <Button disabled={!videoFile} onClick={() => applyFilter()}>
          Add
        </Button>
        <Button
          disabled={!videoFile}
          danger={true}
          onClick={() => resetFilter()}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default VideoFilters
