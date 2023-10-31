import React, { useEffect, useState } from 'react'
import ProfileCard from './components/Profile'
import { Card, CardContent, Typography, Avatar, Grid } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

const MyPage: React.FC = () => {
  const [achievements, setAchievements] = useState(0)
  const [failures, setFailures] = useState(0)

  useEffect(() => {
    // APIエンドポイントのURLを指定
    const apiEndpoint = '/api/goals' // ここに実際のGETエンドポイントを指定
    // GETリクエストを送信
    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((apiData) => {
        // データから達成数と失敗数を取得
        const achievementCount = apiData.filter(
          (item) => item.mark === 1
        ).length
        const failureCount = apiData.filter((item) => item.mark === 2).length

        setAchievements(achievementCount)
        setFailures(failureCount)
      })
      .catch((error) => {
        console.error('データの取得中にエラーが発生しました:', error)
      })
  }, [])

  return (
    <div>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar alt="User Icon" src="/path/to/icon.jpg" />
            </Grid>
            <Grid item>
              <Typography variant="h6">ユーザー名</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2">
            達成数: {achievements} <br />
            失敗数: {failures}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default MyPage
