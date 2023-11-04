import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import './chapter.css'
import { Button } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'
import { ArrowLeft, HandThumbsUpFill } from 'react-bootstrap-icons'
import { useLikeUnlikeChapter, useIsChapterLiked } from '../../hooks/likes'
import Comments from './Comments'
import { Popconfirm } from 'antd'
import { useMutation } from '@apollo/client'
import { DELETE_CHAPTER, DELETE_STORY } from '../../api/queries'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../components/NotificationsContext'


const Chapter = ({ chapter, childChapters, onNavigate, onAddChapter, onGoBack, isLoading }) => {
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const [deleteChapter] = useMutation(DELETE_CHAPTER)
  const [deleteStory] = useMutation(DELETE_STORY)
  const [isLiked, setIsLiked] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)

  const initialIsLiked = useIsChapterLiked(chapter.id)
  useEffect(() => {
    setIsLiked(initialIsLiked)
  }, [initialIsLiked])

  const toggleLikeUnlike = useLikeUnlikeChapter()

  const handleButton = async () => {
    setIsDisabled(true)

    if (!isLiked) {
      const result = await toggleLikeUnlike(true, chapter.id)
      chapter.votes_count = chapter.votes_count + 1
      setIsLiked(true)
      console.log('Like result:', result)}
    else {const result = await toggleLikeUnlike(false, chapter.id)
      setIsLiked(false)
      chapter.votes_count = chapter.votes_count- 1
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

  return (
    <div className="chapter">

      <Button variant='secondary' className="mb-3" onClick={() => onGoBack()}>
        < ArrowLeft />
      </Button>
      <div className='chapter-content shadow my-2' dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      <div className="chapter-stats m-2">
        {
          isAuthenticated ? (
            user.id === chapter.author.id ? ( childChapters.length === 0 ?
              <>
                <Popconfirm
                  title={chapter.branch === 0 ?'Delete story' : 'Delete chapter'}
                  description={chapter.branch === 0 ? 'Are you sure you want to delete this story': 'Are you sure you want to delete this chapter'}
                  onConfirm={handleDelete}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button variant='danger'>Delete</Button>
                </Popconfirm><span>Likes:</span></>
              : <span>Likes: </span>) : (
              <Button
                disabled={isDisabled}
                variant={isLiked ? 'success' : 'secondary'}
                className="mt-2"
                onClick={() => handleButton()}
              >
                <HandThumbsUpFill />
              </Button>
            )
          ) : (
            <span>Likes:</span>
          )
        }
        <span>{chapter.votes_count}</span>
      </div>
      <div className="next-chapters m-2">
        {!isLoading && isAuthenticated && childChapters.length < 3 && chapter.branch < 9 && (
          <Button variant='secondary' className="mr-3" onClick={() => onAddChapter()}>Add Chapter</Button>
        )}
        {childChapters.map(child => (
          <Button variant='secondary' className="mr-3" key={child.id} onClick={() => onNavigate(child.id)}>
            Continue to: {child.title}
          </Button>
        ))}

      </div>
      <Comments comments={chapter.comments} chapterId={chapter.id}/>


    </div>
  )
}

export default Chapter
