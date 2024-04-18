import { Spin } from 'antd'
import { Card } from 'react-bootstrap'
import { useDarkMode } from '../../components/DarkModeContext'
import '../../utils/theme.css'

const loadingTexts = [
  'Your epic saga is so vast, even our scrolls are taking a while. Hang tight!',
  'Your tale\'s intrigue has our library elves on their toes. One moment!',
  'Such a legendary story requires some extra ink and quill. Bear with us...',
  'Even the grand storytellers of old would be impressed! Prepping your narrative...',
  'Your chapters are so gripping, our books needed a breather. Stay tuned...',
  'Paging all scribes! Your monumental tale is on the way...',
  'Even our magic mirrors need a second to capture the grandeur of your plot. Patience!',
  'Your story has so many layers, even the onions are jealous. Peeling back the pages...',
  'With tales as epic as yours, even the stars stop to listen. Setting the stage...',
  'Weaving tales this intricate takes a touch of sorcery. Conjuring your story...'
]

const getRandomLoadingText = () => {
  return loadingTexts[Math.floor(Math.random() * loadingTexts.length)]
}

const LoadingComponent = () => {
  const { isDarkMode } = useDarkMode()
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Card style={{ width: '300px', textAlign: 'center' }} className={`shadow ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Card.Body >
          <Spin size="large" className='my-3' />
          <Card.Title>Fetching the Story...</Card.Title>
          <Card.Text>
            {getRandomLoadingText()}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default LoadingComponent