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
import { Button } from '@/components/ui/button'

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
    <div className='flex justify-center items-center h-screen flex-col text-center'>
      <div className="shadow-input flex justify-center items-center flex-col max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black border-white border-1">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to Notefusion
        </h2>
        <p className="my-5 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Please enter the verification code sent to your email
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=''>
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
            <Button type='submit' className='mt-4 bg-white w-full text-black' >Confirm</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page