import DOMPurify from 'dompurify'
import './chapter.css'
import { Button } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'
import { ArrowLeft, HandThumbsUpFill } from 'react-bootstrap-icons'


const Chapter = ({ chapter, childChapters, onNavigate, onAddChapter, onGoBack, isLoading }) => {

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
        <span>Reads: 0</span>
        <Button variant="secondary" className="m-2" onClick={() => {/* Handle Upvote */}}><HandThumbsUpFill /></Button>
        <span>0</span>
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
