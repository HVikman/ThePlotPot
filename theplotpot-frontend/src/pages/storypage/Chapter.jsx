import React from 'react'
import DOMPurify from 'dompurify'
import './chapter.css'
import { Button } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'

const Chapter = ({ chapter, chapters, onNavigate, onAddChapter }) => {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const sanitizedHTML = DOMPurify.sanitize(chapter.content)

  // Find child chapters for this chapter
  const childChapters = chapters.filter(chap => chap.parentChapterId === chapter.id)

  return (
    <div className="chapter">

      {chapter.parentChapterId ? <Button variant='secondary' className="m-3" onClick={() => onNavigate(chapter.parentChapterId)}>
            back
      </Button>: ''}
      <div className='chapter-content' dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      {/* Display links or buttons to the next chapters */}
      <div className="next-chapters m-2">
        {isAuthenticated && childChapters.length < 3 && chapter.branch < 10 && (
          <Button variant='secondary' className="m-2" onClick={() => onAddChapter(chapter.id, chapter.branch)}>Add Chapter</Button>
        )}
        {childChapters.map(child => (
          <Button variant='secondary' className="m-2" key={child.id} onClick={() => onNavigate(child.id)}>
            Continue to: {child.title}
          </Button>
        ))}

      </div>


    </div>
  )
}

export default Chapter
