import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router-dom'
import Chapter from './Chapter'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { GET_STORY_BY_ID } from '../../api/queries'

const StoryPage = () => {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const { data, loading, error } = useQuery(GET_STORY_BY_ID, {
    variables: { id: storyId },
  })

  const [currentChapter, setCurrentChapter] = useState(null)

  useEffect(() => {
    if (data && data.getStory && data.getStory.chapters) {
      const rootChapter = data.getStory.chapters.find(chapter => chapter.branch === 0)
      setCurrentChapter(rootChapter)
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const navigateToChapter = (chapterId) => {
    const selectedChapter = data.getStory.chapters.find(chapter => chapter.id === chapterId)
    setCurrentChapter(selectedChapter)
  }

  const handleAddChapter = (parentChapterId, branch) => {
    navigate('/add-chapter', {
      state: {
        storyId: storyId,
        parentChapterId: parentChapterId,
        branch: branch
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
              chapters={data.getStory.chapters}
              onNavigate={navigateToChapter}
              onAddChapter={handleAddChapter}
            />
          )}
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>{data.getStory.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{data.getStory.genre}</Card.Subtitle>
              {currentChapter ? currentChapter.title?<Card.Text>Current chapter: { currentChapter.title }</Card.Text> : <Card.Text>Current chapter: First chapter</Card.Text>:''}
              <Card.Text>{data.getStory.description}</Card.Text>
              <Card.Text><small className="text-muted">Written by: {data.getStory.author.username}</small></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default StoryPage
