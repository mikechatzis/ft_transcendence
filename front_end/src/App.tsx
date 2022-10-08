import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Home from './pages/Home'
import MenuBar from './components/Menu'
import Login from './pages/Login'
import Error401 from './pages/Error401'
import Error404 from './pages/Error404'
import Account from './pages/Account'
import Settings from './pages/Settings'
import { UserContext } from './context/UserContext'
import axios from 'axios'
import { UrlContext } from './context/UrlContext'
import { RerenderContext } from "./context/RerenderContext"
import TwoFactor from './pages/2fa'
import Chat from './pages/Chat'
import { ChatContext, chatSocket } from './context/ChatContext'
import User from './pages/User'
import ChatList from './pages/ChatList'

const App: React.FC = () => {
	const [darkMode, setDarkMode] = useState(false)
	const [context, setContext] = useState(false)
	const [rerender, setRerender] = useState(false)

	const baseUrl = useContext(UrlContext)

	const theme = createTheme ({
		palette: {
			mode: darkMode ? "dark" : "light"
		}
	})

	const checkLoginStatus = () => {
		axios.get(baseUrl + 'auth/logged_in', {withCredentials: true}).then(() => {
			setContext?.(true)
		}).catch((error) => {
			setContext?.(false)
		})
	}

	useEffect(() => {
		if (!chatSocket.connected) {
			chatSocket.connect()
		}
		else if (!context) {
			chatSocket.disconnect()
		}
	}, [context])

	useEffect(checkLoginStatus, [baseUrl])

	useEffect(() => {
		const themeType = localStorage.getItem("dark") || "dark"
		if (themeType === "dark") {
			setDarkMode(true)
		}
	}, [])

	const handleToggle = () => {
		localStorage.setItem("dark", darkMode ? "light" : "dark")
		setDarkMode(!darkMode)
	}

	return (
		<ThemeProvider theme={theme}>
			<RerenderContext.Provider value={{rerender, setRerender}}>
				<ChatContext.Provider value={chatSocket}>
					<UserContext.Provider value={{context, setContext}}>
						<CssBaseline />
						<MenuBar handleToggle={handleToggle} />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/account" element={<Account />} />
							<Route path="/unauthorized" element={<Error401 />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/2fa" element={<TwoFactor /> } />
							<Route path="/chat-list" element={<ChatList />} />
							<Route path="/chat/:name" element={<Chat />} />
							<Route path="/users/:name" element={<User />} />
							<Route path="/401" element={<Error401 />} />
							<Route path="*" element={<Error404 />} />
						</Routes>
					</UserContext.Provider>
				</ChatContext.Provider>
			</RerenderContext.Provider>
		</ThemeProvider>
	)
}

export default App;
