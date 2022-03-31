import type { NextPage } from 'next'

import Header from '../components/header'
import SettingsForm from '../components/settingsForm'
import Wrapper from '../components/wrapper'
import getSettings from '../utils/getSettings'
import withApollo from '../utils/withApollo'

const Settings: NextPage = () => {
  return (
    <>
      <Header />
      <Wrapper>
        <>
          <SettingsForm />
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

export default withApollo(Settings)
