'use client'

// Firebase Imports
// eslint-disable-next-line import/no-unresolved
import { useEffect, useState } from 'react';

// eslint-disable-next-line import/no-unresolved
import { onSnapshot } from 'firebase/firestore';


// MUI Imports

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// Type Imports
import type { ThemeColor } from '@core/types';

// Components Imports
// eslint-disable-next-line import/no-unresolved
import OptionMenu from '@core/components/option-menu';



import { earningsCollection } from '../../libs/controller';

type DataType = {
  id: string
  title: string
  imgSrc: string
  amount: string
  progress: number
  subtitle: string
  color?: ThemeColor
}

const TotalEarning = () => {
  const [data, setData] = useState<DataType[]>([])
  const [totalEarnings, setTotalEarnings] = useState<string>('$0')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(earningsCollection, snapshot => {
      const earningsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DataType[]

      setData(earningsData)

      // Calculate total earnings
      const total = earningsData.reduce((acc, item) => {
        const amount = parseFloat(item.amount.replace(/[^0-9.]/g, ''))

        return acc + amount
      }, 0)

      setTotalEarnings(`$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader title='Total Earning' />
        <CardContent>
          <Typography>Loading earnings data...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title='Total Earning'
        action={
          <OptionMenu
            iconClassName='text-textPrimary'
            options={['Last 28 Days', 'Last Month', 'Last Year']}
          />
        }
      />
      <CardContent className='flex flex-col gap-11 md:mbs-2.5'>
        <div>
          <div className='flex items-center gap-2'>
            <Typography variant='h3'>{totalEarnings}</Typography>
            <i className='ri-arrow-up-s-line align-bottom text-success'></i>
            <Typography component='span' color='success.main'>
              10%
            </Typography>
          </div>
          <Typography>Compared to ₱84,854 last year</Typography>
        </div>

        <div className='flex flex-col gap-6'>
          {data.map(item => (
            <div key={item.id} className='flex items-center gap-3'>
              <Avatar src={item.imgSrc} variant='rounded' className='bg-actionHover' />
              <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
                <div className='flex flex-col gap-0.5'>
                  <Typography color='text.primary' className='font-medium'>
                    {item.title}
                  </Typography>
                  <Typography>{item.subtitle}</Typography>
                </div>
                <div className='flex flex-col gap-2 items-center'>
                  <Typography color='text.primary' className='font-medium'>
                    {item.amount}
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={item.progress}
                    className='is-20 bs-1'
                    color={item.color}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalEarning
