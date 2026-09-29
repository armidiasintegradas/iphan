"use client";

import { useEffect, useRef } from "react";
import { Map as MapLibreMap, NavigationControl, AttributionControl, Popup, Marker } from "maplibre-gl";
import Link from "next/link";

type Point = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  risk: string;
};

function markerColor(risk: string) {
  if (risk === "Risco" || risk === "Crítico") return "#d93636";
  if (risk === "Atenção") return "#e5a923";
  return "#007350";
}

export default function HeritageMap({
  points,
  compact = false,
}: {
  points: Point[];
  compact?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!container.current || map.current) return;

    const instance = new MapLibreMap({
      container: container.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: compact ? [-35.35, -8.2] : [-35.4, -8.25],
      zoom: compact ? 6.2 : 6.4,
      attributionControl: false,
    });

    instance.addControl(new NavigationControl({ showCompass: false }), "top-left");
    instance.addControl(new AttributionControl({ compact: true }), "bottom-right");

    points.forEach((point) => {
      const el = document.createElement("button");
      el.className = "realMapMarker";
      el.style.background = markerColor(point.risk);
      el.title = point.name;

      const popup = new Popup({ offset: 18 }).setHTML(
        `<div class="mapPopup"><strong>${point.name}</strong><span>${point.city}</span><a href="/patrimonio/${point.id}">Ver detalhes →</a></div>`
      );

      new Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .setPopup(popup)
        .addTo(instance);
    });

    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
    };
  }, [points, compact]);

  return (
    <div className={compact ? "realMap compact" : "realMap"}>
      <div ref={container} className="realMapCanvas" />
      {!compact && (
        <div className="mapLegendReal">
          <span><i className="regular" /> Regular</span>
          <span><i className="warning" /> Atenção</span>
          <span><i className="danger" /> Risco</span>
        </div>
      )}
      {compact && <Link href="/patrimonio" className="mapOpenLink">Ver mapa completo</Link>}
    </div>
  );
}
