import { NextPage } from 'next'

import CreatePostForm from '../components/createPostForm'
import Header from '../components/header'
import Wrapper from '../components/wrapper'
import getSettings from '../utils/getSettings'
import withApollo from '../utils/withApollo'

const Create: NextPage = (props: any) => {
  return (
    <>
      <Header />
      <Wrapper>
        <>
          <CreatePostForm preloadedValues={props.settings[0]} />
        </>
      </Wrapper>
    </>
  )
}

export const getServerSideProps = async (ctx: any) => {
  const settingsResponse = await getSettings(ctx)
  return {
    props: {
      settings: settingsResponse.data.data.settings,
    },
  }
}

export default withApollo(Create)
