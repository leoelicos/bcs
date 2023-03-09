import { useCallback, useState } from 'react'

const useRiddle = () => {
  const [riddleQuestion, setRiddleQuestion] = useState('')
  const [riddleAnswer, setRiddleAnswer] = useState('')

  const [riddleLoading, setRiddleLoading] = useState(false)
  const [riddleError, setRiddleError] = useState(false)

  const fetchRiddle = () => fetch('https://riddles-api.vercel.app/random', { method: 'GET', headers: { 'Content-Type': 'application/json' } })

  const deserialiseRiddle = (data) => data.json()

  const spacingRiddle = (str) => str.replace(/([.!?])\s+/g, '$1###').split('###')

  const mockRiddleUpdate = () =>
    new Promise((res, rej) => {
      setRiddleLoading(true)
      setTimeout(() => {
        setRiddleQuestion(spacingRiddle('I come in darkness, but fill the mind with light. I bring enlightenment to some, while gripping others in the hand of fear. With me it can be a journey of inexplicable joy and sorrow. What I will show you will often be unreachable. Journey with me and what you see may haunt you. Journey with me and you may never want to return home. Journey with me and you will never know when it will end. What am I?'))
        setRiddleAnswer('your dreams')
        setRiddleLoading(false)
        console.log('fetchRiddle')
        res(true)
      }, 2000)
    })

  const riddleUpdate = useCallback(async () => {
    let riddle = undefined
    let data = undefined

    try {
      setRiddleLoading(true)

      while (riddle === undefined || riddle.answer.length > 12) {
        data = await fetchRiddle()
        if (!data) throw new Error('fetch error')

        riddle = await deserialiseRiddle(data)
        if (!riddle) throw new Error()

        console.log('Search', { riddle })
      }
      console.log('Final', { riddle })
      setRiddleQuestion(riddle.riddle)
      setRiddleAnswer(riddle.answer.toLowerCase())
    } catch (error) {
      console.error(error)
      setRiddleError(true)
      setTimeout(() => {
        setRiddleError(false)
      }, 2000)
    } finally {
      setRiddleLoading(false)
    }
  }, [])

  return { riddleQuestion, riddleAnswer, riddleUpdate: mockRiddleUpdate, riddleLoading, riddleError }
}
export default useRiddle
