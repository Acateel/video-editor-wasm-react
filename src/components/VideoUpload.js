import { Upload } from 'antd'
import Button from './ui/Button'

function VideoUpload({ disabled, onChange = () => {}, onRemove = () => {} }) {
  return (
    <>
      <Upload
        disabled={disabled}
        beforeUpload={() => {
          return false
        }}
        accept="video/*"
        onChange={(info) => {
          if (info.fileList && info.fileList.length > 0) {
            onChange(info.fileList[0].originFileObj)
          }
        }}
        showUploadList={false}
      >
        <Button>Upload Video</Button>
      </Upload>
      <Button
        danger={true}
        disabled={!disabled}
        onClick={() => {
          onRemove(undefined)
        }}
      >
        Remove
      </Button>
    </>
  )
}

export default VideoUpload
