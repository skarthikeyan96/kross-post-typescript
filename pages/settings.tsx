import type { NextPage } from 'next'

import Header from '../components/header'
import SettingsForm from '../components/settingsForm'
import Wrapper from '../components/wrapper'
import getSettings from '../utils/getSettings'
import withApollo from '../utils/withApollo'

const Settings: NextPage = (props: any) => {
  const { settings } = props
  return (
    <>
      <Header />
      <Wrapper>
        <>
          <SettingsForm preloadedValues={settings[0]} />
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
