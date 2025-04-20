import React from 'react';

interface SourceButtonProps {
  url: string;
  sourceInfo: {
    name: string;
    orientation: 'left' | 'center-left' | 'neutral' | 'center-right' | 'right';
    logo?: string;
  };
}

const SourceButton: React.FC<SourceButtonProps> = ({ url, sourceInfo }) => {
  const orientationLabels = {
    'left': 'Ľavicové',
    'center-left': 'Stredo-ľavé',
    'neutral': 'Neutrálne',
    'center-right': 'Stredo-pravé',
    'right': 'Pravicové'
  };

  const orientationColors = {
    'left': '#FF4D4D',
    'center-left': '#FF9999',
    'neutral': '#CCCCCC',
    'center-right': '#99CCFF',
    'right': '#3399FF'
  };

  const getOrientationLabel = (orientation: string) => {
    return orientationLabels[orientation as keyof typeof orientationLabels] || 'Neutrálne';
  };

  const getOrientationColor = (orientation: string) => {
    return orientationColors[orientation as keyof typeof orientationColors] || '#CCCCCC';
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="source-button"
      title={`Navštíviť zdroj: ${sourceInfo.name}`}
    >
      <div className="source-content">
        {sourceInfo.logo && (
          <img 
            src={sourceInfo.logo} 
            alt={`Logo ${sourceInfo.name}`} 
            className="source-logo"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <span className="source-name">{sourceInfo.name}</span>
        <span 
          className={`source-orientation-tag ${sourceInfo.orientation}`}
          style={{ 
            backgroundColor: getOrientationColor(sourceInfo.orientation),
            color: sourceInfo.orientation === 'neutral' ? '#333' : '#fff'
          }}
        >
          {getOrientationLabel(sourceInfo.orientation)}
        </span>
      </div>
    </a>
  );
};

export default SourceButton;
