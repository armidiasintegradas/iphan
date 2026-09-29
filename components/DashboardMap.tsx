"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  NavigationControl,
  Popup,
  Marker,
} from "maplibre-gl";
import {
  ChevronDown,
  Expand,
  Layers3,
  LocateFixed,
  Play,
} from "lucide-react";

type Point = {
  id: string;
  name: string;
  city: string;
  municipality?: string;
  lat: number;
  lng: number;
  risk: string;
  image?: string;
};

const PE_BOUNDS: [[number, number], [number, number]] = [
  [-41.45, -9.62],
  [-34.73, -7.02],
];

function markerTone(risk: string) {
  const value = (risk || "").toLowerCase();
  if (value.includes("crít") || value.includes("risco")) return "critical";
  if (value.includes("aten")) return "warning";
  if (value.includes("sem") || value.includes("não")) return "unknown";
  return "regular";
}

function markerColor(risk: string) {
  const tone = markerTone(risk);
  if (tone === "critical") return "#e43b35";
  if (tone === "warning") return "#efa91e";
  if (tone === "unknown") return "#9aa6b7";
  return "#008465";
}

function cleanMunicipality(point: Point) {
  if (point.municipality) return point.municipality;
  return (point.city || "").split(",")[0]?.trim() || "";
}

function popupHTML(point: Point) {
  const city = point.city || "Pernambuco";
  const image = point.image || "/visual/priority-decisao.webp";
  const status =
    markerTone(point.risk) === "critical"
      ? "Atenção prioritária"
      : markerTone(point.risk) === "warning"
        ? "Acompanhamento"
        : "Salvaguarda ativa";

  return `
    <article class="v12MapPopup">
      <div class="v12MapPopupImage" style="background-image:url('${image}')">
        <span>Bem acompanhado</span>
      </div>
      <div class="v12MapPopupBody">
        <strong>${point.name}</strong>
        <small>⌖ ${city}</small>
        <em><i></i>${status}</em>
        <a href="/patrimonio/${point.id}" aria-label="Abrir ${point.name}">›</a>
      </div>
    </article>
  `;
}

export default function DashboardMap({
  points,
  activeCount,
}: {
  points: Point[];
  activeCount: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const popup = useRef<Popup | null>(null);
  const tourTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activePole, setActivePole] = useState("Todos");
  const [activeTab, setActiveTab] = useState("Obras");
  const [touring, setTouring] = useState(false);

  const poles = ["Todos", "Olinda", "Recife", "Caruaru", "Garanhuns", "Arcoverde"];

  const visiblePoints = useMemo(() => {
    if (activePole === "Todos") return points;
    return points.filter(
      (point) =>
        cleanMunicipality(point).toLowerCase() === activePole.toLowerCase(),
    );
  }, [points, activePole]);

  const counts = useMemo(() => {
    const base = { critical: 0, warning: 0, regular: 0, unknown: 0 };
    points.forEach((point) => {
      base[markerTone(point.risk)] += 1;
    });
    return base;
  }, [points]);

  useEffect(() => {
    if (!container.current || map.current) return;

    const instance = new MapLibreMap({
      container: container.current,
      style: {
        version: 8,
        sources: {
          imagery: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Esri, Maxar, Earthstar Geographics",
          },
        },
        layers: [
          {
            id: "imagery",
            type: "raster",
            source: "imagery",
          },
        ],
      },
      bounds: PE_BOUNDS,
      fitBoundsOptions: { padding: 22 },
      attributionControl: false,
      maxZoom: 17,
    });

    instance.addControl(
      new NavigationControl({ showCompass: false, visualizePitch: false }),
      "top-left",
    );

    map.current = instance;

    return () => {
      if (tourTimer.current) clearInterval(tourTimer.current);
      markers.current.forEach((marker) => marker.remove());
      popup.current?.remove();
      instance.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];
    popup.current?.remove();

    visiblePoints.forEach((point) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `v12MapMarker ${markerTone(point.risk)}`;
      button.style.setProperty("--marker-color", markerColor(point.risk));
      button.setAttribute("aria-label", point.name);
      button.title = point.name;
      button.innerHTML = '<span></span>';

      const marker = new Marker({ element: button, anchor: "center" })
        .setLngLat([point.lng, point.lat])
        .addTo(instance);

      button.addEventListener("click", () => {
        popup.current?.remove();
        popup.current = new Popup({
          offset: 22,
          closeButton: false,
          closeOnClick: false,
          maxWidth: "310px",
          className: "v12PopupShell",
        })
          .setLngLat([point.lng, point.lat])
          .setHTML(popupHTML(point))
          .addTo(instance);
      });

      markers.current.push(marker);
    });

    if (activePole === "Todos") {
      instance.fitBounds(PE_BOUNDS, { padding: 22, duration: 500 });
    } else if (visiblePoints.length) {
      const first = visiblePoints[0];
      instance.flyTo({
        center: [first.lng, first.lat],
        zoom: 9.1,
        duration: 650,
      });
    }
  }, [visiblePoints, activePole]);

  useEffect(() => {
    if (!touring || !visiblePoints.length || !map.current) {
      if (tourTimer.current) {
        clearInterval(tourTimer.current);
        tourTimer.current = null;
      }
      return;
    }

    let index = 0;
    const show = () => {
      const point = visiblePoints[index % visiblePoints.length];
      popup.current?.remove();
      map.current?.flyTo({
        center: [point.lng, point.lat],
        zoom: 8.6,
        duration: 650,
      });
      popup.current = new Popup({
        offset: 22,
        closeButton: false,
        closeOnClick: false,
        maxWidth: "310px",
        className: "v12PopupShell",
      })
        .setLngLat([point.lng, point.lat])
        .setHTML(popupHTML(point))
        .addTo(map.current!);
      index += 1;
    };

    show();
    tourTimer.current = setInterval(show, 3500);

    return () => {
      if (tourTimer.current) clearInterval(tourTimer.current);
      tourTimer.current = null;
    };
  }, [touring, visiblePoints]);

  return (
    <section className="v12MapCard">
      <div className="v12MapHead">
        <div>
          <div className="v12MapTitleLine">
            <h2>Intervenções em Pernambuco</h2>
            <span className="v12ActivePill">{activeCount} Ativas</span>
          </div>
          <p>Mapeamento georreferenciado e situação de salvaguarda territorial do patrimônio cultural em Pernambuco.</p>
        </div>

        <div className="v12MapActions">
          <button
            type="button"
            className={touring ? "v12Tour active" : "v12Tour"}
            onClick={() => setTouring((value) => !value)}
          >
            <Play size={13} fill="currentColor" />
            Tour Automático
          </button>
          <div className="v12MapTabs" role="tablist" aria-label="Visualização do mapa">
            {["Obras", "Vistorias", "Histórico"].map((tab) => (
              <button
                type="button"
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="v12PoleRow">
        <strong>POLOS:</strong>
        {poles.map((pole) => (
          <button
            type="button"
            key={pole}
            className={activePole === pole ? "active" : ""}
            onClick={() => setActivePole(pole)}
          >
            {pole}
          </button>
        ))}
        <button type="button" className="v12PoleMore" aria-label="Mais polos">
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="v12MapFrame">
        <div ref={container} className="v12MapCanvas" />
        <div className="v12MapUtility" aria-hidden="true">
          <span><LocateFixed size={15} /></span>
          <span><Layers3 size={15} /></span>
        </div>
        <button
          type="button"
          className="v12Fullscreen"
          aria-label="Ampliar mapa"
          onClick={() => map.current?.fitBounds(PE_BOUNDS, { padding: 22, duration: 500 })}
        >
          <Expand size={16} />
        </button>
      </div>

      <footer className="v12MapFooter">
        <div className="v12Legend">
          <span><i className="critical" />Crítico ({counts.critical})</span>
          <span><i className="warning" />Atenção ({counts.warning})</span>
          <span><i className="regular" />Regular ({counts.regular})</span>
          <span><i className="unknown" />Sem dado ({counts.unknown})</span>
        </div>
        <a href="/api/export/heritage" className="v12GeoExport">Exportar GeoJSON →</a>
      </footer>
    </section>
  );
}
