import React from 'react'
import { Card, CardContent, CardDescription, CardHeader } from "../../ui/card"
import { BookOpen, PackageMinus, PackagePlus } from "lucide-react"
const Katalog = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Buku</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-2xl text-gray-100">0</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stok Tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PackagePlus className="w-4 h-4 text-emerald-600" />
              <span className="text-2xl text-gray-100">
                0
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stok Habis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PackageMinus className="w-4 h-4 text-orange-600" />
              <span className="text-2xl text-gray-100">
                0
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

export default Katalog