import { useQuery } from '@apollo/client'
import { Carousel, Card, Button, Placeholder } from 'react-bootstrap'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import { GET_ALL_STORIES } from '../../api/queries'
import './Home.css'
import { Link } from 'react-router-dom'
import ErrorComponent from '../../components/utilities/Error'
import EmptyState from '../../components/utilities/EmptyState'
import '../../utils/theme.css'
import { useDarkMode } from '../../context/DarkModeContext'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../context/AuthContext'

const LoadingPlaceholder = () => (
  <Card className="shadow home-card loading-card">
    <Card.Body>
      <Placeholder as={Card.Title} animation="glow">
        <Placeholder xs={8} />
      </Placeholder>
      <Placeholder as={Card.Text} animation="glow">
        <Placeholder xs={12} />
        <Placeholder xs={10} />
      </Placeholder>
      <Placeholder as={Card.Text} animation="glow">
        <Placeholder xs={6} />
      </Placeholder>
      <Placeholder.Button variant="secondary" xs={4} />
    </Card.Body>
  </Card>
)

const Home = () => {
  const { isDarkMode } = useDarkMode()
  const { user } = useAuth()
  const isAuthenticated = Boolean(user)
  const { loading, error, data } = useQuery(GET_ALL_STORIES)
  const themeClass = isDarkMode ? 'dark-mode' : 'light-mode'

  if (error) return <ErrorComponent message={error.message} />

  let latestStories = []
  let featuredStories = []

  if (data?.getAllStories?.length) {
    const sortedByReads = [...data.getAllStories].sort((a, b) => b.read_count - a.read_count)
    featuredStories = sortedByReads.slice(0, 5)

    const sortedByCreatedAt = [...data.getAllStories].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    latestStories = sortedByCreatedAt.slice(0, 9)
  }

  const prevIcon = (
    <span className={`carousel-nav-button ${themeClass}`}>
      <ChevronLeft aria-hidden="true" />
    </span>
  )

  const nextIcon = (
    <span className={`carousel-nav-button ${themeClass}`}>
      <ChevronRight aria-hidden="true" />
    </span>
  )

  return (
    <div className="home-container">
      <section className={`hero-section ${themeClass}`}>
        <div className="hero-content">
          <h1>Ignite your next great story</h1>
          <p>
            Discover imaginative tales from the community, get inspired by featured writers and
            publish your own adventures with ThePlotPot.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/new-story">
                  <Button variant="secondary">Write a Story</Button>
                </Link>
                <Link to="/stories">
                  <Button variant="outline-secondary">Browse Stories</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button variant="secondary">Join</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-secondary">Start Writing</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className={`carousel-section ${themeClass}`}>
        <h2 className="section-heading">Featured Stories</h2>
        {loading ? (
          <div className={`carousel-shell ${themeClass}`}>
            <Carousel
              className='home-carousel'
              controls
              indicators
              keyboard
              slide={false}
              data-bs-theme={isDarkMode ? 'dark' : 'light'}
              prevIcon={prevIcon}
              nextIcon={nextIcon}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Carousel.Item key={index}>
                  <div className="carousel-item-wrapper">
                    <LoadingPlaceholder />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        ) : featuredStories.length > 0 ? (
          <div className={`carousel-shell ${themeClass}`}>
            <Carousel
              className='home-carousel'
              controls
              indicators
              keyboard
              slide={false}
              data-bs-theme={isDarkMode ? 'dark' : 'light'}
              prevIcon={prevIcon}
              nextIcon={nextIcon}
            >
              {featuredStories.map((story, index) => (
                <Carousel.Item key={story.id}>
                  <div className="carousel-item-wrapper">
                    <Card className={`shadow home-card ${themeClass}`}>
                      {index === 0 && <span className="badge badge-secondary badge-corner">Top Story</span>}
                      <Card.Body>
                        <Card.Title className="truncate-text">{story.title}</Card.Title>
                        <Card.Text className="truncate-text">{story.description}</Card.Text>
                        <div className="card-meta">
                          <span className="genre-tag">{story.genre}</span>
                          <small className="text-muted">Reads: {story.read_count}</small>
                        </div>
                        <Card.Text>
                          <small className="text-muted">
                            By:&nbsp;
                            <Link className="muted-link" to={`/user/${story.author.id}`}>
                              {story.author.username}
                            </Link>
                          </small>
                        </Card.Text>
                        <Link to={`/story/${story.id}`}>
                          <Button variant="secondary">Read Story</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        ) : (
          <EmptyState
            title="No featured stories yet"
            description="Stories with the most reads will appear here once your community starts sharing."
            actionLabel={isAuthenticated ? 'Create the first story' : 'Join to share a story'}
            actionTo={isAuthenticated ? '/new-story' : '/signup'}
            secondaryAction={
              isAuthenticated ? null : (
                <Link to="/login" className="empty-state-secondary">
                  <Button variant="outline-secondary">Sign in to write</Button>
                </Link>
              )
            }
          />
        )}
      </section>

      <section className={`stories-grid ${themeClass}`}>
        <h2 className="section-heading">Recent Stories</h2>
        <div className="card-grid-container">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingPlaceholder key={index} />
            ))
          ) : latestStories.length > 0 ? (
            latestStories.map(story => (
              <Card className={`shadow home-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`} key={story.id}>
                <Card.Body>
                  <Card.Title>{story.title}</Card.Title>
                  <Card.Text>{story.description}</Card.Text>
                  <div className="card-meta">
                    <span className="genre-tag">{story.genre}</span>
                    <small className="text-muted">
                      {story.read_count} reads · Updated {formatDistanceToNow(new Date(Number(story.createdAt)))} ago
                    </small>
                  </div>
                  <Card.Text>
                    <small className="text-muted">
                      By:&nbsp;
                      <Link className="muted-link" to={`/user/${story.author.id}`}>
                        {story.author.username}
                      </Link>
                    </small>
                  </Card.Text>
                  <Link to={`/story/${story.id}`}>
                    <Button variant="secondary">Read Story</Button>
                  </Link>
                </Card.Body>
              </Card>
            ))
          ) : (
            <EmptyState
              title="No stories to show yet"
              description="When new stories are published, you’ll find them here. Be the first to share something new!"
              actionLabel={isAuthenticated ? 'Share your story' : 'Join to share a story'}
              actionTo={isAuthenticated ? '/new-story' : '/signup'}
              secondaryAction={
                isAuthenticated ? null : (
                  <Link to="/login" className="empty-state-secondary">
                    <Button variant="outline-secondary">Sign in to write</Button>
                  </Link>
                )
              }
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default Home