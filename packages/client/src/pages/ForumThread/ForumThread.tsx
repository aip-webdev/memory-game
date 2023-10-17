import Navigation from '@/components/Navigation/Navigation'
import s from './ForumThread.module.scss'
import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Comment } from 'server/models/forum/comment'
import { Spinner } from '@/components/Spinner/Spinner'
import { declensionWords } from '@/utils/declensionWords'
import { Topic } from 'server/models/forum/topic'
import Button from '@/components/Button/Button'
import EmojiPicker from '@/components/EmojiPicker/EmojiPicker'

const ForumThread: React.FC = () => {
  const { topicId } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [newComment, setNewComment] = useState('')

  const getData = async () => {
    try {
      const responseComments = await fetch(
        `http://localhost:9000/api/comments/${topicId}`
      )
      const responseTopic = await fetch(
        `http://localhost:9000/api/topics/${topicId}`
      )
      const jsonComments = await responseComments.json()
      const jsonTopic = await responseTopic.json()
      setComments(jsonComments.comments)
      setTopic(jsonTopic.topic)
    } catch (error) {
      console.error('Ошибка при получении данных:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const showFormHandler = () => setShowForm(!showForm)

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:9000/api/comments/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic_id: topicId,
            body: newComment,
          }),
        }
      )

      if (response.ok) {
        getData().then(() => {
          setNewComment('')
          setShowForm(false)
        })
      } else {
        console.error('Не удалось создать новый комментарий')
      }
    } catch (error) {
      console.error('Ошибка при публикации комментария:', error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="page">
      <Navigation />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="content-wrapper">
          <div className={s.topicTitle}>
            <h1>
              <Link to={'/forum'}>Форум</Link>/<div>{topic?.title}</div>
            </h1>
          </div>
          <div className={s.topicCreated}>
            <div>
              <b>Автор топика: </b>
              {topic?.user_name}
            </div>
            |
            <div>
              <b>Дата создания: </b>
              {topic && new Date(topic.created_at).toLocaleString()}
            </div>
          </div>
          <div className={s.topicBody}>{topic?.body}</div>
          <Button onClick={showFormHandler}>
            {!showForm ? 'Написать комментарий' : 'Отмена'}
          </Button>
          {showForm && (
            <form className={s.commentForm} onSubmit={submitForm}>
              <textarea
                placeholder="Сообщение"
                value={newComment}
                onChange={event => setNewComment(event.target.value)}
              />
              <Button
                className={s.submitButton}
                theme="orange"
                type="submit"
                disabled={!newComment}>
                Отправить
              </Button>
            </form>
          )}
          <div className={s.commentsCount}>
            <b>
              {comments.length
                ? declensionWords(comments.length, [
                    'комментарий',
                    'комментария',
                    'комментариев',
                  ])
                : 'Комментариев еще нет'}
            </b>
          </div>
          <ul className={s.cards}>
            {comments.map(item => {
              const { id, body, likes, user_name, created_at } = item

              return (
                <li className={s.card} key={id}>
                  <div className={s.avatarBlock}>
                    <div className={s.forumAvatar}>
                      {user_name.split('')[0]}
                    </div>
                    <div className={s.userName}>{user_name}</div>
                    <p className={s.time}>
                      {new Date(created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className={s['message-block']}>
                    <p className={s.message}>{body}</p>
                    <div className={s.info}>
                      <EmojiPicker data={likes} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ForumThread
