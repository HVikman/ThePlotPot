import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Card, Accordion, Container, Row, Col, ListGroup } from 'react-bootstrap'
import { GET_USER_PROFILE } from '../../api/queries'
import { CupHot } from 'react-bootstrap-icons'
import { useDarkMode } from '../../components/DarkModeContext'

const UserPage = () => {
  const { isDarkMode } = useDarkMode()
  const { id } = useParams()
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { getUserProfileId: id }
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const { user, stories, chapters } = data.getUserProfile
  console.log(data)

  const groupedChapters = chapters.reduce((acc, chapter) => {
    const storyId = chapter.story.id
    const branch = chapter.branch
    if (!acc[storyId]) {
      acc[storyId] = {
        storyTitle: chapter.story.title,
        branches: {},
      }
    }
    if (!acc[storyId].branches[branch]) {
      acc[storyId].branches[branch] = []
    }
    acc[storyId].branches[branch].push(chapter)
    return acc
  }, {})

  return (
    <Container >
      <Row className="mt-5">
        <Col md={4}>
          <Card style={{ width: '18rem' }} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Card.Body >
              <Card.Img variant="top" src={`https://www.gravatar.com/avatar/${user.email}?d=robohash&r=g&s=100`} />
              <Card.Title className="mt-2">{user.username}</Card.Title>
              {user.coffee && <Card.Text><Link to={user.coffee} style={{ color: 'inherit', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
  Buy Me a Coffee
              </Link> <CupHot /> </Card.Text>}
              <Card.Text>Some day user could have nice description or bio here!</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1" className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
              <Accordion.Header>Stories</Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  {stories.map((story) => (
                    <ListGroup.Item key={story.id}><Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={`/story/${story.id}`}>{story.title} - {story.genre}</Link></ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
              <Accordion.Header >Chapters</Accordion.Header>
              <Accordion.Body >
                {Object.keys(groupedChapters).map(storyId => (
                  <div key={storyId} className="mb-2">
                    <h4 >{groupedChapters[storyId].storyTitle}</h4>
                    {Object.keys(groupedChapters[storyId].branches).sort((a, b) => a - b).map(branch => (
                      <div key={branch} className="mb-3">
                        <h5>Branch {branch}</h5>
                        <ListGroup>
                          {groupedChapters[storyId].branches[branch].map(chapter => (
                            <ListGroup.Item key={chapter.id}>
                              <Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={`/story/${storyId}/chapter/${chapter.id}`}>{chapter.title} - Likes: {chapter.votes_count} - Reads: {chapter.reads_count}</Link>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    ))}
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          {/* Stats will be here*/}
        </Col>
      </Row>
    </Container>
  )
}

export default UserPage
