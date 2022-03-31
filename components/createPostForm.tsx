import { useMutation } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'

import { ADD_POST } from '../graphql/queries'
import {
  postToForem,
  postToHashnode,
  postToMedium,
  renderModal,
  showAlert,
} from '../utils/helper'

const MonacoEditor = dynamic(import('@monaco-editor/react'), { ssr: false })

const CreatePostForm = (props: any) => {
  const [markdownContent, setMarkdownContent] = useState('')
  const handleEditorChange = (value: any) => setMarkdownContent(value)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePublicId, setImagePublicId] = useState('')
  const [, setForemPublishStatus] = useState(false)
  const [message, setMessage] = useState('')
  const [imageUploading, setImageUploading] = useState(false)

  const router = useRouter()

  const [AddPostMutation] = useMutation(ADD_POST)
  const { user } = useUser()

  const { theme } = useTheme()

  useEffect(() => {
    // @ts-ignore
    import('tw-elements')
  }, [])

  const handleUpdatingtheDB = async (
    postUrl: string,
    foremPublishStatus: boolean,
    hashnodePublishStatus: boolean,
    mediumPublishStatus: boolean
  ) => {
    setMessage('Updating the DB in progress ... ')
    const addPostMutationResponse = await AddPostMutation({
      variables: {
        post_id: uuidv4(),
        post_name: title,
        author: user?.nickname,
        post_created_at: new Date().toISOString(),
        link: postUrl,
        user_id: user?.sub,
        forem: foremPublishStatus.toString(),
        hashnode: hashnodePublishStatus.toString(),
        medium: mediumPublishStatus.toString(),
      },
    })

    if (addPostMutationResponse?.data) {
      setMessage('added to the DB success, redirecting to homepage')
      // TODO: check to see if you can remove the image from the cloudinary bucket after updating the DB 
      router.push('/posts')
    }
  }

  const handlePublish = async () => {
    let hashnodeStatus = false
    let foremStatus = false
    let mediumStatus = false

    if (title.length === 0 || markdownContent.length === 0) {
      setMessage('Please add content before publishing')
      return
    }

    const response = await postToForem(
      title,
      markdownContent,
      imageUrl,
      tags,
      props.preloadedValues.forem_key
    )
    const { data: canonical_url } = await response.json()
    if (response.status === 200) {
      foremStatus = true
      setMessage('Published to Forem, successfully')
      Promise.allSettled([
        handleHashnodeResponse(canonical_url),
        handleMediumResponse(canonical_url),
      ])
        .then((results) => {
          for (const result of results) {
            if (result.status === 'fulfilled') {
              switch (result?.value?.platform) {
                case 'hashnode':
                  hashnodeStatus = true
                  break
                case 'medium':
                  mediumStatus = true
                  break
              }
            }
            if (result.status === 'rejected') {
              switch (result.reason.platform) {
                case 'hashnode':
                  hashnodeStatus = false
                  break
                case 'medium':
                  mediumStatus = false
                  break
              }
            }
          }

          handleUpdatingtheDB(
            canonical_url,
            foremStatus,
            hashnodeStatus,
            mediumStatus
          )
        })
        .catch((error) => {
          setForemPublishStatus(false)
          setMessage(error.message as string)
        })
    } else {
      setMessage('cross posting failed')
    }
  }

  const handleHashnodeResponse = async (canonical_url: string | undefined) => {
    const response = await postToHashnode(
      title,
      markdownContent,
      imageUrl,
      tags,
      props.preloadedValues.hashnode_key,
      props.preloadedValues.hashnode_publication_id,
      canonical_url
    )
    if (response?.status === 200) {
      setMessage('published successfully to hashnode')
      return { platform: 'hashnode', data: 'OK' }
    } else {
      if (response?.status === 500) {
        throw { platform: 'hashnode', data: 'Something went wrong' }
      }
    }
  }

  const handleMediumResponse = async (canonical_url: string | undefined) => {
    const response = await postToMedium(
      title,
      markdownContent,
      imageUrl,
      tags,
      props.preloadedValues.medium_key,
      canonical_url
    )
    if (response?.status === 200) {
      setMessage('published successfully to medium')
      return { platform: 'medium', data: 'OK' }
    } else {
      if (response?.status === 500) {
        throw { platform: 'medium', data: 'Something went wrong' }
      }
    }
  }

  const handleDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    setImageUploading(true)
    const cloudName = 'dmxhfewt0'
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])
    formData.append('upload_preset', 'kross-post') // Replace the preset name with your own
    formData.append('api_key', process.env.CLOUDINARY_API_KEY as string) // Replace API key with your own Cloudinary key

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()

    setImageUrl(data.secure_url)
    setImagePublicId(data.public_id)
    setImageUploading(false)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg,image/png',
    onDrop: handleDrop,
  })

  const handleDelete = async () => {
    const response = await fetch(`/api/delete?public_id=${imagePublicId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    if (data.status === 'OK') {
      setImageUrl('')
      setImagePublicId('')
    }
  }

  return (
    <>
      {message && showAlert(message)}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="pr-4 text-xl font-bold"> CREATE POST </h2>
        <div>
          <button
            type="button"
            onClick={handlePublish}
            className="mr-4 inline-flex rounded border-0 bg-black py-2 px-6 text-sm tracking-wider text-white focus:outline-none  dark:border-2"
          >
            Publish
          </button>
          <button
            type="button"
            disabled={markdownContent.length === 0}
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            className="inline-flex  rounded border-2 py-2  px-6 text-sm tracking-wider text-black focus:outline-none  dark:text-white"
          >
            Preview
          </button>
        </div>
      </div>

      {imageUploading && <p> Uploading the cover ...</p>}
      {!imageUploading && imageUrl ? (
        <>
          {' '}
          <div className="direction-column flex h-24 items-center pb-4">
            <div>
              <img
                className="h-24 w-28 rounded-md object-cover "
                src={imageUrl}
                alt="post cover"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleDelete}
                className="ml-4 inline-block rounded-full border-2 px-6  py-2 text-xs font-medium uppercase leading-tight text-gray-800 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 dark:border-white dark:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </>
      ) : (
        !imageUploading &&
        !imageUrl && (
          <div {...getRootProps({ className: 'dropzone mb-4' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <em>(Only *.jpeg and *.png images will be accepted)</em>
          </div>
        )
      )}

      <div>
        <input
          type="text"
          placeholder="Enter the title for the post"
          className="
          dark:
          mt-4
          block
          w-full
          rounded-md
          border-transparent
          bg-gray-100 text-black focus:border-gray-500
          focus:bg-white focus:ring-0
          "
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          className="  
          dark:
          mt-4 block
          w-full
          rounded-md
          border-transparent
          bg-gray-100
          text-black
          focus:border-gray-500 focus:bg-white focus:ring-0
        "
          placeholder="Enter tags separated by comma"
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="mt-4">
          <label className="block">
            <span className="pr-4 font-bold text-gray-700 dark:text-slate-200">
              {' '}
              Editor{' '}
            </span>
            <MonacoEditor
              height="65vh"
              className="mt-4 rounded-lg border"
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              defaultLanguage="markdown"
              onChange={handleEditorChange}
              options={{
                lineNumbers: false,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </label>
        </div>
        {/* <div>
            <div
              className="dark:prose-invert prose prose-slate max-w-none overflow-auto rounded-lg border p-4 focus:outline-none"
              style={{ height: "70vh" }}
            >
              <ReactMarkdown
                children={markdownContent}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          </div> */}
      </div>

      <footer className="text-center text-white">
        <div className="container p-6">
          <div className="">
            <p className="flex items-center justify-center"></p>
          </div>
        </div>
      </footer>
      {renderModal(markdownContent)}
    </>
  )
}

export default CreatePostForm
