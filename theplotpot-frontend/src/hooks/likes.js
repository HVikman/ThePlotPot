import { useQuery, useMutation } from '@apollo/client'
import { LIKE_CHAPTER, IS_CHAPTER_LIKED, UNLIKE_CHAPTER } from '../api/queries'


export const useIsChapterLiked = (id) => {
  const { data } = useQuery(IS_CHAPTER_LIKED, {
    variables: { id }
  })

  return data ? data.isChapterLiked : false
}


export const useLikeUnlikeChapter = () => {
  const [likeChapterMutation] = useMutation(LIKE_CHAPTER)
  const [unlikeChapterMutation] = useMutation(UNLIKE_CHAPTER)

  const toggleLikeUnlike = async (like, id) => {
    if (like) {
      const { data } = await likeChapterMutation({ variables: { id } })
      return data.likeChapter
    } else {
      const { data } = await unlikeChapterMutation({ variables: { id } })
      return data.unlikeChapter
    }
  }

  return toggleLikeUnlike
}
