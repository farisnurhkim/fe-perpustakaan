/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import ModalStatsDipinjam from "../modal/modal-stats-diPinjam";

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
    </>
  )
}

export default ModalProvider