import { useEffect } from "react";
import {socket} from "@/state/socket";
import { useDispatch } from "react-redux";
import { api } from "@/state/api";  // this is your RTK Query api slice

export const useKpiSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    socket.on("kpiUpdated", () => {
      // Invalidate the 'getKpis' query cache
      dispatch(api.util.invalidateTags(["Kpis", "Products",
  "Transactions",
  "StateRevenue",
  "Customers",
  "Suggestions"]));
    });

    return () => {
      socket.off("kpiUpdated");
      socket.disconnect();
    };
  }, [dispatch]);
};
