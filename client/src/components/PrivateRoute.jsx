import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signOut } from "../redux/user/userSlice";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!currentUser) {
        setAuthChecked(true);
        return;
      }

      try {
        const res = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (res.status === 200) {
          setIsValid(true);
        } else {
          dispatch(signOut());
          setIsValid(false);
        }
      } catch (err) {
        dispatch(signOut());
        setIsValid(false);
      } finally {
        setAuthChecked(true);
      }
    };

    verifyToken();
  }, [currentUser, dispatch]);

  if (!authChecked) {
    return <div className="text-center p-10">Checking authentication...</div>;
  }

  return currentUser && isValid ? <Outlet /> : <Navigate to="/sign-in" />;
}
