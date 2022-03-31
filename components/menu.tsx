import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment } from 'react'

export default function Profile({ image }: any) {
  const router = useRouter()

  const handleLogout = () => {
    router.push('/api/auth/logout')
  }

  const SwitchToProfile = () => {
    router.push('/profile')
  }

  const SwitchToSettings = () => {
    router.push('/settings')
  }

  const profileItems = [
    {
      name: 'Profile',
      event: SwitchToProfile,
    },
    {
      name: 'Account Settings',
      event: SwitchToSettings,
    },
    {
      name: 'Logout',
      event: handleLogout,
    },
  ]

  return (
    <div className=" text-right ">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center px-4 py-2">
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              src={image}
              alt="Profile"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {profileItems.map((Item) => {
                return (
                  <Menu.Item key={Item.name}>
                    <button
                      className={
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                      }
                      onClick={Item.event}
                    >
                      {Item.name}
                    </button>
                  </Menu.Item>
                )
              })}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
