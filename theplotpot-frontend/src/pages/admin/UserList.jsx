import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Table, Button } from 'react-bootstrap'
import { Popconfirm } from 'antd'
import { GET_ALL_USERS, BAN_USER, UNBAN_USER, DELETE_USER } from '../../api/queries'
import { Link } from 'react-router-dom'
import { useDarkMode } from '../../context/DarkModeContext'

const UserList = () => {
  const { isDarkMode } = useDarkMode()
  const { loading, error, data } = useQuery(GET_ALL_USERS)
  const [banUser] = useMutation(BAN_USER, {
    refetchQueries: [
      { query: GET_ALL_USERS },
    ],
  })
  const [unbanUser] = useMutation(UNBAN_USER, {
    refetchQueries: [
      { query: GET_ALL_USERS },
    ],
  })
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [
      { query: GET_ALL_USERS },
    ],
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const handleUnban = async (userId) => {
    try {
      const response = await unbanUser({ variables: { id: userId } })
      if (response.data.unbanUser.success) {
        console.log(response.data)
      } else {
        console.log(response.data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handleBan = async (userId) => {
    try {
      const response = await banUser({ variables: { id: userId } })
      if (response.data.banUser.success) {
        console.log(response.data)
      } else {
        console.log(response.data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  //TODO: handle user activation
  const handleActivate = async (userId) => {
  //manual user activation will be here if needed
  }


  //TODO: handle user deletion
  const handleDelete = async (userId) => {
    if (window.confirm('Are you absolutely sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await deleteUser({ variables: { id: userId } })
        if (response.data.deleteUser.success) {
          console.log('User deleted successfully')
        } else {
          console.log('Failed to delete user')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <Table striped bordered hover {...(isDarkMode ? { variant: 'dark' } : {})}>
      <thead>
        <tr>
          <th>User id</th>
          <th>Username</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Coffee</th>
          <th>Banned at</th>
          <th>Actions</th>

        </tr>
      </thead>
      <tbody>
        {data.getAllUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td><Link style={{ color: 'inherit', textDecoration: 'inherit' }} to={`/user/${user.id}`}>{user.username}</Link></td>
            <td>{user.email}</td>
            <td>{user.has_superpowers ? 'Yes' : 'No'}</td>
            <td>{user.coffee ? <a href={user.coffee} target="_blank" rel="noopener noreferrer">Coffee Link</a> : 'None'}</td>
            <td>{user.bannedAt && new Date(Number(user.bannedAt)).toLocaleString()}</td>
            <td>
              {!user.has_superpowers && (
                <Popconfirm
                  title="Are you sure you want to activate this user?"
                  onConfirm={() => handleActivate(user.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button variant="success" size="sm" className="me-2">
                    Activate
                  </Button>
                </Popconfirm>
              )}
              {!user.has_superpowers && (!user.bannedAt ? (
                <Popconfirm
                  title="Are you sure you want to ban this user?"
                  onConfirm={() => handleBan(user.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button variant="danger" size="sm" className='mx-1'>
                    Ban
                  </Button>
                </Popconfirm>
              ): (
                <Popconfirm
                  title="Are you sure you want to unban this user?"
                  onConfirm={() => handleUnban(user.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button variant="warning" size="sm" className='mx-1'>
                    Unban
                  </Button>
                </Popconfirm>
              ))}
              {!user.has_superpowers && <Popconfirm
                title="Are you sure you want to delete this user?"
                onConfirm={() => handleDelete(user.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button variant="outline-danger" size="sm" className='mx-2'>
                  Delete
                </Button>
              </Popconfirm>}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default UserList