import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {
    createBrowserRouter,
    createHashRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import AboutPage from "./pages/AboutPage.tsx";

const routerConfig = [
    {
        path: "",
        element: (
            <div>
                <h1>Hello World</h1>
                <Link to="about">About Us</Link>
                <ul>
                    <li><Link to={"main"}>Main</Link></li>
                </ul>
            </div>
        ),
    },
    {
        path: "about",
        element: <AboutPage />,
    },
    {
        path: "main",
        element: <App />,
    },
]
// const router = createBrowserRouter(routerConfig)
const router = createHashRouter(routerConfig)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
