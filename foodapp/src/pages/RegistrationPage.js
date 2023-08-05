import { useEffect } from 'react'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Input,
  useMediaQuery
} from '@mui/material'
import { useCreateUserMutation } from '../services/userApiSlice'
import { useUploadProfilePictureMutation } from '../services/pictureHandlerApiSlice'
import React from 'react'
/*import { useConfirmEmailQuery } from '../services/apiSlice'
import { selectCurrentAccessToken } from '../services/loginSlice'
import { useSelector } from 'react-redux'*/

const RegistrationForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
    getValues,
  } = useForm()

  const inputRef = React.createRef()

  const [selectedImage, setSelectedImage] = useState(null)
  const isScreenSmall = useMediaQuery('(max-width: 900px)')

  const handleUploadClick = () => {
    inputRef.current.click()
  }

  const imageStyle = {
    width: '100%',
    height: '100vh',
    backgroundImage: 'url(/images/loginPageImage.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const containerStyle = {
    height: '100vh',
    overflow: 'auto',
  }


  const [isSuccess, setIsSuccess] = useState(false)
  const [createUser]  = useCreateUserMutation()
  const [uploadProfilePicture] = useUploadProfilePictureMutation()
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    console.log(selectedFile)
    // Do something with the profilePictureValue
  }, [selectedFile])

  const onSubmit = async (submitData) => {

    if (Object.keys(errors).length === 0) {
      try {
        console.log(submitData)
        const response = await createUser(submitData).unwrap()
        const id = response.id

        if (selectedFile && id) {
          console.log({ file: selectedFile, id })
          await uploadProfilePicture({ file: selectedFile, id }).unwrap()
        }

        reset()
        setIsSuccess(true)
      } catch (err) {
        console.error('Failed to create user or upload profile picture: ', err)
      }
    }
    console.log('Form submitted:', submitData)
  }

  const handleBlur = (field) => {
    trigger(field.name)
    if (field.name === 'password') {
      trigger('confirmPassword')
    }
  }

  const handleCloseSnackbar = () => {
    setIsSuccess(false)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImage(null)
    }
    setSelectedFile(file)
  }


  return (
    <Container maxWidth="lg" style={ containerStyle }  >

      <Grid container justifyContent="center" spacing={2} >

        {!isScreenSmall && <Grid item xs={6}>
          <div style={imageStyle}></div>
        </Grid> }

        <Grid item xs={!isScreenSmall ? 6 : 10}  >
          <Snackbar
            open={isSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: '100%' }}
            >
          Profile successfully created
            </Alert>
          </Snackbar>
          <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
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
                <Controller
                  name="confirmPassword" // Change the name to "confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{ required: true,
                    validate: (value) => {
                      return getValues('password') === value }
                  }}
                  render={({ field }) => (
                    <TextField
                      type="password"
                      label="Confirm Password"
                      {...field}
                      error={!!errors.confirmPassword} // Update the error reference to "confirmPassword"
                      helperText={
                        errors.confirmPassword && errors.confirmPassword.type === 'required'
                          ?'password is required'
                          : errors.confirmPassword ? 'Passwords do not match' : ''}
                      fullWidth
                      onBlur={() => field.onBlur()}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} style={{ marginBottom: '24px' }}>
                <Typography variant="h6">Profile Picture</Typography>
                <Input
                  type="file"
                  name="profilePicture"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  inputRef={inputRef}
                  id="profilePictureInput"
                />
                <label
                  htmlFor="profilePictureInput"
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onClick={handleUploadClick}
                >
              Upload Picture
                </label>
                {selectedImage && (
                  <div style={{ marginTop: '16px' }}>
                    <Typography variant="body1">Selected Picture:</Typography>
                    <img
                      src={selectedImage}
                      alt="Selected Profile Picture"
                      style={{ width: '100px', height: '100px', marginTop: '8px' }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
              Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  )
}

export default RegistrationForm
