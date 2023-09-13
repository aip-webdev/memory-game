import s from './Main.module.scss'
import Navigation from '@/components/Navigation/Navigation'
import Button from '@/components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { AppPath } from '@/types/AppPath'
import { setGameCols } from '@/store/features/gameSlice'
import { useDispatch } from 'react-redux'
import { ChangeEventHandler, useState } from 'react'

const Main = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [selectedValue, setSelectedValue] = useState<null | string>(null)

  const handleRadioChange: ChangeEventHandler<HTMLInputElement> = event => {
    const selectedValue = event.target.id // Должно быть 'easy', 'hard' или 'veryHard'
    let cols = 4 // Значение по умолчанию

    setSelectedValue(selectedValue)

    if (selectedValue === 'easy') {
      cols = 4
    } else if (selectedValue === 'hard') {
      cols = 6
    } else if (selectedValue === 'veryHard') {
      cols = 10
    }

    // Вызываем действие для обновления gameCols в хранилище Redux
    dispatch(setGameCols(cols))

    // Сохраняем значение в Local Storage
    localStorage.setItem('gameCols', cols.toString())
  }

  const handlePlayClick = () => {
    navigate(AppPath.GAME)
  }

  return (
    <div className={s.wrapper}>
      <Navigation />
      <main className={s.content}>
        <div className={s.textWrapper}>
          <h1 className={s.mainTitle}>
            🟪 🟦 🟥 Игра Memory: Запомни свой стек
          </h1>
          <p className={s.subtitle}>
            Узнай, насколько хорошо ты можешь запоминать и сочетать пары!
          </p>
          <h2 className="mb-2">Правила игры:</h2>
          <ol>
            <li>
              <strong>Цель игры:</strong> Найти все одинаковые пары карточек на
              игровом поле.
            </li>
            <li>
              <strong>Ход игры:</strong> Игрок открывает две карточки за один
              ход. Если они совпадают (имеют одинаковое изображение), они
              остаются открытыми. В противном случае они закрываются.
            </li>
            <li>
              <strong>Цель игрока:</strong> Найти все пары, путем поочередного
              открытия и запоминания местоположения карточек на игровом поле.
            </li>
          </ol>
        </div>
        <div className={s.levelWrapper}>
          <h2 className={s.pickLevelTitle}>Выбрать сложность:</h2>
          <ul className={s.levels}>
            <li className={s.level}>
              <input
                id="easy"
                name="levels"
                type="radio"
                className={s.radio}
                onChange={handleRadioChange}
              />
              <label htmlFor="easy" className={s.levelText}>
                4X4
              </label>
            </li>
            <li className={s.level}>
              <input
                id="hard"
                name="levels"
                type="radio"
                className={s.radio}
                onChange={handleRadioChange}
              />
              <label htmlFor="hard" className={s.levelText}>
                6X6
              </label>
            </li>
            <li className={s.level}>
              <input
                id="veryHard"
                name="levels"
                type="radio"
                className={s.radio}
                onChange={handleRadioChange}
              />
              <label htmlFor="veryHard" className={s.levelText}>
                6X10
              </label>
            </li>
          </ul>
          <Button
            onClick={handlePlayClick}
            className={s.button}
            disabled={!selectedValue}>
            Играть
          </Button>
        </div>
      </main>
    </div>
  )
}

export default Main
