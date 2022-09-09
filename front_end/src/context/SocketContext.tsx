import { createContext } from 'react'
import io from 'socket.io-client'

export const chatSocket = io("http://localhost:3333/chat", {withCredentials: true})

export const ChatContext = createContext<any>(null)

