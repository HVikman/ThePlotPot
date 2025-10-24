import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import './StoryPage.css'
import { Button } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, HandThumbsUpFill } from 'react-bootstrap-icons'
import { useLikeUnlikeChapter, useIsChapterLiked } from '../../hooks/useLikes.js'
import Comments from './Comments'
import { Popconfirm } from 'antd'
import { useMutation } from '@apollo/client'
import { DELETE_CHAPTER, DELETE_STORY } from '../../api/queries'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationsContext'
import { useDarkMode } from '../../context/DarkModeContext'
import '../../utils/theme.css'
import { Link } from 'react-router-dom'

const Chapter = ({ chapter, childChapters, onNavigate, onAddChapter, onGoBack, isLoading }) => {
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const [deleteChapter] = useMutation(DELETE_CHAPTER)
  const [deleteStory] = useMutation(DELETE_STORY)
  const [isLiked, setIsLiked] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const { isDarkMode } = useDarkMode()
  const [likes, setLikes] = useState(chapter.votes_count)

  const initialIsLiked = useIsChapterLiked(chapter.id)
  useEffect(() => {
    setIsLiked(initialIsLiked)
  }, [initialIsLiked])

  const toggleLikeUnlike = useLikeUnlikeChapter()

  const handleButton = async () => {
    setIsDisabled(true)

    if (!isLiked) {
      const result = await toggleLikeUnlike(true, chapter.id)
      setIsLiked(true)
      setLikes(likes+1)
      console.log('Like result:', result)}
    else {const result = await toggleLikeUnlike(false, chapter.id)
      setIsLiked(false)
      setLikes(likes-1)
      console.log('Unlike result:', result)}

    setTimeout(() => {
      setIsDisabled(false)
    }, 1000)
  }
  const handleDelete = async () => {
    console.log(chapter)
    try {
      if (chapter.branch === 0) {
        const response = await deleteStory({
          variables: { id: chapter.story.id }
        })

        if (response.data.deleteStory.success) {
          addNotification(response.data.deleteStory.message, 3000, 'success')
          navigate('/')
          console.log('Story deleted successfully')
        } else {
          console.error(response.data.deleteStory.message)
          addNotification(response.data.deleteStory.message, 3000, 'error')
        }

      } else {
        const response = await deleteChapter({
          variables: { id: chapter.id }
        })

        if (response.data.deleteChapter.success) {
          addNotification(response.data.deleteChapter.message, 3000, 'success')
          navigate('/')
          console.log('Chapter deleted successfully')
        } else {
          console.error(response.data.deleteChapter.message)
          addNotification(response.data.deleteChapter.message, 3000, 'error')
        }
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }



  const { user } = useAuth()
  const isAuthenticated = !!user
  const sanitizedHTML = DOMPurify.sanitize(chapter.content)
  const likesLabel = `${likes} ${likes === 1 ? 'like' : 'likes'}`
  const chapterAuthorId = chapter.author?.id
  const canToggleLike = isAuthenticated && (!chapterAuthorId || user.id !== chapterAuthorId)
  const canDeleteChapter = isAuthenticated && chapterAuthorId && user.id === chapterAuthorId && childChapters.length === 0

  return (
    <div className="chapter-reader">
      <div className="chapter-back">
        <Button
          variant={isDarkMode ? 'outline-light' : 'outline-dark'}
          onClick={() => onGoBack()}
        >
          <ArrowLeft /> Back
        </Button>
      </div>

      <article className={`chapter-card ${isDarkMode ? 'chapter-card--dark' : 'chapter-card--light'}`}>
        <header className="chapter-card__header">
          <span className="chapter-card__eyebrow">Chapter {chapter.branch + 1}</span>
          <h2 className="chapter-card__title">{chapter.title || ''}</h2>
          <div className="chapter-card__meta">
            {chapter.author && (
              <span>
                By <Link to={`/user/${chapter.author.id}`}>{chapter.author.username}</Link>
              </span>
            )}
            <span>{chapter.reads_count} {chapter.reads_count === 1 ? 'read' : 'reads'}</span>
            <span>{likesLabel}</span>
          </div>
        </header>

        <div
          className="chapter-card__content"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />

        <footer className="chapter-card__footer">
          <div className="chapter-card__toolbar">
            <div className="chapter-card__likes">
              <span>{likesLabel}</span>
              {canToggleLike ? (
                <Button
                  disabled={isDisabled}
                  variant={isLiked ? 'success' : (isDarkMode ? 'outline-light' : 'outline-dark')}
                  onClick={() => handleButton()}
                >
                  <HandThumbsUpFill />
                </Button>
              ) : !isAuthenticated ? (
                <span>Sign in to applaud</span>
              ) : null}
            </div>

            <div className="chapter-card__admin">
              {canDeleteChapter && (
                <Popconfirm
                  title={chapter.branch === 0 ? 'Delete story' : 'Delete chapter'}
                  description={chapter.branch === 0 ? 'Are you sure you want to delete this story' : 'Are you sure you want to delete this chapter'}
                  onConfirm={handleDelete}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button variant='outline-danger'>Delete</Button>
                </Popconfirm>
              )}
              {user?.has_superpowers && (
                <Popconfirm
                  title={chapter.branch === 0 ? 'Delete story' : 'Delete chapter'}
                  description={chapter.branch === 0 ? 'Are you sure you want to delete this story' : 'Are you sure you want to delete this chapter'}
                  onConfirm={handleDelete}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button variant='outline-danger'>Admin delete</Button>
                </Popconfirm>
              )}
            </div>
          </div>

          <div className="chapter-card__choices">
            {!isLoading && isAuthenticated && childChapters.length < 3 && chapter.branch < 9 && (
              <Button variant={isDarkMode ? 'outline-light' : 'outline-dark'} onClick={() => onAddChapter()}>
                Add chapter
              </Button>
            )}
            {childChapters.map(child => (
              <Button
                variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                key={child.id}
                onClick={() => onNavigate(child.id)}
              >
                Continue to {child.title || 'next chapter'}
              </Button>
            ))}
          </div>
        </footer>
      </article>

      <Comments key={chapter.id} comments={chapter.comments} chapterId={chapter.id} />
    </div>
  )
}


export default Chapter
