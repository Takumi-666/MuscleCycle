import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Link,
} from '@mui/material'

const RegisterPage: React.FC = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            会員登録
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="ユーザー名" variant="outlined" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="メールアドレス"
                  type="email"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="パスワード"
                  type="password"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" fullWidth>
              会員登録
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  ログイン
                </Link>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
