import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Triangle } from "react-loader-spinner";

import PrivateRoute from "./utils/PrivateRoute";

const MainPage = lazy(() => import("./pages/Main"));
const LoginPage = lazy(() => import("./pages/Login"));
const KnowMePage = lazy(() => import("./pages/KnowMe"));

function App() {
	return (
		<Suspense
			fallback={
				<div className='loaderPage'>
					<Triangle
						className=''
						type='Oval'
						color='#004458'
						height={150}
						width={150}
					/>
				</div>
			}>
			<BrowserRouter>
				<Routes>
					<Route
						exact
						path='/'
						element={
							<PrivateRoute>
								<MainPage />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/knowme'
						element={
							<PrivateRoute>
								<KnowMePage />
							</PrivateRoute>
						}
					/>
					<Route path='/login' element={<LoginPage />} />
					{/*
				<Route exact path='/login' component={Register} />
				/> */}
				</Routes>
			</BrowserRouter>
		</Suspense>
	);
}

export default App;
