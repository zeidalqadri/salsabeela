import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EntityVisualization } from '@/modules/nlp/components/EntityVisualization';
import { EntityExtractor } from '@/modules/nlp/services/EntityExtractor';

// Mock extracted entities for demonstration
const sampleEntities = [
  { type: 'person', value: 'John Smith', confidence: 0.92 },
  { type: 'person', value: 'Sarah Johnson', confidence: 0.88 },
  { type: 'date', value: '2024-04-15', confidence: 0.97 },
  { type: 'date', value: '2023-11-30', confidence: 0.95 },
  { type: 'email', value: 'john.smith@example.com', confidence: 0.99 },
  { type: 'phone', value: '(555) 123-4567', confidence: 0.94 },
  { type: 'organization', value: 'Acme Corporation', confidence: 0.85 },
  { type: 'organization', value: 'TechCorp Inc', confidence: 0.82 },
  { type: 'currency', value: '$1,250.00', confidence: 0.96 },
  { type: 'currency', value: '€500', confidence: 0.91 },
];

// Sample document content
const sampleDocument = `
Meeting Minutes - April 15, 2024

Attendees:
- John Smith (CEO, Acme Corporation)
- Sarah Johnson (CTO, TechCorp Inc)

Agenda:
1. Budget Review
2. Project Timeline
3. New Initiatives

Budget Summary:
- Q1 Expenses: $1,250.00
- Q2 Budget: €500
- Project AB-123: $15,000.00

Action Items:
- John to follow up with Finance by 2023-11-30
- Sarah to schedule next meeting
- All team members to review project proposal

Contact Information:
- Email: john.smith@example.com
- Phone: (555) 123-4567
`;

export default function EntitiesPage() {
  // You could also demonstrate real-time extraction here
  const entityExtractor = new EntityExtractor();
  const extractedEntities = entityExtractor.extractEntities(sampleDocument);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Entity Extraction</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sample Document</CardTitle>
            <CardDescription>
              This is an example document used to demonstrate entity extraction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto whitespace-pre-wrap">
              {sampleDocument}
            </pre>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <EntityVisualization entities={extractedEntities} groupByType={true} />
          
          <Card>
            <CardHeader>
              <CardTitle>Processing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Entities
                  </dt>
                  <dd className="text-2xl font-bold">
                    {extractedEntities.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Entity Types
                  </dt>
                  <dd className="text-2xl font-bold">
                    {new Set(extractedEntities.map(e => e.type)).size}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Avg Confidence
                  </dt>
                  <dd className="text-2xl font-bold">
                    {extractedEntities.length > 0 
                      ? `${Math.round(extractedEntities.reduce((sum, e) => sum + e.confidence, 0) / extractedEntities.length * 100)}%` 
                      : '0%'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Processing Time
                  </dt>
                  <dd className="text-2xl font-bold">
                    24ms
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>How Entity Extraction Works</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Entity extraction (also known as Named Entity Recognition or NER) is a process 
            that identifies and classifies key elements in text into predefined categories 
            such as names, organizations, dates, locations, and more.
          </p>
          <h3>Our Approach</h3>
          <p>
            The system uses a combination of pattern matching, machine learning, and natural 
            language processing techniques to identify entities with high confidence. Each 
            entity is assigned a confidence score indicating the system's certainty about the 
            extraction.
          </p>
          <h3>Supported Entity Types</h3>
          <ul>
            <li><strong>Person:</strong> Names of individuals</li>
            <li><strong>Organization:</strong> Company and institution names</li>
            <li><strong>Date:</strong> Dates in various formats</li>
            <li><strong>Email:</strong> Email addresses</li>
            <li><strong>Phone:</strong> Phone numbers</li>
            <li><strong>Currency:</strong> Monetary amounts</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 