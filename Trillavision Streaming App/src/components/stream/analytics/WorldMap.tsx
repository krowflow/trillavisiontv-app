import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

interface WorldMapProps {
  data: Array<{
    country: string;
    percentage: number;
    coordinates?: [number, number];
  }>;
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryData = data.find(d => d.country === geo.properties.name);
              const fillColor = countryData 
                ? `rgba(88, 15, 150, ${Math.min(countryData.percentage / 100, 0.8)})`
                : "#F5F5F5";
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: "none"
                    },
                    hover: {
                      fill: countryData ? "#3B0764" : "#E5E5E5",
                      outline: "none"
                    },
                    pressed: {
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
        
        {data.filter(d => d.coordinates).map((d, i) => (
          <Marker key={i} coordinates={d.coordinates as [number, number]}>
            <circle r={4} fill="#580F96" />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};