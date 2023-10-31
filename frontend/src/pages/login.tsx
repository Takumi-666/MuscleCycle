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

const LoginPage: React.FC = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            ログイン
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="ユーザー名" variant="outlined" fullWidth />
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
              ログイン
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/register" variant="body2">
                  会員登録
                </Link>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
