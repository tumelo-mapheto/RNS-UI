import { useTheme } from 'contexts/theme'
import { NextPage } from 'next'
import Link from 'next/link'
import { ImArrowRight2 } from 'react-icons/im'
import { useWallet } from 'contexts/wallet'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Coin } from '@cosmjs/stargate'

declare global {
  interface Window {
    keplr: any
  }
}

const Airdrop: NextPage = () => {
  const theme = useTheme()
  const wallet = useWallet()
  const [mintLoading, setMintLoading] = useState(false)

  const checkTaken = (address: String) => {
    console.log(address)
  }

  const registerName = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!wallet.initialized) {
      toast.error('Wallet not connected!', { style: { maxWidth: 'none' } })
      return false
    }

    if (e.target.nmval.value.length < 1) {
      toast.error('Must enter a name!', { style: { maxWidth: 'none' } })
      return false
    }

    const client = wallet.getClient()

    const contractAddress: string = String(
      process.env.NEXT_PUBLIC_ENV_CONTRACT_ADDRESS
    )

    let years = parseInt(e.target.years.value)
    let nm = e.target.nmval.value
    const msg = { add_time: { name: nm, years: years } }

    let cost = 156250

    switch (nm.length) {
      case 1:
        cost = 5000000
        break
      case 2:
        cost = 2500000
        break
      case 3:
        cost = 1250000
        break
      case 4:
        cost = 625000
        break
      case 5:
        cost = 312500
        break
      default:
        cost = 156250
        break
    }

    cost = cost * years

    let juno: Coin = {
      denom: 'ujunox',
      amount: cost.toString(),
    }

    let secret_id = await window.keplr.getKey('secret-4')
    secret_id = secret_id.bech32Address
    let cro = await window.keplr.getKey('crypto-org-chain-mainnet-1')
    cro = cro.bech32Address
    let iov = await window.keplr.getKey('iov-mainnet-ibc')
    iov = iov.bech32Address
    let pers = await window.keplr.getKey('core-1')
    pers = pers.bech32Address
    let kava = await window.keplr.getKey('kava-9')
    kava = kava.bech32Address

    let funds: Coin[] = [juno]

    console.log(contractAddress)
    client
      .execute(
        wallet.address,
        contractAddress,
        msg,
        'auto',
        `Extending Name: ${nm}`,
        funds
      )
      .then(() => {
        setMintLoading(false)
        toast.success('Duration Extended!', {
          style: { maxWidth: 'none' },
        })
      })
      .catch((err: any) => {
        setMintLoading(false)
        toast.error(err.message, { style: { maxWidth: 'none' } })
        console.error(err)
      })
    return false
  }

  const overwriteName = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!wallet.initialized) {
      toast.error('Wallet not connected!', { style: { maxWidth: 'none' } })
      return false
    }

    if (e.target.nmval.value.length < 1) {
      toast.error('Must enter a name!', { style: { maxWidth: 'none' } })
      return false
    }

    let secret_id = await window.keplr.getKey('secret-4')
    secret_id = secret_id.bech32Address
    let cro = await window.keplr.getKey('crypto-org-chain-mainnet-1')
    cro = cro.bech32Address
    let iov = await window.keplr.getKey('iov-mainnet-ibc')
    iov = iov.bech32Address
    let pers = await window.keplr.getKey('core-1')
    pers = pers.bech32Address
    let kava = await window.keplr.getKey('kava-9')
    kava = kava.bech32Address
    let terra = await window.keplr.getKey('columbus-5')
    terra = terra.bech32Address

    const client = wallet.getClient()

    const contractAddress: string = String(
      process.env.NEXT_PUBLIC_ENV_CONTRACT_ADDRESS
    )

    let nm = e.target.nmval.value

    const msg = {
      update_params: {
        name: nm,
        terra_address: terra,
        secret_address: secret_id,
        crypto_org_address: cro,
        kava_address: kava,
        persistence_address: pers,
        starname_address: iov,
        avatar_url:
          e.target.avatar_url.value.length > 0
            ? e.target.avatar_url.value
            : null,
        website:
          e.target.website.value.length > 0 ? e.target.website.value : null,
        email: e.target.email.value.length > 0 ? e.target.email.value : null,
        twitter:
          e.target.twitter.value.length > 0 ? e.target.twitter.value : null,
        telegram:
          e.target.telegram.value.length > 0 ? e.target.telegram.value : null,
        discord:
          e.target.discord.value.length > 0 ? e.target.discord.value : null,
        instagram:
          e.target.instagram.value.length > 0 ? e.target.instagram.value : null,
        reddit: e.target.reddit.value.length > 0 ? e.target.reddit.value : null,
      },
    }

    console.log(contractAddress)
    client
      .execute(
        wallet.address,
        contractAddress,
        msg,
        'auto',
        `Updating name: ${nm}`
      )
      .then(() => {
        setMintLoading(false)
        toast.success('Name Updated!', {
          style: { maxWidth: 'none' },
        })
      })
      .catch((err: any) => {
        setMintLoading(false)
        toast.error(err.message, { style: { maxWidth: 'none' } })
        console.error(err)
      })
    return false
  }

  return (
    <div className="h-4/4 w-3/4">
      <h1 className="text-6xl font-bold text-center">
        Add Time to Domain Name
      </h1>
      <div className="my-6">
        <form
          className="container mx-auto grid gap-1 grid-cols-8 justify-items-center items-center"
          onSubmit={registerName}
        >
          <div className="col-span-5 h-full w-full block grid grid-cols-8">
            <input
              name="nmval"
              id="nmval"
              type="text"
              className="col-span-7 h-full bg-gray-50 box-content border-gray-300 text-black text-2xl rounded-lg px-4 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter name you wish to extend'}
              onChange={(e) => checkTaken(e.target.value)}
            />
            <div
              className="col-span-1 text-2xl block h-full w-full text-left rounded-r-md bg-white text-black grid items-center"
              style={{ marginLeft: '-10px', paddingLeft: '10px' }}
            >
              <label htmlFor="nmval" className="col-span-1">
                .rns
              </label>
            </div>
          </div>

          <input
            type="number"
            id="years"
            name="years"
            min="1"
            max="10"
            className="col-span-1 w-full text-2xl h-full text-black px-5 border-gray-300 rounded-l-md"
            defaultValue="1"
          />
          <div
            className="col-span-1 text-2xl block h-full w-full text-left rounded-r-md bg-white text-black grid items-center"
            style={{ marginLeft: '-10px', paddingLeft: '10px' }}
          >
            <label htmlFor="years">Years</label>
          </div>

          <button
            type="submit"
            className={`${theme.isDarkTheme ? 'bg-gray/10' : 'bg-dark-gray/10'}
            col-span-1 h-full p-3 rounded-md w-full  text-2xl block`}
          >
            Extend
          </button>
        </form>
      </div>

      <div className="my-6">
        <h1 className="text-6xl font-bold text-center">Overwrite Metadata</h1>
        <form
          className="container my-4 mx-auto grid gap-1 grid-cols-8 justify-items-center items-center"
          onSubmit={overwriteName}
        >
          <div className="col-span-7 h-full w-full block grid grid-cols-8">
            <input
              name="nmval"
              id="nmval"
              type="text"
              className="col-span-7 h-full bg-gray-50 box-content border-gray-300 text-black text-2xl rounded-lg px-4 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter name you wish to reclaim'}
              onChange={(e) => checkTaken(e.target.value)}
            />
            <div
              className="col-span-1 text-2xl block h-full w-full text-left rounded-r-md bg-white text-black grid items-center"
              style={{ marginLeft: '-10px', paddingLeft: '10px' }}
            >
              <label htmlFor="nmval" className="col-span-1">
                .rns
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`${theme.isDarkTheme ? 'bg-gray/10' : 'bg-dark-gray/10'}
            col-span-1 h-full p-3 w-full rounded-md text-2xl block`}
          >
            Reclaim
          </button>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center  py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="avatar_url" className="col-span-1 bg-white">
                AvatarURL
              </label>
            </div>
            <input
              name="avatar_url"
              id="avatar_url"
              type="text"
              className="col-span-6 w-full h-full bg-gray-50 box-content border-gray-300 text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter URL'}
            />
          </div>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="website" className="col-span-1 bg-white">
                Website
              </label>
            </div>
            <input
              name="website"
              id="website"
              type="text"
              className="col-span-6 h-full w-full bg-gray-50 box-content border-gray-300  text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter URL'}
            />
          </div>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="email" className="col-span-1 bg-white">
                E-Mail
              </label>
            </div>
            <input
              name="email"
              id="email"
              type="text"
              className="col-span-6 h-full w-full bg-gray-50 box-content border-gray-300  text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter Address'}
            />
          </div>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="twitter" className="col-span-1 bg-white">
                Twitter
              </label>
            </div>
            <input
              name="twitter"
              id="twitter"
              type="text"
              className="col-span-6 h-full w-full bg-gray-50 box-content border-gray-300  text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter @handle'}
            />
          </div>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="telegram" className="col-span-1 bg-white">
                Telegram
              </label>
            </div>
            <input
              name="telegram"
              id="telegram"
              type="text"
              className="col-span-6 h-full w-full bg-gray-50 box-content border-gray-300  text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter @handle'}
            />
          </div>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="discord" className="col-span-1 bg-white">
                Discord
              </label>
            </div>
            <input
              name="discord"
              id="discord"
              type="text"
              className="col-span-6 h-full w-full bg-gray-50 box-content border-gray-300  text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter name#number'}
            />
          </div>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="instagram" className="col-span-1 bg-white">
                Instagram
              </label>
            </div>
            <input
              name="instagram"
              id="instagram"
              type="text"
              className="col-span-6 h-full w-full bg-gray-50 box-content border-gray-300  text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter @handle'}
            />
          </div>

          <div className="col-span-4 h-full w-full block grid grid-cols-8">
            <div
              className="col-span-2 text-2xl block h-full w-full text-left rounded-l-md bg-white text-black grid items-center py-2"
              style={{ marginRight: '-20px', paddingLeft: '10px', zIndex: 2 }}
            >
              <label htmlFor="reddit" className="col-span-1 bg-white">
                Reddit
              </label>
            </div>
            <input
              name="reddit"
              id="reddit"
              type="text"
              className="col-span-6 h-full w-full bg-gray-50 box-content border-gray-300  text-black text-2xl rounded-r-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={'Enter u/username'}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Airdrop
