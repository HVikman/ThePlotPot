import { useQuery } from '@apollo/client'
import { Carousel, Card, Button, CardGroup } from 'react-bootstrap'
import { GET_ALL_STORIES } from '../../api/queries'
import './Home.css'
import { Link } from 'react-router-dom'
import ErrorComponent from '../../components/utilities/Error'
import '../../utils/theme.css'
import { useDarkMode } from '../../context/DarkModeContext'
import { formatDistanceToNow } from 'date-fns'

const LoadingPlaceholder = () => {
  return (
    <div style={{ backgroundColor: '#e0e0e0', height: '100%', width: '100%' }}></div>
  )
}

const Home = () => {
  const { isDarkMode } = useDarkMode()
  const { loading, error, data } = useQuery(GET_ALL_STORIES)

  if (error) return <ErrorComponent message={error.message} />

  let latestStories = []
  let featuredStories = []

  if (data) {
    const sortedByReads = [...data.getAllStories].sort((a, b) => b.read_count - a.read_count)
    featuredStories = sortedByReads.slice(0, 5) // Otetaan 5 tarinaa esiin carouselia varten

    const sortedByCreatedAt = [...data.getAllStories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    latestStories = sortedByCreatedAt.slice(0, 9)
  }

  return (
    <div className="home-container">
      <section className="carousel-section">
        <h2 className="carousel-heading">Featured Stories</h2>
        <Carousel className='carousel' controls indicators keyboard slide={false} data-bs-theme="dark">
          {loading ? Array(5).fill(null).map((_, index) => (
            <Carousel.Item key={index}>
              <LoadingPlaceholder />
            </Carousel.Item>
          )) : featuredStories.map((story, index) => (
            <Carousel.Item key={story.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', width: '100%' }}>
                <Card className="shadow" style={{ textAlign: 'center', width: '80%', minHeight: '70%' }}>
                  {index === 0 && <span className="badge badge-secondary badge-corner">Top Story</span>}
                  <Card.Body>
                    <Card.Title className="truncate-text">{story.title}</Card.Title>
                    <Card.Text className="truncate-text">{story.description}</Card.Text>
                    <Card.Text>Genre: {story.genre}</Card.Text>
                    <Card.Text><small className="text-muted">Reads: {story.read_count}</small></Card.Text>
                    <Card.Text><small className="text-muted">By:<Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={`/user/${story.author.id}`}>{story.author.username}</Link></small></Card.Text>
                    <Link to={`/story/${story.id}`}>
                      <Button variant="secondary">Read Story</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      <section className="stories-grid">
        <h2 className="carousel-heading">Recent Stories</h2>
        <div className="card-grid-container">
          <CardGroup>
            {loading ? Array(9).fill(null).map((_, index) => (
              <Card className="shadow" key={index} style={{ margin: '15px' }}>
                <LoadingPlaceholder />
              </Card>
            )) : latestStories.map(story => (
              <Card className={`shadow ${isDarkMode ? 'dark-mode' : 'light-mode'}`} key={story.id} style={{ margin: '15px', maxWidth:'600px' }}>
                <Card.Body>
                  <Card.Title>{story.title}</Card.Title>
                  <Card.Text>{story.description}</Card.Text>
                  <Card.Text>
                    <span>Genre: {story.genre}</span>
                    <small className="text-muted" style={{ display: 'block', marginTop: '5px' }}>
                      Created {formatDistanceToNow(new Date(Number(story.createdAt)))} ago by:&nbsp;
                      <Link
                        style={{ color: 'inherit', textDecoration: 'inherit' }}
                        to={`/user/${story.author.id}`}
                      >
                        {story.author.username}
                      </Link>
                    </small>
                  </Card.Text>                  <Link to={`/story/${story.id}`}>
                    <Button variant="secondary">Read Story</Button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </CardGroup>
        </div>
      </section>
    </div>
  )
}

export default Home