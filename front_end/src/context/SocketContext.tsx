import { createContext } from 'react'
import io from 'socket.io-client'

const chatSocket = io("http://localhost:3333/chat", {withCredentials: true})

const ChatContext = createContext<any>(null)

export {ChatContext, chatSocket}
