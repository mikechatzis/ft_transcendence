import React from 'react'
import { createContext } from 'react'

export const UserContext = createContext<{context: boolean | null, setContext: React.Dispatch<React.SetStateAction<boolean>> | null}>({context: null, setContext: null})