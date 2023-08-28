import React from 'react'
import DOMPurify from 'dompurify'
import './chapter.css'
import { Button } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'
import { ArrowLeft } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'

const Chapter = ({ chapter, chapters, onNavigate, onAddChapter }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAuthenticated = !!user
  const sanitizedHTML = DOMPurify.sanitize(chapter.content)

  const childChapters = chapters.filter(chap => chap.parentChapterId === chapter.id)

  const target = chapter.parentChapterId ?
    () => onNavigate(chapter.parentChapterId) :
    () => navigate('/')

  return (
    <div className="chapter">

      {chapter.parentChapterId ? <Button variant='secondary' className="mb-3" onClick={target}>
        < ArrowLeft />
      </Button>: <Button variant='secondary' className="mb-3" onClick={() => navigate('/')}>
        < ArrowLeft />
      </Button>}
      <div className='chapter-content' dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      <div className="next-chapters mt-2">
        {isAuthenticated && childChapters.length < 3 && chapter.branch < 10 && (
          <Button variant='secondary' className="mr-2" onClick={() => onAddChapter(chapter.id, chapter.branch)}>Add Chapter</Button>
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
