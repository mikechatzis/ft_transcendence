import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home'
import Menu from './components/Menu'
import Login from './pages/Login'
import Error404 from './pages/Error404'

const App: React.FC = () => {
	return (
		<>
		<Menu />
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="*" element={<Error404 />} />
		</Routes>
		</>
	)
}

export default App;
