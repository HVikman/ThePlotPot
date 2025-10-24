import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap'
import { GET_ALL_STORIES } from '../../api/queries'
import ErrorComponent from '../../components/utilities/Error'
import EmptyState from '../../components/utilities/EmptyState'
import { useDarkMode } from '../../context/DarkModeContext'
import '../../utils/theme.css'
import './StoriesPage.css'
import { useAuth } from '../../context/AuthContext'

const StoriesPage = () => {
  const { loading, error, data } = useQuery(GET_ALL_STORIES)
  const { isDarkMode } = useDarkMode()
  const { user } = useAuth()
  const isAuthenticated = Boolean(user)
  const [filteredStories, setFilteredStories] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const categories = useMemo(() => {
    if (!data?.getAllStories) return []
    const uniqueCategories = new Set(data.getAllStories.map((story) => story.genre))
    return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b))
  }, [data])

  useEffect(() => {
    if (data?.getAllStories) {
      setFilteredStories(data.getAllStories)
    }
  }, [data])

  useEffect(() => {
    if (!data?.getAllStories) return

    if (selectedGenres.length === 0) {
      setFilteredStories(data.getAllStories)
    } else {
      setFilteredStories(
        data.getAllStories.filter((story) => selectedGenres.includes(story.genre))
      )
    }
  }, [selectedGenres, data])

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre]
    )
  }

  const clearFilters = () => setSelectedGenres([])

  if (loading) {
    return (
      <div className="stories-page-loading">
        <span className="spinner-border text-secondary" role="status" aria-hidden="true"></span>
        <p className="muted-copy">Loading stories...</p>
      </div>
    )
  }

  if (error) return <ErrorComponent message={error.message} />

  const filteredCategories = categories.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container className="stories-page-container">
      <Row>
        <Col lg={3} className="genre-rail">
          <div className={`genre-panel ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h2 className="stories-subheading">Discover by genre</h2>
            <Form.Control
              type="search"
              placeholder="Search genres"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="genre-search"
            />
            <div className="genre-chips" role="list">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((genre) => {
                  const isSelected = selectedGenres.includes(genre)
                  return (
                    <Button
                      key={genre}
                      variant={isSelected ? 'secondary' : 'outline-secondary'}
                      onClick={() => toggleGenre(genre)}
                      className="genre-chip"
                    >
                      {genre}
                    </Button>
                  )
                })
              ) : (
                <p className="muted-copy">No genres found.</p>
              )}
            </div>
            <div className="genre-meta">
              <Badge bg="secondary">{categories.length}</Badge>
              <span className="muted-copy">genres available</span>
            </div>
            <Button
              variant="link"
              className="clear-filters"
              onClick={clearFilters}
              disabled={selectedGenres.length === 0}
            >
              Clear filters
            </Button>
          </div>
        </Col>
        <Col lg={9}>
          <div className={`stories-header ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div>
              <h1 className="stories-heading">All Stories</h1>
              {selectedGenres.length > 0 && (
                <p className="muted-copy">
                  Filtering by {selectedGenres.join(', ')}
                </p>
              )}
            </div>
            {isAuthenticated ? (
              <Link to="/new-story">
                <Button variant="secondary">Write a story</Button>
              </Link>
            ) : (
              <div className="stories-header__actions">
                <Link to="/signup">
                  <Button variant="secondary">Join</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-secondary">Start Writing</Button>
                </Link>
              </div>
            )}
          </div>
          <div className="stories-list">
            {filteredStories.length > 0 ? (
              filteredStories.map((story) => {
                const updatedTimestamp = story.updatedAt ?? story.createdAt
                const formattedUpdatedDate = updatedTimestamp
                  ? new Date(Number(updatedTimestamp)).toLocaleDateString()
                  : 'Recently updated'

                return (
                  <Card
                    key={story.id}
                    className={`story-card shadow-sm ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                  >
                    <Card.Body>
                      <div className="story-card__header">
                        <div>
                          <Card.Title>{story.title}</Card.Title>
                          <Card.Subtitle className="text-muted">
                            {story.genre} · by {story.author.username}
                          </Card.Subtitle>
                        </div>
                        <Link to={`/story/${story.id}`}>
                          <Button variant="outline-secondary">Read</Button>
                        </Link>
                      </div>
                      <Card.Text className="story-card__description">{story.description}</Card.Text>
                      <div className="story-card__footer">
                        <span className="muted-copy">{story.read_count} reads</span>
                        <span className="muted-copy">Updated {formattedUpdatedDate}</span>
                      </div>
                    </Card.Body>
                  </Card>
                )
              })
            ) : (
              <EmptyState
                title="No stories match these filters"
                description="Try selecting different genres or clearing your current filters to keep exploring."
                actionLabel={isAuthenticated ? 'Share your story' : 'Join to share a story'}
                actionTo={isAuthenticated ? '/new-story' : '/signup'}
                secondaryAction={(
                  <>
                    {!isAuthenticated && (
                      <Link to="/login" className="empty-state-secondary">
                        <Button variant="outline-secondary">Sign in to write</Button>
                      </Link>
                    )}
                    <Button
                      variant="outline-secondary"
                      onClick={clearFilters}
                      disabled={selectedGenres.length === 0}
                    >
                      Clear filters
                    </Button>
                  </>
                )}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default StoriesPage