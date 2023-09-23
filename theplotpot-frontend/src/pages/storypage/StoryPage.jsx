import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Chapter from './Chapter'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { GET_STORY_BY_ID, GET_CHAPTER_CHILDREN, GET_CHAPTER } from '../../api/queries'
import LoadingComponent from './Loading'

const StoryPage = () => {
  const navigate = useNavigate()
  const { storyId, chapterId } = useParams()

  //GraphQL queries
  const { data, loading, error } = useQuery(GET_STORY_BY_ID, {
    variables: { id: storyId, chapterId },
  })
  const [getChildChapters, { data: childChaptersData, loading: childChaptersLoading }] = useLazyQuery(GET_CHAPTER_CHILDREN)
  const [getParentChapter, { data: parentChapterData }] = useLazyQuery(GET_CHAPTER)

  const location = useLocation()
  const { chapter, navigationStack: newNavigationStack } = location.state || {}

  const [currentChapter, setCurrentChapter] = useState(null)
  const [navigationStack, setNavigationStack] = useState([])

  useEffect(() => {
    if (chapter) {
      setCurrentChapter(chapter)
      window.history.replaceState(null, '', `/story/${storyId}/chapter/${chapter.id}`)
      if (newNavigationStack) {
        setNavigationStack(newNavigationStack)
      }
    } else if (data && data.getStory && data.getStory.chapters) {
      setCurrentChapter(data.getStory.chapters[0])
    }
  }, [chapter, data, newNavigationStack, storyId])
  useEffect(() => {
    if (currentChapter) {
      getChildChapters({ variables: { id: currentChapter.id } })
    }
  }, [currentChapter, getChildChapters])
  useEffect(() => {
    if (parentChapterData && parentChapterData.getChapter) {
      setCurrentChapter(parentChapterData.getChapter)
      window.history.replaceState(null, '', `/story/${storyId}/chapter/${parentChapterData.getChapter.id}`)
    }
  }, [parentChapterData, storyId])

  if (loading) return <LoadingComponent />
  if (error) return <p>Error: {error.message}</p>

  const navigateToChapter = (chapterId) => {
    let chaptersArray

    if (childChaptersData && childChaptersData.getChapterChildren) {
      chaptersArray = childChaptersData.getChapterChildren
    } else if (data && data.getStory && Array.isArray(data.getStory.chapters)) {
      chaptersArray = data.getStory.chapters
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setNavigationStack([...navigationStack, currentChapter])
    const selectedChapter = chaptersArray.find(chapter => chapter.id === chapterId)
    if (!selectedChapter) {
      console.log('Chapter not found with the given ID:', chapterId)
      return
    }
    setCurrentChapter(selectedChapter)
    window.history.replaceState(null, '', `/story/${storyId}/chapter/${selectedChapter.id}`)
    getChildChapters({ variables: { id: selectedChapter.id } })
  }

  const goBack = () => {
    const lastChapter = navigationStack.pop()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    console.log(currentChapter)
    setNavigationStack([...navigationStack])
    if (lastChapter) {
      setCurrentChapter(lastChapter)
      window.history.replaceState(null, '', `/story/${storyId}/chapter/${lastChapter.id}`)
    } else if (currentChapter && currentChapter.parentChapterId) {
      getParentChapter({ variables: { getChapterId: currentChapter.parentChapterId } })
    } else {
      navigate('/')
    }
  }

  const handleAddChapter = ( ) => {
    navigate('/add-chapter', {
      state: {
        storyId: storyId,
        parentChapter: currentChapter,
        navigationStack: navigationStack
      }
    })
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={9}>
          {currentChapter && (
            <Chapter
              chapter={currentChapter}
              childChapters={childChaptersData ? childChaptersData.getChapterChildren : []}
              onNavigate={navigateToChapter}
              onAddChapter={handleAddChapter}
              onGoBack={goBack}
              isLoading={childChaptersLoading}
            />
          )}
        </Col>
        <Col md={3}>
          {currentChapter &&
            <Card>
              <Card.Body>
                <Card.Title>{data.getStory.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{data.getStory.genre}</Card.Subtitle>
                {currentChapter.title && <Card.Text>Chapter {currentChapter.branch+1}:<br /> { currentChapter.title }</Card.Text> }
                <Card.Text><span>Reads: {currentChapter && currentChapter.reads_count}</span></Card.Text>
                <Card.Text><small className="text-muted">Written by: {currentChapter ? currentChapter.author.username : data.getStory.author.username}</small></Card.Text>
                {currentChapter.branch === 0 ?<Card.Text>{data.getStory.description}</Card.Text>:null}
                {currentChapter.author.coffee && <Card.Text>Enjoying what {currentChapter.author.username} is writing? <a href={currentChapter.author.coffee} target="_blank" rel="noreferrer"> Buy them a coffee </a>  </Card.Text>}

              </Card.Body>
            </Card>}

        </Col>
      </Row>
    </Container>
  )
}

export default StoryPage
