import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserService } from "../services/Users.service";

const useUserStatus = () => {
  const userId = useSelector((state) => state.auth.user.id);

  const [activeOnly, setActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const userData = await UserService.getSingleUser(userId);
        if (!cancelled) {
          setUser(userData);
          setActiveOnly(userData?.status === "ACTIVE");
        }
      } catch (error) {
        if (!cancelled) console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // ✅ Function to update user status
  const updateStatus = async (newStatus) => {
    if (!userId) return;
    try {
      setLoading(true);
      const updatedUser = await UserService.updateUserStatus(userId, newStatus);
      setUser(updatedUser);
      setActiveOnly(updatedUser?.status === "ACTIVE");
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setLoading(false);
    }
  };

  return { activeOnly, setActiveOnly, loading, user, updateStatus };
};

export default useUserStatus;
