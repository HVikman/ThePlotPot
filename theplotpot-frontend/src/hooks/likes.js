import { useQuery, useMutation } from '@apollo/client'
import { LIKE_CHAPTER, IS_CHAPTER_LIKED, UNLIKE_CHAPTER } from '../api/queries'
import { useNotifications } from '../components/NotificationsContext'

export const useIsChapterLiked = (id) => {
  const { data } = useQuery(IS_CHAPTER_LIKED, {
    variables: { id }
  })

  return data ? data.isChapterLiked : false
}


export const useLikeUnlikeChapter = () => {
  const { addNotification } = useNotifications()
  const [likeChapterMutation] = useMutation(LIKE_CHAPTER)
  const [unlikeChapterMutation] = useMutation(UNLIKE_CHAPTER)

  const toggleLikeUnlike = async (like, id) => {
    if (like) {
      const { data } = await likeChapterMutation({ variables: { id } })
      addNotification('Chapter liked', 1000, 'success')
      return data.likeChapter
    } else {
      const { data } = await unlikeChapterMutation({ variables: { id } })
      addNotification('Like removed', 1000, 'error')
      return data.unlikeChapter
    }
  }

  return toggleLikeUnlike
}
