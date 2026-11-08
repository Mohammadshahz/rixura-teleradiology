import React, { useEffect } from "react";
import AppRoutes from "./AppRouters";
import { profileUrl } from "./utils/urls";
import { useNavigate } from "react-router";
import { errorHandler } from "./utils/error-handler";
import { useDispatch } from "react-redux";
import { setUser } from "./store/auth.slice";
import axiosInstance from "./utils/axios-instance";
function App() {
  const [appLoaded, setAppLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //   // Simulate an async operation like fetching user data or settings
  //   const loadApp = async () => {
  //     // Simulate a delay
  //    axiosInstance.get(profileUrl).then((response) => {
  //       console.log("User profile loaded:", response.data);
  //       setAppLoaded(true);
  //       const dummyData = {
  //         name: "Dummy User",
  //         email : 'dummy-email'
  //       }
  //       // TODO: Replace with actual user data from response
  //       dispatch(setUser(dummyData));
  //     }
  //     ).catch((error) => {
  //       errorHandler(error)
  //       setAppLoaded(false);
  //       navigate("/login");
  //     });
  //   };
  //   loadApp();
  // }, []);
  
  // if(!appLoaded) {
  //   return <div className="flex items-center justify-center h-screen">Loading...</div>;
  // }
  return (
    <div className={"text-black bg-white dark:bg-black dark:text-white"}>
      <AppRoutes />
    </div>
  );
}

export default App;