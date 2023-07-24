import { User } from '../models/user.js'
import { UserRecipe } from '../models/useCreatedreceipe.js'

async function resetDatabase(request, response) {
  try {
  // Delete all records from the User collection
    await User.deleteMany({})
    // Delete all records from the UserRecipe collection
    await UserRecipe.deleteMany({})

    console.log('Database reset successful.')
    response.json({ success: 'Database reset successful.' })
  } catch (error) {
    console.error('Database reset failed:', error)
  }
}

export default resetDatabase
