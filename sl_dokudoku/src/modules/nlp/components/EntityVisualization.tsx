import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExtractedEntity } from '../services/EntityExtractor';

interface EntityVisualizationProps {
  entities: ExtractedEntity[];
  groupByType?: boolean;
}

export function EntityVisualization({ entities, groupByType = true }: EntityVisualizationProps) {
  if (!entities || entities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extracted Entities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No entities extracted from this document.</p>
        </CardContent>
      </Card>
    );
  }

  // Group entities by type if needed
  if (groupByType) {
    const groupedEntities: Record<string, ExtractedEntity[]> = {};
    
    for (const entity of entities) {
      if (!groupedEntities[entity.type]) {
        groupedEntities[entity.type] = [];
      }
      groupedEntities[entity.type].push(entity);
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extracted Entities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedEntities).map(([type, typeEntities]) => (
            <div key={type} className="space-y-2">
              <h3 className="font-medium text-lg capitalize">{type}</h3>
              <div className="flex flex-wrap gap-2">
                {typeEntities.map((entity, index) => (
                  <EntityBadge key={`${type}-${index}`} entity={entity} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  // Display as a flat list if not grouping by type
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Entities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {entities.map((entity, index) => (
            <EntityBadge key={index} entity={entity} showType />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface EntityBadgeProps {
  entity: ExtractedEntity;
  showType?: boolean;
}

function EntityBadge({ entity, showType = false }: EntityBadgeProps) {
  // Get color based on confidence
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.9) return 'bg-green-500';
    if (confidence > 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get variant based on entity type
  const getEntityVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'person':
        return 'default';
      case 'date':
        return 'secondary';
      case 'organization':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  return (
    <div className="inline-flex items-center">
      <Badge variant={getEntityVariant(entity.type)} className="mr-1 py-1">
        {entity.value}
      </Badge>
      {showType && (
        <span className="text-xs text-muted-foreground ml-1">({entity.type})</span>
      )}
      <div 
        className={`w-2 h-2 rounded-full ml-1 ${getConfidenceColor(entity.confidence)}`} 
        title={`Confidence: ${Math.round(entity.confidence * 100)}%`}
      />
    </div>
  );
} 