import dayjs from 'dayjs'
import 'dayjs/locale/fi'

const formatFinnishDate = (dateString) => {
  const date = dayjs(dateString)
  const day = date.format('D')
  const month = date.locale('fi').format('MMMM') // Format month in Finnish
  const year = date.format('YYYY')
  const time = date.format('HH:mm')

  return `${day}. ${month} ${year} klo ${time}`
}

export default formatFinnishDate