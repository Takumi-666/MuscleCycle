import { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../../../server/db'

type Task = {
  uuid: string
  date: string
  exercise: string
  repetitions: number
  mark: number // 新しい列 "mark" を追加
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { date, exercise, repetitions, mark } = req.body as Task
      const { v4: uuidv4 } = require('uuid')

      // データベースにデータを挿入するSQLクエリ
      const query =
        'INSERT INTO event_table (uuid, date, exercise, repetitions, mark) VALUES ($1, $2, $3, $4, $5)'
      const values = [uuidv4(), date, exercise, repetitions, mark]

      // データベースにクエリを実行
      await pool.query(query, values)

      const registeredData = { date, exercise, repetitions, mark }

      // POSTリクエスト成功後にGETリクエストを送信
      const getResult = await pool.query('SELECT * FROM event_table')
      const events = getResult.rows

      res.status(201).json({ registeredData, events })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'データの登録中にエラーが発生しました' })
    }
  } else if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM event_table')
      const events = result.rows
      res.status(200).json(events)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'データの取得中にエラーが発生しました' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { uuid, mark } = req.body as Task

      // データベースで目標を更新するSQLクエリ
      const query = 'UPDATE event_table SET mark = $1 WHERE uuid = $2'
      const values = [mark, uuid]

      // データベースにクエリを実行
      await pool.query(query, values)

      res.status(200).json({ message: 'mark の値が更新されました' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'mark の値の更新中にエラーが発生しました' })
    }
  } else {
    res.status(405).end() // POST、GET、PUT以外のHTTPメソッドを許可しない
  }
}
