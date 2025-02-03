import {Outlet} from "react-router";


export default function ContentLayout(){
  return (
      <div>
        <h1>CONTENT LAYOUT</h1>
        <main>
          <Outlet/>
        </main>
      </div>
  );
}