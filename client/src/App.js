import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Loader from "react-loader-spinner";
// import PrivateRoute from "./utils/PrivateRoute";
// import Register from "./components/RegistrationComponents/Register";

// const MainPage = lazy(() => import("./components/Mainpage"));
// const ArchitectHomePage = lazy(() => import("./components/architect"));
// const JuniorHomePage = lazy(() => import("./components/Junior"));
// const SeniorHomePage = lazy(() => import("./components/Senior"));
// const AdminHomePage = lazy(() => import("./components/Admin"));

function App() {
	return (
		<Suspense
			fallback={
				<Loader
					className='centerPage'
					type='Oval'
					color='#1194ff'
					height={150}
					width={150}
				/>
			}>
			<BrowserRouter>
				{/* <Route exact path='/' component={MainPage} />
				<Route exact path='/login' component={Login} />
				<PrivateRoute
					exact
					path='/user'
					component={UserHomePage}
				/>
				/> */}
			</BrowserRouter>
		</Suspense>
	);
}

export default App;
