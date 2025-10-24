/**
 * StoryPage displays story chapters and handles navigation between them.
 * - Supports branching stories (chapters can have children)
 * - Tracks custom chapter navigation stack for backtracking
 * - Loads story and chapter data via GraphQL
 */

import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import Chapter from './Chapter'
import { Container, Button } from 'react-bootstrap'
import { GET_STORY_BY_ID, GET_CHAPTER_CHILDREN, GET_CHAPTER } from '../../api/queries'
import LoadingComponent from './Loading'
import ErrorComponent from '../../components/utilities/Error'
import { useDarkMode } from '../../context/DarkModeContext'
import './StoryPage.css'

const StoryPage = () => {
  const { isDarkMode } = useDarkMode()
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
  // Incoming chapter and navigationStack from navigation state (after adding a chapter)
  // navigationStack tracks the user's path through branching chapters

  const [currentChapter, setCurrentChapter] = useState(null)
  const [navigationStack, setNavigationStack] = useState([])

  useEffect(() => {
    // If chapter is passed via navigation, use it and preserve navigation history
    // Otherwise fallback to the first chapter of the story
    if (chapter) {
      setCurrentChapter(chapter)
      setNavigationStack(newNavigationStack || [])
    } else if (data && data.getStory && data.getStory.chapters) {
      const chapters = data.getStory.chapters
      const initialChapter = (chapterId && chapters.find(item => item.id === chapterId)) || chapters[0]

      if (initialChapter) {
        setCurrentChapter(initialChapter)
        setNavigationStack([])

        navigate(
          `/story/${storyId}/chapter/${initialChapter.id}`,
          {
            state: { chapter: initialChapter, navigationStack: [] },
            replace: true,
          },
        )
      }
    }
  }, [chapter, chapterId, data, navigate, newNavigationStack, storyId])
  useEffect(() => {
    if (currentChapter) {
      getChildChapters({ variables: { id: currentChapter.id } })
    }
  }, [currentChapter, getChildChapters])
  useEffect(() => {
    if (parentChapterData && parentChapterData.getChapter) {
      const parentChapter = parentChapterData.getChapter
      setCurrentChapter(parentChapter)
      setNavigationStack([])
      navigate(
        `/story/${storyId}/chapter/${parentChapter.id}`,
        {
          state: { chapter: parentChapter, navigationStack: [] },
          replace: true,
        },
      )
    }
  }, [navigate, parentChapterData, storyId])

  if (loading) return <LoadingComponent />
  if (error) return <ErrorComponent message={error.message} />

  // Navigates to a child chapter and pushes the current one to the navigation stack
  const navigateToChapter = (chapterId) => {
    let chaptersArray

    if (childChaptersData && childChaptersData.getChapterChildren) {
      chaptersArray = childChaptersData.getChapterChildren
    } else if (data && data.getStory && Array.isArray(data.getStory.chapters)) {
      chaptersArray = data.getStory.chapters
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const nextNavigationStack = [...navigationStack, currentChapter]
    setNavigationStack(nextNavigationStack)
    const selectedChapter = chaptersArray.find(chapter => chapter.id === chapterId)
    if (!selectedChapter) {
      console.log('Chapter not found with the given ID:', chapterId)
      return
    }
    // Find selected chapter from loaded children or fallback to initial chapters
    setCurrentChapter(selectedChapter)
    navigate(
      `/story/${storyId}/chapter/${selectedChapter.id}`,
      {
        state: { chapter: selectedChapter, navigationStack: nextNavigationStack },
      },
    )
    getChildChapters({ variables: { id: selectedChapter.id } })
  }

  // Navigates back to the previous chapter using custom navigation stack
  // Falls back to parent chapter via query if stack is empty
  const goBack = () => {
    const lastChapter = navigationStack[navigationStack.length - 1]
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (lastChapter) {
      const updatedStack = navigationStack.slice(0, -1)
      setNavigationStack(updatedStack)
      setCurrentChapter(lastChapter)
      navigate(
        `/story/${storyId}/chapter/${lastChapter.id}`,
        {
          state: { chapter: lastChapter, navigationStack: updatedStack },
          replace: true,
        },
      )
    } else if (currentChapter && currentChapter.parentChapterId) {
      getParentChapter({ variables: { getChapterId: currentChapter.parentChapterId } })
    } else {
      navigate('/')
    }
  }

  // Navigates to the "Add Chapter" page with context about the current chapter and navigation history
  const handleAddChapter = ( ) => {
    navigate('/add-chapter', {
      state: {
        storyId: storyId,
        parentChapter: currentChapter,
        navigationStack: navigationStack
      }
    })
  }

  const story = data?.getStory
  const storyAuthor = story?.author
  const totalChapters = story?.total_chapters

  return (
    <div className={`story-reader ${isDarkMode ? 'story-reader--dark' : ''}`}>
      <Container className="story-reader__container">
        {story && (
          <header className={`story-reader__header ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="story-reader__header-top">
              <div>
                <span className="story-reader__header-eyebrow">Interactive story</span>
                <h1 className="story-reader__header-title">{story.title}</h1>
              </div>
              <div className="story-reader__header-actions">
                <Button
                  as={Link}
                  to="/stories"
                  variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                  size="sm"
                >
                  Browse stories
                </Button>
              </div>
            </div>
            {story.description && (
              <p className="story-reader__header-description">{story.description}</p>
            )}
            <div className="story-reader__header-meta">
              {storyAuthor && (
                <span>
                  By <Link to={`/user/${storyAuthor.id}`}>{storyAuthor.username}</Link>
                </span>
              )}
              {currentChapter?.title && (
                <span>
                  Chapter {currentChapter.branch + 1}
                  {currentChapter.title ? ` · ${currentChapter.title}` : ''}
                </span>
              )}
              {story.genre && <span>{story.genre}</span>}
              <span>{totalChapters} {totalChapters === 1 ? 'chapter' : 'chapters'}</span>
              {currentChapter?.reads_count != null && (
                <span>{currentChapter.reads_count} {currentChapter.reads_count === 1 ? 'read' : 'reads'}</span>
              )}
              {currentChapter?.author?.coffee && (
                <span>
                  <a href={currentChapter.author.coffee} target="_blank" rel="noreferrer">
                    Support {currentChapter.author.username}
                  </a>
                </span>
              )}
            </div>
          </header>
        )}

        <div className="story-reader__content">
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
        </div>
      </Container>
    </div>
  )
}

export default StoryPage
