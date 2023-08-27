import { useQuery } from '@apollo/client'
import { Carousel, Card, Button, CardGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GET_ALL_STORIES } from '../../api/queries'
import './home.css'
import { Link } from 'react-router-dom'



const Home = () => {
  const { loading, error, data } = useQuery(GET_ALL_STORIES)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const sortedStories = [...data.getAllStories].sort((a, b) => b.id - a.id)

  const latestStories = sortedStories.slice(0, 9)

  return (
    <div className="home-container">
      <section className="carousel-section">
        <h2 className="carousel-heading">Featured Stories</h2>
        <Carousel className='carousel' controls indicators keyboard slide={false} data-bs-theme="dark">
          {data.getAllStories.slice(0, 5).map(story => (
            <Carousel.Item key={story.id} >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', width: '100%' }}>
                <Card className="shadow" style={{ textAlign: 'center', width: '80%', minHeight:'70%' }}>
                  <Card.Body>
                    <Card.Title>{story.title}</Card.Title>
                    <Card.Text>{story.description}</Card.Text>
                    <Card.Text>Genre: {story.genre}</Card.Text>
                    <Card.Text><small className="text-muted">By: {story.author.username}</small></Card.Text>
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
            {latestStories.map(story => (
              <Card className="shadow" key={story.id} style={{ margin: '15px' }}>
                <Card.Body>
                  <Card.Title>{story.title}</Card.Title>
                  <Card.Text>{story.description}</Card.Text>
                  <Card.Text>Genre: {story.genre}</Card.Text>
                  <Card.Text><small className="text-muted">By: {story.author.username}</small></Card.Text>
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
