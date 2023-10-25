import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import style from '@/components/EmojiPicker/EmojiPicker.module.scss'
import emojiPickerIcon from '@/components/EmojiPicker/emojiPicker.svg'
import { useAppSelector } from '@/hooks/useAppSelector'
import { userSelector } from '@/store/slices/userSlice'
import { Like } from 'server/models/forum/like'

interface EmojiPickerProps {
  commentId?: number
  replyId?: number
}

interface RequestData {
  comment_id: number | null
  reply_id: number | null
  emoji?: string
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  commentId = null,
  replyId = null,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [emojis, setEmojis] = useState<Like[]>([])
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const user = useAppSelector(userSelector)

  const popularEmojis = [
    '😀',
    '😂',
    '👍',
    '🙌',
    '👏',
    '🤔',
    '😎',
    '🤩',
    '😭',
    '🥳',
    '👋',
    '🌟',
    '💯',
    '🔥',
    '🎉',
    '🚀',
    '🤑',
    '😈',
    '🤡',
    '💩',
    '👻️',
    '👽',
    '👾',
    '🤖',
  ]

  const emojiListToggle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  const addEmojiToggle = (activeUser: boolean, emoji: string) => {
    !activeUser ? addEmojiHandler(emoji) : removerEmojiHandler()
  }

  const emojiMap = useMemo(() => {
    const emojiMapData: { [emoji: string]: Like[] } = {}

    emojis.forEach(item => {
      const { emoji, user_id } = item

      if (!emoji || !user_id) return

      if (emojiMapData[emoji]) {
        emojiMapData[emoji].push(item)
      } else {
        emojiMapData[emoji] = [item]
      }
    })

    return emojiMapData
  }, [emojis])

  const getEmojisData = async () => {
    const api = replyId
      ? `http://localhost:9000/api/likes/reply/${replyId}`
      : `http://localhost:9000/api/likes/comment/${commentId}`

    try {
      const responseLikes = await fetch(api)
      const jsonLikes = await responseLikes.json()
      setEmojis(jsonLikes.likes)
    } catch (error) {
      console.error('Ошибка при получении лайков:', error)
    }
  }

  const sendEmojiRequest = async (action: string, data: RequestData) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/likes/${action}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (response.ok) {
        getEmojisData()
      } else {
        console.error('Не удалось выполнить операцию')
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  const addEmojiHandler = async (emoji: string) => {
    const data = {
      comment_id: commentId,
      reply_id: replyId,
      emoji,
    }
    await sendEmojiRequest('add', data)
    setIsOpen(false)
  }

  const removerEmojiHandler = async () => {
    const data = {
      comment_id: commentId,
      reply_id: replyId,
    }
    await sendEmojiRequest('remove', data)
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!replyId && !commentId) return

    getEmojisData()
  }, [replyId, commentId])

  return (
    <div className={style.selectedEmojiWrapper}>
      <div
        className={style.emojiPicker}
        onClick={emojiListToggle}
        ref={emojiPickerRef}>
        <img src={emojiPickerIcon} alt="Emoji" />
        {isOpen && (
          <div className={style.emojiList}>
            {popularEmojis.map(emoji => (
              <div
                key={emoji}
                className={style.emoji}
                onClick={event =>
                  addEmojiHandler(event.currentTarget.textContent || '')
                }>
                {emoji}
              </div>
            ))}
          </div>
        )}
      </div>
      {emojis.length
        ? Object.entries(emojiMap).map(([emoji, ids], index) => {
            const activeUser = ids.some(item => item.user_id === user.data?.id)

            return (
              <div
                onClick={() => addEmojiToggle(activeUser, emoji)}
                className={
                  activeUser
                    ? `${style.selectedEmoji} ${style.active}`
                    : style.selectedEmoji
                }
                key={index}>
                {emoji}
                <span>{ids.length}</span>
              </div>
            )
          })
        : null}
    </div>
  )
}

export default EmojiPicker
