/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import ModalStatsDipinjam from "../modal/modal-stats-diPinjam";
import ModalStatsPendingPeminjaman from "../modal/modal-stats-pendingPeminjaman";
import ModalStatsPendingPengembalian from "../modal/modal-stats-pendingPengembalian";
import ModalStatsDenda from "../modal/modal-stats-denda";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

  return (
    <>
    <ModalStatsDipinjam/>
    <ModalStatsPendingPeminjaman/>
    <ModalStatsPendingPengembalian/>
    <ModalStatsDenda/>
    </>
  )
}

export default ModalProvider