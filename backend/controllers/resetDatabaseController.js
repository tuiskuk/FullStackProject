//import { User } from '../models/user.js'
import { Recipe } from '../models/recipe.js'
async function resetDatabase(request, response) {
  try {
    // Delete all records from the User collection
    //await User.deleteMany({})

    // Delete all records from the UserRecipe collection
    await Recipe.deleteMany({})

    console.log('Database reset successful.')
    response.json({ succes: 'Database reset successful.' })
  } catch (error) {
    console.error('Database reset failed:', error)
  }
}

export default resetDatabase
