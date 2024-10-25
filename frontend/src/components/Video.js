import ReactPlayer from "react-player"

const Video = () => {
  return (
    <div>
        <ReactPlayer
            url="/vids/repco.mp4"
            playing={true}
            loop={true}
            width="100%"
            height="100%"
            volume="0"
            muted={true}
        />
    </div>
  )
}

export default Video;
  