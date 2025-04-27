"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, Minus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MapMarker {
  id: string
  x: number
  y: number
  label: string
  floor: number
  color?: string
  onClick?: () => void
}

interface InteractiveMapProps {
  markers: MapMarker[]
  width?: number
  height?: number
  onMarkerClick?: (markerId: string) => void
}

export default function InteractiveMap({ markers, width = 1000, height = 500, onMarkerClick }: InteractiveMapProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentFloor, setCurrentFloor] = useState(1)

  const mapRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = (e.clientX - dragStart.x) / zoom
    const dy = (e.clientY - dragStart.y) / zoom

    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handlePan = (direction: "up" | "down" | "left" | "right") => {
    const panAmount = 50 / zoom

    switch (direction) {
      case "up":
        setPosition((prev) => ({ ...prev, y: prev.y + panAmount }))
        break
      case "down":
        setPosition((prev) => ({ ...prev, y: prev.y - panAmount }))
        break
      case "left":
        setPosition((prev) => ({ ...prev, x: prev.x + panAmount }))
        break
      case "right":
        setPosition((prev) => ({ ...prev, x: prev.x - panAmount }))
        break
    }
  }

  const handleMarkerClick = (markerId: string) => {
    if (onMarkerClick) {
      onMarkerClick(markerId)
    }
  }

  // Reset position when changing floors
  useEffect(() => {
    setPosition({ x: 0, y: 0 })
  }, [currentFloor])

  // Filter markers by current floor
  const visibleMarkers = markers.filter((marker) => marker.floor === currentFloor)

  // Fix the map legend positioning by moving it inside the map container
  // Remove the existing map legend
  useEffect(() => {
    const mapLegendDiv = document.querySelector(".absolute.top-4.left-4.bg-white\\/90")
    if (mapLegendDiv) {
      mapLegendDiv.remove()
    }
  }, [])

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100 ">
      {/* Map container */}
      <div
        ref={mapRef}
        className="relative overflow-hidden w-full h-full cursor-grab"
        style={{ width, height }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Map content */}
        <div
          className="absolute transition-transform duration-100 cursor-grab"
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Building layout for Floor 1 */}
          {currentFloor === 1 && (
            <div className="absolute inset-0 ">
              {/* Main building outline */}
              <div
                className="absolute border-4 border-gray-700 bg-gray-200 rounded-lg "
                style={{ left: "10%", top: "10%", width: "80%", height: "80%" }}
              >
                {/* Entrance */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-700 -mb-2"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-center mt-1">
                  Entrance
                </div>

                {/* Rooms/Stores */}
                <div
                  className="absolute border-2 border-gray-500 bg-blue-100 rounded"
                  style={{ left: "5%", top: "5%", width: "25%", height: "30%" }}
                >
                  <div className="p-1 text-xs">Store A</div>
                </div>

                <div
                  className="absolute border-2 border-gray-500 bg-green-100 rounded"
                  style={{ left: "5%", top: "40%", width: "25%", height: "30%" }}
                >
                  <div className="p-1 text-xs">Store B</div>
                </div>

                <div
                  className="absolute border-2 border-gray-500 bg-yellow-100 rounded"
                  style={{ right: "5%", top: "5%", width: "25%", height: "30%" }}
                >
                  <div className="p-1 text-xs">Store C</div>
                </div>

                <div
                  className="absolute border-2 border-gray-500 bg-red-100 rounded"
                  style={{ right: "5%", top: "40%", width: "25%", height: "30%" }}
                >
                  <div className="p-1 text-xs">Store D</div>
                </div>

                {/* Hallway */}
                <div className="absolute bg-gray-300" style={{ left: "35%", top: "5%", width: "30%", height: "90%" }}>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-center">
                    Hallway
                  </div>

                  {/* Stairs to second floor */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 border-2 border-gray-500 bg-gray-400 rounded flex items-center justify-center">
                    <div className="text-xs text-center">Stairs</div>
                  </div>
                </div>
              </div>

              {/* Parking area */}
              <div
                className="absolute border-2 border-gray-500 bg-gray-300 rounded"
                style={{ left: "10%", bottom: "5%", width: "80%", height: "10%" }}
              >
                <div className="p-1 text-xs">Parking Area</div>
              </div>
            </div>
          )}

          {/* Building layout for Floor 2 */}
          {currentFloor === 2 && (
            <div className="absolute inset-0">
              {/* Main building outline */}
              <div
                className="absolute border-4 border-gray-700 bg-gray-200 rounded-lg"
                style={{ left: "10%", top: "10%", width: "80%", height: "80%" }}
              >
                {/* Rooms/Stores */}
                <div
                  className="absolute border-2 border-gray-500 bg-purple-100 rounded"
                  style={{ left: "5%", top: "5%", width: "25%", height: "40%" }}
                >
                  <div className="p-1 text-xs">Store E</div>
                </div>

                <div
                  className="absolute border-2 border-gray-500 bg-pink-100 rounded"
                  style={{ left: "5%", top: "50%", width: "25%", height: "40%" }}
                >
                  <div className="p-1 text-xs">Store F</div>
                </div>

                <div
                  className="absolute border-2 border-gray-500 bg-indigo-100 rounded"
                  style={{ right: "5%", top: "5%", width: "40%", height: "85%" }}
                >
                  <div className="p-1 text-xs">Food Court</div>
                </div>

                {/* Hallway */}
                <div className="absolute bg-gray-300" style={{ left: "35%", top: "5%", width: "20%", height: "90%" }}>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-center">
                    Hallway
                  </div>

                  {/* Stairs to first floor */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 border-2 border-gray-500 bg-gray-400 rounded flex items-center justify-center">
                    <div className="text-xs text-center">Stairs</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map markers */}
          {visibleMarkers.map((marker) => (
            <div
              key={marker.id}
              className={`absolute w-8 h-8 ${marker.color || "bg-primary"} text-white rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform z-10`}
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
              }}
              onClick={() => handleMarkerClick(marker.id)}
              title={marker.label}
            >
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <span className="absolute w-full h-full rounded-full animate-ping bg-primary/40"></span>
            </div>
          ))}
        </div>

        {/* Map legend - properly positioned */}
        <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg shadow-sm text-xs z-20">
          <div className="font-medium mb-1">Map Legend</div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Active Stores</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Available Spaces</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" onClick={handleZoomIn}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleZoomOut}>
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Pan controls */}
      <div className="absolute bottom-16 right-4 grid grid-cols-3 gap-1">
        <div></div>
        <Button variant="secondary" size="icon" onClick={() => handlePan("up")}>
          <ArrowUp className="h-4 w-4" />
        </Button>
        <div></div>
        <Button variant="secondary" size="icon" onClick={() => handlePan("left")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div></div>
        <Button variant="secondary" size="icon" onClick={() => handlePan("right")}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div></div>
        <Button variant="secondary" size="icon" onClick={() => handlePan("down")}>
          <ArrowDown className="h-4 w-4" />
        </Button>
        <div></div>
      </div>

      {/* Floor selector */}
      <div className="absolute bottom-4 left-4 right-4">
        <Tabs value={currentFloor.toString()} onValueChange={(value) => setCurrentFloor(Number.parseInt(value))}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="1">Floor 1</TabsTrigger>
            <TabsTrigger value="2">Floor 2</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

