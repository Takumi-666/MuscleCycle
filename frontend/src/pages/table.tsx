// クライアント側 (Calendar.js)

import React, { useEffect, useState } from 'react'

const Calendar = () => {
  const [goals, setGoals] = useState([])
  const [editingGoal, setEditingGoal] = useState(null)

  // 目標データを取得
  useEffect(() => {
    fetch('/api/goals')
      .then((response) => response.json())
      .then((data) => setGoals(data))
      .catch((error) =>
        console.error('データの取得中にエラーが発生しました:', error)
      )
  }, [])

  // 目標の編集
  const editGoal = (goal) => {
    setEditingGoal(goal)
  }

  // 目標の削除
  const deleteGoal = (goal) => {
    fetch(`/api/goals/${goal.uuid}`, {
      method: 'DELETE',
    })
      .then(() => {
        setGoals((prevGoals) => prevGoals.filter((g) => g.uuid !== goal.uuid))
      })
      .catch((error) =>
        console.error('目標の削除中にエラーが発生しました:', error)
      )
  }

  return (
    <div>
      <h1>目標一覧</h1>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>エクササイズ</th>
            <th>アクション</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal.uuid}>
              <td>{goal.date}</td>
              <td>{goal.exercise}</td>
              <td>
                <button onClick={() => editGoal(goal)}>編集</button>
                <button onClick={() => deleteGoal(goal)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Calendar
