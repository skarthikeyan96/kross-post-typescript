import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import {
  ADD_SETTINGS,
  DISPLAY_SETTINGS,
  FIND_SETTINGS_ID_BY_USER,
  UPDATE_SETTINGS,
} from '../graphql/queries'
import { showAlert } from '../utils/helper'

interface IFormValues {
  forem: string
  hashnode: string
  hashnodePublicationId: string
  medium: string
}

export const SettingsFormQuery = () => {
  const { user } = useUser()

  const { loading, error, data } = useQuery(DISPLAY_SETTINGS, {
    variables: {
      user_id: user?.sub,
    },
  })

  if (loading) {
    return <div>Loading the settings...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }
  return <SettingsForm preloadedValues={data.settings[0]} />
}

const SettingsForm = ({ preloadedValues }: any) => {
  const [MyMutation]: any = useMutation(ADD_SETTINGS)
  const [updateSettings]: any = useMutation(UPDATE_SETTINGS)
  const { user } = useUser()
  const { data: settingsID } = useQuery(FIND_SETTINGS_ID_BY_USER, {
    variables: {
      user_id: user?.sub,
    },
  })
  const router = useRouter()
  const [message, setMessage] = useState('')

  const { register, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      forem: preloadedValues?.forem_key,
      hashnode: preloadedValues?.hashnode_key,
      medium: preloadedValues?.medium_key,
      hashnodePublicationId: preloadedValues?.hashnode_publication_id,
    },
  })

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    if (settingsID && settingsID.settings.length === 0) {
      setMessage('adding the settings to the DB ...')
      const res = await MyMutation({
        variables: {
          forem_key: data.forem,
          id: uuidv4() as string,
          hashnode_key: data.hashnode,
          medium_key: data.medium,
          hashnode_publication_id: data.hashnodePublicationId,
          user_id: user?.sub,
        },
      })
      if (res.data) {
        setMessage(
          'settings added successfully, redirecting to creation of post..'
        )
        router.push('/create')
      }
    } else {
      setMessage('settings updation in progress ...')
      const res = await updateSettings({
        variables: {
          forem_key: data.forem,
          hashnode_key: data.hashnode,
          medium_key: data.medium,
          hashnode_publication_id: data.hashnodePublicationId,
          user_id: user?.sub,
        },
      })
      if (res.data) {
        setMessage('settings updated successfully')
      }
    }
  }

  return (
    <>
      {message && showAlert(message)}
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <label className="block">
          <span className="pr-4 text-gray-700 dark:text-slate-200">
            {' '}
            Dev.to Key{' '}
          </span>
          <input
            type="password"
            {...register('forem', { required: true })}
            className="
      dark:
      mt-1
      mb-6
      w-full
      rounded-md
      border-transparent bg-gray-100 text-black
      focus:border-gray-500
      focus:bg-white focus:ring-0
    "
          />
        </label>

        <label className="block">
          <span className="pr-4 text-gray-700 dark:text-slate-200">
            {' '}
            Hashnode{' '}
          </span>
          <input
            type="password"
            {...register('hashnode', { required: true })}
            className="
      dark:
      mt-1
      mb-6
      w-full
      rounded-md
      border-transparent bg-gray-100 text-black  focus:border-gray-500
      focus:bg-white focus:ring-0
    "
          />
        </label>

        <label className="block">
          <span className="pr-4 text-gray-700 dark:text-slate-200">
            {' '}
            Hashnode Publication ID{' '}
          </span>
          <p className="mt-2 pb-2 text-xs text-gray-500">
            It is used to post the blog to hashnode
          </p>
          <input
            type="text"
            {...register('hashnodePublicationId', { required: true })}
            className="
      dark:
      mt-1
      mb-6
      w-full
      rounded-md
      border-transparent bg-gray-100 text-black  focus:border-gray-500
      focus:bg-white focus:ring-0
    "
          />
        </label>

        <label className="block">
          <span className="pr-4 text-gray-700 dark:text-slate-200">
            {' '}
            Medium Key{' '}
          </span>

          <input
            type="password"
            {...register('medium', { required: true })}
            className="
      dark:
      mt-1
      mb-6
      w-full
      rounded-md
      border-transparent bg-gray-100 text-black  focus:border-gray-500
      focus:bg-white focus:ring-0
    "
          />
        </label>
        <input
          className="inline-block cursor-pointer border-2 border-slate-400 px-6  py-2 text-xs font-medium uppercase leading-tight text-gray-800 transition duration-150  ease-in-out focus:outline-none focus:ring-0 dark:border-white dark:text-slate-200"
          type="submit"
        />
      </form>
    </>
  )
}

export default SettingsFormQuery
