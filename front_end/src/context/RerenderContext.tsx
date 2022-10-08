//very dumb and probably not advisable but i didnt want to restructure everything
import { createContext } from 'react'

export const RerenderContext = createContext<{rerender: boolean | null, setRerender: React.Dispatch<React.SetStateAction<boolean>> | null}>({rerender: null, setRerender: null})