import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import './chapter.css'
import { Button } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'
import { ArrowLeft, HandThumbsUpFill } from 'react-bootstrap-icons'
import { useLikeUnlikeChapter, useIsChapterLiked } from '../../hooks/likes'


const Chapter = ({ chapter, childChapters, onNavigate, onAddChapter, onGoBack, isLoading }) => {
  const [isLiked, setIsLiked] = useState(null)
  const initialIsLiked = useIsChapterLiked(chapter.id)
  useEffect(() => {
    setIsLiked(initialIsLiked)
  }, [initialIsLiked])

  const toggleLikeUnlike = useLikeUnlikeChapter()

  const handleButton = async () => {
    if (!isLiked) {
      const result = await toggleLikeUnlike(true, chapter.id)
      chapter.votes_count = chapter.votes_count + 1
      setIsLiked(true)
      console.log('Like result:', result)}
    else {const result = await toggleLikeUnlike(false, chapter.id)
      setIsLiked(false)
      chapter.votes_count = chapter.votes_count- 1
      console.log('Unlike result:', result)}
  }


  const { user } = useAuth()
  const isAuthenticated = !!user
  const sanitizedHTML = DOMPurify.sanitize(chapter.content)

  return (
    <div className="chapter">

      <Button variant='secondary' className="mb-3" onClick={() => onGoBack()}>
        < ArrowLeft />
      </Button>
      <div className='chapter-content' dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      <div className="chapter-stats">
        {
          isLiked !== null && isAuthenticated ? (
            <Button variant={isLiked ? 'success' : 'secondary'} className="m-2" onClick={() => handleButton()}>
              <HandThumbsUpFill />
            </Button>
          ) : (
            <span>Likes:</span>
          )
        }
        <span>{chapter.votes_count}</span>
      </div>
      <div className="next-chapters mt-2">
        {!isLoading && isAuthenticated && childChapters.length < 3 && chapter.branch < 9 && (
          <Button variant='secondary' className="mr-2" onClick={() => onAddChapter()}>Add Chapter</Button>
        )}
        {childChapters.map(child => (
          <Button variant='secondary' className="mx-2" key={child.id} onClick={() => onNavigate(child.id)}>
            Continue to: {child.title}
          </Button>
        ))}

      </div>


    </div>
  )
}

export default Chapter
