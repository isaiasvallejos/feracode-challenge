import api from './api'

export default () => {
  api.listen(process.env.PORT, () =>
    console.log('server running on', api.address().port)
  )

  return api
}
