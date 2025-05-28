import {
  data,
  isRouteErrorResponse,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import "./app.css";
import {AuthProvider} from "~/auth/AuthContext";
import type {Route} from "../.react-router/types/app/+types/root";
import {fetchUserData, getTokenFromRequest} from "~/auth/utils";
import {getToast} from "remix-toast";
import {useEffect} from "react";
import {Toaster, toast as notify} from "sonner";

export async function loader({request}: Route.LoaderArgs) {
  const token = getTokenFromRequest(request);
  const user = token ? await fetchUserData(token) : null;

  const {toast, headers} = await getToast(request);

  return data({user: user, toast: toast}, {headers});
}

export function Layout({children}: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Plantly</title>
      </head>
      <body>
      {children}
      <ScrollRestoration/>
      <Scripts/>
      </body>
      </html>
  );
}

export default function App() {
  const {user} = useLoaderData<typeof loader>();
  const {toast} = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast) {
      console.log('toast')
      console.log(toast)
      if (toast?.type === "error") {
        notify.error(toast.message);
      }
      if (toast?.type === "success") {
        notify.success(toast.message);
      }
    }
  }, [toast]);

  return (
      <AuthProvider initialUser={user}>
        <Outlet/>
        <Toaster position="bottom-right" richColors={true}/>
      </AuthProvider>
  );
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  console.log(error);
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
        error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
      <main className="pt-16 p-4 container mx-auto">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
            <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
        )}
      </main>
  );
}