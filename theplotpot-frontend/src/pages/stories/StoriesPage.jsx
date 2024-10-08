import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Modal, Button, Container, Row, Col, Card, ListGroup, Form, InputGroup, Dropdown } from 'react-bootstrap'
import { GET_ALL_STORIES } from '../../api/queries'
import ErrorComponent from '../../components/Error'
import { useDarkMode } from '../../components/DarkModeContext'
import '../../utils/theme.css'

const StoriesPage = () => {
  const { loading, error, data } = useQuery(GET_ALL_STORIES)
  const { isDarkMode } = useDarkMode()
  const [filteredStories, setFilteredStories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (data && data.getAllStories) {
      setFilteredStories(data.getAllStories)
      const uniqueCategories = [...new Set(data.getAllStories.map((story) => story.genre))]
      setCategories(uniqueCategories)
    }
  }, [data])

  const handleClick = (story) => {
    setModalData(story)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const filterByGenre = (genre) => {
    setSelectedGenre(genre)

    if (!genre || genre.trim() === '') {
      setFilteredStories(data.getAllStories)
    } else {
      const filtered = data.getAllStories.filter((story) =>
        story.genre.toLowerCase().includes(genre.toLowerCase())
      )
      setFilteredStories(filtered)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value.trim() === '') {
      filterByGenre('')
    } else {
      setShowDropdown(true)
    }
  }

  const handleGenreSelect = (genre) => {
    setSearchTerm(genre)
    filterByGenre(genre)
    setShowDropdown(false)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <ErrorComponent message={error.message} />

  return (
    <Container>
      <Row>
        <Col>
          <h1>All Stories</h1>

          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search genres..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay closing to allow selection
              className={isDarkMode ? 'dark-mode' : 'light-mode'}
            />
          </InputGroup>

          {showDropdown && (
            <Dropdown show={showDropdown}>
              <Dropdown.Menu style={{ display: 'block', maxHeight: '200px', overflowY: 'auto' }} className={isDarkMode ? 'dark-mode' : 'light-mode'}>
                {categories
                  .filter((genre) =>
                    genre.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((genre, index) => (
                    <Dropdown.Item
                      key={index}
                      active={selectedGenre === genre}
                      onClick={() => handleGenreSelect(genre)}
                    >
                      {genre}
                    </Dropdown.Item>
                  ))}
                {categories.length === 0 && (
                  <Dropdown.Item disabled>No genres found</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          <ListGroup>
            {filteredStories.map((story) => (
              <ListGroup.Item
                key={story.id}
                onClick={() => handleClick(story)}
                className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}
              >
                <Card className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                  <Card.Body>
                    <Row>
                      <Col xs={8}>
                        <Card.Title>
                          {story.title}{' '}
                          <small className="text-muted">by {story.author.username}</small>
                          <small style={{ fontSize: '0.6em', paddingLeft: '5px' }}>
                            (Click for details)
                          </small>
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{story.genre}</Card.Subtitle>
                      </Col>
                      <Col xs={4} className="text-right">
                        <Link to={`/story/${story.id}`}>
                          <Button variant="secondary">Read Story</Button>
                        </Link>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {modalData && (
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <Modal.Title>{modalData.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <p>{modalData.description}</p>
                <Link to={`/story/${modalData.id}`}>
                  <Button variant="secondary">Read Story</Button>
                </Link>
              </Modal.Body>
            </Modal>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default StoriesPage
