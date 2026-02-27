import VolumeSlashIcon from 'react:/src/icons/volume-mute.svg'

export default (DummyHeader = (props) => {
  return (
    <header
      className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out"
      key={'header'}
    >
      <VolumeSlashIcon className="w-6 h-6 text-white" />
    </header>
  )
})
