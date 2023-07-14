import React from 'react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert
} from '@mui/material'
import { useCreateUserMutation } from '../services/userSlice'
/*import { useConfirmEmailQuery } from '../services/apiSlice'
import { selectCurrentToken } from '../services/loginSlice'
import { useSelector } from 'react-redux'*/

const RegistrationForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset
  } = useForm()

  const [isSuccess, setIsSuccess] = useState(false)
  const [ createUser ] = useCreateUserMutation()
  const onSubmit = async(submitData) => {
    if (Object.keys(errors).length === 0) {
      try {
        await createUser(submitData).unwrap()
        reset()
        setIsSuccess(true)
      } catch (err) {
        console.error('Failed to create user: ', err)
      }
    }
    console.log('Form submitted:', submitData)
  }

  const handleBlur = (field) => {
    trigger(field.name)
  }

  const handleCloseSnackbar = () => {
    setIsSuccess(false)
  }

  return (
    <Container maxWidth="sm">
      <Snackbar open={isSuccess} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile successfully created
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">
              Register and experience all we can offer!
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 5 }}
              render={({ field }) => (
                <TextField
                  label="Username"
                  {...field}
                  error={!!errors.username}
                  helperText={
                    errors.username && errors.username.type === 'required'
                      ? 'Username is required'
                      : errors.username && errors.username.type === 'minLength'
                        ? 'Username must be at least 5 characters long'
                        : ''
                  }
                  fullWidth
                  onBlur={() => handleBlur(field)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: true, pattern: /^[A-Za-z]+ [A-Za-z]+$/ }}
              render={({ field }) => (
                <TextField
                  label="Name"
                  {...field}
                  error={!!errors.name}
                  helperText={
                    errors.name && errors.name.type === 'required'
                      ? 'Name is required'
                      : errors.name && errors.name.type === 'pattern'
                        ? 'Invalid name format (e.g., Matti Meikäläinen)'
                        : ''
                  }
                  fullWidth
                  onBlur={() => handleBlur(field)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
              }}
              render={({ field }) => (
                <TextField
                  label="Email"
                  {...field}
                  error={!!errors.email}
                  helperText={
                    errors.email && errors.email.type === 'required'
                      ? 'Email is required'
                      : errors.email && errors.email.type === 'pattern'
                        ? 'Invalid email format (e.g., example@example.com)'
                        : ''
                  }
                  fullWidth
                  onBlur={() => handleBlur(field)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="profileText"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Profile Text"
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  onBlur={() => handleBlur(field)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  type="password"
                  label="Password"
                  {...field}
                  error={!!errors.password}
                  helperText={errors.password && 'Password is required'}
                  fullWidth
                  onBlur={() => handleBlur(field)}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default RegistrationForm