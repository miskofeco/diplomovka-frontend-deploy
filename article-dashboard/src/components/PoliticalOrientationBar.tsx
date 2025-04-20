import React from 'react';

interface PoliticalOrientationBarProps {
  orientation?: {
    left_percent: number;
    center_left_percent: number;
    neutral_percent: number;
    center_right_percent: number;
    right_percent: number;
  };
  dominantOrientation?: string;
  confidence?: number;
}

const PoliticalOrientationBar: React.FC<PoliticalOrientationBarProps> = ({ 
  orientation,
  dominantOrientation,
  confidence
}) => {
  if (!orientation) {
    return (
      <div className="political-orientation-container">
        <h4>Politická orientácia článku</h4>
        <p>Údaje o politickej orientácii nie sú k dispozícii</p>
      </div>
    );
  }

  return (
    <div className="political-orientation-container">
      <h4>Politická orientácia článku</h4>
      {dominantOrientation && confidence && (
        <p className="orientation-summary">
          Prevažujúca orientácia: <strong>{dominantOrientation}</strong> 
          (istota: {(confidence * 100).toFixed(1)}%)
        </p>
      )}
      <div className="orientation-bar">
        <div 
          className="orientation-segment left" 
          style={{width: `${orientation.left_percent}%`}}
          title={`Ľavicové: ${orientation.left_percent.toFixed(1)}%`}
        />
        <div 
          className="orientation-segment center-left"
          style={{width: `${orientation.center_left_percent}%`}}
          title={`Stredo-ľavé: ${orientation.center_left_percent.toFixed(1)}%`}
        />
        <div 
          className="orientation-segment neutral"
          style={{width: `${orientation.neutral_percent}%`}}
          title={`Neutrálne: ${orientation.neutral_percent.toFixed(1)}%`}
        />
        <div 
          className="orientation-segment center-right"
          style={{width: `${orientation.center_right_percent}%`}}
          title={`Stredo-pravé: ${orientation.center_right_percent.toFixed(1)}%`}
        />
        <div 
          className="orientation-segment right"
          style={{width: `${orientation.right_percent}%`}}
          title={`Pravicové: ${orientation.right_percent.toFixed(1)}%`}
        />
      </div>
      <div className="orientation-legend">
        <span className="legend-item left">Ľavicové</span>
        <span className="legend-item center-left">Stredo-ľavé</span>
        <span className="legend-item neutral">Neutrálne</span>
        <span className="legend-item center-right">Stredo-pravé</span>
        <span className="legend-item right">Pravicové</span>
      </div>
    </div>
  );
};

export default PoliticalOrientationBar;
