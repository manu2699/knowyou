import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Triangle } from "react-loader-spinner";

import PrivateRoute from "./utils/PrivateRoute";

const MainPage = lazy(() => import("./pages/Main"));
const LoginPage = lazy(() => import("./pages/Login"));

function App() {
	return (
		<Suspense
			fallback={
				<Triangle
					className='loaderPage'
					type='Oval'
					color='#004458'
					height={150}
					width={150}
				/>
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
