import { useMutation } from '@apollo/client'
import { CREATE_CHAPTER, GET_STORY_BY_ID, GET_CHAPTER_CHILDREN } from '../api/queries'
import { useNavigate } from 'react-router-dom'

export const useCreateChapter = (storyId, parentChapter, navigationStack, addNotification) => {
  const navigate = useNavigate()

  const [createChapter, { error }] = useMutation(CREATE_CHAPTER, {
    update: (cache, { data: { createChapter } }) => {
      try {
        const { getStory } = cache.readQuery({
          query: GET_STORY_BY_ID,
          variables: { id: storyId }
        })

        const updatedChapters = [...getStory.chapters, createChapter]

        cache.writeQuery({
          query: GET_STORY_BY_ID,
          variables: { id: storyId },
          data: {
            getStory: {
              ...getStory,
              chapters: updatedChapters
            }
          }
        })

        const { getChapterChildren } = cache.readQuery({
          query: GET_CHAPTER_CHILDREN,
          variables: { id: parentChapter.id }
        })

        const updatedChildren = [...getChapterChildren, createChapter]

        cache.writeQuery({
          query: GET_CHAPTER_CHILDREN,
          variables: { id: parentChapter.id },
          data: {
            getChapterChildren: updatedChildren
          }
        })
        addNotification(`${createChapter.title} created successfully!`, 2000, 'success')
        console.log(createChapter)
        navigate(`/story/${storyId}`, {
          state: {
            chapter: createChapter,
            navigationStack: [...navigationStack, parentChapter]
          }
        })
      } catch (error) {
        console.error('Error updating cache after adding chapter:', error)
        addNotification(`Something went wrong: ${error}`, 2000, 'error')
      }
    }
  })

  return [createChapter, error]
}