import { useGetUsersQuery } from '../services/userSlice'
import UserCard from './UserCard'
const UsersPage = () => {
  const { data: users, isLoading, isError, error } = useGetUsersQuery([])
  console.log(users)

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error.message}</p>
  }

  const userList = Object.values(users.entities)
  console.log(userList)

  return (
    userList.length !== 0 ? (
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {userList?.map((user) => (
          <UserCard key={user.username} user={user} />
        ))}
      </div>
    ) : (
      <h3>No users found</h3>
    )
  )
}

export default UsersPage