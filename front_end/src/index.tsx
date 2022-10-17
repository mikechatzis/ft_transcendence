import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import { UrlContext } from './context/UrlContext';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

document.title = "Transcendence"

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<UrlContext.Provider value="http://localhost:3333/">
				<App />
			</UrlContext.Provider>
		</BrowserRouter>
	</React.StrictMode>
);
