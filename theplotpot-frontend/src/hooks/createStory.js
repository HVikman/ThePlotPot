import { useMutation } from '@apollo/client'
import { GET_ALL_STORIES, CREATE_STORY } from '../api/queries'
import { useNavigate } from 'react-router-dom'

export const useCreateStory = (addNotification) => {
  const navigate = useNavigate()

  const [createStory] = useMutation(CREATE_STORY, {
    update: (cache, { data: { createStory } }) => {
      if (createStory.success) {
        addNotification(`${createStory.story.title} created successfully!`, 2000, 'success')
        console.log('New Story ID:', createStory.story.id)
        navigate(`/story/${createStory.story.id}`)
      } else {
        console.log('Failed to create story:', createStory.message)
        addNotification(`Story creation failed: ${createStory.message}`, 2000, 'error')
      }
      const { getAllStories } = cache.readQuery({ query: GET_ALL_STORIES })
      const updatedStories = [...getAllStories, createStory.story]
      cache.writeQuery({
        query: GET_ALL_STORIES,
        data: { getAllStories: updatedStories }
      })
    }
  })

  return createStory
}
