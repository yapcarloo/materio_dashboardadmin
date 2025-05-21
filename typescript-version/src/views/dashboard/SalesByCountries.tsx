'use client'

// Firebase Imports
import { useEffect, useState } from 'react'

import { onSnapshot } from 'firebase/firestore';

// MUI Imports

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
// eslint-disable-next-line import/no-unresolved
import OptionMenu from '@core/components/option-menu'
// eslint-disable-next-line import/no-unresolved
import CustomAvatar from '@core/components/mui/Avatar'



import { salesByCountriesCollection } from '../../libs/controller'

type DataType = {
  id: string
  avatarLabel: string
  avatarColor?: ThemeColor
  title: string
  subtitle: string
  sales: string
  trend: 'up' | 'down'
  trendPercentage: string
}

const SalesByCountries = () => {
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(salesByCountriesCollection, snapshot => {
      const firestoreData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DataType[]

      setData(firestoreData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader title='Sales by Countries' />
        <CardContent>
          <Typography>Loading data...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title='Sales by Countries'
        action={
          <OptionMenu
            iconClassName='text-textPrimary'
            options={['Last 28 Days', 'Last Month', 'Last Year']}
          />
        }
      />
      <CardContent className='flex flex-col gap-[0.875rem]'>
        {data.map(item => (
          <div key={item.id} className='flex items-center gap-4'>
            <CustomAvatar skin='light' color={item.avatarColor}>
              {item.avatarLabel}
            </CustomAvatar>

            <div className='flex items-center justify-between is-full flex-wrap gap-x-4 gap-y-2'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1'>
                  <Typography color='text.primary' className='font-medium'>
                    {item.title}
                  </Typography>
                  <div className='flex items-center gap-1'>
                    <i
                      className={classnames(
                        item.trend === 'up'
                          ? 'ri-arrow-up-s-line text-success'
                          : 'ri-arrow-down-s-line text-error'
                      )}
                    ></i>
                    <Typography
                      color={item.trend === 'up' ? 'success.main' : 'error.main'}
                    >
                      {item.trendPercentage}
                    </Typography>
                  </div>
                </div>
                <Typography>{item.subtitle}</Typography>
              </div>

              <div className='flex flex-col gap-1'>
                <Typography color='text.primary' className='font-medium'>
                  {item.sales}
                </Typography>
                <Typography variant='body2' color='text.disabled'>
                  Sales
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default SalesByCountries
