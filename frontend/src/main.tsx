import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import ErrorPage from "./routes/errorPage";
import LoginAuth from "./components/Auth/42_auth";
import LoginTwoFa from "./components/Auth/Auth2Fa";
import GoogleAuth from "./components/Auth/GoogleAuth";

import { TokenAuth } from "./utils/Auth";

const router = createBrowserRouter([
	{
		path: "*",
		element: <App access_token={TokenAuth.getAccessToken()} refresh_token={TokenAuth.getRefreshToken()}/>,
		errorElement: <ErrorPage />,
	},
	{
		path: "/42_auth",
		element: <LoginAuth setToken={TokenAuth.setToken as React.Dispatch<React.SetStateAction<string | undefined>>}/>,
		errorElement: <ErrorPage />,
	},
	{
		path: "/Auth2Fa",
		element: <LoginTwoFa setToken={TokenAuth.setToken as React.Dispatch<React.SetStateAction<string | undefined>>} temp_access_token={TokenAuth.getTempAccessToken()}/>,
		errorElement: <ErrorPage />,
	},
	{
		path: "/google_auth",
		element: <GoogleAuth setToken={TokenAuth.setToken as React.Dispatch<React.SetStateAction<string | undefined>>}/>,
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />
);