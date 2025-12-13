/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import ModalStatsDipinjam from "../modal/modal-stats-diPinjam";
import ModalStatsPendingPeminjaman from "../modal/modal-stats-pendingPeminjaman";
import ModalStatsPendingPengembalian from "../modal/modal-stats-pendingPengembalian";
import ModalStatsDenda from "../modal/modal-stats-denda";
import ModalCreateBuku from "../modal/modal-create-buku";
import { ReactQueryProvider } from "./ReactQueryProvider";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ReactQueryProvider>
      <ModalStatsDipinjam />
      <ModalStatsPendingPeminjaman />
      <ModalStatsPendingPengembalian />
      <ModalStatsDenda />
      <ModalCreateBuku />
    </ReactQueryProvider>
  )
}

export default ModalProvider