/* eslint-disable import/no-unresolved */
// MUI Imports
'use client'

// Firebase Imports
import React, { useEffect, useState } from 'react'

import { onSnapshot } from 'firebase/firestore'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Component Imports
import Link from '@components/Link'

import { depositCollection, withdrawDataCollection } from '../../libs/controller'

type TransactionType = {
  id: string
  logo: string
  title: string
  amount: string
  subtitle: string
}

const DepositWithdraw = () => {
  const [depositData, setDepositData] = useState<TransactionType[]>([])
  const [withdrawData, setWithdrawData] = useState<TransactionType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up real-time listeners for both collections
    const unsubscribeDeposits = onSnapshot(depositCollection, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TransactionType[]

      setDepositData(data)
    })

    const unsubscribeWithdrawals = onSnapshot(withdrawDataCollection, (snapshot: { docs: { id: any; data: () => any }[] }) => {
      const data = snapshot.docs.map((doc: { id: any; data: () => any }) => ({
        id: doc.id,
        ...doc.data()
      })) as TransactionType[]

      setWithdrawData(data)
      setLoading(false)
    })

    // Clean up listeners on unmount
    return () => {
      unsubscribeDeposits()
      unsubscribeWithdrawals()
    }
  }, [])

  if (loading) {
    return <Typography>Loading transactions...</Typography>
  }

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} md={6} className='border-be md:border-be-0 md:border-ie'>
          <CardHeader
            title='Deposit'
            action={
              <Typography component={Link} className='font-medium' color='primary'>
                View All
              </Typography>
            }
          />
          <CardContent className='flex flex-col gap-5'>
            {depositData.map(item => (
              <div key={item.id} className='flex items-center gap-4'>
                <img src={item.logo} alt={item.title} width={30} />
                <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
                  <div className='flex flex-col gap-0.5'>
                    <Typography color='text.primary' className='font-medium'>
                      {item.title}
                    </Typography>
                    <Typography>{item.subtitle}</Typography>
                  </div>
                  <Typography color='success.main' className='font-medium'>
                    {item.amount}
                  </Typography>
                </div>
              </div>
            ))}
          </CardContent>
        </Grid>
        <Grid item xs={12} md={6}>
          <CardHeader
            title='Withdraw'
            action={
              <Typography component={Link} className='font-medium' color='primary'>
                View All
              </Typography>
            }
          />
          <CardContent className='flex flex-col gap-5'>
            {withdrawData.map(item => (
              <div key={item.id} className='flex items-center gap-4'>
                <img src={item.logo} alt={item.title} width={30} />
                <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
                  <div className='flex flex-col gap-0.5'>
                    <Typography color='text.primary' className='font-medium'>
                      {item.title}
                    </Typography>
                    <Typography>{item.subtitle}</Typography>
                  </div>
                  <Typography color='error.main' className='font-medium'>
                    {item.amount}
                  </Typography>
                </div>
              </div>
            ))}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default DepositWithdraw