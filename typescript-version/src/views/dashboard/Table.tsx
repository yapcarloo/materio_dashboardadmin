'use client'
// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

// Firebase Imports
import { onSnapshot } from 'firebase/firestore'
import { usersCollection } from '../../libs/controller'
import react from 'react'

type TableBodyRowType = {
  id: string
  avatarSrc?: string
  name: string
  username: string
  email: string
  iconClass: string
  roleIcon?: string
  role: string
  status: 'active' | 'inactive' | 'pending'
}

const Table = () => {
  const [rowsData, setRowsData] = react.useState<TableBodyRowType[]>([])
  const [loading, setLoading] = react.useState(true)

  react.useEffect(() => {
    const unsubscribe = onSnapshot(usersCollection, (snapshot: { docs: any[] }) => {
      const data = snapshot.docs.map((doc: { id: any; data: () => any }) => ({
        id: doc.id,
        ...doc.data()
      })) as TableBodyRowType[]
      setRowsData(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <Card>
        <Typography className='p-4'>Loading users...</Typography>
      </Card>
    )
  }

  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.map(row => (
              <tr key={row.id}>
                <td className='!plb-1'>
                  <div className='flex items-center gap-3'>
                    <CustomAvatar src={row.avatarSrc} size={34} />
                    <div className='flex flex-col'>
                      <Typography color='text.primary' className='font-medium'>
                        {row.name}
                      </Typography>
                      <Typography variant='body2'>{row.username}</Typography>
                    </div>
                  </div>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.email}</Typography>
                </td>
                <td className='!plb-1'>
                  <div className='flex gap-2'>
                    <i className={classnames(row.roleIcon, row.iconClass, 'text-[22px]')} />
                    <Typography color='text.primary'>{row.role}</Typography>
                  </div>
                </td>
                <td className='!pb-1'>
                  <Chip
                    className='capitalize'
                    variant='tonal'
                    color={row.status === 'pending' ? 'warning' : row.status === 'inactive' ? 'secondary' : 'success'}
                    label={row.status}
                    size='small'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default Table