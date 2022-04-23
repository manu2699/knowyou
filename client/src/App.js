import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Triangle } from "react-loader-spinner";

const MainPage = lazy(() => import("./pages/Main"));

function App() {
	return (
		<Suspense
			fallback={
				<Triangle
					className='centerPage'
					type='Oval'
					color='#1194ff'
					height={150}
					width={150}
				/>
			}>
			<BrowserRouter>
				<Routes>
					<Route exact path='/login' element={<MainPage />} />
					{/*
				<Route exact path='/login' component={Register} />
				/> */}
				</Routes>
			</BrowserRouter>
		</Suspense>
	);
}

export default App;
