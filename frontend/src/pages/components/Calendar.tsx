import React, { useRef, useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import Link from 'next/link'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { jaLocale } from '../locales/ja'

// Task型は目標データを表す
type Task = {
  uuid: string
  date: string
  exercise: string
  repetitions: number
  mark: number // 新しい列 "mark" を追加
}

const Calendar: React.FC = () => {
  const calendarRef = useRef(null)
  const [events, setEvents] = useState<Task[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Task | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [goal, setGoal] = useState<Task>({
    uuid: '',
    date: '',
    exercise: '',
    repetitions: 5,
    mark: 0,
  })

  // ダイアログの状態を管理
  const [isConfirmationOpen, setConfirmationOpen] = useState(false)

  // ダイアログで選択されたアクションを管理
  const [selectedAction, setSelectedAction] = useState('')
  //カレンダーの1か月、1週間、1日の表示の切り替え
  const handleViewChange = (newView: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(newView)
    }
  }

  // イベントを達成済みのものはカレンダーから非表示にする処理
  function renderEventContent(eventInfo: any) {
    const repetitions = eventInfo.event.extendedProps.repetitions
    const mark = eventInfo.event.extendedProps.mark

    // mark の値が 0 の場合のみ表示
    if (mark === 0) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative', // 相対位置指定
          }}
        >
          <div style={{ flex: 1 }}>
            {eventInfo.event.title} ｜{repetitions}回
          </div>
          <div
            style={{
              right: '5px', // ボタンをカレンダーの右寄りに配置
              top: '5px', // ボタンをカレンダーの上寄りに配置
              zIndex: 1, // ボタンを他の要素の上に表示
              padding: '5px', // パディングを追加
              background: 'orange', // 背景色をオレンジに設定
              borderRadius: '5px', // 枠に角丸を追加
            }}
          >
            <Button onClick={() => handleConfirmationOpen(eventInfo.event)}>
              達成
            </Button>
          </div>
        </div>
      )
    } else {
      // mark の値が 0 でない場合は何も表示しない
      return null
    }
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleConfirmationOpen = (eventInfo: any) => {
    setSelectedEvent(eventInfo) // ダイアログで操作するイベントを設定
    setConfirmationOpen(true) // ダイアログを開く
  }

  const handleConfirmationClose = () => {
    setSelectedEvent(null) // 選択されたイベントをクリア
    setConfirmationOpen(false) // ダイアログを閉じる
  }

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // 回数の正規表現パターン
    const numberPattern = /^(?:[5-9]|[1-9][0-9]|1[0-9][0-9]|200)$/

    if (name === 'repetitions' && !numberPattern.test(value)) {
      console.log('無効な回数です')
    } else {
      setGoal({
        ...goal,
        [name]: name === 'repetitions' ? parseInt(value, 10) : value,
      })
    }
  }

  const handleAchieve = (eventInfo: any) => {
    // ダイアログで選択されたアクションに応じて mark の値を設定
    if (selectedAction === 'はい') {
      updateMark(eventInfo, 1)
    } else if (selectedAction === 'いいえ') {
      updateMark(eventInfo, 2)
    } else if (selectedAction === '目標を消す') {
      updateMark(eventInfo, 3)
    }

    handleConfirmationClose() // ダイアログを閉じる
    refreshCalendar()
  }

  // mark の値を更新
  const updateMark = (eventInfo: any, newValue: any) => {
    // イベントのIDや識別子を使用して、該当のイベントをデータベースで更新
    // newValue で mark の値を更新
    // 例えば、eventInfo.event.id を使用してデータベースを更新
    // データベースの更新が成功したら、カレンダーを再描画

    // サーバーにPUTリクエストを送信
    const updatedEvent = {
      uuid: eventInfo.event?.id,
      mark: newValue,
    }

    fetch('/api/goals', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => {
        if (!response.ok) {
          // エラーハンドリング: サーバーからのエラーレスポンスの処理
          throw new Error('データベースの更新に失敗しました。')
        }
        return response.json()
      })
      .then((data) => {
        // データが正常に更新された場合の処理
        console.log('mark の値が更新されました:', data)
        // カレンダーを再描画などの処理を実行
      })
      .catch((error) => {
        // エラーハンドリング: エラーが発生した場合の処理
        console.error('mark の値の更新中にエラーが発生しました:', error)

        // ユーザーにエラーメッセージを表示
        alert('エラーが発生しました。データベースの更新に失敗しました。')

        // その他のエラーハンドリングやログ記録を行うことも検討してください
      })
  }

  const uuidv4 = require('uuid').v4

  // 新しいUUIDを生成
  const newUUID = uuidv4()

  //カレンダーの再描写
  const refreshCalendar = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.refetchEvents()
    }
  }

  const handleAddGoal = () => {
    if (!goal.date || !goal.exercise) {
      // 日付またはエクササイズが選択されていない場合、エラーメッセージを設定
      setError('項目を正しく選択してください')
      return
    }

    // ダイアログから得た情報をTask型に整形
    const newGoal: Task = {
      uuid: newUUID,
      date: goal.date,
      exercise: goal.exercise,
      repetitions: goal.repetitions,
      mark: goal.mark,
    }

    // バリデーションが成功した場合はエラーメッセージをクリア
    setError(null)

    // POSTリクエストを送信
    fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGoal),
    })
      .then((response) => response.json())
      .then((data) => {
        // データが正常に登録された場合の処理
        console.log('登録した目標:', data)
        setDialogOpen(false)
      })
      .catch((error) => {
        // エラーハンドリング
        console.error('データの登録中にエラーが発生しました:', error)
      })
  }

  useEffect(() => {
    // サーバーサイドからイベント情報を取得
    fetch('/api/goals')
      .then((response) => response.json())
      .then((data) => {
        // サーバーサイドから取得したデータを整形してFullCalendarのeventsに設定
        const formattedEvents = data.map((event: Task) => {
          return {
            title: event.exercise,
            start: event.date,
            repetitions: event.repetitions,
            mark: event.mark, // mark の値を events に追加
          }
        })

        setEvents(formattedEvents) // 整形済みのデータを events ステートに設定
      })
      .catch((error) => {
        console.error(error)
      })
  }, [events])

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.refetchEvents()
    }
  }, [events])

  return (
    <div>
      <header
        style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>カレンダー</h1>
        <div>
          <div>
            <Link href="/login">ログイン</Link>
            <Link href="/register">会員登録</Link>
            <Link href="/mypage">マイページ</Link>
            <Button onClick={handleDialogOpen} startIcon={<AddCircleIcon />}>
              目標を追加する
            </Button>
          </div>
        </div>
      </header>
      <button onClick={() => handleViewChange('dayGridMonth')}>1か月</button>
      <button onClick={() => handleViewChange('dayGridWeek')}>1週間</button>
      <button onClick={() => handleViewChange('dayGridDay')}>1日</button>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale={jaLocale}
        height="auto"
        eventContent={renderEventContent}
      />
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>目標を追加する</DialogTitle>
        <DialogContent>
          <DialogContentText>目標の詳細を入力してください.</DialogContentText>
          <div style={{ color: 'red' }}>{error}</div>
          <TextField
            label="日にち"
            type="date"
            name="date"
            value={goal.date}
            onChange={handleGoalChange}
            fullWidth
          />
          <TextField
            select
            label="種目"
            name="exercise"
            value={goal.exercise}
            onChange={handleGoalChange}
            fullWidth
          >
            <MenuItem value="腕立て">腕立て</MenuItem>
            <MenuItem value="腹筋">腹筋</MenuItem>
            <MenuItem value="スクワット">スクワット</MenuItem>
          </TextField>
          <TextField
            select
            label="回数"
            type="number"
            name="repetitions"
            value={goal.repetitions}
            onChange={handleGoalChange}
            fullWidth
          >
            {Array.from({ length: 40 }, (_, i) => (i + 1) * 5).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleAddGoal} color="primary">
            登録
          </Button>
        </DialogActions>
      </Dialog>
      {/* ダイアログを表示 */}
      <Dialog open={isConfirmationOpen} onClose={handleConfirmationClose}>
        <DialogTitle>達成できましたか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            目標を達成できた場合、選択してください。
          </DialogContentText>
          <Button onClick={() => setSelectedAction('はい')}>はい</Button>
          <Button onClick={() => setSelectedAction('いいえ')}>いいえ</Button>
          <Button onClick={() => setSelectedAction('目標を消す')}>
            目標を消す
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleAchieve} color="primary">
            実行
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Calendar
