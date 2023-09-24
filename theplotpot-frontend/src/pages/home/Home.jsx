import { useQuery } from '@apollo/client'
import { Carousel, Card, Button, CardGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GET_ALL_STORIES } from '../../api/queries'
import './home.css'
import { Link } from 'react-router-dom'
import ErrorComponent from '../../components/Error'



const LoadingPlaceholder = () => {
  return (
    <div style={{ backgroundColor: '#e0e0e0', height: '100%', width: '100%' }}></div>
  )
}

const Home = () => {
  const { loading, error, data } = useQuery(GET_ALL_STORIES)

  if (error) return <ErrorComponent message={error.message} />

  let latestStories = []
  if (data) {
    const sortedStories = [...data.getAllStories].sort((a, b) => b.id - a.id)
    latestStories = sortedStories.slice(0, 9)
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
          )) : data.getAllStories.slice(0, 5).map((story, index) => (
            <Carousel.Item key={story.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', width: '100%' }}>
                <Card className="shadow" style={{ textAlign: 'center', width: '80%', minHeight: '70%' }}>
                  {index === 0 && <span className="badge badge-secondary badge-corner">Top Story</span>}
                  <Card.Body>
                    <Card.Title>{story.title}</Card.Title>
                    <Card.Text>{story.description}</Card.Text>
                    <Card.Text>Genre: {story.genre}</Card.Text>
                    <Card.Text><small className="text-muted">By:<Link to={`/user/${story.author.id}`}>{story.author.username}</Link> </small></Card.Text>
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
              <Card className="shadow" key={story.id} style={{ margin: '15px' }}>
                <Card.Body>
                  <Card.Title>{story.title}</Card.Title>
                  <Card.Text>{story.description}</Card.Text>
                  <Card.Text>Genre: {story.genre}</Card.Text>
                  <Card.Text><small className="text-muted">By: <Link to={`/user/${story.author.id}`}>{story.author.username}</Link></small></Card.Text>
                  <Link to={`/story/${story.id}`}>
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