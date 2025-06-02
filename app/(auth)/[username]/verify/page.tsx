"use client"

import { Form, FormField, FormItem } from '@/components/ui/form'
import React from 'react'
import { useForm } from 'react-hook-form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { verifySchema } from '@/app/schema/verifySchema'
import { usePostCode } from "./api/api"
import { useParams } from 'next/navigation';

const page = () => {
  const { mutate } = usePostCode()
  const params = useParams();
  const username = params.username as string;

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  })

  const onSubmit = async (data: any) => {
    mutate({
      code: data.code,
      username
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex justify-center items-center h-screen'>
        <FormField control={form.control} name="code" render={({ field }) => (
          <FormItem>
            <InputOTP maxLength={6} {...field}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormItem>
        )} />
        <button type='submit' className='mt-4'>Confirm</button>
      </form>
    </Form>
  )
}

export default page