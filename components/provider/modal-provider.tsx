/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import ModalStatsDipinjam from "../modal/modal-stats-diPinjam";
import ModalStatsPendingPeminjaman from "../modal/modal-stats-pendingPeminjaman";
import ModalStatsPendingPengembalian from "../modal/modal-stats-pendingPengembalian";
import ModalStatsDenda from "../modal/modal-stats-denda";
import ModalCreateBuku from "../modal/modal-create-buku";
import { ReactQueryProvider } from "./ReactQueryProvider";
import ModalDeleteBuku from "../modal/modal-delete-buku";
import ModalEditBuku from "../modal/modal-edit-buku";
import ModalSuccessPeminjaman from "../modal/modal-success-peminjaman";
import ModalKonfirmasiPeminjaman from "../modal/modal-konfirmasi-peminjaman";
import ModalStrukPeminjaman from "../modal/modal-struk-peminjaman";

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
      <ModalDeleteBuku/>
      <ModalEditBuku/>
      <ModalSuccessPeminjaman/>
      <ModalKonfirmasiPeminjaman/>
      <ModalStrukPeminjaman/>
    </ReactQueryProvider>
  )
}

export default ModalProvider